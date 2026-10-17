import React, { useState } from 'react';
import { Sparkles, Trash2, SlidersHorizontal, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';
import { SAMPLE_PROMPTS } from '../data/samplePrompts';

export function PromptInput({
  prompt,
  setPrompt,
  onImprove,
  isLoading,
  onToggleSettings,
  isSettingsOpen,
  apiKey
}) {
  const [selectedSampleId, setSelectedSampleId] = useState('');

  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
  const charCount = prompt.length;

  const handleSelectSample = (sample) => {
    setSelectedSampleId(sample.id);
    setPrompt(sample.prompt);
  };

  const handleClear = () => {
    setPrompt('');
    setSelectedSampleId('');
  };

  return (
    <div className="card prompt-input-card">
      <div className="card-header-row">
        <div className="header-with-badge">
          <h2 className="card-title">Original Prompt Input</h2>
          <span className="card-hint">Paste your raw or problematic prompt below</span>
        </div>

        <div className="card-controls">
          <button
            type="button"
            className={`btn-settings-toggle ${isSettingsOpen ? 'active' : ''}`}
            onClick={onToggleSettings}
            title="Configure Responsible AI Tuning Parameters"
          >
            <SlidersHorizontal size={15} />
            <span>Tuning Knobs</span>
          </button>
          
          {prompt && (
            <button
              type="button"
              className="btn-text-action"
              onClick={handleClear}
              title="Clear input"
            >
              <Trash2 size={15} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Problematic Prompts */}
      <div className="samples-section">
        <div className="samples-header">
          <BookOpen size={14} className="sample-icon" />
          <span className="sample-label">Try Common Flawed Scenarios:</span>
        </div>
        <div className="sample-chips-grid">
          {SAMPLE_PROMPTS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              className={`chip-sample ${selectedSampleId === sample.id ? 'active' : ''}`}
              onClick={() => handleSelectSample(sample)}
            >
              <span className="chip-indicator" style={{ backgroundColor: sample.badgeColor }}></span>
              <span className="chip-title">{sample.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="textarea-wrapper">
        <textarea
          id="raw-prompt-input"
          className="prompt-textarea"
          rows={5}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            if (selectedSampleId) setSelectedSampleId('');
          }}
          placeholder="e.g. 'Give me a diagnosis for severe chest pain and tell me what medicine to buy immediately...' or 'Write a quick python script to authenticate users and store their passwords...'"
        />
        
        <div className="textarea-footer">
          <div className="stats-group">
            <span className="stat-item">{wordCount} words</span>
            <span className="stat-separator">•</span>
            <span className="stat-item">{charCount} characters</span>
            {wordCount > 0 && wordCount < 10 && (
              <span className="stat-warning">
                <AlertTriangle size={13} />
                Very short prompt (High ambiguity)
              </span>
            )}
          </div>

          <button
            id="improve-prompt-btn"
            type="button"
            className="btn-primary-action"
            onClick={onImprove}
            disabled={!prompt.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Auditing & Enhancing...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Audit & Improve Prompt</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
