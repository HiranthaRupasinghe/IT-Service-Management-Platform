import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useNotifications } from '../../context/NotificationContext';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function AppLayout() {
  const { toasts, removeToast } = useNotifications();

  const toastIcon = (type) => {
    const s = 18;
    if (type === 'success') return <CheckCircle size={s} color="var(--success-500)" />;
    if (type === 'error')   return <XCircle size={s} color="var(--danger-500)" />;
    if (type === 'warning') return <AlertTriangle size={s} color="var(--warning-500)" />;
    return <Info size={s} color="var(--teal-500)" />;
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <TopBar />
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon">{toastIcon(t.type)}</span>
            <div className="toast-content">
              <div className="toast-title">{t.title}</div>
              {t.message && <div className="toast-message">{t.message}</div>}
            </div>
            <button className="icon-btn" onClick={() => removeToast(t.id)} style={{ flexShrink: 0 }}>
              <X size={14} color="var(--gray-400)" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
