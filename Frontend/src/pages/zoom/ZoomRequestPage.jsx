import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { ArrowLeft, Video, Info } from 'lucide-react';

const EQUIPMENT_OPTIONS = ['Projector','HDMI Cable','VGA Cable','Laptop','Webcam','Microphone','Screen','Extension Cord','Pointer','Podium'];

export default function ZoomRequestPage() {
  const { createZoomRequest } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();
  const [form, setForm] = useState({ meetingName:'', location:'', meetingLevel:'Medium', scheduledDate:'', requiredEquipment:[] });

  const toggleEquip = (eq) => setForm(f => ({ ...f, requiredEquipment: f.requiredEquipment.includes(eq) ? f.requiredEquipment.filter(e=>e!==eq) : [...f.requiredEquipment, eq] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.meetingName || !form.location || !form.scheduledDate) { addToast('error','Missing Fields','Please fill required fields'); return; }
    createZoomRequest(form, currentUser);
    addToast('success','Request Submitted', `Zoom support request for "${form.meetingName}" submitted successfully. IT Admin will upload the Zoom link.`);
    navigate('/zoom');
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Link to="/zoom" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}><ArrowLeft size={15} /> Back</Link>
      </div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>New Zoom Meeting Support Request</h1>
          <p>Submit meeting details and requirements for IT Administration support</p>
        </div>
      </div>
      <div style={{ maxWidth: 680 }}>
        <form onSubmit={handleSubmit}>
          <div className="alert-card alert-card-info" style={{ borderRadius: 'var(--radius-lg)', marginBottom: 20, padding: '14px 18px' }}>
            <Info size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div className="alert-title">Zoom Meeting Link Provision</div>
              <div className="alert-message">
                You do not need to provide a Zoom link. The <strong>IT Administrator</strong> will generate and upload the official meeting link upon receiving this request.
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><span className="card-title">Meeting Details</span></div>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Meeting Name / Subject <span className="required">*</span></label>
                  <input className="form-input" placeholder="e.g., Budget Review 2027" value={form.meetingName} onChange={e=>setForm(f=>({...f,meetingName:e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Meeting Level <span className="required">*</span></label>
                  <select className="form-select" value={form.meetingLevel} onChange={e=>setForm(f=>({...f,meetingLevel:e.target.value}))}>
                    <option value="Medium">Medium</option>
                    <option value="Critical">Critical — Executive/High Priority</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Location / Hall / Venue <span className="required">*</span></label>
                  <input className="form-input" placeholder="e.g., Main Conference Hall — 3rd Floor" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Scheduled Date & Time <span className="required">*</span></label>
                  <input type="datetime-local" className="form-input" value={form.scheduledDate} onChange={e=>setForm(f=>({...f,scheduledDate:e.target.value}))} required />
                </div>
              </div>
            </div>
          </div>
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header"><span className="card-title">Required Equipment</span></div>
            <div className="card-body">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {EQUIPMENT_OPTIONS.map(eq => (
                  <button key={eq} type="button" onClick={() => toggleEquip(eq)} style={{ padding:'8px 16px', borderRadius:'var(--radius-full)', fontSize:'0.82rem', fontWeight:500, cursor:'pointer', background:form.requiredEquipment.includes(eq)?'var(--teal-500)':'var(--gray-100)', color:form.requiredEquipment.includes(eq)?'white':'var(--gray-700)', border:`1.5px solid ${form.requiredEquipment.includes(eq)?'var(--teal-500)':'var(--gray-200)'}`, transition:'all var(--transition-fast)' }}>
                    {eq}
                  </button>
                ))}
              </div>
              {form.requiredEquipment.length > 0 && (
                <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--gray-600)' }}>Selected: {form.requiredEquipment.join(', ')}</div>
              )}
            </div>
          </div>
          {form.meetingLevel === 'Critical' && (
            <div className="alert-card alert-card-error" style={{ borderRadius:'var(--radius-lg)', marginBottom:20, padding:'14px 18px' }}>
              <div><div className="alert-title">⚠ Critical Meeting Level</div><div className="alert-message">IT Admin will be notified immediately. Priority support and link generation will be arranged.</div></div>
            </div>
          )}
          <div style={{ display:'flex', justifyContent:'flex-end', gap:12 }}>
            <Link to="/zoom" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary"><Video size={15} /> Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}
