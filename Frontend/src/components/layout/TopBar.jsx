import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Search, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard/super-admin': { title: 'Super Admin Dashboard', subtitle: 'Global system overview & control center' },
  '/dashboard/it-admin':    { title: 'IT Admin Dashboard',    subtitle: 'Operational management & triage center' },
  '/dashboard/trainee':     { title: 'My Dashboard',          subtitle: 'Assigned tickets, tasks & activity' },
  '/dashboard/tasks':       { title: 'Task Management',       subtitle: 'Project & task overview' },
  '/dashboard/zoom':        { title: 'Zoom Request Portal',   subtitle: 'Submit & track meeting support requests' },
  '/assets':                { title: 'Asset Inventory',       subtitle: 'PC, Laptop & Printer master catalog' },
  '/stock':                 { title: 'IT Stock & Cables',     subtitle: 'Consumables & peripheral inventory' },
  '/helpdesk':              { title: 'Helpdesk Tickets',      subtitle: 'Categorized service request management' },
  '/helpdesk/new':          { title: 'New Ticket',            subtitle: 'Log a new technical issue' },
  '/repairs':               { title: 'External Repairs',      subtitle: 'Vendor dispatch & repair tracking' },
  '/zoom':                  { title: 'Zoom Support',          subtitle: 'Meeting technical support scheduler' },
  '/zoom/new':              { title: 'New Zoom Request',      subtitle: 'Submit a Zoom meeting support request' },
  '/publications':          { title: 'Web Publications',      subtitle: 'Internal Ministry web content management' },
  '/tasks/board':           { title: 'Kanban Board',          subtitle: 'Visual task management board' },
  '/tasks/list':            { title: 'Task List',             subtitle: 'All tasks sorted & filtered' },
  '/tasks/calendar':        { title: 'Task Calendar',         subtitle: 'Deadline & milestone calendar view' },
  '/tasks/mine':            { title: 'My Tasks',              subtitle: 'Tasks assigned directly to you' },
  '/users':                 { title: 'User Management',       subtitle: 'RBAC & privilege management' },
  '/audit':                 { title: 'Audit Trail',           subtitle: 'Immutable system-wide activity log' },
};

function NotificationIcon({ type }) {
  if (type === 'warning') return <AlertTriangle size={16} color="var(--warning-500)" />;
  if (type === 'success') return <CheckCircle size={16} color="var(--success-500)" />;
  if (type === 'error')   return <X size={16} color="var(--danger-500)" />;
  return <Info size={16} color="var(--teal-500)" />;
}

export default function TopBar() {
  const { currentUser } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const panelRef = useRef(null);

  const pageInfo = Object.entries(PAGE_TITLES).find(([path]) => location.pathname.startsWith(path))?.[1]
    || { title: 'IT Service Management Platform', subtitle: 'ITSM Operations & Portal' };

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setShowNotifications(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h2>{pageInfo.title}</h2>
        <p>{pageInfo.subtitle}</p>
      </div>

      <div className="topbar-actions">
        {/* Search */}
        <div className="topbar-search">
          <Search size={15} color="var(--gray-400)" />
          <input type="text" placeholder="Search tickets, assets, tasks..." />
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={panelRef}>
          <button className="icon-btn" onClick={() => setShowNotifications(v => !v)}>
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notification-panel">
              <div className="notification-panel-header">
                <span className="notification-panel-title">Notifications</span>
                {unreadCount > 0 && (
                  <button className="btn btn-ghost btn-sm" onClick={markAllRead} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                    Mark all read
                  </button>
                )}
              </div>
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`notification-item ${!n.read ? 'unread' : ''}`}
                  onClick={() => markRead(n.id)}
                >
                  <div className={`notification-item-icon`} style={{ background: n.type === 'warning' ? 'var(--warning-100)' : n.type === 'success' ? 'var(--success-100)' : 'var(--teal-100)' }}>
                    <NotificationIcon type={n.type} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="notification-item-title">{n.title}</div>
                    <div className="notification-item-message">{n.message}</div>
                    <div className="notification-item-time">{n.time}</div>
                  </div>
                  {!n.read && <div className="unread-dot" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
