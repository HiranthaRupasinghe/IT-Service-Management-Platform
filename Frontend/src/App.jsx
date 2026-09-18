import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';
import { ROLES } from './data/mockData';

import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';

// Dashboards
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard';
import ITAdminDashboard from './pages/dashboards/ITAdminDashboard';
import TraineeDashboard from './pages/dashboards/TraineeDashboard';
import TaskDashboard from './pages/dashboards/TaskDashboard';
import ZoomRequesterDashboard from './pages/dashboards/ZoomRequesterDashboard';

// Feature Pages
import AssetListPage from './pages/assets/AssetListPage';
import AssetDetailPage from './pages/assets/AssetDetailPage';
import StockPage from './pages/stock/StockPage';
import TicketListPage from './pages/helpdesk/TicketListPage';
import TicketDetailPage from './pages/helpdesk/TicketDetailPage';
import NewTicketPage from './pages/helpdesk/NewTicketPage';
import RepairListPage from './pages/repairs/RepairListPage';
import RepairDetailPage from './pages/repairs/RepairDetailPage';
import ZoomListPage from './pages/zoom/ZoomListPage';
import ZoomRequestPage from './pages/zoom/ZoomRequestPage';
import PublicationPage from './pages/publication/PublicationPage';
import TaskBoardPage from './pages/tasks/TaskBoardPage';
import TaskListPage from './pages/tasks/TaskListPage';
import TaskCalendarPage from './pages/tasks/TaskCalendarPage';
import MyTasksPage from './pages/tasks/MyTasksPage';
import TaskDetailPage from './pages/tasks/TaskDetailPage';
import UserManagementPage from './pages/users/UserManagementPage';
import AuditLogPage from './pages/audit/AuditLogPage';

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function DashboardRedirect() {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  switch (currentUser.role) {
    case ROLES.SUPER_ADMIN: return <Navigate to="/dashboard/super-admin" replace />;
    case ROLES.IT_ADMIN:    return <Navigate to="/dashboard/it-admin" replace />;
    case ROLES.TRAINEE:     return <Navigate to="/dashboard/trainee" replace />;
    case ROLES.ZOOM_REQUESTER: return <Navigate to="/dashboard/zoom" replace />;
    default: return <Navigate to="/login" replace />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="dashboard" element={<DashboardRedirect />} />
                <Route path="dashboard/super-admin" element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}><SuperAdminDashboard /></ProtectedRoute>} />
                <Route path="dashboard/it-admin"    element={<ProtectedRoute allowedRoles={[ROLES.IT_ADMIN]}><ITAdminDashboard /></ProtectedRoute>} />
                <Route path="dashboard/trainee"     element={<ProtectedRoute allowedRoles={[ROLES.TRAINEE]}><TraineeDashboard /></ProtectedRoute>} />
                <Route path="dashboard/tasks"       element={<TaskDashboard />} />
                <Route path="dashboard/zoom"        element={<ZoomRequesterDashboard />} />

                <Route path="assets"         element={<AssetListPage />} />
                <Route path="assets/:id"     element={<AssetDetailPage />} />
                <Route path="stock"          element={<StockPage />} />
                <Route path="helpdesk"       element={<TicketListPage />} />
                <Route path="helpdesk/new"   element={<NewTicketPage />} />
                <Route path="helpdesk/:id"   element={<TicketDetailPage />} />
                <Route path="repairs"        element={<RepairListPage />} />
                <Route path="repairs/:id"    element={<RepairDetailPage />} />
                <Route path="zoom"           element={<ZoomListPage />} />
                <Route path="zoom/new"       element={<ZoomRequestPage />} />
                <Route path="publications"   element={<PublicationPage />} />
                <Route path="tasks/board"    element={<TaskBoardPage />} />
                <Route path="tasks/list"     element={<TaskListPage />} />
                <Route path="tasks/calendar" element={<TaskCalendarPage />} />
                <Route path="tasks/mine"     element={<MyTasksPage />} />
                <Route path="tasks/:id"      element={<TaskDetailPage />} />
                <Route path="users"          element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}><UserManagementPage /></ProtectedRoute>} />
                <Route path="audit"          element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}><AuditLogPage /></ProtectedRoute>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </DataProvider>
    </AuthProvider>
  );
}
