import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Badge } from '../../components/ui/Badge';
import { USERS, ROLES, getUser } from '../../data/mockData';
import { Video, Plus, MapPin, Clock, Link as LinkIcon, User, Send, Check } from 'lucide-react';
import Modal from '../../components/ui/Modal';

export default function ZoomListPage() {
  const { zoomRequests, assignZoomRequest, updateZoomMeetingLink } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useNotifications();
  const [assignModal, setAssignModal] = useState(null);
  const [assignee, setAssignee] = useState('');
  const [linkModal, setLinkModal] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [filter, setFilter] = useState('All');

  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN].includes(currentUser.role);
  const isZoomRequester = currentUser.role === ROLES.ZOOM_REQUESTER;
  const technicians = USERS.filter(u => [ROLES.IT_ADMIN, ROLES.TRAINEE].includes(u.role));

  const filtered = filter === 'All' ? zoomRequests : zoomRequests.filter(z => z.status === filter);

  const handleAssign = () => {
    assignZoomRequest(assignModal.id, assignee || currentUser.id, currentUser);
    addToast('success', 'Assigned', `Zoom request assigned to ${getUser(assignee || currentUser.id)?.name}`);
    setAssignModal(null);
    setAssignee('');
  };

  const handleSaveLink = () => {
    if (!meetingLink.trim()) {
      addToast('error', 'Missing Link', 'Please enter a valid Zoom meeting URL');
      return;
    }
    updateZoomMeetingLink(linkModal.id, meetingLink.trim(), currentUser);
    addToast('success', 'Zoom Link Uploaded', `Meeting link sent for "${linkModal.meetingName}"`);
    setLinkModal(null);
    setMeetingLink('');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Zoom Support Scheduler</h1>
          <p>Manage meeting technical support requests, upload meeting links, and assignments</p>
        </div>
        {/* ITAdmin should not have New Zoom Request button — only Zoom Requesters create requests */}
        {isZoomRequester && (
          <div className="page-header-actions">
            <Link to="/zoom/new" className="btn btn-primary"><Plus size={15} /> New Zoom Request</Link>
          </div>
        )}
      </div>

      <div className="tab-list">
        {['All', 'Pending', 'Confirmed', 'Completed'].map(s => (
          <div key={s} className={`tab-item ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s}
            <span style={{ fontSize: '0.72rem', background: 'var(--gray-200)', padding: '1px 6px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              {s === 'All' ? zoomRequests.length : zoomRequests.filter(z => z.status === s).length}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
        {filtered.map(z => {
          const assignedUser = getUser(z.assignedTo);
          const requester = getUser(z.requestedBy);
          return (
            <div key={z.id} className={`zoom-card zoom-card-level-${z.meetingLevel.toLowerCase()}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <span className="id-chip" style={{ marginBottom: 4, display: 'inline-block' }}>{z.id}</span>
                  <div className="zoom-meeting-name">{z.meetingName}</div>
                </div>
                <Badge status={z.meetingLevel === 'Critical' ? 'High' : 'Medium'}>{z.meetingLevel}</Badge>
              </div>

              <div className="zoom-detail-row">
                <Clock size={13} />
                <span>{new Date(z.scheduledDate).toLocaleString()}</span>
              </div>
              <div className="zoom-detail-row">
                <MapPin size={13} />
                <span>{z.location}</span>
              </div>
              <div className="zoom-detail-row">
                <User size={13} />
                <span style={{ fontSize: '0.78rem' }}>
                  Requested by: <strong>{requester ? requester.name : 'Staff'}</strong> {requester?.division ? `(${requester.division})` : ''}
                </span>
              </div>

              {z.meetingLink ? (
                <div className="zoom-detail-row" style={{ color: 'var(--teal-600)', marginTop: 4 }}>
                  <LinkIcon size={13} />
                  <a
                    href={z.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--teal-600)', fontWeight: 600, textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    Join Zoom Link
                  </a>
                </div>
              ) : (
                <div className="zoom-detail-row" style={{ color: 'var(--warning-700)', marginTop: 4, fontSize: '0.78rem' }}>
                  <Clock size={13} />
                  <em>Zoom link not yet uploaded</em>
                </div>
              )}

              <div className="zoom-equipment-list">
                {z.requiredEquipment.map(e => <span key={e} className="zoom-equipment-tag">{e}</span>)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--gray-100)', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <Badge status={z.status} />
                  {assignedUser && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 4 }}>
                      Tech: {assignedUser.name}
                    </div>
                  )}
                </div>
                {isAdmin && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button
                      className={z.meetingLink ? "btn btn-secondary btn-sm" : "btn btn-primary btn-sm"}
                      onClick={() => { setLinkModal(z); setMeetingLink(z.meetingLink || ''); }}
                    >
                      <LinkIcon size={13} /> {z.meetingLink ? 'Edit Link' : 'Upload Zoom Link'}
                    </button>
                    {z.status !== 'Completed' && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => { setAssignModal(z); setAssignee(z.assignedTo || ''); }}
                      >
                        <User size={13} /> {z.assignedTo ? 'Reassign' : 'Assign'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Zoom Link Modal */}
      <Modal
        isOpen={!!linkModal}
        onClose={() => { setLinkModal(null); setMeetingLink(''); }}
        title="Upload Zoom Meeting Link"
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => { setLinkModal(null); setMeetingLink(''); }}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSaveLink} disabled={!meetingLink.trim()}>
              <Send size={14} /> Send Zoom Link
            </button>
          </>
        }
      >
        {linkModal && (
          <div>
            <div style={{ padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-900)' }}>{linkModal.meetingName}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: 3 }}>
                Requested by: <strong>{getUser(linkModal.requestedBy)?.name}</strong> ({getUser(linkModal.requestedBy)?.division})
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: 2 }}>
                Scheduled: {new Date(linkModal.scheduledDate).toLocaleString()} • {linkModal.location}
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Zoom Meeting Link / URL <span className="required">*</span></label>
              <input
                className="form-input"
                placeholder="https://zoom.us/j/1234567890?pwd=..."
                value={meetingLink}
                onChange={e => setMeetingLink(e.target.value)}
                autoFocus
              />
              <div className="form-hint">Enter the generated Zoom meeting URL. It will be sent to the requester.</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Modal */}
      <Modal isOpen={!!assignModal} onClose={() => setAssignModal(null)} title="Assign Zoom Support" size="sm"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setAssignModal(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAssign}>Assign</button>
        </>}
      >
        {assignModal && (
          <div>
            <div style={{ padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
              <div style={{ fontWeight: 700 }}>{assignModal.meetingName}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{new Date(assignModal.scheduledDate).toLocaleString()}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Assign Technician</label>
              <select className="form-select" value={assignee} onChange={e => setAssignee(e.target.value)}>
                <option value={currentUser.id}>Self — {currentUser.name}</option>
                {technicians.filter(u => u.id !== currentUser.id).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <div className="form-hint">Assign a technician for equipment setup and on-site support</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
