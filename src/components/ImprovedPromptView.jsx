import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  GitCompare,
  FileText,
  ShieldCheck,
  PlayCircle,
  Sparkles,
  Info,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { getSimulatedLLMOutputs } from '../engine/improver';

export function ImprovedPromptView({
  originalPrompt,
  improvedData,
  onCopyPrompt,
  hasCopied,
  analysis
}) {
  const [activeTab, setActiveTab] = useState('enhanced'); // 'enhanced' | 'diff' | 'breakdown' | 'simulation'

  if (!improvedData) return null;

  const { improvedPrompt, breakdown, domain, role } = improvedData;
  const simulatedOutputs = getSimulatedLLMOutputs(originalPrompt, domain);

  const handleDownloadMarkdown = () => {
    const blob = new Blob([improvedPrompt], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `responsible-prompt-${domain || 'enhanced'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const estimatedTokens = Math.round(improvedPrompt.length / 4);

  return (
    <div className="card improved-prompt-card animate-fade-in">
      <div className="card-header-tabs">
        <div className="tabs-nav">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'enhanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('enhanced')}
          >
            <Sparkles size={16} />
            <span>Enhanced Prompt</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'diff' ? 'active' : ''}`}
            onClick={() => setActiveTab('diff')}
          >
            <GitCompare size={16} />
            <span>Side-by-Side Diff</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'breakdown' ? 'active' : ''}`}
            onClick={() => setActiveTab('breakdown')}
          >
            <ShieldCheck size={16} />
            <span>Responsible Safeguards ({breakdown?.length || 0})</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'simulation' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulation')}
          >
            <PlayCircle size={16} />
            <span>LLM Response Sandbox</span>
          </button>
        </div>

        {activeTab === 'enhanced' && (
          <div className="actions-cluster">
            <span className="token-indicator">~{estimatedTokens} tokens</span>
            <button
              type="button"
              className="btn-action-sm"
              onClick={handleDownloadMarkdown}
              title="Download as Markdown (.md)"
            >
              <Download size={14} />
              <span>Export .MD</span>
            </button>
            <button
              type="button"
              className={`btn-action-sm btn-copy ${hasCopied ? 'copied' : ''}`}
              onClick={() => onCopyPrompt(improvedPrompt)}
              title="Copy to clipboard"
            >
              {hasCopied ? <Check size={14} /> : <Copy size={14} />}
              <span>{hasCopied ? 'Copied!' : 'Copy Prompt'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="tab-content-area">
        {/* TAB 1: ENHANCED PROMPT */}
        {activeTab === 'enhanced' && (
          <div className="tab-pane-enhanced">
            <div className="prompt-display-container">
              <pre className="code-block-display">
                <code>{improvedPrompt}</code>
              </pre>
            </div>
            
            <div className="enhanced-footer-meta">
              <div className="meta-pill">
                <strong>Assigned Persona:</strong> {role}
              </div>
              <div className="meta-pill">
                <strong>Domain Context:</strong> {domain.toUpperCase()}
              </div>
              <div className="meta-pill">
                <strong>Uncertainty Defense:</strong> Active
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SIDE BY SIDE DIFF */}
        {activeTab === 'diff' && (
          <div className="tab-pane-diff">
            <div className="diff-columns">
              <div className="diff-col col-original">
                <div className="diff-col-header header-bad">
                  <div className="diff-title-row">
                    <AlertTriangle size={16} className="text-danger" />
                    <h4>Original Prompt (Flawed & Fragile)</h4>
                  </div>
                  <span className="score-pill-bad">Score: {analysis?.overallScore || 0}/100</span>
                </div>
                <div className="diff-body">
                  <p className="diff-text-original">{originalPrompt}</p>
                  <div className="diff-flaws-summary">
                    <span className="flaws-label">Key Missing Safeguards:</span>
                    <ul>
                      <li>❌ No uncertainty handling (hallucination catalyst)</li>
                      <li>❌ Lacks constraints and formatting boundaries</li>
                      <li>❌ No target audience calibration or role context</li>
                      <li>❌ Missing ethical / safety / liability guardrails</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="diff-col col-improved">
                <div className="diff-col-header header-good">
                  <div className="diff-title-row">
                    <ShieldCheck size={16} className="text-success" />
                    <h4>Aegis Improved Prompt (Responsible)</h4>
                  </div>
                  <span className="score-pill-good">Score: 95/100</span>
                </div>
                <div className="diff-body">
                  <pre className="diff-text-improved">
                    <code>{improvedPrompt}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RESPONSIBLE SAFEGUARDS BREAKDOWN */}
        {activeTab === 'breakdown' && (
          <div className="tab-pane-breakdown">
            <div className="breakdown-intro">
              <Info size={18} className="text-info" />
              <p>
                Every enhancement below represents a concrete Responsible AI principle added to neutralize ambiguity, prevent confabulation/hallucination, eliminate bias, and enforce safety boundaries.
              </p>
            </div>

            <div className="breakdown-cards-list">
              {breakdown && breakdown.map((item, idx) => (
                <div key={idx} className="breakdown-card">
                  <div className="breakdown-card-top">
                    <span className="breakdown-pillar-badge">{item.pillar}</span>
                    <ShieldCheck size={16} className="text-success" />
                  </div>
                  <h4 className="breakdown-title">{item.title}</h4>
                  <p className="breakdown-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RESPONSE SANDBOX / SIMULATION */}
        {activeTab === 'simulation' && (
          <div className="tab-pane-simulation">
            <div className="simulation-notice">
              <Layers size={18} />
              <p>
                <strong>Comparative AI Behavior Simulator:</strong> Notice how typical LLMs respond carelessly to the original prompt, versus how the Aegis Improved prompt forces epistemic honesty, safety disclaimers, and structured clarity.
              </p>
            </div>

            <div className="simulation-columns">
              {/* Unsafe / Flawed Output */}
              <div className="sim-col sim-flawed">
                <div className="sim-col-header">
                  <div className="sim-header-title">
                    <AlertTriangle size={16} className="text-danger" />
                    <span>Response to Original Prompt</span>
                  </div>
                  <span className="tag-warning">Unsafe / Unreliable</span>
                </div>
                <div className="sim-body">
                  <div className="sim-message-box">
                    <p>{simulatedOutputs.originalResponse}</p>
                  </div>
                  <div className="sim-critique critique-bad">
                    {simulatedOutputs.originalCritique}
                  </div>
                </div>
              </div>

              {/* Responsible / Safe Output */}
              <div className="sim-col sim-safe">
                <div className="sim-col-header">
                  <div className="sim-header-title">
                    <ShieldCheck size={16} className="text-success" />
                    <span>Response to Aegis Improved Prompt</span>
                  </div>
                  <span className="tag-safe">Responsible & Guardrailed</span>
                </div>
                <div className="sim-body">
                  <div className="sim-message-box markdown-sim-output">
                    <pre>
                      <code>{simulatedOutputs.improvedResponse}</code>
                    </pre>
                  </div>
                  <div className="sim-critique critique-good">
                    {simulatedOutputs.improvedCritique}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
