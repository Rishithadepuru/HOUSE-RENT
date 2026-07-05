import React from 'react';
import api from '../../../services/api';

const AllBookings = ({ visitRequests, loadDashboardData }) => {
  const handleUpdateBookingStatus = async (bookingId, nextStatus) => {
    try {
      const response = await api.put(`/bookings/${bookingId}`, { status: nextStatus });
      if (response.data.success) {
        alert(response.data.message);
        loadDashboardData();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update visit status.');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (visitRequests.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No visit requests have been submitted for your properties yet.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {visitRequests.map((req) => (
        <div key={req._id} className="glass-card booking-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className={`badge badge-${req.status}`} style={{ marginBottom: '8px' }}>{req.status}</span>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Target: {req.property.title}</h3>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span>📅 Requested Date: {formatDate(req.visitDate)}</span>
              <span>⏰ Requested Time: {req.visitTime}</span>
              {req.message && (
                <span style={{ fontStyle: 'italic', display: 'block', marginTop: '6px', color: 'var(--text-muted)' }}>
                  " {req.message} "
                </span>
              )}
            </div>
          </div>

          {/* Tenant Information Card */}
          <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', minWidth: '240px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '8px' }}>
              Tenant Details
            </h4>
            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontWeight: 700 }}>{req.tenant.name}</span>
              <span>📞 {req.tenant.phone}</span>
              <span>✉️ {req.tenant.email}</span>
            </div>

            {req.status === 'pending' && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button 
                  onClick={() => handleUpdateBookingStatus(req._id, 'approved')}
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '6px', fontSize: '12px', borderRadius: '6px', display: 'flex', gap: '2px', justifyContent: 'center' }}
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleUpdateBookingStatus(req._id, 'cancelled')}
                  className="btn btn-danger" 
                  style={{ flex: 1, padding: '6px', fontSize: '12px', borderRadius: '6px', display: 'flex', gap: '2px', justifyContent: 'center' }}
                >
                  Cancel
                </button>
              </div>
            )}

            {req.status === 'approved' && (
              <button
                onClick={() => handleUpdateBookingStatus(req._id, 'completed')}
                className="btn btn-outline"
                style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '6px', marginTop: '12px' }}
              >
                Mark Completed
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllBookings;
