import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Badge, PriorityBadge } from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { calcTaskProgress } from '../../data/mockData';
import { CheckSquare, Clock, ArrowRight } from 'lucide-react';

export default function MyTasksPage() {
  const { tasks } = useData();
  const { currentUser } = useAuth();

  const myTasks = tasks.filter(t => t.assignees.includes(currentUser.id));
  const mySubtasks = myTasks.flatMap(t => t.subtasks.filter(s => s.assignee === currentUser.id).map(s => ({ ...s, taskId: t.id, taskTitle: t.title })));

  const today = new Date();
  const active = myTasks.filter(t => t.status !== 'Completed');
  const completed = myTasks.filter(t => t.status === 'Completed');
  const overdue = myTasks.filter(t => new Date(t.dueDate) < today && t.status !== 'Completed');

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>My Tasks</h1>
          <p>Tasks and subtasks assigned directly to you</p>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 }}>
        {[
          { label:'Total Assigned', value:myTasks.length, color:'var(--teal-500)' },
          { label:'Active', value:active.length, color:'var(--warning-500)' },
          { label:'Completed', value:completed.length, color:'var(--success-500)' },
          { label:'Overdue', value:overdue.length, color:'var(--danger-500)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--stat-accent':s.color }}>
            <div className="stat-content"><div className="stat-label">{s.label}</div><div className="stat-value" style={{ color:s.color }}>{s.value}</div></div>
          </div>
        ))}
      </div>

      {overdue.length > 0 && (
        <div className="alert-card alert-card-error" style={{ borderRadius:'var(--radius-lg)', padding:'14px 20px', marginBottom:20 }}>
          <div className="alert-title">⚠ {overdue.length} task{overdue.length > 1 ? 's' : ''} overdue</div>
          <div className="alert-message">{overdue.map(t => t.title).join(', ')}</div>
        </div>
      )}

      <div className="card-grid">
        {/* Active Tasks */}
        <div className="card">
          <div className="card-header"><span className="card-title">Active Tasks ({active.length})</span></div>
          <div className="card-body" style={{ paddingTop:8 }}>
            {active.map(t => {
              const progress = calcTaskProgress(t);
              const isOverdue = new Date(t.dueDate) < today;
              return (
                <div key={t.id} style={{ border:'1.5px solid var(--border-color)', borderRadius:'var(--radius-md)', padding:'14px', marginBottom:12, borderLeftColor: isOverdue ? 'var(--danger-500)' : undefined, borderLeftWidth: isOverdue ? 3 : undefined }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <div>
                      <span className="id-chip" style={{ display:'inline-block', marginBottom:3 }}>{t.id}</span>
                      <div style={{ fontWeight:700, fontSize:'0.875rem' }}>{t.title}</div>
                    </div>
                    <PriorityBadge priority={t.priority} />
                  </div>
                  <ProgressBar value={progress} size="sm" showLabel={false} />
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
                    <span style={{ fontSize:'0.72rem', color:'var(--gray-500)' }}>{progress}% complete</span>
                    <span style={{ fontSize:'0.72rem', color:isOverdue?'var(--danger-500)':'var(--gray-500)', fontWeight:isOverdue?700:400 }}>
                      {isOverdue ? '⚠ Overdue' : 'Due'}: {t.dueDate}
                    </span>
                  </div>
                  <Link to={`/tasks/${t.id}`} className="btn btn-secondary btn-sm" style={{ marginTop:10 }}>
                    View & Update <ArrowRight size={12} />
                  </Link>
                </div>
              );
            })}
            {active.length === 0 && <div style={{ textAlign:'center', padding:'32px', color:'var(--gray-400)' }}><CheckSquare size={32} style={{ margin:'0 auto 10px', opacity:0.3 }} /><div>No active tasks!</div></div>}
          </div>
        </div>

        {/* My Subtasks */}
        <div className="card">
          <div className="card-header"><span className="card-title">My Subtasks ({mySubtasks.length})</span></div>
          <div className="card-body" style={{ paddingTop:8 }}>
            {mySubtasks.map(s => (
              <div key={s.id} className="subtask-item">
                <div className={`subtask-check ${s.status === 'Completed' ? 'checked' : ''}`}>
                  {s.status === 'Completed' && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1,5 4,8 9,2" stroke="white" strokeWidth="2" fill="none"/></svg>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div className={`subtask-title ${s.status === 'Completed' ? 'done' : ''}`}>{s.title}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--gray-400)' }}>
                    <Link to={`/tasks/${s.taskId}`} style={{ color:'var(--teal-600)' }}>{s.taskTitle}</Link>
                    {s.dueDate && <span> · Due {s.dueDate}</span>}
                  </div>
                </div>
                <Badge status={s.status} />
              </div>
            ))}
            {mySubtasks.length === 0 && <div style={{ textAlign:'center', padding:'32px', color:'var(--gray-400)' }}>No subtasks assigned</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
