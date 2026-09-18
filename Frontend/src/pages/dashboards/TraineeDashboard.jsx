import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getUser, calcTaskProgress } from '../../data/mockData';
import StatCard from '../../components/ui/StatCard';
import { Badge, CategoryBadge, PriorityBadge } from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import Modal from '../../components/ui/Modal';
import { useNotifications } from '../../context/NotificationContext';
import { Ticket, CheckSquare, Package, RotateCcw, ChevronRight, AlertCircle, ArrowRight } from 'lucide-react';

export default function TraineeDashboard() {
  const { currentUser } = useAuth();
  const { tickets, tasks, stock, submitReassignmentRequest, updateSubtaskStatus } = useData();
  const { addToast } = useNotifications();
  const [reassignModal, setReassignModal] = useState(null);
  const [reassignReason, setReassignReason] = useState('');

  const myTickets = tickets.filter(t => t.assignedTo === currentUser.id && ['New','Assigned','In Progress','Pending Parts'].includes(t.status));
  const myTasks = tasks.filter(t => t.assignees.includes(currentUser.id));
  const resolvedCount = tickets.filter(t => t.assignedTo === currentUser.id && ['Resolved','Closed'].includes(t.status)).length;

  const handleReassignSubmit = () => {
    if (!reassignReason.trim()) return;
    submitReassignmentRequest(reassignModal.id, reassignReason, currentUser);
    addToast('success', 'Request Submitted', 'Reassignment request sent to IT Admin');
    setReassignModal(null);
    setReassignReason('');
  };

  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-left">
          <h2>{greeting}, {currentUser.name.split(' ')[0]} 👋</h2>
          <p>Here are your active assignments and tasks</p>
        </div>
        <div className="dashboard-welcome-badge">IT Trainee / Intern</div>
      </div>

      <div className="stats-grid">
        <StatCard label="My Active Tickets" value={myTickets.length} icon={Ticket} iconBg="rgba(6,182,212,0.1)" iconColor="var(--teal-500)" accentColor="var(--teal-500)" />
        <StatCard label="My Tasks" value={myTasks.length} icon={CheckSquare} iconBg="rgba(139,92,246,0.1)" iconColor="var(--purple-500)" accentColor="var(--purple-500)" />
        <StatCard label="Resolved This Period" value={resolvedCount} icon={CheckSquare} iconBg="rgba(16,185,129,0.1)" iconColor="var(--success-500)" accentColor="var(--success-500)" />
        <StatCard label="Stock Check" value={stock.filter(s=>s.status==='Available').length} icon={Package} iconBg="rgba(59,130,246,0.1)" iconColor="#3b82f6" accentColor="#3b82f6" sub="items available" />
      </div>

      <div className="card-grid">
        {/* Assigned Tickets */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">My Assigned Tickets</span>
            <Link to="/helpdesk" className="btn btn-ghost btn-sm"><ArrowRight size={14} /></Link>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            {myTickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-400)' }}>
                <CheckSquare size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <div>No active tickets assigned to you</div>
              </div>
            ) : myTickets.map(t => (
              <div key={t.id} style={{ border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: 10, transition: 'all var(--transition-fast)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span className="id-chip">{t.id}</span>
                      <CategoryBadge category={t.category} />
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-900)' }}>{t.title}</div>
                  </div>
                  <PriorityBadge priority={t.priority} />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginBottom: 10 }}>{t.description.slice(0,80)}...</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Badge status={t.status} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/helpdesk/${t.id}`} className="btn btn-secondary btn-sm">View</Link>
                    {!t.reassignmentRequest && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => setReassignModal(t)}
                      >
                        <RotateCcw size={13} /> Reassign
                      </button>
                    )}
                    {t.reassignmentRequest?.status === 'Pending' && <Badge status="Pending">Reassign Requested</Badge>}
                    {t.reassignmentRequest?.status === 'Rejected' && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => setReassignModal(t)}
                        title="Previous request was rejected. Click to re-request."
                      >
                        <RotateCcw size={13} /> Re-request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Tasks */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">My Project Tasks</span>
            <Link to="/tasks/mine" className="btn btn-ghost btn-sm"><ArrowRight size={14} /></Link>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            {myTasks.map(task => {
              const progress = calcTaskProgress(task);
              const mySubtasks = task.subtasks.filter(s => s.assignee === currentUser.id);
              return (
                <div key={task.id} style={{ border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <span className="id-chip" style={{ marginBottom: 4, display: 'inline-block' }}>{task.id}</span>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-900)' }}>{task.title}</div>
                    </div>
                    <Badge status={task.priority === 'Urgent' ? 'High' : task.priority === 'High' ? 'High' : task.priority === 'Medium' ? 'Medium' : 'Low'}>{task.priority}</Badge>
                  </div>
                  <ProgressBar value={progress} label="Progress" size="sm" />
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 8 }}>
                    {mySubtasks.filter(s=>s.status==='Completed').length}/{mySubtasks.length} subtasks done
                  </div>
                  <Link to={`/tasks/${task.id}`} className="btn btn-secondary btn-sm" style={{ marginTop: 10 }}>Update Progress</Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stock Quick Check */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <span className="card-title">Available Parts & Tools Quick-Check</span>
          <Link to="/stock" className="btn btn-ghost btn-sm"><ArrowRight size={14} /></Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, padding: '16px 20px' }}>
          {stock.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: s.status === 'Not Available' ? 'var(--danger-50)' : s.status === 'Low Stock' ? 'var(--warning-50)' : 'var(--gray-50)', border: `1px solid ${s.status === 'Not Available' ? '#fecdd3' : s.status === 'Low Stock' ? '#fde68a' : 'var(--gray-200)'}` }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-800)' }}>{s.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>{s.category}</div>
              </div>
              <Badge status={s.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Reassignment Modal */}
      <Modal
        isOpen={!!reassignModal}
        onClose={() => { setReassignModal(null); setReassignReason(''); }}
        title="Request Job Reassignment"
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setReassignModal(null)}>Cancel</button>
            <button className="btn btn-warning" onClick={handleReassignSubmit} disabled={!reassignReason.trim()}>
              <RotateCcw size={14} /> Submit Request
            </button>
          </>
        }
      >
        {reassignModal && (
          <div>
            <div className="alert-card alert-card-warning" style={{ marginBottom: 16, borderRadius: 'var(--radius-md)' }}>
              <div>
                <div className="alert-title">{reassignModal.id}: {reassignModal.title}</div>
                <div className="alert-message">You are requesting this ticket to be reassigned to another technician.</div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Reason for Reassignment <span className="required">*</span></label>
              <textarea
                className="form-textarea"
                placeholder="Describe why you need this ticket reassigned (e.g., requires specialized skills, scheduling conflict...)"
                value={reassignReason}
                onChange={e => setReassignReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
