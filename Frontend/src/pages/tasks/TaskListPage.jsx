import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/ui/DataTable';
import { Badge, PriorityBadge } from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { calcTaskProgress, getUser, ROLES } from '../../data/mockData';
import { Search, Plus, Kanban, Calendar } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { useNotifications } from '../../context/NotificationContext';
import { USERS } from '../../data/mockData';

export default function TaskListPage() {
  const { tasks, createTask } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useNotifications();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', priority:'Medium', status:'To Do', startDate:'', dueDate:'', assignees:[], project:'' });

  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN].includes(currentUser.role);

  const filtered = tasks.filter(t => {
    const matchSearch = !search || [t.id, t.title, t.project].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchPri = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPri;
  });

  const handleCreate = () => {
    if (!form.title || !form.dueDate) { addToast('error','Required','Title and due date are required'); return; }
    createTask({ ...form, createdBy: currentUser.id, department: 'IT Department' }, currentUser);
    addToast('success','Task Created',`Task "${form.title}" has been created`);
    setShowNew(false);
    setForm({ title:'', description:'', priority:'Medium', status:'To Do', startDate:'', dueDate:'', assignees:[], project:'' });
  };

  const toggleAssignee = (id) => setForm(f => ({ ...f, assignees: f.assignees.includes(id) ? f.assignees.filter(a=>a!==id) : [...f.assignees, id] }));

  const columns = [
    { key: 'id', label: 'Task ID', render: v => <Link to={`/tasks/${v}`} style={{ fontFamily:'JetBrains Mono,monospace', color:'var(--teal-600)', fontWeight:600, fontSize:'0.8rem' }}>{v}</Link> },
    { key: 'title', label: 'Task', render: (v, row) => (
      <div>
        <div style={{ fontWeight:600, marginBottom:2 }}>{v}</div>
        <div style={{ fontSize:'0.72rem', color:'var(--gray-400)' }}>{row.project}</div>
        <div style={{ marginTop:6 }}><ProgressBar value={calcTaskProgress(row)} size="sm" showLabel={false} /></div>
      </div>
    )},
    { key: 'priority', label: 'Priority', render: v => <PriorityBadge priority={v} /> },
    { key: 'status', label: 'Status', render: v => <Badge status={v} /> },
    { key: 'assignees', label: 'Assignees', render: v => (
      <div className="avatar-stack">
        {v.slice(0,3).map(id => { const u = getUser(id); return u ? <div key={id} className="avatar avatar-sm" style={{ background:'var(--teal-500)' }} title={u.name}>{u.name.slice(0,2)}</div> : null; })}
        {v.length > 3 && <div className="avatar avatar-sm" style={{ background:'var(--gray-400)' }}>+{v.length-3}</div>}
      </div>
    )},
    { key: 'dueDate', label: 'Due Date', render: (v, row) => {
      const overdue = new Date(v) < new Date() && row.status !== 'Completed';
      return <span style={{ fontSize:'0.8rem', color: overdue ? 'var(--danger-500)' : 'var(--gray-600)', fontWeight: overdue ? 700 : 400 }}>{overdue ? '⚠ ' : ''}{v}</span>;
    }},
    { key: 'id', label: '', sortable:false, render: v => <Link to={`/tasks/${v}`} className="btn btn-secondary btn-sm">View</Link> },
  ];

  const technicians = USERS.filter(u => [ROLES.IT_ADMIN, ROLES.TRAINEE].includes(u.role));

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left"><h1>Task List</h1><p>All IT Department tasks sorted and filtered</p></div>
        <div className="page-header-actions">
          <Link to="/tasks/board" className="btn btn-secondary btn-sm"><Kanban size={14} /> Board</Link>
          <Link to="/tasks/calendar" className="btn btn-secondary btn-sm"><Calendar size={14} /> Calendar</Link>
          {isAdmin && <button className="btn btn-primary" onClick={() => setShowNew(true)}><Plus size={15} /> New Task</button>}
        </div>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Search size={15} color="var(--gray-400)" />
            <input className="filter-input" placeholder="Search task ID, title, project..." value={search} onChange={e=>setSearch(e.target.value)} style={{ width:280 }} />
          </div>
          <div className="table-filters">
            <select className="filter-input" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option>To Do</option><option>In Progress</option><option>Completed</option><option>On Hold</option>
            </select>
            <select className="filter-input" value={priorityFilter} onChange={e=>setPriorityFilter(e.target.value)}>
              <option value="All">All Priorities</option>
              <option>Urgent</option><option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
        </div>
        <DataTable columns={columns} data={filtered} emptyMessage="No tasks found" emptyIcon="✅" />
      </div>

      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Create New Task" size="lg"
        footer={<><button className="btn btn-secondary" onClick={() => setShowNew(false)}>Cancel</button><button className="btn btn-primary" onClick={handleCreate}><Plus size={14}/> Create Task</button></>}
      >
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Task Title <span className="required">*</span></label>
            <input className="form-input" placeholder="Task title..." value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-select" value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>
              <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input type="date" className="form-input" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Due Date <span className="required">*</span></label>
            <input type="date" className="form-input" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Project / Group</label>
          <input className="form-input" placeholder="e.g., Network Upgrade 2026" value={form.project} onChange={e=>setForm(f=>({...f,project:e.target.value}))} />
        </div>
        <div className="form-group">
          <label className="form-label">Assign To (Supervisees only)</label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {technicians.map(u => (
              <button key={u.id} type="button" onClick={() => toggleAssignee(u.id)} style={{ padding:'7px 14px', borderRadius:'var(--radius-full)', fontSize:'0.8rem', fontWeight:500, cursor:'pointer', background:form.assignees.includes(u.id)?'var(--teal-500)':'var(--gray-100)', color:form.assignees.includes(u.id)?'white':'var(--gray-700)', border:`1.5px solid ${form.assignees.includes(u.id)?'var(--teal-500)':'var(--gray-200)'}`, transition:'all var(--transition-fast)' }}>
                {u.name}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
