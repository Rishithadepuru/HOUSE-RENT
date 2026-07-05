import React from 'react';
import { Users, Building, CheckCircle, TrendingUp, Settings } from 'lucide-react';

const AdminHome = ({ analytics }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }} className="analytics-grid">
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700 }}>PLATFORM USERS</div>
          <div style={{ fontSize: '32px', fontWeight: 800, marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {analytics.users.total}
            <Users size={24} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Landlords: {analytics.users.landlords} | Tenants: {analytics.users.tenants}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700 }}>PROPERTIES LISTED</div>
          <div style={{ fontSize: '32px', fontWeight: 800, marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {analytics.properties.total}
            <Building size={24} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Approved: {analytics.properties.approved} | Pending: {analytics.properties.pending}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700 }}>TOUR BOOKINGS</div>
          <div style={{ fontSize: '32px', fontWeight: 800, marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {analytics.bookings.total}
            <CheckCircle size={24} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Pending: {analytics.bookings.pending} | Completed: {analytics.bookings.completed}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700 }}>AVG MONTHLY RENT</div>
          <div style={{ fontSize: '32px', fontWeight: 800, marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            ₹{analytics.pricing.average.toLocaleString('en-IN')}
            <TrendingUp size={24} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Min: ₹{analytics.pricing.minimum} | Max: ₹{analytics.pricing.maximum}
          </div>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="stats-sections">
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>System Status Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
              <span>Mongoose DB Connection</span>
              <span style={{ fontWeight: 700, color: 'var(--success)' }}>ONLINE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
              <span>Image Storage Service</span>
              <span style={{ fontWeight: 700, color: 'var(--success)' }}>LOCAL (ACTIVE)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
              <span>Total Submitted Reviews</span>
              <span style={{ fontWeight: 700 }}>{analytics.reviews.total} Reviews</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Settings size={28} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Administrative Control Center</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '300px' }}>
            Quickly switch tabs above to inspect pending approvals or modify credentials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
