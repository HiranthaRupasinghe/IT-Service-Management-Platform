import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import { Monitor, Laptop, Printer, Plus, Search, Filter } from 'lucide-react';

export default function AssetListPage() {
  const { assets } = useData();
  const { currentUser } = useAuth();
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = assets.filter(a => {
    const matchType = typeFilter === 'All' || a.type === typeFilter;
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchSearch = !searchTerm || [a.tag, a.serial, a.brand, a.model, a.officer, a.division].some(v => v?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchType && matchStatus && matchSearch;
  });

  const pcCount = assets.filter(a => a.type === 'PC').length;
  const laptopCount = assets.filter(a => a.type === 'Laptop').length;
  const printerCount = assets.filter(a => a.type === 'Printer').length;

  const columns = [
    { key: 'tag', label: 'Inventory Tag', render: (v, row) => <Link to={`/assets/${row.id}`} style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--teal-600)', fontWeight: 600, fontSize: '0.8rem' }}>{v}</Link> },
    { key: 'type', label: 'Type', render: v => {
      const icons = { PC: <Monitor size={13} />, Laptop: <Laptop size={13} />, Printer: <Printer size={13} /> };
      return <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{icons[v]}<span>{v}</span></div>;
    }},
    { key: 'brand', label: 'Brand / Model', render: (v, row) => <div><div style={{ fontWeight: 600 }}>{v}</div><div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{row.model}</div></div> },
    { key: 'division', label: 'Division' },
    { key: 'officer', label: 'Assigned Officer' },
    { key: 'ip', label: 'IP Address', render: v => v ? <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem' }}>{v}</span> : '—' },
    { key: 'status', label: 'Status', render: v => <Badge status={v} /> },
    { key: 'id', label: '', sortable: false, render: (v) => <Link to={`/assets/${v}`} className="btn btn-secondary btn-sm">View</Link> },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Asset Inventory</h1>
          <p>PC, Laptop & Printer master catalog — {assets.length} total assets</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary"><Plus size={15} /> Add Asset</button>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <StatCard label="PCs / Desktops" value={pcCount} icon={Monitor} iconBg="rgba(59,130,246,0.1)" iconColor="#3b82f6" accentColor="#3b82f6" />
        <StatCard label="Laptops" value={laptopCount} icon={Laptop} iconBg="rgba(139,92,246,0.1)" iconColor="var(--purple-500)" accentColor="var(--purple-500)" />
        <StatCard label="Printers" value={printerCount} icon={Printer} iconBg="rgba(6,182,212,0.1)" iconColor="var(--teal-500)" accentColor="var(--teal-500)" />
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={15} color="var(--gray-400)" />
            <input className="filter-input" placeholder="Search tag, serial, officer..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: 260 }} />
          </div>
          <div className="table-filters">
            {['All','PC','Laptop','Printer'].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)} className={`btn ${typeFilter === t ? 'btn-primary' : 'btn-secondary'} btn-sm`}>{t}</button>
            ))}
            <select className="filter-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <DataTable columns={columns} data={filtered} emptyMessage="No assets found matching your filters" emptyIcon="🖥️" />
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--gray-100)', fontSize: '0.78rem', color: 'var(--gray-400)' }}>
          Showing {filtered.length} of {assets.length} assets
        </div>
      </div>
    </div>
  );
}
