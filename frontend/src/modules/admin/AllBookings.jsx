import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, User, Phone, Mail, Building } from 'lucide-react';
import { DashboardSkeleton } from '../../components/SkeletonLoader';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/landlord');
        if (response.data.success) {
          setBookings(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>
        📅 Platform Bookings Overview ({bookings.length})
      </h2>
      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
          <p>No bookings scheduled on the platform.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map((booking) => (
            <div
              key={booking._id}
              style={{
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <span className={`badge badge-${booking.status}`} style={{ marginBottom: '8px' }}>
                  {booking.status}
                </span>
                <h4 style={{ fontWeight: 800, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building size={16} /> {booking.property?.title}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  📅 Visit Date: {formatDate(booking.visitDate)} | Slot: {booking.visitTime}
                </p>
              </div>
              <div style={{ fontSize: '13px', borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                <span style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tenant Contact</span>
                <span><User size={12} style={{ display: 'inline', marginRight: '4px' }} />{booking.tenant?.name}</span>
                <br />
                <span><Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />{booking.tenant?.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBookings;
