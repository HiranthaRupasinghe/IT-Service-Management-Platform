import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useData } from '../../context/DataContext';
import { Badge, PriorityBadge } from '../../components/ui/Badge';
import { calcTaskProgress } from '../../data/mockData';
import { CalendarDays } from 'lucide-react';

export default function TaskCalendarPage() {
  const { tasks } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dateStr = (d) => new Date(d).toDateString();
  const selectedStr = selectedDate.toDateString();

  const tasksOnDate = (date) => tasks.filter(t => dateStr(t.dueDate) === date.toDateString());
  const todayTasks = tasks.filter(t => dateStr(t.dueDate) === selectedStr);

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dayTasks = tasksOnDate(date);
    if (dayTasks.length === 0) return null;
    return (
      <div style={{ display:'flex', flexWrap:'wrap', gap:2, justifyContent:'center', marginTop:2 }}>
        {dayTasks.slice(0,3).map((t,i) => (
          <div key={i} style={{ width:6, height:6, borderRadius:'50%', background: t.priority==='Urgent'||t.priority==='High' ? 'var(--danger-500)' : t.priority==='Medium' ? 'var(--warning-500)' : 'var(--success-500)' }} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left"><h1>Task Calendar</h1><p>Deadline & milestone calendar view</p></div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:24 }}>
        <div>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
          />

          <div style={{ marginTop:16, display:'flex', alignItems:'center', gap:16, fontSize:'0.78rem', color:'var(--gray-500)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ width:8, height:8, borderRadius:'50%', background:'var(--danger-500)' }}/> Urgent/High</div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ width:8, height:8, borderRadius:'50%', background:'var(--warning-500)' }}/> Medium</div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ width:8, height:8, borderRadius:'50%', background:'var(--success-500)' }}/> Low</div>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <CalendarDays size={16} style={{ display:'inline', marginRight:8 }} />
                {selectedDate.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
              </span>
              <span className="id-chip">{todayTasks.length} task{todayTasks.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="card-body" style={{ paddingTop:8 }}>
              {todayTasks.length === 0 ? (
                <div style={{ textAlign:'center', padding:'32px 16px', color:'var(--gray-400)' }}>
                  <CalendarDays size={32} style={{ margin:'0 auto 12px', opacity:0.3 }} />
                  <div>No tasks due on this day</div>
                </div>
              ) : todayTasks.map(t => (
                <div key={t.id} style={{ borderLeft:`3px solid ${t.priority==='Urgent'||t.priority==='High'?'var(--danger-500)':t.priority==='Medium'?'var(--warning-500)':'var(--success-500)'}`, paddingLeft:12, marginBottom:14 }}>
                  <div style={{ fontWeight:700, fontSize:'0.875rem', color:'var(--gray-900)', marginBottom:4 }}>{t.title}</div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <PriorityBadge priority={t.priority} />
                    <Badge status={t.status} />
                  </div>
                  <div style={{ fontSize:'0.72rem', color:'var(--gray-500)', marginTop:6 }}>{t.project}</div>
                  <Link to={`/tasks/${t.id}`} style={{ fontSize:'0.75rem', color:'var(--teal-600)', fontWeight:600, marginTop:6, display:'inline-block' }}>View task →</Link>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming tasks */}
          <div className="card" style={{ marginTop:16 }}>
            <div className="card-header"><span className="card-title">All Due Dates</span></div>
            <div className="card-body" style={{ paddingTop:8, maxHeight:300, overflowY:'auto' }}>
              {tasks.filter(t => t.status !== 'Completed').sort((a,b) => new Date(a.dueDate)-new Date(b.dueDate)).map(t => {
                const due = new Date(t.dueDate);
                const overdue = due < new Date();
                return (
                  <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid var(--gray-100)' }}>
                    <div style={{ width:44, height:44, borderRadius:'var(--radius-md)', background:overdue?'var(--danger-50)':'var(--gray-50)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <div style={{ fontSize:'0.65rem', fontWeight:700, color:'var(--gray-500)', textTransform:'uppercase' }}>{due.toLocaleDateString('en-US',{month:'short'})}</div>
                      <div style={{ fontSize:'1rem', fontWeight:800, color:overdue?'var(--danger-500)':'var(--gray-800)' }}>{due.getDate()}</div>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <Link to={`/tasks/${t.id}`} style={{ fontWeight:600, fontSize:'0.82rem', color:'var(--gray-900)' }}>{t.title}</Link>
                      <div style={{ display:'flex', gap:6, marginTop:3 }}>
                        <PriorityBadge priority={t.priority} />
                        {overdue && <span className="badge badge-red" style={{ fontSize:'0.65rem' }}>Overdue</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
