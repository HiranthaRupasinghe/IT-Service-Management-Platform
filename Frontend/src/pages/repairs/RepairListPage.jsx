import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import DataTable from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';
import { Wrench, Plus, AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import SearchableAssetSelect from '../../components/ui/SearchableAssetSelect';

export default function RepairListPage() {
  const { repairs, vendors, assets, createRepair } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useNotifications();
  const [showNewModal, setShowNewModal] = useState(false);
  const [form, setForm] = useState({ assetId: '', vendorId: '', dispatchDate: '', expectedReturn: '', gatePass: '', forReason: '', initialDiagnosis: '' });

  const overdueCount = repairs.filter(r => r.status === 'Overdue').length;
  const activeCount = repairs.filter(r => r.status === 'Active').length;
  const closedCount = repairs.filter(r => r.status === 'Closed').length;

  const handleCreate = () => {
    if (!form.assetId || !form.vendorId || !form.forReason || !form.dispatchDate) {
      addToast('error', 'Missing Fields', 'Please fill required fields including Repair Purpose');
      return;
    }
    const asset = assets.find(a => a.id === form.assetId);
    const vendor = vendors.find(v => v.id === form.vendorId);
    createRepair({
      ...form,
      assetTag: asset?.tag,
      assetDescription: `${asset?.brand} ${asset?.model} — ${asset?.division}`,
      vendorName: vendor?.name,
      assignedTo: currentUser.id,
      whatReplaced: null, totalCost: null, invoice: null,
    }, currentUser);
    addToast('success', 'Repair Dispatched', `Asset sent to ${vendor?.name}`);
    setShowNewModal(false);
    setForm({ assetId: '', vendorId: '', dispatchDate: '', expectedReturn: '', gatePass: '', forReason: '', initialDiagnosis: '' });
  };

  const columns = [
    { key: 'id', label: 'Repair ID', render: v => <Link to={`/repairs/${v}`} style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--teal-600)', fontWeight: 600, fontSize: '0.8rem' }}>{v}</Link> },
    { key: 'assetTag', label: 'Asset', render: (v, row) => <div><div style={{ fontWeight: 600 }}>{v}</div><div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>{row.assetDescription?.slice(0,40)}</div></div> },
    { key: 'vendorName', label: 'Vendor' },
    { key: 'forReason', label: 'For (Reason)', render: v => <span style={{ fontSize: '0.8rem' }}>{v?.slice(0,50)}...</span> },
    { key: 'dispatchDate', label: 'Dispatched' },
    { key: 'expectedReturn', label: 'Expected Return' },
    { key: 'status', label: 'Status', render: v => <Badge status={v} /> },
    { key: 'whatReplaced', label: 'What Replaced', render: v => v ? <span style={{ fontSize: '0.75rem' }}>{v.slice(0,30)}...</span> : <span style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>Pending</span> },
    { key: 'id', label: '', sortable: false, render: v => <Link to={`/repairs/${v}`} className="btn btn-secondary btn-sm">Details</Link> },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>External Repair Tracker</h1>
          <p>Vendor repair dispatch records with fault & replacement tracking</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowNewModal(true)}><Plus size={15} /> Dispatch for Repair</button>
        </div>
      </div>

      {overdueCount > 0 && (
        <div className="alert-card alert-card-error" style={{ marginBottom: 20, borderRadius: 'var(--radius-lg)', padding: '14px 20px' }}>
          <AlertTriangle size={20} color="var(--danger-500)" />
          <div>
            <div className="alert-title">⚠ {overdueCount} Overdue Repair{overdueCount > 1 ? 's' : ''}</div>
            <div className="alert-message">Items have exceeded their expected return date. Contact vendor immediately.</div>
          </div>
        </div>
      )}

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <StatCard label="Active Repairs" value={activeCount} icon={Wrench} iconBg="rgba(245,158,11,0.1)" iconColor="var(--warning-500)" accentColor="var(--warning-500)" />
        <StatCard label="Overdue" value={overdueCount} icon={AlertTriangle} iconBg={overdueCount > 0 ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)'} iconColor={overdueCount > 0 ? 'var(--danger-500)' : 'var(--success-500)'} accentColor={overdueCount > 0 ? 'var(--danger-500)' : 'var(--success-500)'} />
        <StatCard label="Completed" value={closedCount} icon={CheckCircle} iconBg="rgba(16,185,129,0.1)" iconColor="var(--success-500)" accentColor="var(--success-500)" />
      </div>

      <div className="table-container">
        <DataTable columns={columns} data={repairs} emptyMessage="No repair records found" emptyIcon="🔧" />
      </div>

      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Dispatch Asset for External Repair" size="lg"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowNewModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate}><Wrench size={14} /> Dispatch for Repair</button>
        </>}
      >
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Asset <span className="required">*</span></label>
            <SearchableAssetSelect
              assets={assets}
              value={form.assetId}
              onChange={(assetId) => setForm(f => ({ ...f, assetId }))}
              placeholder="-- Select Asset --"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Vendor <span className="required">*</span></label>
            <select className="form-select" value={form.vendorId} onChange={e => setForm(f=>({...f,vendorId:e.target.value}))}>
              <option value="">-- Select Vendor --</option>
              {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">For (Repair Purpose / Fault Reason) <span className="required">*</span></label>
          <textarea className="form-textarea" placeholder="Describe exactly why the item is being sent for repair (e.g., motherboard failure — no POST screen)..." value={form.forReason} onChange={e => setForm(f=>({...f,forReason:e.target.value}))} rows={3} />
        </div>
        <div className="form-group">
          <label className="form-label">Initial Diagnosis</label>
          <textarea className="form-textarea" placeholder="Initial diagnosis before dispatch..." value={form.initialDiagnosis} onChange={e => setForm(f=>({...f,initialDiagnosis:e.target.value}))} rows={2} />
        </div>
        <div className="form-row-3">
          <div className="form-group">
            <label className="form-label">Gate Pass / Ref No.</label>
            <input className="form-input" placeholder="GP-2026-XXX" value={form.gatePass} onChange={e => setForm(f=>({...f,gatePass:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Dispatch Date <span className="required">*</span></label>
            <input type="date" className="form-input" value={form.dispatchDate} onChange={e => setForm(f=>({...f,dispatchDate:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Expected Return</label>
            <input type="date" className="form-input" value={form.expectedReturn} onChange={e => setForm(f=>({...f,expectedReturn:e.target.value}))} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
