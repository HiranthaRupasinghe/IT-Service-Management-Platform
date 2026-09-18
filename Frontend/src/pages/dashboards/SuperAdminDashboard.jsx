import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getTicketStats, getTaskStats, USERS, REPAIRS } from '../../data/mockData';
import StatCard from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import {
  Monitor, Users, Ticket, Wrench, CheckSquare, AlertTriangle,
  TrendingUp, Shield, Database, Activity, Clock, Eye
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3b82f6','#8b5cf6','#06b6d4','#f97316'];

export default function SuperAdminDashboard() {
  const { currentUser } = useAuth();
  const { assets, tickets, repairs, tasks, auditLogs, users, stock } = useData();

  const ticketStats = getTicketStats();
  const taskStats = getTaskStats();

  const activeUsers = users.filter(u => u.active).length;
  const overdueRepairs = repairs.filter(r => r.status === 'Overdue').length;
  const notAvailableStock = stock.filter(s => s.status === 'Not Available').length;
  const lowStock = stock.filter(s => s.status === 'Low Stock').length;

  const pieData = [
    { name: 'Hardware', value: ticketStats.byCategory.Hardware },
    { name: 'Software', value: ticketStats.byCategory.Software },
    { name: 'Network', value: ticketStats.byCategory.Network },
    { name: 'PC/Printer', value: ticketStats.byCategory['PC/Printer'] },
  ];

  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-left">
          <h2>{greeting}, {currentUser.name.split(' ')[0]} 👋</h2>
          <p>Here's the global system status for {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="dashboard-welcome-badge">
          <Shield size={14} style={{ display: 'inline', marginRight: 6 }} />
          Super Administrator
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <StatCard label="Total Assets" value={assets.length} icon={Monitor} iconBg="rgba(59,130,246,0.1)" iconColor="#3b82f6" accentColor="#3b82f6" sub={`${assets.filter(a=>a.type==='PC').length} PCs · ${assets.filter(a=>a.type==='Laptop').length} Laptops · ${assets.filter(a=>a.type==='Printer').length} Printers`} />
        <StatCard label="Active Users" value={activeUsers} icon={Users} iconBg="rgba(139,92,246,0.1)" iconColor="#8b5cf6" accentColor="#8b5cf6" sub={`${users.length - activeUsers} inactive`} />
        <StatCard label="Open Tickets" value={ticketStats.open} icon={Ticket} iconBg="rgba(6,182,212,0.1)" iconColor="var(--teal-500)" accentColor="var(--teal-500)" sub={`${ticketStats.total} total this period`} />
        <StatCard label="External Repairs" value={repairs.length} icon={Wrench} iconBg={overdueRepairs > 0 ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)'} iconColor={overdueRepairs > 0 ? 'var(--danger-500)' : 'var(--success-500)'} accentColor={overdueRepairs > 0 ? 'var(--danger-500)' : 'var(--success-500)'} sub={overdueRepairs > 0 ? `⚠ ${overdueRepairs} overdue` : 'All on track'} subColor={overdueRepairs > 0 ? 'var(--danger-500)' : 'var(--success-500)'} />
        <StatCard label="Active Tasks" value={taskStats.inProgress} icon={CheckSquare} iconBg="rgba(245,158,11,0.1)" iconColor="var(--warning-500)" accentColor="var(--warning-500)" sub={`${taskStats.overdue} overdue`} subColor={taskStats.overdue > 0 ? 'var(--danger-500)' : 'var(--success-500)'} />
        <StatCard label="Stock Issues" value={notAvailableStock + lowStock} icon={AlertTriangle} iconBg="rgba(244,63,94,0.1)" iconColor="var(--danger-500)" accentColor="var(--danger-500)" sub={`${notAvailableStock} out · ${lowStock} low`} />
      </div>

      <div className="card-grid">
        {/* Ticket by Category Donut */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Tickets by Category</span>
            <Link to="/helpdesk" className="btn btn-ghost btn-sm">
              <Eye size={14} /> View All
            </Link>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
              {Object.entries(ticketStats.byCategory).map(([cat, count]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '6px 10px', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--gray-600)' }}>{cat}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Audit Stream */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Live Audit Stream</span>
            <Link to="/audit" className="btn btn-ghost btn-sm"><Activity size={14} /> Full Log</Link>
          </div>
          <div className="card-body" style={{ padding: '8px 16px' }}>
            {auditLogs.slice(0, 6).map(log => (
              <div key={log.id} className="audit-entry">
                <div className={`audit-icon-wrap audit-action-${log.action}`}>
                  <Activity size={14} />
                </div>
                <div className="audit-details">
                  <div className="audit-desc">{log.description}</div>
                  <div className="audit-meta">
                    <span className="audit-user">{log.username}</span>
                    <span className="audit-time">{new Date(log.timestamp).toLocaleString()}</span>
                    <span className="audit-module">{log.module}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Users Table */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <span className="card-title">User Privilege Control Panel</span>
          <Link to="/users" className="btn btn-primary btn-sm"><Users size={14} /> Manage Users</Link>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Division</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ background: 'var(--teal-500)' }}>{u.avatar?.slice(0,2) || u.name.slice(0,2)}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><Badge status={u.role === 'super_admin' ? 'High' : u.role === 'it_admin' ? 'New' : 'Resolved'}>{u.role.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}</Badge></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>{u.division}</td>
                  <td><Badge status={u.active ? 'Active' : 'Inactive'}>{u.active ? 'Active' : 'Inactive'}</Badge></td>
                  <td>
                    <Link to="/users" className="btn btn-secondary btn-sm">
                      <Shield size={13} /> Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Health */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header"><span className="card-title">System Health & Backup Status</span></div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Server Status', value: '🟢 Online', sub: 'localhost:3000' },
              { label: 'Last Backup', value: '✅ Today 03:00', sub: 'Daily auto backup' },
              { label: 'Disk Usage', value: '47% used', sub: '234 GB / 500 GB' },
              { label: 'DB Records', value: `${assets.length + tickets.length + tasks.length}+`, sub: 'Across all modules' },
            ].map(h => (
              <div key={h.label} style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{h.label}</div>
                <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{h.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 2 }}>{h.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
