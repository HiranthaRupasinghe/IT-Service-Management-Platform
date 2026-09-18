import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Badge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { getUser } from '../../data/mockData';
import { Globe, Plus, CheckCircle, Clock, Upload } from 'lucide-react';
import { ROLES } from '../../data/mockData';

export default function PublicationPage() {
  const { publications, approvePublication, createPublication } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useNotifications();
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', attachments: [] });

  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN].includes(currentUser.role);

  const handleApprove = (id) => {
    approvePublication(id, currentUser);
    addToast('success', 'Published', 'Publication has been approved and published');
  };

  const handleCreate = () => {
    if (!form.title) { addToast('error', 'Required', 'Title is required'); return; }
    createPublication(form, currentUser);
    addToast('success', 'Submitted', 'Publication request submitted for review');
    setShowNew(false);
    setForm({ title: '', content: '', attachments: [] });
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Web Publication Portal</h1>
          <p>Internal Ministry website content management — IT Department only</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowNew(true)}><Plus size={15} /> New Publication</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Published', count: publications.filter(p=>p.status==='Published').length, color: 'var(--success-500)', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Pending Review', count: publications.filter(p=>p.status==='Pending Review').length, color: 'var(--warning-500)', bg: 'rgba(245,158,11,0.1)' },
          { label: 'Total', count: publications.length, color: 'var(--teal-500)', bg: 'rgba(6,182,212,0.1)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--stat-accent': s.color }}>
            <div className="stat-icon" style={{ background: s.bg }}><Globe size={22} color={s.color} /></div>
            <div className="stat-content"><div className="stat-label">{s.label}</div><div className="stat-value">{s.count}</div></div>
          </div>
        ))}
      </div>

      <div>
        {publications.map(pub => {
          const requestedBy = getUser(pub.requestedBy);
          const publishedBy = getUser(pub.publishedBy);
          const approvedBy = getUser(pub.approvedBy);
          return (
            <div key={pub.id} className="pub-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <span className="id-chip" style={{ marginBottom: 4, display: 'inline-block' }}>{pub.id}</span>
                  <div className="pub-title">{pub.title}</div>
                </div>
                <Badge status={pub.status} />
              </div>
              <div className="pub-meta">
                {requestedBy && <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>Requested by: <strong>{requestedBy.name}</strong></span>}
                <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}><Clock size={11} style={{ display: 'inline' }} /> {new Date(pub.requestedAt).toLocaleString()}</span>
                {pub.status === 'Published' && publishedBy && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--success-700)' }}><CheckCircle size={11} style={{ display: 'inline' }} /> Published by {publishedBy.name}</span>
                )}
                {pub.attachments.length > 0 && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>
                    <Upload size={11} style={{ display: 'inline' }} /> {pub.attachments.length} attachment{pub.attachments.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {isAdmin && pub.status === 'Pending Review' && (
                <div style={{ marginTop: 12 }}>
                  <button className="btn btn-success btn-sm" onClick={() => handleApprove(pub.id)}>
                    <CheckCircle size={13} /> Approve & Publish
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="New Web Publication Request" size="lg"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowNew(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate}><Globe size={14} /> Submit for Review</button>
        </>}
      >
        <div className="form-group">
          <label className="form-label">Publication Title <span className="required">*</span></label>
          <input className="form-input" placeholder="e.g., Scholarship Application Portal Launch" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
        </div>
        <div className="form-group">
          <label className="form-label">Content / Description</label>
          <textarea className="form-textarea" placeholder="Publication content or notes..." value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} rows={4} />
        </div>
        <div className="form-group">
          <label className="form-label">Attachments</label>
          <input type="file" className="form-input" multiple accept=".pdf,.docx,.zip,.png,.jpg" style={{ padding: '7px 12px' }} />
          <div className="form-hint">PDF, DOCX, ZIP, PNG, JPG — max 25MB per file</div>
        </div>
        <div className="alert-card alert-card-info" style={{ borderRadius:'var(--radius-md)' }}>
          <div className="alert-message">Publication requests require IT Admin or Super Admin approval before going live on the Ministry website.</div>
        </div>
      </Modal>
    </div>
  );
}
