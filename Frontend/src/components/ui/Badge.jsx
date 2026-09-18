import React from 'react';
import { STATUS_COLORS } from '../../data/mockData';

export function Badge({ status, children, className = '' }) {
  const colorClass = STATUS_COLORS[status] || STATUS_COLORS[children] || 'badge-gray';
  return (
    <span className={`badge ${colorClass} ${className}`}>
      <span className="badge-dot" />
      {children || status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const map = { Urgent: 'badge-red', High: 'badge-red', Medium: 'badge-amber', Low: 'badge-gray' };
  return <span className={`badge ${map[priority] || 'badge-gray'}`}>{priority}</span>;
}

export function CategoryBadge({ category }) {
  const map = { Hardware: 'badge-blue', Software: 'badge-purple', Network: 'badge-teal', 'PC/Printer': 'badge-orange' };
  return <span className={`badge ${map[category] || 'badge-gray'}`}>{category}</span>;
}

export function RoleBadge({ role }) {
  const map = {
    super_admin: { cls: 'badge-red', label: 'Super Admin' },
    it_admin:    { cls: 'badge-blue', label: 'IT Admin' },
    trainee:     { cls: 'badge-green', label: 'Trainee' },
    zoom_requester: { cls: 'badge-purple', label: 'Zoom Requester' },
  };
  const r = map[role] || { cls: 'badge-gray', label: role };
  return <span className={`badge ${r.cls}`}>{r.label}</span>;
}
