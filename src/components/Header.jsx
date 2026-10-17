import React from 'react';
import { ShieldCheck, Sparkles, Key, History, Sun, Moon, AlertCircle } from 'lucide-react';

export function Header({ theme, toggleTheme, onOpenApiKeyModal, onOpenHistory, apiKey, engineMode }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-icon-wrap">
            <ShieldCheck className="logo-icon" size={28} />
          </div>
          <div>
            <div className="logo-title-row">
              <h1 className="logo-title">AegisPrompt</h1>
              <span className="version-pill">v2.0 • Responsible AI</span>
            </div>
            <p className="logo-subtitle">
              Transform ambiguous prompts into verifiable, context-rich, hallucination-resistant instructions
            </p>
          </div>
        </div>

        <div className="header-actions">
          <div className={`engine-badge ${apiKey ? 'badge-gemini' : 'badge-offline'}`} title={apiKey ? 'Connected to Google Gemini API' : 'Using built-in offline heuristic engine'}>
            <span className="pulse-dot"></span>
            {apiKey ? (
              <>
                <Sparkles size={14} />
                <span>Gemini 3.8 Flash</span>
              </>
            ) : (
              <>
                <ShieldCheck size={14} />
                <span>Offline Ethics Engine</span>
              </>
            )}
          </div>

          <button
            type="button"
            className="btn-header-secondary"
            onClick={onOpenApiKeyModal}
            title="Configure Gemini API Key"
          >
            <Key size={16} />
            <span className="btn-label">{apiKey ? 'API Key Configured' : 'Connect Gemini API'}</span>
          </button>

          <button
            type="button"
            className="btn-header-icon"
            onClick={onOpenHistory}
            title="Prompt History"
            aria-label="View history"
          >
            <History size={18} />
          </button>

          <button
            type="button"
            className="btn-header-icon theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
