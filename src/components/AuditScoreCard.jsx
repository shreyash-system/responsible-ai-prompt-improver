import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Sparkles, HelpCircle, Eye, Info } from 'lucide-react';

export function AuditScoreCard({ analysis }) {
  if (!analysis) return null;

  const { overallScore, status, statusColor, riskLevel, scores, deficiencies, positives } = analysis;

  const getPillarColor = (val) => {
    if (val >= 16) return '#10b981';
    if (val >= 11) return '#f59e0b';
    return '#ef4444';
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'critical':
        return <span className="badge-severity sev-critical">CRITICAL RISK</span>;
      case 'high':
        return <span className="badge-severity sev-high">HIGH DEFICIENCY</span>;
      case 'medium':
        return <span className="badge-severity sev-medium">WARNING</span>;
      default:
        return <span className="badge-severity sev-low">SUGGESTION</span>;
    }
  };

  return (
    <div className="card audit-card">
      <div className="audit-header">
        <div>
          <span className="section-eyebrow">AUDIT & DIAGNOSTICS</span>
          <h2 className="card-title">Responsible AI Readiness Audit</h2>
        </div>

        <div className="risk-level-tag">
          <span className="risk-tag-label">Vulnerability Risk:</span>
          <span className={`risk-tag-val risk-${riskLevel.toLowerCase()}`}>
            {riskLevel}
          </span>
        </div>
      </div>

      <div className="audit-overview-grid">
        {/* Overall Score Circle */}
        <div className="score-hero">
          <div className="score-meter" style={{ borderColor: statusColor }}>
            <span className="score-number" style={{ color: statusColor }}>
              {overallScore}
            </span>
            <span className="score-max">/100</span>
          </div>
          <div className="score-meta">
            <span className="score-status-title" style={{ color: statusColor }}>
              {status}
            </span>
            <p className="score-description">
              {overallScore >= 80
                ? 'Excellent: Prompt contains strong epistemic safeguards and clear instructions.'
                : overallScore >= 50
                ? 'Vulnerable: Susceptible to hallucinations or missing critical guardrails.'
                : 'High-Risk Flaws: Vulnerable to hallucinations, bias, and undefined boundaries.'}
            </p>
          </div>
        </div>

        {/* 5 Pillars Progress Bars */}
        <div className="pillars-breakdown">
          <h3 className="sub-heading">5 Core Responsible AI Pillars</h3>
          
          <div className="pillar-bar-item">
            <div className="pillar-bar-meta">
              <span className="pillar-name">1. Clarity & Specificity</span>
              <span className="pillar-val">{scores.clarity}/20</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(scores.clarity / 20) * 100}%`, backgroundColor: getPillarColor(scores.clarity) }}
              ></div>
            </div>
          </div>

          <div className="pillar-bar-item">
            <div className="pillar-bar-meta">
              <span className="pillar-name">2. Context & Persona</span>
              <span className="pillar-val">{scores.context}/20</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(scores.context / 20) * 100}%`, backgroundColor: getPillarColor(scores.context) }}
              ></div>
            </div>
          </div>

          <div className="pillar-bar-item">
            <div className="pillar-bar-meta">
              <span className="pillar-name">3. Constraints & Boundaries</span>
              <span className="pillar-val">{scores.constraints}/20</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(scores.constraints / 20) * 100}%`, backgroundColor: getPillarColor(scores.constraints) }}
              ></div>
            </div>
          </div>

          <div className="pillar-bar-item">
            <div className="pillar-bar-meta">
              <span className="pillar-name">4. Uncertainty & Hallucination Defense</span>
              <span className="pillar-val">{scores.uncertainty}/20</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(scores.uncertainty / 20) * 100}%`, backgroundColor: getPillarColor(scores.uncertainty) }}
              ></div>
            </div>
          </div>

          <div className="pillar-bar-item">
            <div className="pillar-bar-meta">
              <span className="pillar-name">5. Ethics, Fairness & Safety</span>
              <span className="pillar-val">{scores.ethics}/20</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(scores.ethics / 20) * 100}%`, backgroundColor: getPillarColor(scores.ethics) }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Flaws & Deficiencies List */}
      <div className="audit-issues-section">
        <h3 className="sub-heading">Detected Deficiencies & Gaps ({deficiencies.length})</h3>
        {deficiencies.length === 0 ? (
          <div className="clean-audit-notice">
            <CheckCircle size={18} className="text-success" />
            <span>No critical responsible AI deficiencies detected.</span>
          </div>
        ) : (
          <div className="deficiencies-grid">
            {deficiencies.map((item, idx) => (
              <div key={idx} className="deficiency-card">
                <div className="deficiency-header">
                  {getSeverityBadge(item.severity)}
                  <span className="deficiency-pillar">{item.pillar}</span>
                </div>
                <h4 className="deficiency-title">{item.title}</h4>
                <p className="deficiency-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        {positives && positives.length > 0 && (
          <div className="positives-section">
            <h4 className="positives-heading">
              <CheckCircle size={16} className="text-success" />
              <span>Identified Strengths:</span>
            </h4>
            <ul className="positives-list">
              {positives.map((pos, idx) => (
                <li key={idx}>{pos}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
