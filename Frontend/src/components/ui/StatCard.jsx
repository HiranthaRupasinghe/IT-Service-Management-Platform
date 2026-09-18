import React from 'react';

export default function StatCard({ label, value, icon: Icon, iconBg, iconColor, accentColor, sub, subIcon: SubIcon, subColor }) {
  return (
    <div className="stat-card" style={{ '--stat-accent': accentColor || 'var(--teal-500)' }}>
      <div className="stat-icon" style={{ background: iconBg || 'rgba(6,182,212,0.1)' }}>
        {Icon && <Icon size={22} color={iconColor || 'var(--teal-500)'} />}
      </div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {sub && (
          <div className="stat-sub" style={{ color: subColor || 'var(--gray-400)' }}>
            {SubIcon && <SubIcon size={12} />}
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
