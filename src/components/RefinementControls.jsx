import React from 'react';
import { SlidersHorizontal, ShieldAlert, Compass, FileText, CheckCircle2 } from 'lucide-react';

export function RefinementControls({ options, setOptions, isOpen, onClose }) {
  if (!isOpen) return null;

  const handleChange = (key, val) => {
    setOptions(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="tuning-panel animate-slide-down">
      <div className="tuning-panel-header">
        <div className="title-with-icon">
          <SlidersHorizontal size={18} className="accent-icon" />
          <h3 className="panel-title">Responsible AI Tuning Parameters</h3>
        </div>
        <button type="button" className="btn-close-sm" onClick={onClose}>✕</button>
      </div>

      <div className="tuning-grid">
        {/* Uncertainty Strictness */}
        <div className="tuning-item">
          <label className="tuning-label" htmlFor="select-uncertainty">
            <Compass size={14} />
            <span>Uncertainty & Hallucination Rigor</span>
          </label>
          <select
            id="select-uncertainty"
            className="tuning-select"
            value={options.uncertaintyStrictness}
            onChange={(e) => handleChange('uncertaintyStrictness', e.target.value)}
          >
            <option value="high">High (Admit Unknowns, Require Assumptions & Confidence Scores)</option>
            <option value="medium">Medium (Standard epistemic disclaimers & bounds)</option>
            <option value="low">Low (Minimal uncertainty flagging)</option>
          </select>
          <span className="field-hint">Instructs the LLM to actively state what it does NOT know.</span>
        </div>

        {/* Target Audience */}
        <div className="tuning-item">
          <label className="tuning-label" htmlFor="select-audience">
            <CheckCircle2 size={14} />
            <span>Target Audience Calibration</span>
          </label>
          <select
            id="select-audience"
            className="tuning-select"
            value={options.targetAudience}
            onChange={(e) => handleChange('targetAudience', e.target.value)}
          >
            <option value="General Public / Layperson">General Public / Layperson</option>
            <option value="Beginner / Student">Beginner / Student (Clear, accessible)</option>
            <option value="Technical / Professional">Technical / Professional (Rigorous, domain-specific)</option>
            <option value="Executive / Board Level">Executive / Board Level (High-level synthesis)</option>
          </select>
          <span className="field-hint">Prevents confusing technical jargon or oversimplified answers.</span>
        </div>

        {/* Output Format */}
        <div className="tuning-item">
          <label className="tuning-label" htmlFor="select-format">
            <FileText size={14} />
            <span>Expected Output Structure</span>
          </label>
          <select
            id="select-format"
            className="tuning-select"
            value={options.outputFormat}
            onChange={(e) => handleChange('outputFormat', e.target.value)}
          >
            <option value="Structured Markdown with Headers">Structured Markdown with Headers</option>
            <option value="Step-by-Step Actionable Protocol">Step-by-Step Actionable Protocol</option>
            <option value="JSON Schema with Validated Attributes">JSON Schema (Machine readable)</option>
            <option value="Comparative Analysis Table">Comparative Analysis Table</option>
          </select>
          <span className="field-hint">Forces deterministic layout and prevents unstructured rambling.</span>
        </div>

        {/* Safety Level */}
        <div className="tuning-item">
          <label className="tuning-label" htmlFor="select-safety">
            <ShieldAlert size={14} />
            <span>Ethics, Bias & Safety Guardrails</span>
          </label>
          <select
            id="select-safety"
            className="tuning-select"
            value={options.safetyLevel}
            onChange={(e) => handleChange('safetyLevel', e.target.value)}
          >
            <option value="strict">Strict (Mandatory Disclaimers, Blind Review, Zero Unsafe Advice)</option>
            <option value="standard">Standard (Industry standard ethical guardrails)</option>
          </select>
          <span className="field-hint">Enforces legal/medical disclaimers and debiased screening rules.</span>
        </div>
      </div>
    </div>
  );
}
