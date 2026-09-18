import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Badge, RoleBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { ROLES } from '../../data/mockData';
import { Users, Shield, ToggleLeft, ToggleRight, Edit3, Search } from 'lucide-react';

const ROLE_OPTIONS = [
  { value: ROLES.SUPER_ADMIN, label: 'Super Administrator' },
  { value: ROLES.IT_ADMIN, label: 'IT Administrator' },
  { value: ROLES.TRAINEE, label: 'Trainee / Intern' },
  { value: ROLES.ZOOM_REQUESTER, label: 'Zoom Requester (External)' },
];

const AVATAR_COLORS = ['#0891b2','#7c3aed','#059669','#dc2626','#d97706','#0284c7'];
const getAvatarColor = (id) => AVATAR_COLORS[id.charCodeAt(id.length-1) % AVATAR_COLORS.length];

export default function UserManagementPage() {
  const { users, updateUserRole, toggleUserActive } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useNotifications();
  const [roleModal, setRoleModal] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    !search || [u.name, u.email, u.division, u.username].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleRoleChange = () => {
    updateUserRole(roleModal.id, newRole, currentUser);
    addToast('success', 'Role Updated', `${roleModal.name}'s role changed to ${ROLE_OPTIONS.find(r=>r.value===newRole)?.label}`);
    setRoleModal(null);
  };

  const handleToggle = (user) => {
    if (user.id === currentUser.id) { addToast('error','Cannot Modify','You cannot deactivate your own account'); return; }
    toggleUserActive(user.id, currentUser);
    addToast('success', 'Status Updated', `${user.name} is now ${user.active ? 'deactivated' : 'activated'}`);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>User Management</h1>
          <p>Dynamic Role-Based Access Control — Super Admin only</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', background:'rgba(244,63,94,0.08)', borderRadius:'var(--radius-md)', border:'1px solid rgba(244,63,94,0.2)' }}>
          <Shield size={15} color="var(--danger-500)" />
          <span style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--danger-700)' }}>Super Admin Exclusive</span>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {ROLE_OPTIONS.map(r => {
          const count = users.filter(u => u.role === r.value).length;
          return (
            <div key={r.value} className="stat-card" style={{ '--stat-accent':'var(--teal-500)' }}>
              <div className="stat-icon" style={{ background:'rgba(6,182,212,0.1)' }}><Users size={20} color="var(--teal-500)" /></div>
              <div className="stat-content"><div className="stat-label">{r.label}</div><div className="stat-value">{count}</div></div>
            </div>
          );
        })}
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Search size={15} color="var(--gray-400)" />
            <input className="filter-input" placeholder="Search users..." value={search} onChange={e=>setSearch(e.target.value)} style={{ width:260 }} />
          </div>
          <span style={{ fontSize:'0.78rem', color:'var(--gray-400)' }}>{filtered.length} of {users.length} users</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>User</th><th>Username</th><th>Division</th><th>Role</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div className="avatar" style={{ background: getAvatarColor(u.id) }}>{u.name.slice(0,2)}</div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:'0.875rem' }}>{u.name}</div>
                        <div style={{ fontSize:'0.72rem', color:'var(--gray-400)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'0.8rem' }}>{u.username}</span></td>
                  <td style={{ fontSize:'0.82rem', color:'var(--gray-600)' }}>{u.division}</td>
                  <td><RoleBadge role={u.role} /></td>
                  <td><Badge status={u.active ? 'Active' : 'Inactive'} /></td>
                  <td>
                    <div style={{ display:'flex', gap:8 }}>
                      {u.id !== currentUser.id && (
                        <>
                          <button className="btn btn-secondary btn-sm" onClick={() => { setRoleModal(u); setNewRole(u.role); }} title="Change Role">
                            <Edit3 size={13} /> Role
                          </button>
                          <button
                            className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => handleToggle(u)}
                            title={u.active ? 'Deactivate' : 'Activate'}
                          >
                            {u.active ? <ToggleLeft size={13} /> : <ToggleRight size={13} />}
                            {u.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </>
                      )}
                      {u.id === currentUser.id && <span style={{ fontSize:'0.78rem', color:'var(--gray-400)' }}>Current user</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!roleModal} onClose={() => setRoleModal(null)} title="Change User Role" size="sm"
        footer={<><button className="btn btn-secondary" onClick={() => setRoleModal(null)}>Cancel</button><button className="btn btn-primary" onClick={handleRoleChange} disabled={newRole === roleModal?.role}>Update Role</button></>}
      >
        {roleModal && (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px', background:'var(--gray-50)', borderRadius:'var(--radius-md)', marginBottom:16 }}>
              <div className="avatar avatar-lg" style={{ background: getAvatarColor(roleModal.id) }}>{roleModal.name.slice(0,2)}</div>
              <div><div style={{ fontWeight:700 }}>{roleModal.name}</div><div style={{ fontSize:'0.78rem', color:'var(--gray-500)' }}>{roleModal.email}</div></div>
            </div>
            <div className="form-group">
              <label className="form-label">New Role <span className="required">*</span></label>
              <select className="form-select" value={newRole} onChange={e=>setNewRole(e.target.value)}>
                {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              <div className="form-hint">This immediately changes the user's access level across the entire system.</div>
            </div>
            {newRole === ROLES.SUPER_ADMIN && (
              <div className="alert-card alert-card-error" style={{ borderRadius:'var(--radius-md)' }}>
                <div className="alert-title">⚠ Granting Super Admin Access</div>
                <div className="alert-message">This user will have unrestricted access to all modules including audit logs and privilege management.</div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
