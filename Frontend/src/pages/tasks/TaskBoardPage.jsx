import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Badge, PriorityBadge } from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { calcTaskProgress, getUser } from '../../data/mockData';
import { Kanban, Plus, Calendar, Clock } from 'lucide-react';

const COLUMNS = [
  { id: 'To Do', label: 'To Do', color: '#3b82f6', bg: '#eff6ff' },
  { id: 'In Progress', label: 'In Progress', color: '#f59e0b', bg: '#fffbeb' },
  { id: 'Completed', label: 'Completed', color: '#10b981', bg: '#ecfdf5' },
  { id: 'On Hold', label: 'On Hold', color: '#8b5cf6', bg: '#f5f3ff' },
];

export default function TaskBoardPage() {
  const { tasks, updateTaskStatus } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useNotifications();

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter(t => t.status === col.id);
    return acc;
  }, {});

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const newStatus = destination.droppableId;
    updateTaskStatus(draggableId, newStatus, currentUser);
    addToast('success', 'Status Updated', `Task moved to "${newStatus}"`);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Kanban Board</h1>
          <p>Drag and drop tasks to update their status</p>
        </div>
        <div className="page-header-actions">
          <Link to="/tasks/list" className="btn btn-secondary btn-sm">List View</Link>
          <Link to="/tasks/calendar" className="btn btn-secondary btn-sm"><Calendar size={14} /> Calendar</Link>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {COLUMNS.map(col => (
            <div key={col.id} className="kanban-column">
              <div className="kanban-col-header" style={{ borderBottomColor: col.color, background: col.bg }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color, flexShrink: 0 }} />
                {col.label}
                <span className="kanban-col-count" style={{ background: col.color, color: 'white' }}>{grouped[col.id]?.length || 0}</span>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    className="kanban-col-body"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ background: snapshot.isDraggingOver ? col.bg : undefined, minHeight: 80 }}
                  >
                    {grouped[col.id]?.map((task, index) => {
                      const progress = calcTaskProgress(task);
                      const assignees = task.assignees.map(id => getUser(id)).filter(Boolean);
                      const dueDate = new Date(task.dueDate);
                      const isOverdue = dueDate < new Date() && task.status !== 'Completed';
                      return (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className={`kanban-card ${snapshot.isDragging ? 'dragging' : ''}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="kanban-card-id">{task.id}</div>
                              <div className="kanban-card-title">{task.title}</div>

                              <div className="kanban-card-progress">
                                <ProgressBar value={progress} size="sm" showLabel={false} />
                                <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)', marginTop: 4 }}>{progress}% complete</div>
                              </div>

                              <div className="kanban-card-meta">
                                <PriorityBadge priority={task.priority} />
                                {isOverdue && <span className="badge badge-red" style={{ fontSize: '0.65rem' }}>Overdue</span>}
                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <Clock size={11} color="var(--gray-400)" />
                                  <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)' }}>{task.dueDate}</span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <div className="avatar-stack">
                                  {assignees.slice(0,3).map(u => (
                                    <div key={u.id} className="avatar avatar-sm" style={{ background: 'var(--teal-500)' }} title={u.name}>
                                      {u.name.slice(0,2)}
                                    </div>
                                  ))}
                                </div>
                                <Link to={`/tasks/${task.id}`} style={{ fontSize: '0.72rem', color: 'var(--teal-600)', fontWeight: 600 }}>View →</Link>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                    {grouped[col.id]?.length === 0 && !snapshot.isDraggingOver && (
                      <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--gray-300)', fontSize: '0.8rem' }}>
                        Drop tasks here
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
