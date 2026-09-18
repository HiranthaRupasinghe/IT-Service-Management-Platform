import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  ASSETS, STOCK_ITEMS, TICKETS, REPAIRS, VENDORS,
  ZOOM_REQUESTS, PUBLICATIONS, TASKS, AUDIT_LOGS, USERS,
  calcTaskProgress
} from '../data/mockData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [assets, setAssets] = useState(ASSETS);
  const [stock, setStock] = useState(STOCK_ITEMS);
  const [tickets, setTickets] = useState(TICKETS);
  const [repairs, setRepairs] = useState(REPAIRS);
  const [vendors] = useState(VENDORS);
  const [zoomRequests, setZoomRequests] = useState(ZOOM_REQUESTS);
  const [publications, setPublications] = useState(PUBLICATIONS);
  const [tasks, setTasks] = useState(TASKS);
  const [auditLogs, setAuditLogs] = useState(AUDIT_LOGS);
  const [users, setUsers] = useState(USERS);

  const addAuditLog = useCallback((userId, username, action, entityType, entityId, description, module) => {
    const entry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId, username, action, entityType, entityId, description, module,
    };
    setAuditLogs(prev => [entry, ...prev]);
  }, []);

  // --- STOCK ---
  const updateStockStatus = (id, status, user) => {
    setStock(prev => prev.map(s => s.id === id ? { ...s, status, lastUpdated: new Date().toISOString().split('T')[0], updatedBy: user.name } : s));
    addAuditLog(user.id, user.username, 'UPDATE', 'Stock', id, `Marked stock item ${id} as "${status}"`, 'Stock');
  };

  const updateStockQuantity = (id, quantity, user) => {
    setStock(prev => prev.map(s => {
      if (s.id !== id) return s;
      const newStatus = quantity === 0 ? 'Not Available' : quantity <= s.minThreshold ? 'Low Stock' : 'Available';
      return { ...s, quantity, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0], updatedBy: user.name };
    }));
    addAuditLog(user.id, user.username, 'UPDATE', 'Stock', id, `Updated stock quantity for ${id} to ${quantity}`, 'Stock');
  };

  // --- TICKETS ---
  const updateTicketStatus = (id, status, user) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t));
    addAuditLog(user.id, user.username, 'STATUS_CHANGE', 'Ticket', id, `Changed ticket status to "${status}"`, 'Helpdesk');
  };

  const assignTicket = (id, assigneeId, user) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, assignedTo: assigneeId, status: 'Assigned', reassignmentRequest: null, updatedAt: new Date().toISOString() } : t));
    addAuditLog(user.id, user.username, 'ASSIGN', 'Ticket', id, `Assigned ticket to user ${assigneeId}`, 'Helpdesk');
  };

  const submitReassignmentRequest = (ticketId, reason, user) => {
    const request = { id: `RR-${Date.now()}`, requestedBy: user.id, reason, requestedAt: new Date().toISOString(), status: 'Pending' };
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, reassignmentRequest: request } : t));
    addAuditLog(user.id, user.username, 'REASSIGN_REQUEST', 'Ticket', ticketId, `Submitted reassignment request: ${reason}`, 'Helpdesk');
  };

  const rejectReassignmentRequest = (ticketId, reason, user) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      const updatedReq = t.reassignmentRequest ? {
        ...t.reassignmentRequest,
        status: 'Rejected',
        rejectedBy: user.id,
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason || 'Reassignment request was rejected by IT Admin.'
      } : null;
      return {
        ...t,
        reassignmentRequest: updatedReq,
        updatedAt: new Date().toISOString()
      };
    }));
    addAuditLog(user.id, user.username, 'REJECT_REASSIGN', 'Ticket', ticketId, `Rejected reassignment request${reason ? `: ${reason}` : ''}`, 'Helpdesk');
  };

  const createTicket = (ticketData, user) => {
    const newTicket = { id: `TKT-${Date.now()}`, ...ticketData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), partsUsed: [], reassignmentRequest: null };
    setTickets(prev => [newTicket, ...prev]);
    addAuditLog(user.id, user.username, 'CREATE', 'Ticket', newTicket.id, `Created new ticket: ${ticketData.title}`, 'Helpdesk');
    return newTicket;
  };

  // --- TASKS ---
  const updateTaskStatus = (id, status, user) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t));
    addAuditLog(user.id, user.username, 'STATUS_CHANGE', 'Task', id, `Changed task status to "${status}"`, 'Task Management');
  };

  const updateSubtaskStatus = (taskId, subtaskId, status, user) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const updatedSubtasks = t.subtasks.map(s =>
        s.id === subtaskId ? { ...s, status, completedAt: status === 'Completed' ? new Date().toISOString() : null } : s
      );
      const progress = calcTaskProgress({ ...t, subtasks: updatedSubtasks });
      const newStatus = progress === 100 ? 'Completed' : t.status === 'To Do' && progress > 0 ? 'In Progress' : t.status;
      return { ...t, subtasks: updatedSubtasks, status: newStatus, updatedAt: new Date().toISOString() };
    }));
    addAuditLog(user.id, user.username, 'UPDATE', 'Subtask', subtaskId, `Updated subtask status to "${status}"`, 'Task Management');
  };

  const createTask = (taskData, user) => {
    const newTask = { id: `TSK-${Date.now()}`, ...taskData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), subtasks: taskData.subtasks || [] };
    setTasks(prev => [newTask, ...prev]);
    addAuditLog(user.id, user.username, 'CREATE', 'Task', newTask.id, `Created task: ${taskData.title}`, 'Task Management');
    return newTask;
  };

  // --- ZOOM ---
  const createZoomRequest = (data, user) => {
    const newReq = { id: `ZM-${Date.now()}`, ...data, meetingLink: '', requestedBy: user.id, status: 'Pending', createdAt: new Date().toISOString() };
    setZoomRequests(prev => [newReq, ...prev]);
    addAuditLog(user.id, user.username, 'CREATE', 'ZoomRequest', newReq.id, `Submitted Zoom request: ${data.meetingName}`, 'Zoom Support');
    return newReq;
  };

  const assignZoomRequest = (id, assigneeId, user) => {
    setZoomRequests(prev => prev.map(z => z.id === id ? { ...z, assignedTo: assigneeId, status: z.status === 'Pending' ? 'Confirmed' : z.status } : z));
    addAuditLog(user.id, user.username, 'ASSIGN', 'ZoomRequest', id, `Assigned Zoom request to ${assigneeId}`, 'Zoom Support');
  };

  const updateZoomMeetingLink = (id, linkData, user) => {
    const isObj = typeof linkData === 'object' && linkData !== null;
    const meetingLink = isObj ? linkData.meetingLink : linkData;
    const meetingId = isObj ? linkData.meetingId : '';
    const passcode = isObj ? linkData.passcode : '';

    setZoomRequests(prev => prev.map(z => z.id === id ? {
      ...z,
      meetingLink,
      meetingId: meetingId !== undefined ? meetingId : (z.meetingId || ''),
      passcode: passcode !== undefined ? passcode : (z.passcode || ''),
      linkUploadedBy: user.id,
      linkUploadedAt: new Date().toISOString(),
      status: z.status === 'Pending' ? 'Confirmed' : z.status,
    } : z));
    addAuditLog(user.id, user.username, 'UPDATE_LINK', 'ZoomRequest', id, `Uploaded Zoom meeting link & access info for ${id}`, 'Zoom Support');
  };

  // --- USERS ---
  const updateUserRole = (userId, newRole, user) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    addAuditLog(user.id, user.username, 'PRIVILEGE_CHANGE', 'User', userId, `Changed role for user ${userId} to "${newRole}"`, 'User Management');
  };

  const toggleUserActive = (userId, user) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: !u.active } : u));
    addAuditLog(user.id, user.username, 'UPDATE', 'User', userId, `Toggled active status for user ${userId}`, 'User Management');
  };

  // --- REPAIRS ---
  const createRepair = (data, user) => {
    const newRepair = { id: `REP-${Date.now()}`, ...data, status: 'Active', createdAt: new Date().toISOString() };
    setRepairs(prev => [newRepair, ...prev]);
    addAuditLog(user.id, user.username, 'DISPATCH', 'Repair', newRepair.id, `Dispatched asset for repair: ${data.forReason}`, 'External Repairs');
    return newRepair;
  };

  const closeRepair = (id, data, user) => {
    setRepairs(prev => prev.map(r => r.id === id ? { ...r, ...data, status: 'Closed' } : r));
    addAuditLog(user.id, user.username, 'CLOSE', 'Repair', id, `Closed repair job. Parts replaced: ${data.whatReplaced}`, 'External Repairs');
  };

  // --- PUBLICATIONS ---
  const createPublication = (data, user) => {
    const newPub = { id: `PUB-${Date.now()}`, ...data, status: 'Pending Review', requestedBy: user.id, requestedAt: new Date().toISOString(), publishedBy: null, approvedBy: null, publishedAt: null };
    setPublications(prev => [newPub, ...prev]);
    addAuditLog(user.id, user.username, 'CREATE', 'Publication', newPub.id, `Submitted publication request: ${data.title}`, 'Web Publication');
    return newPub;
  };

  const approvePublication = (id, user) => {
    setPublications(prev => prev.map(p => p.id === id ? { ...p, status: 'Published', approvedBy: user.id, publishedBy: user.id, publishedAt: new Date().toISOString() } : p));
    addAuditLog(user.id, user.username, 'PUBLISH', 'Publication', id, `Approved and published publication ${id}`, 'Web Publication');
  };

  return (
    <DataContext.Provider value={{
      assets, stock, tickets, repairs, vendors, zoomRequests, publications, tasks, auditLogs, users,
      updateStockStatus, updateStockQuantity,
      updateTicketStatus, assignTicket, submitReassignmentRequest, rejectReassignmentRequest, createTicket,
      updateTaskStatus, updateSubtaskStatus, createTask,
      createZoomRequest, assignZoomRequest, updateZoomMeetingLink,
      updateUserRole, toggleUserActive,
      createRepair, closeRepair,
      createPublication, approvePublication,
      addAuditLog,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
