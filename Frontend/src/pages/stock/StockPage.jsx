import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Badge } from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';
import { Package, AlertTriangle, Plus, Edit, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import { ROLES } from '../../data/mockData';

const CATEGORIES = ['All', 'HDD', 'RAM', 'Mouse', 'Keyboard', 'Wi-Fi Adapter', 'Network Cable', 'Power Cable', 'HDMI Cable', 'VGA Cable'];

export default function StockPage() {
  const { stock, updateStockStatus, updateStockQuantity } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useNotifications();
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState(null);
  const [editQty, setEditQty] = useState(0);

  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN].includes(currentUser.role);

  const filtered = stock.filter(s => {
    const matchCat = catFilter === 'All' || s.category === catFilter;
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const handleToggleAvailability = (item) => {
    if (!isAdmin) return;
    const newStatus = item.status === 'Not Available' ? 'Available' : 'Not Available';
    updateStockStatus(item.id, newStatus, currentUser);
    addToast('success', 'Stock Updated', `${item.name} marked as ${newStatus}`);
  };

  const handleSaveQty = () => {
    updateStockQuantity(editModal.id, Number(editQty), currentUser);
    addToast('success', 'Quantity Updated', `${editModal.name} quantity set to ${editQty}`);
    setEditModal(null);
  };

  const totalNA = stock.filter(s => s.status === 'Not Available').length;
  const lowStock = stock.filter(s => s.status === 'Low Stock').length;
  const available = stock.filter(s => s.status === 'Available').length;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>IT Stock & Cables</h1>
          <p>Internal consumable and peripheral inventory management</p>
        </div>
        {isAdmin && <div className="page-header-actions"><button className="btn btn-primary"><Plus size={15} /> Add Stock Item</button></div>}
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <StatCard label="Available Items" value={available} icon={Package} iconBg="rgba(16,185,129,0.1)" iconColor="var(--success-500)" accentColor="var(--success-500)" />
        <StatCard label="Low Stock" value={lowStock} icon={AlertTriangle} iconBg="rgba(245,158,11,0.1)" iconColor="var(--warning-500)" accentColor="var(--warning-500)" />
        <StatCard label="Not Available" value={totalNA} icon={AlertTriangle} iconBg="rgba(244,63,94,0.1)" iconColor="var(--danger-500)" accentColor="var(--danger-500)" />
      </div>

      {/* Filters */}
      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={15} color="var(--gray-400)" />
            <input className="filter-input" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220 }} />
          </div>
          <div className="table-filters" style={{ flexWrap: 'wrap' }}>
            <select className="filter-input" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="filter-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Not Available">Not Available</option>
            </select>
          </div>
        </div>

        <div className="stock-grid" style={{ padding: '20px' }}>
          {filtered.map(item => (
            <div key={item.id} className={`stock-card${item.status === 'Not Available' ? ' out-of-stock' : item.status === 'Low Stock' ? ' low-stock' : ''}`}>
              <div className="stock-category-tag">{item.category}</div>
              <div className="stock-name">{item.name}</div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 4 }}>
                <div className="stock-quantity">{item.quantity}</div>
                <div className="stock-quantity-label">{item.unit}</div>
              </div>

              {item.quantity <= item.minThreshold && item.quantity > 0 && (
                <div style={{ fontSize: '0.72rem', color: 'var(--warning-700)', fontWeight: 600, marginBottom: 6 }}>
                  ⚠ Below threshold (min: {item.minThreshold})
                </div>
              )}

              <div className="stock-meta">
                <Badge status={item.status} />
                {isAdmin && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => { setEditModal(item); setEditQty(item.quantity); }}
                      title="Edit quantity"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      className={`btn btn-sm ${item.status === 'Not Available' ? 'btn-success' : 'btn-danger'}`}
                      onClick={() => handleToggleAvailability(item)}
                      title={item.status === 'Not Available' ? 'Mark Available' : 'Mark Not Available'}
                    >
                      {item.status === 'Not Available' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      {item.status === 'Not Available' ? 'Enable' : 'Disable'}
                    </button>
                  </div>
                )}
              </div>

              <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginTop: 8 }}>
                Updated {item.lastUpdated} by {item.updatedBy}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={!!editModal}
        onClose={() => setEditModal(null)}
        title={`Edit Stock: ${editModal?.name}`}
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setEditModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSaveQty}>Save Quantity</button>
          </>
        }
      >
        {editModal && (
          <div>
            <div className="form-group">
              <label className="form-label">Current Quantity</label>
              <input type="number" className="form-input" min={0} value={editQty} onChange={e => setEditQty(e.target.value)} />
              <div className="form-hint">Min threshold: {editModal.minThreshold} {editModal.unit}</div>
            </div>
            {Number(editQty) === 0 && (
              <div className="alert-card alert-card-error" style={{ borderRadius: 'var(--radius-md)' }}>
                <div className="alert-message">Setting quantity to 0 will automatically mark this item as "Not Available".</div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
