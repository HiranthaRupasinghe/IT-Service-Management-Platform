import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Activity, Search, Filter } from 'lucide-react';

const ACTION_ICONS = {
  CREATE: '➕', UPDATE: '✏️', ASSIGN: '👤', DELETE: '🗑️',
  STATUS_CHANGE: '🔄', REASSIGN_REQUEST: '↩️', DISPATCH: '📦',
  CLOSE: '✅', PUBLISH: '🌐', PRIVILEGE_CHANGE: '🔐',
  LOGIN: '🔑', RESOLVE: '✅',
};

const MODULES = ['All','Helpdesk','Stock','Task Management','External Repairs','Zoom Support','Web Publication','User Management','Authentication'];
const ACTIONS = ['All','CREATE','UPDATE','ASSIGN','STATUS_CHANGE','REASSIGN_REQUEST','DISPATCH','CLOSE','PUBLISH','PRIVILEGE_CHANGE','LOGIN','RESOLVE'];

export default function AuditLogPage() {
  const { auditLogs } = useData();
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');

  const filtered = auditLogs.filter(log => {
    const matchSearch = !search || [log.description, log.username, log.entityId].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchModule = moduleFilter === 'All' || log.module === moduleFilter;
    const matchAction = actionFilter === 'All' || log.action === actionFilter;
    return matchSearch && matchModule && matchAction;
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Immutable Audit Trail</h1>
          <p>Complete, tamper-proof system-wide activity log — Super Admin only</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', background:'rgba(6,182,212,0.08)', borderRadius:'var(--radius-md)', border:'1px solid rgba(6,182,212,0.2)' }}>
          <Activity size={15} color="var(--teal-600)" />
          <span style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--teal-600)' }}>{auditLogs.length} entries — Append only</span>
        </div>
      </div>

      <div className="alert-card alert-card-info" style={{ marginBottom:24, borderRadius:'var(--radius-lg)', padding:'14px 20px' }}>
        <div className="alert-message">
          <strong>🔒 Immutability Notice:</strong> This log is append-only. No entries can be edited or deleted. Every user action across all system modules is automatically recorded here with exact timestamp and user identity.
        </div>
      </div>

      <div className="table-container">
        <div className="table-toolbar" style={{ flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Search size={15} color="var(--gray-400)" />
            <input className="filter-input" placeholder="Search description, user, entity..." value={search} onChange={e=>setSearch(e.target.value)} style={{ width:280 }} />
          </div>
          <div className="table-filters">
            <select className="filter-input" value={moduleFilter} onChange={e=>setModuleFilter(e.target.value)}>
              {MODULES.map(m => <option key={m}>{m}</option>)}
            </select>
            <select className="filter-input" value={actionFilter} onChange={e=>setActionFilter(e.target.value)}>
              {ACTIONS.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <span style={{ marginLeft:'auto', fontSize:'0.78rem', color:'var(--gray-400)' }}>{filtered.length} of {auditLogs.length} entries</span>
        </div>

        <div style={{ padding:'0 20px 20px' }}>
          {filtered.map(log => (
            <div key={log.id} className="audit-entry">
              <div className={`audit-icon-wrap audit-action-${log.action}`}>
                <span style={{ fontSize:'1rem' }}>{ACTION_ICONS[log.action] || '📋'}</span>
              </div>
              <div className="audit-details">
                <div className="audit-desc">{log.description}</div>
                <div className="audit-meta">
                  <span className="audit-user">{log.username}</span>
                  <span className="audit-time">{new Date(log.timestamp).toLocaleString('en-US', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' })}</span>
                  <span className="audit-module">{log.module}</span>
                  <span className={`badge badge-gray`} style={{ fontSize:'0.65rem' }}>{log.action}</span>
                  {log.entityId && <span style={{ fontSize:'0.72rem', fontFamily:'JetBrains Mono,monospace', color:'var(--gray-400)' }}>{log.entityType}: {log.entityId}</span>}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'48px', color:'var(--gray-400)' }}>
              <Activity size={40} style={{ margin:'0 auto 16px', opacity:0.3 }} />
              <div>No audit entries match your filters</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
