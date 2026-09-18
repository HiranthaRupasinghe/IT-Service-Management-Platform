import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ROLES } from '../../data/mockData';
import {
  LayoutDashboard, Monitor, Package, Ticket, Wrench, Video, Globe,
  CheckSquare, Users, ClipboardList, LogOut, Shield, Bell,
  HardDrive, Settings, ChevronRight, Kanban, Calendar, ListTodo,
  BookOpen, UserCheck, Star
} from 'lucide-react';

const AVATAR_COLORS = ['#0891b2','#7c3aed','#059669','#dc2626','#d97706','#0284c7'];
function getAvatarColor(id) { return AVATAR_COLORS[id.charCodeAt(id.length-1) % AVATAR_COLORS.length]; }

function NavSection({ label, children }) {
  return (
    <div>
      <div className="sidebar-section-label">{label}</div>
      {children}
    </div>
  );
}

function NavItem({ to, icon: Icon, label, badge }) {
  return (
    <NavLink to={to} className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
      <span className="sidebar-item-icon"><Icon size={18} /></span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge ? <span className="sidebar-badge">{badge}</span> : null}
    </NavLink>
  );
}

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const { tickets } = useData();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const role = currentUser.role;
  const pendingReassignments = tickets.filter(t => t.reassignmentRequest?.status === 'Pending').length;
  const openTickets = tickets.filter(t => ['New','Assigned','In Progress','Pending Parts'].includes(t.status)).length;

  const handleLogout = () => { logout(); navigate('/login'); };

  const isSuperAdmin = role === ROLES.SUPER_ADMIN;
  const isITAdmin = role === ROLES.IT_ADMIN;
  const isTrainee = role === ROLES.TRAINEE;
  const isZoom = role === ROLES.ZOOM_REQUESTER;

  const dashPath = isSuperAdmin ? '/dashboard/super-admin' : isITAdmin ? '/dashboard/it-admin' : isTrainee ? '/dashboard/trainee' : '/dashboard/zoom';

  return (
    <nav className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Shield size={22} color="white" />
        </div>
        <div className="sidebar-logo-text">
          <h1>ITSM Platform</h1>
          <p>IT Service Management</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav">
        <NavSection label="Overview">
          <NavItem to={dashPath} icon={LayoutDashboard} label="Dashboard" />
        </NavSection>

        {/* Zoom Requester — Restricted view */}
        {isZoom && (
          <NavSection label="Zoom Support">
            <NavItem to="/zoom/new" icon={Video} label="New Zoom Request" />
            <NavItem to="/zoom" icon={ListTodo} label="My Requests" />
          </NavSection>
        )}

        {/* IT Staff (Super Admin + IT Admin + Trainee) */}
        {!isZoom && (
          <>
            <NavSection label="Asset Management">
              <NavItem to="/assets" icon={Monitor} label="PC / Laptop / Printers" />
              <NavItem to="/stock" icon={Package} label="IT Stock & Cables" />
            </NavSection>

            <NavSection label="Service Desk">
              <NavItem to="/helpdesk" icon={Ticket} label="Helpdesk Tickets" badge={openTickets > 0 ? openTickets : null} />
              <NavItem to="/repairs" icon={Wrench} label="External Repairs" />
            </NavSection>

            <NavSection label="Specialized Services">
              <NavItem to="/zoom" icon={Video} label="Zoom Support" />
              {(isSuperAdmin || isITAdmin) && (
                <NavItem to="/publications" icon={Globe} label="Web Publications" />
              )}
            </NavSection>

            <NavSection label="Task Management">
              <NavItem to="/dashboard/tasks" icon={Star} label="Task Dashboard" />
              <NavItem to="/tasks/board" icon={Kanban} label="Kanban Board" />
              <NavItem to="/tasks/list" icon={ListTodo} label="Task List" />
              <NavItem to="/tasks/calendar" icon={Calendar} label="Calendar" />
              <NavItem to="/tasks/mine" icon={UserCheck} label="My Tasks" />
            </NavSection>

            {(isSuperAdmin || isITAdmin) && (
              <NavSection label="Reports">
                <NavItem to="/audit" icon={ClipboardList} label="Audit Trail" />
              </NavSection>
            )}

            {isSuperAdmin && (
              <NavSection label="Administration">
                <NavItem to="/users" icon={Users} label="User Management" badge={pendingReassignments > 0 ? pendingReassignments : null} />
              </NavSection>
            )}

            {isITAdmin && pendingReassignments > 0 && (
              <NavSection label="Alerts">
                <NavItem to="/helpdesk" icon={Bell} label="Reassignment Requests" badge={pendingReassignments} />
              </NavSection>
            )}
          </>
        )}
      </div>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={handleLogout} title="Click to logout">
          <div className="sidebar-avatar" style={{ background: getAvatarColor(currentUser.id) }}>
            {currentUser.avatar?.slice(0,2) || currentUser.name.slice(0,2).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{currentUser.name}</div>
            <div className="sidebar-user-role">
              {role === ROLES.SUPER_ADMIN ? 'Super Administrator' : role === ROLES.IT_ADMIN ? 'IT Administrator' : role === ROLES.TRAINEE ? 'IT Trainee / Intern' : 'Zoom Requester'}
            </div>
          </div>
          <LogOut size={15} color="rgba(255,255,255,0.35)" />
        </div>
      </div>
    </nav>
  );
}
