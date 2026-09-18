import React from 'react';

export default function ProgressBar({ value, label, size = 'md', showLabel = true }) {
  const pct = Math.min(100, Math.max(0, value || 0));
  const color = pct === 100 ? 'var(--success-500)' : pct >= 60 ? 'var(--teal-500)' : pct >= 30 ? 'var(--warning-500)' : 'var(--danger-500)';

  return (
    <div className={`progress-bar-${size}`}>
      {showLabel && (
        <div className="progress-label">
          <span>{label || 'Progress'}</span>
          <strong>{pct}%</strong>
        </div>
      )}
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, background: color, height: size === 'sm' ? '6px' : size === 'lg' ? '14px' : '10px' }}
        />
      </div>
    </div>
  );
}
