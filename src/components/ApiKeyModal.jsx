import React, { useState } from 'react';
import { Key, ShieldCheck, CheckCircle2, AlertCircle, ExternalLink, Trash2 } from 'lucide-react';
import { testGeminiApiKey } from '../services/geminiService';

export function ApiKeyModal({ isOpen, onClose, apiKey, onSaveApiKey, onClearApiKey }) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, message: string }

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    if (!keyInput.trim()) {
      setTestResult({ success: false, message: 'Please enter an API key.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      await testGeminiApiKey(keyInput.trim());
      setTestResult({ success: true, message: 'Gemini API Key validated successfully!' });
      onSaveApiKey(keyInput.trim());
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to validate API key. Please check the key.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleRemove = () => {
    onClearApiKey();
    setKeyInput('');
    setTestResult({ success: true, message: 'API key removed. Using built-in offline engine.' });
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="title-with-icon">
            <Key size={20} className="text-accent" />
            <h3 className="modal-title">Connect Google Gemini API</h3>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            AegisPrompt comes with a powerful <strong>built-in offline ethics and heuristic engine</strong> that works without any API key.
            Optionally connecting your Google Gemini API key enables deep generative semantic enhancement with <code>gemini-2.5-flash</code>.
          </p>

          <div className="form-group">
            <label htmlFor="gemini-key-input" className="form-label">
              Google Gemini API Key
            </label>
            <input
              id="gemini-key-input"
              type="password"
              className="form-input"
              placeholder="AIzaSy..."
              value={keyInput}
              onChange={(e) => {
                setKeyInput(e.target.value);
                if (testResult) setTestResult(null);
              }}
            />
          </div>

          {testResult && (
            <div className={`status-banner ${testResult.success ? 'banner-success' : 'banner-error'}`}>
              {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="privacy-badge">
            <ShieldCheck size={16} className="text-success" />
            <span>
              Your API key is saved exclusively in your browser's local storage. It is NEVER sent to any intermediary server.
            </span>
          </div>

          <div className="help-link-row">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="link-external"
            >
              <span>Get a free Gemini API key from Google AI Studio</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <div className="modal-footer">
          {apiKey && (
            <button
              type="button"
              className="btn-modal-danger"
              onClick={handleRemove}
            >
              <Trash2 size={15} />
              <span>Remove Key</span>
            </button>
          )}

          <div className="footer-right-actions">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-modal-primary"
              onClick={handleTestAndSave}
              disabled={isTesting || !keyInput.trim()}
            >
              {isTesting ? (
                <>
                  <span className="spinner"></span>
                  <span>Validating Key...</span>
                </>
              ) : (
                'Save & Activate'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
