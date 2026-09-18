import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getTaskStats, calcTaskProgress, getUser } from '../../data/mockData';
import StatCard from '../../components/ui/StatCard';
import { Badge, PriorityBadge } from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { CheckSquare, Clock, AlertTriangle, TrendingUp, Kanban, Calendar, ListTodo, ArrowRight, Flag } from 'lucide-react';

export default function TaskDashboard() {
  const { currentUser } = useAuth();
  const { tasks } = useData();
  const stats = getTaskStats(currentUser.id);
  const allStats = getTaskStats();

  const urgentTasks = tasks.filter(t => (t.priority === 'Urgent' || t.priority === 'High') && t.status !== 'Completed');
  const today = new Date();

  return (
    <div>
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-left">
          <h2>Task Management Dashboard</h2>
          <p>Internal IT Department — Project & Task Overview</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/tasks/board" className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '8px 14px' }}><Kanban size={14} /> Board</Link>
          <Link to="/tasks/list" className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '8px 14px' }}><ListTodo size={14} /> List</Link>
          <Link to="/tasks/calendar" className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '8px 14px' }}><Calendar size={14} /> Calendar</Link>
        </div>
      </div>

      {/* My Task KPIs */}
      <div style={{ marginBottom: 8, fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>My Tasks</div>
      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <StatCard label="Assigned to Me" value={stats.total} icon={CheckSquare} iconBg="rgba(6,182,212,0.1)" iconColor="var(--teal-500)" accentColor="var(--teal-500)" />
        <StatCard label="In Progress" value={stats.inProgress} icon={TrendingUp} iconBg="rgba(245,158,11,0.1)" iconColor="var(--warning-500)" accentColor="var(--warning-500)" />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} iconBg={stats.overdue > 0 ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)'} iconColor={stats.overdue > 0 ? 'var(--danger-500)' : 'var(--success-500)'} accentColor={stats.overdue > 0 ? 'var(--danger-500)' : 'var(--success-500)'} />
        <StatCard label="Due Within 48h" value={stats.dueSoon} icon={Clock} iconBg="rgba(139,92,246,0.1)" iconColor="var(--purple-500)" accentColor="var(--purple-500)" />
      </div>

      {/* All Tasks KPIs */}
      <div style={{ marginBottom: 8, fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Department Overview</div>
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <StatCard label="Total Tasks" value={allStats.total} icon={ListTodo} iconBg="rgba(59,130,246,0.1)" iconColor="#3b82f6" accentColor="#3b82f6" />
        <StatCard label="Completed" value={allStats.completed} icon={CheckSquare} iconBg="rgba(16,185,129,0.1)" iconColor="var(--success-500)" accentColor="var(--success-500)" />
        <StatCard label="In Progress" value={allStats.inProgress} icon={TrendingUp} iconBg="rgba(245,158,11,0.1)" iconColor="var(--warning-500)" accentColor="var(--warning-500)" />
        <StatCard label="To Do" value={allStats.toDo} icon={ListTodo} iconBg="rgba(139,92,246,0.1)" iconColor="var(--purple-500)" accentColor="var(--purple-500)" />
      </div>

      <div className="card-grid">
        {/* Urgent & Critical Tasks */}
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Flag size={16} color="var(--danger-500)" /> Urgent & High Priority Tasks
            </span>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            {urgentTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--gray-400)' }}>
                <CheckSquare size={32} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
                <div>No urgent tasks — great work!</div>
              </div>
            ) : urgentTasks.map(t => {
              const progress = calcTaskProgress(t);
              const due = new Date(t.dueDate);
              const isOverdue = due < today && t.status !== 'Completed';
              return (
                <div key={t.id} style={{ borderLeft: `3px solid ${t.priority === 'Urgent' ? 'var(--danger-500)' : 'var(--warning-500)'}`, paddingLeft: 12, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--gray-900)' }}>{t.title}</span>
                    <PriorityBadge priority={t.priority} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: isOverdue ? 'var(--danger-500)' : 'var(--gray-500)', marginBottom: 8, fontWeight: isOverdue ? 600 : 400 }}>
                    {isOverdue ? '⚠ Overdue — ' : 'Due: '}{t.dueDate}
                  </div>
                  <ProgressBar value={progress} size="sm" showLabel={false} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>{progress}% complete</span>
                    <Link to={`/tasks/${t.id}`} style={{ fontSize: '0.72rem', color: 'var(--teal-600)', fontWeight: 600 }}>View →</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Progress */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Department Project Progress</span>
          </div>
          <div className="card-body">
            {tasks.map(t => {
              const progress = calcTaskProgress(t);
              const assignees = t.assignees.map(id => getUser(id)).filter(Boolean);
              return (
                <div key={t.id} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gray-900)' }}>{t.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)', marginTop: 2 }}>{t.project}</div>
                    </div>
                    <div className="avatar-stack">
                      {assignees.slice(0, 3).map(u => (
                        <div key={u.id} className="avatar avatar-sm" style={{ background: 'var(--teal-500)', fontSize: '0.6rem' }}>
                          {u.name.slice(0,2)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <ProgressBar value={progress} size="sm" showLabel={false} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>
                      {t.subtasks.filter(s=>s.status==='Completed').length}/{t.subtasks.length} subtasks
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: progress === 100 ? 'var(--success-500)' : 'var(--gray-700)' }}>{progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
