import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 'N001', type: 'warning', title: 'Overdue Repair', message: 'REP-2026-001 (PC003) has exceeded expected return date', read: false, time: '2h ago' },
    { id: 'N002', type: 'info', title: 'Reassignment Request', message: 'Hassan Waheed requested reassignment for TKT-2026-003', read: false, time: '4h ago' },
    { id: 'N003', type: 'warning', title: 'Low Stock Alert', message: 'Cat6 Network Cable (1m) is below minimum threshold (8/10)', read: false, time: '1d ago' },
    { id: 'N004', type: 'success', title: 'Task Completed', message: 'Server Room Cable Management (TSK-2026-004) marked complete', read: true, time: '2d ago' },
  ]);

  const addToast = useCallback((type, title, message, duration = 4000) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ toasts, notifications, addToast, removeToast, markRead, markAllRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
