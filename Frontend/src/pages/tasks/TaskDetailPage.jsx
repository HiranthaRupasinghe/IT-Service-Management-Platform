import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Badge, PriorityBadge } from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { calcTaskProgress, getUser, ROLES } from '../../data/mockData';
import { ArrowLeft, CheckSquare, User, Calendar, Flag, Plus, Check } from 'lucide-react';

export default function TaskDetailPage() {
  const { id } = useParams();
  const { tasks, updateTaskStatus, updateSubtaskStatus } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useNotifications();

  const task = tasks.find(t => t.id === id);
  if (!task) return <div style={{ padding:40, textAlign:'center', color:'var(--gray-400)' }}>Task not found</div>;

  const progress = calcTaskProgress(task);
  const assignees = task.assignees.map(id => getUser(id)).filter(Boolean);
  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN].includes(currentUser.role);
  const isAssignee = task.assignees.includes(currentUser.id);

  const handleSubtaskToggle = (subtask) => {
    const newStatus = subtask.status === 'Completed' ? 'In Progress' : 'Completed';
    updateSubtaskStatus(task.id, subtask.id, newStatus, currentUser);
    addToast('success', 'Subtask Updated', `"${subtask.title}" marked as ${newStatus}`);
  };

  const handleStatusChange = (status) => {
    updateTaskStatus(task.id, status, currentUser);
    addToast('success', 'Status Updated', `Task moved to "${status}"`);
  };

  const today = new Date();
  const isOverdue = new Date(task.dueDate) < today && task.status !== 'Completed';

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <Link to="/tasks/list" className="btn btn-ghost btn-sm" style={{ paddingLeft:0 }}><ArrowLeft size={15} /> Back to Tasks</Link>
      </div>

      {/* Header */}
      <div className="detail-header" style={isOverdue ? { borderLeft:'4px solid var(--danger-500)' } : {}}>
        <div className="detail-icon" style={{ background:'rgba(6,182,212,0.1)' }}>
          <CheckSquare size={28} color="var(--teal-500)" />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="detail-title">{task.title}</div>
          <div className="detail-meta">
            <span className="id-chip">{task.id}</span>
            <PriorityBadge priority={task.priority} />
            <Badge status={task.status} />
            {isOverdue && <span className="badge badge-red">Overdue</span>}
          </div>
        </div>
        {(isAdmin || isAssignee) && (
          <div className="detail-actions">
            <select className="filter-input" value={task.status} onChange={e => handleStatusChange(e.target.value)}>
              <option>To Do</option><option>In Progress</option><option>Completed</option><option>On Hold</option>
            </select>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="card" style={{ marginBottom:20 }}>
        <div className="card-header">
          <span className="card-title">Overall Progress</span>
          <span style={{ fontWeight:800, fontSize:'1.2rem', color: progress === 100 ? 'var(--success-500)' : 'var(--teal-600)' }}>{progress}%</span>
        </div>
        <div className="card-body">
          <ProgressBar value={progress} size="lg" showLabel={false} />
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:'0.78rem', color:'var(--gray-500)' }}>
            <span>{task.subtasks.filter(s=>s.status==='Completed').length} of {task.subtasks.length} subtasks completed</span>
            <span style={{ color:isOverdue?'var(--danger-500)':'var(--gray-500)', fontWeight:isOverdue?700:400 }}>
              {isOverdue ? '⚠ Overdue — ' : 'Due: '}{task.dueDate}
            </span>
          </div>
        </div>
      </div>

      <div className="card-grid">
        {/* Task Info */}
        <div className="card">
          <div className="card-header"><span className="card-title">Task Details</span></div>
          <div className="card-body">
            {task.description && (
              <div className="form-group">
                <div className="info-label">Description</div>
                <div style={{ fontSize:'0.875rem', color:'var(--gray-700)', lineHeight:1.7, marginTop:4, background:'var(--gray-50)', padding:'12px', borderRadius:'var(--radius-md)' }}>
                  {task.description}
                </div>
              </div>
            )}
            <div className="info-grid" style={{ marginTop:16 }}>
              <div className="info-item"><div className="info-label">Project</div><div className="info-value">{task.project || '—'}</div></div>
              <div className="info-item"><div className="info-label">Department</div><div className="info-value">{task.department}</div></div>
              <div className="info-item"><div className="info-label">Start Date</div><div className="info-value">{task.startDate}</div></div>
              <div className="info-item"><div className="info-label">Due Date</div><div className="info-value" style={{ color:isOverdue?'var(--danger-500)':'inherit', fontWeight:isOverdue?700:400 }}>{task.dueDate}</div></div>
              <div className="info-item"><div className="info-label">Created</div><div className="info-value">{new Date(task.createdAt).toLocaleDateString()}</div></div>
            </div>

            <div style={{ marginTop:16 }}>
              <div className="info-label">Assigned To</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:8 }}>
                {assignees.map(u => (
                  <div key={u.id} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div className="avatar" style={{ background:'var(--teal-500)' }}>{u.name.slice(0,2)}</div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'0.875rem' }}>{u.name}</div>
                      <div style={{ fontSize:'0.72rem', color:'var(--gray-400)' }}>{u.role.replace('_',' ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Subtasks */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Subtasks ({task.subtasks.length})</span>
            <span className="id-chip">{task.subtasks.filter(s=>s.status==='Completed').length} done</span>
          </div>
          <div className="card-body" style={{ paddingTop:8 }}>
            {task.subtasks.map(s => {
              const assignee = getUser(s.assignee);
              const canToggle = isAdmin || s.assignee === currentUser.id;
              return (
                <div key={s.id} className="subtask-item" style={{ cursor: canToggle ? 'pointer' : 'default' }} onClick={() => canToggle && handleSubtaskToggle(s)}>
                  <div className={`subtask-check ${s.status==='Completed'?'checked':''}`}>
                    {s.status==='Completed' && <Check size={11} color="white" strokeWidth={3} />}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className={`subtask-title ${s.status==='Completed'?'done':''}`}>{s.title}</div>
                    <div style={{ display:'flex', gap:8, marginTop:4 }}>
                      {assignee && <span style={{ fontSize:'0.72rem', color:'var(--gray-400)' }}><User size={10} style={{ display:'inline' }} /> {assignee.name}</span>}
                      {s.dueDate && <span style={{ fontSize:'0.72rem', color:'var(--gray-400)' }}><Calendar size={10} style={{ display:'inline' }} /> {s.dueDate}</span>}
                    </div>
                  </div>
                  <Badge status={s.status} />
                </div>
              );
            })}
            {task.subtasks.length === 0 && (
              <div style={{ textAlign:'center', padding:'24px', color:'var(--gray-400)' }}>No subtasks created yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
