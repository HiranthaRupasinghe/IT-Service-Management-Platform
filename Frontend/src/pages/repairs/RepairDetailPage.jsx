import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Badge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { ArrowLeft, Wrench, Upload, CheckCircle } from 'lucide-react';

export default function RepairDetailPage() {
  const { id } = useParams();
  const { repairs, closeRepair } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useNotifications();
  const [closeModal, setCloseModal] = useState(false);
  const [closeForm, setCloseForm] = useState({ whatReplaced: '', totalCost: '', notes: '' });

  const repair = repairs.find(r => r.id === id);
  if (!repair) return <div style={{ padding: 40, textAlign: 'center' }}>Repair record not found</div>;

  const handleClose = () => {
    if (!closeForm.whatReplaced) { addToast('error', 'Required', '"What Replaced" is mandatory before closing'); return; }
    closeRepair(id, closeForm, currentUser);
    addToast('success', 'Repair Closed', 'Repair job has been closed successfully');
    setCloseModal(false);
  };

  const isOverdue = repair.status === 'Overdue';

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Link to="/repairs" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}><ArrowLeft size={15} /> Back to Repairs</Link>
      </div>

      <div className="detail-header" style={isOverdue ? { borderLeft: '4px solid var(--danger-500)' } : {}}>
        <div className="detail-icon" style={{ background: isOverdue ? 'rgba(244,63,94,0.1)' : 'rgba(245,158,11,0.1)' }}>
          <Wrench size={28} color={isOverdue ? 'var(--danger-500)' : 'var(--warning-500)'} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="detail-title">{repair.assetDescription}</div>
          <div className="detail-meta">
            <span className="id-chip">{repair.id}</span>
            <span className="id-chip">{repair.assetTag}</span>
            <Badge status={repair.status} />
          </div>
        </div>
        {repair.status !== 'Closed' && (
          <div className="detail-actions">
            <button className="btn btn-success" onClick={() => setCloseModal(true)}>
              <CheckCircle size={14} /> Close Repair Job
            </button>
          </div>
        )}
      </div>

      {isOverdue && (
        <div className="alert-card alert-card-error" style={{ marginBottom: 20, borderRadius: 'var(--radius-lg)', padding: '14px 20px' }}>
          <div className="alert-title">⚠ This repair is OVERDUE</div>
          <div className="alert-message">Expected return was {repair.expectedReturn}. Please contact {repair.vendorName} immediately.</div>
        </div>
      )}

      <div className="card-grid">
        <div className="card">
          <div className="card-header"><span className="card-title">Dispatch Information</span></div>
          <div className="card-body">
            <div className="info-grid">
              <div className="info-item"><div className="info-label">Vendor</div><div className="info-value" style={{ fontWeight: 700 }}>{repair.vendorName}</div></div>
              <div className="info-item"><div className="info-label">Gate Pass / Ref</div><div className="info-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{repair.gatePass}</div></div>
              <div className="info-item"><div className="info-label">Dispatch Date</div><div className="info-value">{repair.dispatchDate}</div></div>
              <div className="info-item"><div className="info-label">Expected Return</div><div className="info-value" style={{ color: isOverdue ? 'var(--danger-500)' : 'inherit', fontWeight: isOverdue ? 700 : 400 }}>{repair.expectedReturn}</div></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Fault & Replacement Details</span></div>
          <div className="card-body">
            <div className="form-group">
              <div className="info-label">For (Repair Reason)</div>
              <div style={{ background: 'var(--gray-50)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginTop: 4, color: 'var(--gray-800)', lineHeight: 1.6 }}>
                {repair.forReason}
              </div>
            </div>
            <div className="form-group">
              <div className="info-label">What Replaced</div>
              <div style={{ background: repair.whatReplaced ? 'var(--success-50)' : 'var(--gray-50)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginTop: 4, color: repair.whatReplaced ? 'var(--success-700)' : 'var(--gray-400)', lineHeight: 1.6 }}>
                {repair.whatReplaced || 'Not yet recorded — fill in when closing the repair job'}
              </div>
            </div>
            {repair.totalCost && (
              <div className="info-item">
                <div className="info-label">Total Cost</div>
                <div className="info-value" style={{ fontWeight: 700, fontSize: '1.1rem' }}>MVR {repair.totalCost.toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close Repair Modal */}
      <Modal isOpen={closeModal} onClose={() => setCloseModal(false)} title="Close Repair Job" size="lg"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setCloseModal(false)}>Cancel</button>
          <button className="btn btn-success" onClick={handleClose}><CheckCircle size={14} /> Close & Archive</button>
        </>}
      >
        <div className="form-group">
          <label className="form-label">What Was Replaced <span className="required">*</span></label>
          <textarea className="form-textarea" placeholder="List all hardware components replaced by the vendor (e.g., Motherboard, RAM DDR4 8GB, HDD 500GB...)" value={closeForm.whatReplaced} onChange={e => setCloseForm(f=>({...f,whatReplaced:e.target.value}))} rows={3} />
          <div className="form-hint">This is mandatory and forms the official repair record</div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Total Servicing Cost (MVR)</label>
            <input type="number" className="form-input" placeholder="0.00" value={closeForm.totalCost} onChange={e => setCloseForm(f=>({...f,totalCost:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Invoice / Receipt Upload</label>
            <input type="file" className="form-input" accept=".pdf,.jpg,.png,.docx" style={{ padding: '7px 12px' }} />
            <div className="form-hint">PDF, JPG, PNG, DOCX — max 25MB</div>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Closing Notes</label>
          <textarea className="form-textarea" placeholder="Additional notes about the repair..." value={closeForm.notes} onChange={e => setCloseForm(f=>({...f,notes:e.target.value}))} rows={2} />
        </div>
      </Modal>
    </div>
  );
}
