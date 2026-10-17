import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { RefinementControls } from './components/RefinementControls';
import { AuditScoreCard } from './components/AuditScoreCard';
import { ImprovedPromptView } from './components/ImprovedPromptView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { HistoryModal } from './components/HistoryModal';
import { Toast } from './components/Toast';
import { analyzePrompt } from './engine/analyzer';
import { generateImprovedPrompt } from './engine/improver';
import { enhancePromptWithGemini } from './services/geminiService';
import { SAMPLE_PROMPTS } from './data/samplePrompts';

export function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('aegis_theme') || 'dark';
  });

  // API Key state
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('aegis_gemini_api_key') || '';
  });

  // History state
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aegis_prompt_history') || '[]');
    } catch {
      return [];
    }
  });

  // Core Prompt State - Pre-load first high-risk sample
  const [prompt, setPrompt] = useState(SAMPLE_PROMPTS[0].prompt);
  const [analysis, setAnalysis] = useState(null);
  const [improvedData, setImprovedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  // Settings & Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Tuning Knobs
  const [options, setOptions] = useState({
    uncertaintyStrictness: 'high',
    safetyLevel: 'strict',
    targetAudience: 'Technical / Professional',
    outputFormat: 'Structured Markdown with Headers',
    includeConfidenceScores: true,
    includeNegativeConstraints: true
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aegis_theme', theme);
  }, [theme]);

  // Initial audit on mount
  useEffect(() => {
    handleRunImprovement(SAMPLE_PROMPTS[0].prompt, false);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('aegis_gemini_api_key', key);
    showToast('Gemini API key connected successfully!', 'success');
  };

  const handleClearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('aegis_gemini_api_key');
    showToast('Gemini API key removed. Using built-in offline engine.', 'info');
  };

  const handleCopyPrompt = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      showToast('Enhanced prompt copied to clipboard!', 'success');
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      showToast('Failed to copy to clipboard.', 'error');
    }
  };

  const handleRunImprovement = async (inputPrompt = prompt, addToHistory = true) => {
    if (!inputPrompt || !inputPrompt.trim()) {
      showToast('Please enter a prompt to audit.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Run local Responsible AI Audit
      const auditResult = analyzePrompt(inputPrompt);
      setAnalysis(auditResult);

      let resultData;

      // 2. Enhance via Gemini API if key is available, else fallback to offline heuristic engine
      if (apiKey && apiKey.trim().length > 10) {
        try {
          const geminiResult = await enhancePromptWithGemini(inputPrompt, apiKey, options);
          resultData = {
            improvedPrompt: geminiResult.improvedPrompt,
            breakdown: geminiResult.breakdown || [],
            domain: geminiResult.domain || auditResult.domain,
            role: geminiResult.role || 'Responsible AI Specialist',
            source: 'gemini'
          };
          showToast('Enhanced via Google Gemini 3.8 Flash!', 'success');
        } catch (apiErr) {
          console.warn('Gemini API failed, falling back to heuristic engine:', apiErr);
          showToast(`Gemini API: ${apiErr.message}. Fallback to Offline Engine.`, 'error');
          resultData = generateImprovedPrompt(inputPrompt, auditResult, options);
        }
      } else {
        resultData = generateImprovedPrompt(inputPrompt, auditResult, options);
      }

      setImprovedData(resultData);

      // 3. Save to history
      if (addToHistory) {
        const historyItem = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          prompt: inputPrompt,
          score: auditResult.overallScore,
          statusColor: auditResult.statusColor,
          domain: auditResult.domain,
          improvedData: resultData,
          analysis: auditResult
        };

        const updatedHistory = [historyItem, ...history.slice(0, 24)];
        setHistory(updatedHistory);
        localStorage.setItem('aegis_prompt_history', JSON.stringify(updatedHistory));
      }
    } catch (err) {
      console.error('Audit failed:', err);
      showToast(err.message || 'Audit encountered an error.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (item) => {
    setPrompt(item.prompt);
    setAnalysis(item.analysis);
    setImprovedData(item.improvedData);
    showToast('Loaded prompt from history.', 'info');
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('aegis_prompt_history');
    showToast('Prompt history cleared.', 'info');
  };

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        onClearApiKey={handleClearApiKey}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {/* App Header */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        apiKey={apiKey}
        engineMode={apiKey ? 'gemini' : 'offline'}
      />

      {/* Main Container */}
      <main className="main-content">
        <div className="content-container">
          {/* Top Banner Explaining the 4 Responsible Tenets */}
          <section className="responsible-pillars-strip">
            <div className="pillar-strip-item">
              <span className="strip-num">01</span>
              <div>
                <strong>Clear Instructions</strong>
                <span>Task decomposition & explicit persona</span>
              </div>
            </div>
            <div className="pillar-strip-item">
              <span className="strip-num">02</span>
              <div>
                <strong>Domain Context</strong>
                <span>Target audience & calibrated depth</span>
              </div>
            </div>
            <div className="pillar-strip-item">
              <span className="strip-num">03</span>
              <div>
                <strong>Strict Constraints</strong>
                <span>Negative rules & output schemas</span>
              </div>
            </div>
            <div className="pillar-strip-item">
              <span className="strip-num">04</span>
              <div>
                <strong>Uncertainty Defense</strong>
                <span>Epistemic bounds & zero hallucinations</span>
              </div>
            </div>
          </section>

          {/* Prompt Input Section */}
          <section className="section-input">
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              onImprove={() => handleRunImprovement(prompt, true)}
              isLoading={isLoading}
              onToggleSettings={() => setIsSettingsOpen(prev => !prev)}
              isSettingsOpen={isSettingsOpen}
              apiKey={apiKey}
            />

            {/* Tuning Controls */}
            <RefinementControls
              options={options}
              setOptions={setOptions}
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
            />
          </section>

          {/* Results Grid: Audit Radar + Improved Prompt View */}
          {analysis && (
            <div className="results-grid">
              <section className="section-audit">
                <AuditScoreCard analysis={analysis} />
              </section>

              <section className="section-output">
                <ImprovedPromptView
                  originalPrompt={prompt}
                  improvedData={improvedData}
                  onCopyPrompt={handleCopyPrompt}
                  hasCopied={hasCopied}
                  analysis={analysis}
                />
              </section>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <p>
            AegisPrompt • Responsible AI Governance & Epistemic Uncertainty Alignment
          </p>
          <div className="footer-links">
            <span>Client-side secure</span>
            <span>•</span>
            <span>Zero prompt retention</span>
            <span>•</span>
            <span>Adheres to IEEE & NIST AI RMF Standards</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
