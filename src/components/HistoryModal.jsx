import React from 'react';
import { History, Trash2, ArrowUpRight, Clock, ShieldCheck } from 'lucide-react';

export function HistoryModal({ isOpen, onClose, history, onSelectHistoryItem, onClearHistory }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-container history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="title-with-icon">
            <History size={20} className="text-accent" />
            <h3 className="modal-title">Prompt Audit History</h3>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {history.length === 0 ? (
            <div className="empty-history-state">
              <Clock size={36} className="text-muted" />
              <p>No previous prompt audits saved yet.</p>
              <span>Prompts you audit and enhance will appear here automatically.</span>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="history-item-card"
                  onClick={() => {
                    onSelectHistoryItem(item);
                    onClose();
                  }}
                >
                  <div className="history-item-top">
                    <span className="history-time">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="history-score" style={{ color: item.statusColor }}>
                      Score: {item.score}/100
                    </span>
                  </div>
                  <p className="history-prompt-preview">{item.prompt}</p>
                  <div className="history-item-bottom">
                    <span className="history-domain-pill">{item.domain?.toUpperCase() || 'GENERAL'}</span>
                    <span className="history-load-link">
                      <span>Load prompt</span>
                      <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {history.length > 0 && (
            <button
              type="button"
              className="btn-modal-danger"
              onClick={onClearHistory}
            >
              <Trash2 size={14} />
              <span>Clear History</span>
            </button>
          )}
          <button
            type="button"
            className="btn-modal-cancel"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
