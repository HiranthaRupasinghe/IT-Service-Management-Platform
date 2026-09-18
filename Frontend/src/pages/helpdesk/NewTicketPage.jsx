import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { USERS, ROLES } from '../../data/mockData';
import { ArrowLeft, Plus } from 'lucide-react';
import SearchableAssetSelect from '../../components/ui/SearchableAssetSelect';

export default function NewTicketPage() {
  const { assets, createTicket } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: 'Hardware', title: '', description: '', priority: 'Medium',
    division: '', assetId: '', assignedTo: '',
  });

  const technicians = USERS.filter(u => [ROLES.IT_ADMIN, ROLES.TRAINEE].includes(u.role));
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAssetChange = (assetId) => {
    setField('assetId', assetId);
    if (assetId) {
      const selected = assets.find(a => String(a.id) === String(assetId));
      if (selected?.division && !form.division) {
        setField('division', selected.division);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) {
      addToast('error', 'Missing Fields', 'Please fill in all required fields');
      return;
    }
    const ticket = createTicket({ ...form, reportedBy: currentUser.id, status: form.assignedTo ? 'Assigned' : 'New' }, currentUser);
    addToast('success', 'Ticket Created', `${ticket.id} has been created and logged`);
    navigate(`/helpdesk/${ticket.id}`);
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Link to="/helpdesk" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}><ArrowLeft size={15} /> Back to Helpdesk</Link>
      </div>

      <div className="page-header">
        <div className="page-header-left">
          <h1>Log New Ticket</h1>
          <p>Enter technical issue details and assign a technician</p>
        </div>
      </div>

      <div style={{ maxWidth: 760 }}>
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><span className="card-title">Issue Information</span></div>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Job Category <span className="required">*</span></label>
                  <select className="form-select" value={form.category} onChange={e => setField('category', e.target.value)}>
                    <option>Hardware</option>
                    <option>Software</option>
                    <option>Network</option>
                    <option>PC/Printer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority <span className="required">*</span></label>
                  <select className="form-select" value={form.priority} onChange={e => setField('priority', e.target.value)}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Issue Title <span className="required">*</span></label>
                <input className="form-input" placeholder="Brief description of the issue" value={form.title} onChange={e => setField('title', e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description <span className="required">*</span></label>
                <textarea className="form-textarea" placeholder="Provide full details about the technical issue..." value={form.description} onChange={e => setField('description', e.target.value)} rows={4} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Division / Location <span className="required">*</span></label>
                  <input className="form-input" placeholder="e.g., Finance Division" value={form.division} onChange={e => setField('division', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Related Asset (Optional)</label>
                  <SearchableAssetSelect
                    assets={assets}
                    value={form.assetId}
                    onChange={handleAssetChange}
                    placeholder="-- Select Asset --"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header"><span className="card-title">Assignment</span></div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Assign To</label>
                <select className="form-select" value={form.assignedTo} onChange={e => setField('assignedTo', e.target.value)}>
                  <option value="">-- Assign Later --</option>
                  {technicians.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase())})</option>)}
                </select>
              </div>
              {!form.assignedTo && (
                <div className="form-hint">If no assignee is selected, ticket will be created with "New" status</div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Link to="/helpdesk" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary"><Plus size={15} /> Create Ticket</button>
          </div>
        </form>
      </div>
    </div>
  );
}
