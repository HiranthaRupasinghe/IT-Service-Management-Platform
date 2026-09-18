import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Badge } from '../../components/ui/Badge';
import { Monitor, Laptop, Printer, ArrowLeft, Cpu, HardDrive, MemoryStick, MapPin, User, Tag, Network, Calendar } from 'lucide-react';

const TypeIcon = ({ type }) => {
  const s = 28, c = 'var(--teal-500)';
  if (type === 'PC') return <Monitor size={s} color={c} />;
  if (type === 'Laptop') return <Laptop size={s} color={c} />;
  return <Printer size={s} color={c} />;
};

export default function AssetDetailPage() {
  const { id } = useParams();
  const { assets, tickets } = useData();
  const asset = assets.find(a => a.id === id);
  if (!asset) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-400)' }}>Asset not found</div>;

  const assetTickets = tickets.filter(t => t.assetId === id);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Link to="/assets" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}><ArrowLeft size={15} /> Back to Assets</Link>
      </div>

      <div className="detail-header">
        <div className="detail-icon" style={{ background: 'rgba(6,182,212,0.1)' }}>
          <TypeIcon type={asset.type} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="detail-title">{asset.brand} {asset.model}</div>
          <div className="detail-meta">
            <span className="id-chip">{asset.tag}</span>
            <span className="id-chip">S/N: {asset.serial}</span>
            <Badge status={asset.status} />
          </div>
        </div>
        <div className="detail-actions">
          <button className="btn btn-secondary">Edit Asset</button>
          <button className="btn btn-primary">Log Ticket</button>
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <div className="card-header"><span className="card-title">Asset Information</span></div>
          <div className="card-body">
            <div className="info-grid">
              <div className="info-item"><div className="info-label">Type</div><div className="info-value">{asset.type}</div></div>
              <div className="info-item"><div className="info-label">Brand</div><div className="info-value">{asset.brand}</div></div>
              <div className="info-item"><div className="info-label">Model</div><div className="info-value">{asset.model}</div></div>
              <div className="info-item"><div className="info-label">Inventory Tag</div><div className="info-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{asset.tag}</div></div>
              <div className="info-item"><div className="info-label">Serial Number</div><div className="info-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{asset.serial}</div></div>
              <div className="info-item"><div className="info-label">Purchase Date</div><div className="info-value">{asset.purchaseDate || '—'}</div></div>
            </div>
          </div>
        </div>

        {(asset.type === 'PC' || asset.type === 'Laptop') && (
          <div className="card">
            <div className="card-header"><span className="card-title">Technical Specifications</span></div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item"><div className="info-label">CPU</div><div className="info-value">{asset.cpu}</div></div>
                <div className="info-item"><div className="info-label">RAM</div><div className="info-value">{asset.ram}</div></div>
                <div className="info-item"><div className="info-label">Storage</div><div className="info-value">{asset.storage}</div></div>
                <div className="info-item"><div className="info-label">OS</div><div className="info-value">{asset.os}</div></div>
                <div className="info-item"><div className="info-label">IP Address</div><div className="info-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{asset.ip || '—'}</div></div>
                <div className="info-item"><div className="info-label">Location</div><div className="info-value">{asset.location}</div></div>
              </div>
            </div>
          </div>
        )}

        {asset.type === 'Printer' && (
          <div className="card">
            <div className="card-header"><span className="card-title">Printer Details</span></div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item"><div className="info-label">Location</div><div className="info-value">{asset.location}</div></div>
                <div className="info-item"><div className="info-label">Connection</div><div className="info-value">{asset.connectionType}</div></div>
                <div className="info-item"><div className="info-label">IP Address</div><div className="info-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{asset.ipAddress || '—'}</div></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Assignment */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header"><span className="card-title">Assignment</span></div>
        <div className="card-body">
          <div className="info-grid">
            <div className="info-item"><div className="info-label">Division</div><div className="info-value">{asset.division}</div></div>
            <div className="info-item"><div className="info-label">Assigned Officer</div><div className="info-value">{asset.officer || '—'}</div></div>
          </div>
        </div>
      </div>

      {/* Maintenance History */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <span className="card-title">Maintenance History</span>
          <span className="id-chip">{assetTickets.length} tickets</span>
        </div>
        {assetTickets.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--gray-400)' }}>No maintenance history for this asset</div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead><tr><th>Ticket ID</th><th>Issue</th><th>Category</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {assetTickets.map(t => (
                  <tr key={t.id}>
                    <td><Link to={`/helpdesk/${t.id}`} style={{ color: 'var(--teal-600)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', fontWeight: 600 }}>{t.id}</Link></td>
                    <td>{t.title}</td>
                    <td><span className="badge badge-blue">{t.category}</span></td>
                    <td><Badge status={t.status} /></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
