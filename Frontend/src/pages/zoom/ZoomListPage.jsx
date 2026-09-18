import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Badge } from '../../components/ui/Badge';
import { USERS, ROLES, getUser } from '../../data/mockData';
import { Video, Plus, MapPin, Clock, Link as LinkIcon, User, Send, Check, Hash, Key, Copy } from 'lucide-react';
import Modal from '../../components/ui/Modal';

export default function ZoomListPage() {
  const { zoomRequests, assignZoomRequest, updateZoomMeetingLink } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useNotifications();
  const [assignModal, setAssignModal] = useState(null);
  const [assignee, setAssignee] = useState('');
  const [linkModal, setLinkModal] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [passcode, setPasscode] = useState('');
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

  const handleOpenLinkModal = (z) => {
    setLinkModal(z);
    setMeetingLink(z.meetingLink || '');
    setMeetingId(z.meetingId || '');
    setPasscode(z.passcode || '');
  };

  const handleLinkChange = (url) => {
    setMeetingLink(url);
    try {
      // Auto-extract Meeting ID if found in url
      const matchId = url.match(/\/j\/(\d+)/);
      if (matchId && matchId[1] && !meetingId) {
        const raw = matchId[1];
        const formatted = raw.length === 11 
          ? `${raw.slice(0,3)} ${raw.slice(3,7)} ${raw.slice(7)}`
          : raw.length === 10
          ? `${raw.slice(0,3)} ${raw.slice(3,6)} ${raw.slice(6)}`
          : raw;
        setMeetingId(formatted);
      }
      // Auto-extract Passcode if pwd param exists
      const matchPwd = url.match(/[?&]pwd=([^&#]+)/);
      if (matchPwd && matchPwd[1] && !passcode) {
        setPasscode(matchPwd[1]);
      }
    } catch (err) {
      // ignore regex parsing error
    }
  };

  const handleSaveLink = () => {
    if (!meetingLink.trim()) {
      addToast('error', 'Missing Link', 'Please enter a valid Zoom meeting URL');
      return;
    }
    updateZoomMeetingLink(linkModal.id, {
      meetingLink: meetingLink.trim(),
      meetingId: meetingId.trim(),
      passcode: passcode.trim(),
    }, currentUser);
    addToast('success', 'Zoom Details Uploaded', `Meeting link and access credentials sent for "${linkModal.meetingName}"`);
    setLinkModal(null);
    setMeetingLink('');
    setMeetingId('');
    setPasscode('');
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    addToast('info', 'Copied', `${label} copied to clipboard`);
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
                <div style={{ background: 'var(--teal-50, #f0fdfa)', border: '1px solid var(--teal-200, #99f6e4)', borderRadius: 'var(--radius-md)', padding: '10px 12px', margin: '8px 0 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: (z.meetingId || z.passcode) ? 8 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <LinkIcon size={14} style={{ color: 'var(--teal-600)' }} />
                      <a
                        href={z.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--teal-600)', fontWeight: 700, fontSize: '0.84rem', textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        Join Zoom Meeting
                      </a>
                    </div>
                  </div>

                  {(z.meetingId || z.passcode) && (
                    <div style={{ display: 'flex', gap: 12, fontSize: '0.78rem', color: 'var(--gray-700)', flexWrap: 'wrap', paddingTop: 6, borderTop: '1px dashed var(--teal-200, #a5f3fc)' }}>
                      {z.meetingId && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Hash size={12} style={{ color: 'var(--teal-700)' }} />
                          <span style={{ color: 'var(--gray-500)' }}>ID:</span>
                          <strong style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--navy-900)' }}>{z.meetingId}</strong>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(z.meetingId, 'Meeting ID')}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: '0 2px', display: 'flex', alignItems: 'center' }}
                            title="Copy Meeting ID"
                          >
                            <Copy size={11} />
                          </button>
                        </div>
                      )}
                      {z.passcode && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Key size={12} style={{ color: 'var(--teal-700)' }} />
                          <span style={{ color: 'var(--gray-500)' }}>Passcode:</span>
                          <strong style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--navy-900)' }}>{z.passcode}</strong>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(z.passcode, 'Passcode')}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: '0 2px', display: 'flex', alignItems: 'center' }}
                            title="Copy Passcode"
                          >
                            <Copy size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
                      onClick={() => handleOpenLinkModal(z)}
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
        onClose={() => { setLinkModal(null); setMeetingLink(''); setMeetingId(''); setPasscode(''); }}
        title="Upload Zoom Meeting Link & Access"
        size="md"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => { setLinkModal(null); setMeetingLink(''); setMeetingId(''); setPasscode(''); }}>Cancel</button>
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

            <div className="form-group">
              <label className="form-label">Zoom Meeting Link / URL <span className="required">*</span></label>
              <input
                className="form-input"
                placeholder="https://zoom.us/j/1234567890?pwd=..."
                value={meetingLink}
                onChange={e => handleLinkChange(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Meeting ID</label>
                <input
                  className="form-input"
                  placeholder="e.g., 839 2841 9023"
                  value={meetingId}
                  onChange={e => setMeetingId(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Passcode</label>
                <input
                  className="form-input"
                  placeholder="e.g., mohe2026"
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                />
              </div>
            </div>

            <div className="form-hint" style={{ marginTop: 10 }}>
              Enter the generated Zoom meeting URL, Meeting ID, and Passcode. They will be shared with the requester.
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
