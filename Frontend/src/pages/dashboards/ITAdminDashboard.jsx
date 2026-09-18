import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getTicketStats, getUser } from '../../data/mockData';
import StatCard from '../../components/ui/StatCard';
import { Badge, CategoryBadge, PriorityBadge } from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { Ticket, Package, Wrench, Video, Globe, AlertCircle, Clock, Plus, CheckSquare, ArrowRight } from 'lucide-react';

export default function ITAdminDashboard() {
  const { currentUser } = useAuth();
  const { tickets, stock, repairs, zoomRequests } = useData();

  const stats = getTicketStats();
  const pendingReassign = tickets.filter(t => t.reassignmentRequest?.status === 'Pending');
  const overdueRepairs = repairs.filter(r => r.status === 'Overdue');
  const lowStock = stock.filter(s => ['Low Stock', 'Not Available'].includes(s.status));
  const upcomingZoom = zoomRequests.filter(z => ['Pending', 'Confirmed'].includes(z.status));

  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-left">
          <h2>{greeting}, {currentUser.name.split(' ')[0]} 👋</h2>
          <p>IT Admin Control Center — {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/helpdesk/new" className="btn btn-primary" style={{ fontSize: '0.82rem', padding: '8px 16px' }}>
            <Plus size={15} /> New Ticket
          </Link>
        </div>
      </div>

      {/* Reassignment Alert Banner */}
      {pendingReassign.length > 0 && (
        <div className="alert-card alert-card-warning" style={{ marginBottom: '20px', borderRadius: 'var(--radius-lg)', padding: '14px 20px' }}>
          <AlertCircle size={20} color="var(--warning-700)" style={{ flexShrink: 0 }} />
          <div>
            <div className="alert-title">⚠ {pendingReassign.length} Reassignment Request{pendingReassign.length > 1 ? 's' : ''} Pending</div>
            <div className="alert-message">
              {pendingReassign.map(t => (
                <span key={t.id} style={{ marginRight: 12 }}>
                  <Link to={`/helpdesk/${t.id}`} style={{ color: 'var(--warning-700)', fontWeight: 600 }}>{t.id}</Link>
                  {' — '}{t.reassignmentRequest.reason.slice(0, 50)}...
                </span>
              ))}
            </div>
          </div>
          <Link to="/helpdesk" className="btn btn-warning btn-sm" style={{ marginLeft: 'auto', flexShrink: 0 }}>Review</Link>
        </div>
      )}

      <div className="stats-grid">
        <StatCard label="Open Tickets" value={stats.open} icon={Ticket} iconBg="rgba(6,182,212,0.1)" iconColor="var(--teal-500)" accentColor="var(--teal-500)" sub={`${stats.total} total`} />
        <StatCard label="Pending Reassignment" value={pendingReassign.length} icon={AlertCircle} iconBg={pendingReassign.length > 0 ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)'} iconColor={pendingReassign.length > 0 ? 'var(--warning-500)' : 'var(--success-500)'} accentColor={pendingReassign.length > 0 ? 'var(--warning-500)' : 'var(--success-500)'} sub="Requires action" />
        <StatCard label="Stock Issues" value={lowStock.length} icon={Package} iconBg="rgba(244,63,94,0.1)" iconColor="var(--danger-500)" accentColor="var(--danger-500)" sub={`${stock.filter(s=>s.status==='Not Available').length} not available`} />
        <StatCard label="Overdue Repairs" value={overdueRepairs.length} icon={Wrench} iconBg={overdueRepairs.length > 0 ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)'} iconColor={overdueRepairs.length > 0 ? 'var(--danger-500)' : 'var(--success-500)'} accentColor={overdueRepairs.length > 0 ? 'var(--danger-500)' : 'var(--success-500)'} sub="External vendor" />
        <StatCard label="Zoom Sessions" value={upcomingZoom.length} icon={Video} iconBg="rgba(139,92,246,0.1)" iconColor="var(--purple-500)" accentColor="var(--purple-500)" sub="Upcoming & pending" />
      </div>

      <div className="card-grid">
        {/* Ticket Triage */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Helpdesk Ticket Triage</span>
            <Link to="/helpdesk" className="btn btn-ghost btn-sm"><ArrowRight size={14} /></Link>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr><th>ID</th><th>Title</th><th>Category</th><th>Priority</th><th>Status</th></tr>
              </thead>
              <tbody>
                {tickets.filter(t => ['New','Assigned','In Progress','Pending Parts'].includes(t.status)).slice(0,5).map(t => (
                  <tr key={t.id}>
                    <td><Link to={`/helpdesk/${t.id}`} style={{ color: 'var(--teal-600)', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem' }}>{t.id}</Link></td>
                    <td style={{ maxWidth: 180 }}><span className="truncate" style={{ display: 'block' }}>{t.title}</span></td>
                    <td><CategoryBadge category={t.category} /></td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td><Badge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Status Panel */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Consumable Stock Status</span>
            <Link to="/stock" className="btn btn-ghost btn-sm"><ArrowRight size={14} /></Link>
          </div>
          <div className="card-body" style={{ paddingTop: 12 }}>
            {stock.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-800)' }}>{s.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>{s.category}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 700, color: s.quantity === 0 ? 'var(--danger-500)' : 'var(--gray-800)' }}>{s.quantity}</span>
                  <Badge status={s.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zoom Schedule & Repair Monitor */}
      <div className="card-grid" style={{ marginTop: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Upcoming Zoom Sessions</span>
            <Link to="/zoom" className="btn btn-ghost btn-sm"><ArrowRight size={14} /></Link>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            {upcomingZoom.map(z => (
              <div key={z.id} className={`zoom-card zoom-card-level-${z.meetingLevel.toLowerCase()}`} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div className="zoom-meeting-name">{z.meetingName}</div>
                  <Badge status={z.meetingLevel === 'Critical' ? 'High' : 'Medium'}>{z.meetingLevel}</Badge>
                </div>
                <div className="zoom-detail-row"><Clock size={13} />{new Date(z.scheduledDate).toLocaleString()}</div>
                <div className="zoom-detail-row">{z.location}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <Badge status={z.status} />
                  {z.meetingLink ? (
                    <span style={{ fontSize: '0.72rem', color: 'var(--teal-600)', fontWeight: 600 }}>✓ Link Uploaded</span>
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: 'var(--warning-700)', fontWeight: 600 }}>⚠ Link Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">External Repair Monitor</span>
            <Link to="/repairs" className="btn btn-ghost btn-sm"><ArrowRight size={14} /></Link>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            {repairs.map(r => (
              <div key={r.id} className={`stock-card${r.status === 'Overdue' ? ' out-of-stock' : ''}`} style={{ marginBottom: 12, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{r.assetTag}</span>
                  <Badge status={r.status} />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)', marginBottom: 4 }}>
                  <strong>Vendor:</strong> {r.vendorName}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)', marginBottom: 4 }}>
                  <strong>For:</strong> {r.forReason.slice(0, 60)}...
                </div>
                <div style={{ fontSize: '0.75rem', color: r.status === 'Overdue' ? 'var(--danger-500)' : 'var(--gray-500)' }}>
                  Expected: {r.expectedReturn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
