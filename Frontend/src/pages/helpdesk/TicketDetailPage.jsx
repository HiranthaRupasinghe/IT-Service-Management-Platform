import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Badge, CategoryBadge, PriorityBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { getUser, USERS, ROLES, getAsset } from '../../data/mockData';
import { ArrowLeft, User, Calendar, Tag, RefreshCw, CheckCircle, ChevronRight, XCircle } from 'lucide-react';

const STATUS_FLOW = ['New', 'Assigned', 'In Progress', 'Pending Parts', 'Resolved', 'Closed'];

export default function TicketDetailPage() {
  const { id } = useParams();
  const { tickets, updateTicketStatus, assignTicket, submitReassignmentRequest, rejectReassignmentRequest } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useNotifications();
  const [reassignModal, setReassignModal] = useState(false);
  const [reassignReason, setReassignReason] = useState('');
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [assignModal, setAssignModal] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('');

  const ticket = tickets.find(t => t.id === id);
  if (!ticket) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-400)' }}>Ticket not found</div>;

  const assignedUser = getUser(ticket.assignedTo);
  const asset = ticket.assetId ? getAsset(ticket.assetId) : null;
  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN].includes(currentUser.role);
  const isAssignee = ticket.assignedTo === currentUser.id;
  const currentStatusIdx = STATUS_FLOW.indexOf(ticket.status);
  const nextStatus = STATUS_FLOW[currentStatusIdx + 1];

  const handleStatusAdvance = () => {
    if (!nextStatus) return;
    updateTicketStatus(id, nextStatus, currentUser);
    addToast('success', 'Status Updated', `Ticket moved to "${nextStatus}"`);
  };

  const handleAssign = () => {
    assignTicket(id, selectedAssignee, currentUser);
    addToast('success', 'Ticket Assigned', `Assigned to ${getUser(selectedAssignee)?.name}`);
    setAssignModal(false);
  };

  const handleReassignSubmit = () => {
    if (!reassignReason.trim()) return;
    submitReassignmentRequest(id, reassignReason, currentUser);
    addToast('success', 'Reassignment Requested', 'IT Admin has been notified');
    setReassignModal(false);
    setReassignReason('');
  };

  const handleRejectReassignSubmit = () => {
    rejectReassignmentRequest(id, rejectReason, currentUser);
    addToast('info', 'Reassignment Rejected', 'The reassignment request has been rejected');
    setRejectModal(false);
    setRejectReason('');
  };

  const technicians = USERS.filter(u => [ROLES.IT_ADMIN, ROLES.TRAINEE].includes(u.role));

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Link to="/helpdesk" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}><ArrowLeft size={15} /> Back to Helpdesk</Link>
      </div>

      {/* Header */}
      <div className="detail-header">
        <div className="detail-icon" style={{ background: 'rgba(6,182,212,0.1)' }}>
          <Tag size={28} color="var(--teal-500)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="detail-title">{ticket.title}</div>
          <div className="detail-meta">
            <span className="id-chip">{ticket.id}</span>
            <CategoryBadge category={ticket.category} />
            <PriorityBadge priority={ticket.priority} />
            <Badge status={ticket.status} />
          </div>
        </div>
        <div className="detail-actions">
          {isAdmin && <button className="btn btn-secondary" onClick={() => setAssignModal(true)}><User size={14} /> Assign</button>}
          {(isAssignee || isAdmin) && nextStatus && (
            <button className="btn btn-primary" onClick={handleStatusAdvance}>
              Move to {nextStatus} <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Reassignment alert - Pending */}
      {ticket.reassignmentRequest?.status === 'Pending' && (
        <div className="alert-card alert-card-warning" style={{ marginBottom: 20, borderRadius: 'var(--radius-lg)', padding: '14px 20px', display: 'flex', alignItems: 'center' }}>
          <RefreshCw size={18} color="var(--warning-700)" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="alert-title">Reassignment Request Pending</div>
            <div className="alert-message">
              <strong>{getUser(ticket.reassignmentRequest.requestedBy)?.name}</strong> requested reassignment:
              "{ticket.reassignmentRequest.reason}"
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 4 }}>
              Requested at {new Date(ticket.reassignmentRequest.requestedAt).toLocaleString()}
            </div>
          </div>
          {isAdmin && (
            <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
              <button className="btn btn-outline-danger btn-sm" onClick={() => setRejectModal(true)}>
                <XCircle size={14} /> Reject
              </button>
              <button className="btn btn-warning btn-sm" onClick={() => setAssignModal(true)}>
                <RefreshCw size={14} /> Reassign Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reassignment alert - Rejected */}
      {ticket.reassignmentRequest?.status === 'Rejected' && (
        <div className="alert-card alert-card-error" style={{ marginBottom: 20, borderRadius: 'var(--radius-lg)', padding: '14px 20px', display: 'flex', alignItems: 'flex-start' }}>
          <XCircle size={18} color="var(--danger-700)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="alert-title">Reassignment Request Rejected</div>
            <div className="alert-message">
              Reassignment request from <strong>{getUser(ticket.reassignmentRequest.requestedBy)?.name}</strong> was rejected by <strong>{getUser(ticket.reassignmentRequest.rejectedBy)?.name || 'IT Admin'}</strong>.
              {ticket.reassignmentRequest.rejectionReason && (
                <div style={{ marginTop: 4, fontStyle: 'italic', color: 'var(--gray-700)' }}>
                  "{ticket.reassignmentRequest.rejectionReason}"
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 4 }}>
              Rejected at {new Date(ticket.reassignmentRequest.rejectedAt).toLocaleString()}
            </div>
          </div>
          {isAssignee && (
            <button className="btn btn-secondary btn-sm" onClick={() => setReassignModal(true)} style={{ marginLeft: 'auto', flexShrink: 0 }}>
              <RefreshCw size={14} /> Request Again
            </button>
          )}
        </div>
      )}

      {/* Status Progress */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header"><span className="card-title">Ticket Progress</span></div>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {STATUS_FLOW.map((s, i) => {
              const active = i <= currentStatusIdx;
              const current = i === currentStatusIdx;
              return (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: current ? 'var(--teal-500)' : active ? 'var(--success-500)' : 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                      {active && !current && <CheckCircle size={16} color="white" />}
                      {current && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'white' }} />}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: current ? 700 : 500, color: current ? 'var(--teal-600)' : active ? 'var(--success-600)' : 'var(--gray-400)', textAlign: 'center', whiteSpace: 'nowrap' }}>{s}</div>
                  </div>
                  {i < STATUS_FLOW.length - 1 && (
                    <div style={{ height: 2, flex: 1, background: active && i < currentStatusIdx ? 'var(--success-500)' : 'var(--gray-200)', marginBottom: 20 }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card-grid">
        {/* Details */}
        <div className="card">
          <div className="card-header"><span className="card-title">Issue Details</span></div>
          <div className="card-body">
            <div className="form-group">
              <div className="info-label">Description</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-700)', lineHeight: 1.7, marginTop: 4, background: 'var(--gray-50)', padding: 12, borderRadius: 'var(--radius-md)' }}>
                {ticket.description}
              </div>
            </div>
            {ticket.notes && (
              <div className="form-group">
                <div className="info-label">Technician Notes</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-700)', lineHeight: 1.7, marginTop: 4, background: 'var(--gray-50)', padding: 12, borderRadius: 'var(--radius-md)' }}>
                  {ticket.notes}
                </div>
              </div>
            )}
            <div className="info-grid" style={{ marginTop: 16 }}>
              <div className="info-item"><div className="info-label">Division</div><div className="info-value">{ticket.division}</div></div>
              <div className="info-item"><div className="info-label">Created</div><div className="info-value">{new Date(ticket.createdAt).toLocaleString()}</div></div>
              {asset && <div className="info-item"><div className="info-label">Asset</div><div className="info-value"><Link to={`/assets/${asset.id}`} style={{ color: 'var(--teal-600)', fontWeight: 600 }}>{asset.tag}</Link></div></div>}
            </div>
          </div>
        </div>

        {/* Assignment */}
        <div className="card">
          <div className="card-header"><span className="card-title">Assignment & Actions</span></div>
          <div className="card-body">
            {assignedUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--gray-100)', marginBottom: 16 }}>
                <div className="avatar avatar-lg" style={{ background: 'var(--teal-500)' }}>{assignedUser.name.slice(0,2)}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{assignedUser.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{assignedUser.role.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}</div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0', borderBottom: '1px solid var(--gray-100)', marginBottom: 16, color: 'var(--gray-400)' }}>
                Not yet assigned
              </div>
            )}

            {isAdmin && (
              <button className="btn btn-secondary w-full" onClick={() => setAssignModal(true)} style={{ marginBottom: 8 }}>
                <User size={14} /> {ticket.assignedTo ? 'Reassign' : 'Assign'} Technician
              </button>
            )}

            {isAssignee && !ticket.reassignmentRequest && (
              <button className="btn btn-warning w-full" onClick={() => setReassignModal(true)}>
                <RefreshCw size={14} /> Request Reassignment
              </button>
            )}

            {isAssignee && ticket.reassignmentRequest?.status === 'Pending' && (
              <div className="alert-card alert-card-warning" style={{ borderRadius: 'var(--radius-md)', marginTop: 8 }}>
                <div className="alert-message">Reassignment request submitted and pending IT Admin review.</div>
              </div>
            )}

            {isAssignee && ticket.reassignmentRequest?.status === 'Rejected' && (
              <div className="alert-card alert-card-error" style={{ borderRadius: 'var(--radius-md)', marginTop: 8 }}>
                <div className="alert-message" style={{ marginBottom: 8 }}>
                  Reassignment request was rejected. Please continue handling this ticket.
                </div>
                <button className="btn btn-secondary btn-sm w-full" onClick={() => setReassignModal(true)}>
                  <RefreshCw size={13} /> Request Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <Modal isOpen={assignModal} onClose={() => setAssignModal(false)} title="Assign Technician" size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setAssignModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAssign} disabled={!selectedAssignee}>Assign</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Select Technician</label>
          <select className="form-select" value={selectedAssignee} onChange={e => setSelectedAssignee(e.target.value)}>
            <option value="">-- Select --</option>
            {technicians.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role.replace('_',' ')})</option>)}
          </select>
        </div>
      </Modal>

      {/* Reassign Modal */}
      <Modal isOpen={reassignModal} onClose={() => setReassignModal(false)} title="Request Reassignment" size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setReassignModal(false)}>Cancel</button>
            <button className="btn btn-warning" onClick={handleReassignSubmit} disabled={!reassignReason.trim()}>Submit Request</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Reason for Reassignment <span className="required">*</span></label>
          <textarea className="form-textarea" value={reassignReason} onChange={e => setReassignReason(e.target.value)} placeholder="Explain why this ticket needs reassignment..." rows={4} />
        </div>
      </Modal>

      {/* Reject Reassignment Modal */}
      <Modal
        isOpen={rejectModal}
        onClose={() => { setRejectModal(false); setRejectReason(''); }}
        title="Reject Reassignment Request"
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => { setRejectModal(false); setRejectReason(''); }}>Cancel</button>
            <button className="btn btn-danger" onClick={handleRejectReassignSubmit}>
              <XCircle size={14} /> Reject Request
            </button>
          </>
        }
      >
        <div>
          <div className="alert-card alert-card-warning" style={{ borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 14 }}>
            <div style={{ fontSize: '0.82rem' }}>
              <strong>{getUser(ticket.reassignmentRequest?.requestedBy)?.name}</strong> requested reassignment:
              <div style={{ marginTop: 4, fontStyle: 'italic', color: 'var(--gray-700)' }}>
                "{ticket.reassignmentRequest?.reason}"
              </div>
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Reason for Rejection (Optional)</label>
            <textarea
              className="form-textarea"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Explain why the reassignment request is rejected..."
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
