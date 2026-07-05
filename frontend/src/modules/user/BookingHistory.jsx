import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Phone, Mail, AlertCircle } from 'lucide-react';
import { StatusBadge } from './userHelpers';

const BookingHistory = ({ bookings }) => {
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>
        📅 Booking History ({bookings.length})
      </h2>
      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            You haven't scheduled any home visits yet.
          </p>
          <Link to="/search" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
            Search Properties
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map((booking) => (
            <div
              key={booking._id}
              style={{
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              {/* Booking Card Header */}
              <div
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <StatusBadge status={booking.status} />
                  </div>
                  <Link
                    to={`/property/${booking.property?._id}`}
                    style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-heading)', marginTop: '4px' }}
                  >
                    {booking.property?.title}
                  </Link>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span>
                      <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      {booking.property?.address}, {booking.property?.city}
                    </span>
                    <span>📅 Visit Date: <strong>{formatDate(booking.visitDate)}</strong></span>
                    <span>⏰ Time Slot: <strong>{booking.visitTime}</strong></span>
                  </div>
                </div>

                {/* Landlord Contact */}
                {booking.property?.owner && (
                  <div
                    style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: '12px',
                      padding: '14px 18px',
                      minWidth: '220px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      Landlord Contact
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{booking.property.owner.name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Phone size={12} /> {booking.property.owner.phone}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Mail size={12} /> {booking.property.owner.email}
                    </span>
                  </div>
                )}
              </div>

              {/* Booking message if exists */}
              {booking.message && (
                <div
                  style={{
                    borderTop: '1px solid var(--border-color)',
                    padding: '12px 24px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-secondary)',
                  }}
                >
                  <AlertCircle size={14} style={{ display: 'inline', marginRight: '6px', color: 'var(--text-muted)' }} />
                  <em>"{booking.message}"</em>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
