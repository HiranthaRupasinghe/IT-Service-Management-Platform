import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/ui/DataTable';
import { Badge, CategoryBadge, PriorityBadge } from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import { getTicketStats, getUser, ROLES } from '../../data/mockData';
import { Ticket, Plus, Search, AlertCircle, CheckCircle, Clock, RefreshCw, XCircle } from 'lucide-react';

const STATUS_ORDER = ['New', 'Assigned', 'In Progress', 'Pending Parts', 'Resolved', 'Closed'];

export default function TicketListPage() {
  const { tickets } = useData();
  const { currentUser } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [search, setSearch] = useState('');

  const isTrainee = currentUser.role === ROLES.TRAINEE;
  const pendingReassignCount = tickets.filter(t => t.reassignmentRequest?.status === 'Pending').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;
  const openCount = tickets.filter(t => ['New', 'Assigned', 'In Progress', 'Pending Parts'].includes(t.status)).length;

  const filtered = tickets.filter(t => {
    const matchCat = categoryFilter === 'All' || t.category === categoryFilter;
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchPri = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchSearch = !search || [t.id, t.title, t.division].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchOwn = !isTrainee || t.assignedTo === currentUser.id;
    return matchCat && matchStatus && matchPri && matchSearch && matchOwn;
  });

  const columns = [
    { key: 'id', label: 'Ticket ID', render: (v) => <Link to={`/helpdesk/${v}`} style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--teal-600)', fontWeight: 600, fontSize: '0.8rem' }}>{v}</Link> },
    { key: 'title', label: 'Issue', render: (v, row) => (
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 2 }}>{v}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{row.division}</div>
        {row.reassignmentRequest?.status === 'Pending' && (
          <span className="badge badge-amber" style={{ fontSize: '0.65rem', marginTop: 3 }}>
            <RefreshCw size={9} /> Reassignment Pending
          </span>
        )}
        {row.reassignmentRequest?.status === 'Rejected' && (
          <span className="badge badge-red" style={{ fontSize: '0.65rem', marginTop: 3 }}>
            <XCircle size={9} /> Reassign Rejected
          </span>
        )}
      </div>
    )},
    { key: 'category', label: 'Category', render: v => <CategoryBadge category={v} /> },
    { key: 'priority', label: 'Priority', render: v => <PriorityBadge priority={v} /> },
    { key: 'status', label: 'Status', render: v => <Badge status={v} /> },
    { key: 'assignedTo', label: 'Assignee', render: v => { const u = getUser(v); return u ? <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><div className="avatar avatar-sm" style={{ background: 'var(--teal-500)' }}>{u.name.slice(0,2)}</div><span style={{ fontSize: '0.8rem' }}>{u.name}</span></div> : '—'; }},
    { key: 'createdAt', label: 'Created', render: v => <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{new Date(v).toLocaleDateString()}</span> },
    { key: 'action', label: '', sortable: false, render: (_, row) => <Link to={`/helpdesk/${row.id}`} className="btn btn-secondary btn-sm">View</Link> },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Helpdesk Tickets</h1>
          <p>Categorized IT service requests across all Ministry divisions</p>
        </div>
        <div className="page-header-actions">
          {!isTrainee && <Link to="/helpdesk/new" className="btn btn-primary"><Plus size={15} /> New Ticket</Link>}
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Tickets" value={tickets.length} icon={Ticket} iconBg="rgba(6,182,212,0.1)" iconColor="var(--teal-500)" accentColor="var(--teal-500)" />
        <StatCard label="Open / Active" value={openCount} icon={Clock} iconBg="rgba(245,158,11,0.1)" iconColor="var(--warning-500)" accentColor="var(--warning-500)" />
        <StatCard label="Resolved" value={resolvedCount} icon={CheckCircle} iconBg="rgba(16,185,129,0.1)" iconColor="var(--success-500)" accentColor="var(--success-500)" />
        <StatCard label="Reassign Pending" value={pendingReassignCount} icon={AlertCircle} iconBg={pendingReassignCount > 0 ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)'} iconColor={pendingReassignCount > 0 ? 'var(--danger-500)' : 'var(--success-500)'} accentColor={pendingReassignCount > 0 ? 'var(--danger-500)' : 'var(--success-500)'} />
      </div>

      {/* Category tabs */}
      <div className="tab-list">
        {['All', 'Hardware', 'Software', 'Network', 'PC/Printer'].map(cat => (
          <div key={cat} className={`tab-item ${categoryFilter === cat ? 'active' : ''}`} onClick={() => setCategoryFilter(cat)}>
            {cat}
            <span style={{ fontSize: '0.72rem', background: 'var(--gray-200)', padding: '1px 6px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              {cat === 'All' ? tickets.length : tickets.filter(t => t.category === cat).length}
            </span>
          </div>
        ))}
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={15} color="var(--gray-400)" />
            <input className="filter-input" placeholder="Search ticket ID, title, division..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 280 }} />
          </div>
          <div className="table-filters">
            <select className="filter-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              {STATUS_ORDER.map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="filter-input" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
              <option value="All">All Priorities</option>
              <option>Urgent</option><option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
        </div>
        <DataTable columns={columns} data={filtered} emptyMessage="No tickets found" emptyIcon="🎫" />
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--gray-100)', fontSize: '0.78rem', color: 'var(--gray-400)' }}>
          Showing {filtered.length} of {tickets.length} tickets
        </div>
      </div>
    </div>
  );
}
