import React from 'react';
import { Heart, Calendar, Clock, CheckCircle, MapPin } from 'lucide-react';
import PropertyCard from '../../components/PropertyCard';
import { StatCard, StatusBadge } from './userHelpers';

const UserHome = ({ bookings, wishlist, setActiveTab, handleWishlistRemove }) => {
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const approvedBookings = bookings.filter((b) => b.status === 'approved').length;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stat Cards Row */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <StatCard
          icon={<Heart />}
          label="Saved Properties"
          value={wishlist.length}
          color="#4f46e5"
          bg="rgba(79,70,229,0.1)"
        />
        <StatCard
          icon={<Calendar />}
          label="Total Bookings"
          value={bookings.length}
          color="#0ea5e9"
          bg="rgba(14,165,233,0.1)"
        />
        <StatCard
          icon={<Clock />}
          label="Pending Visits"
          value={pendingBookings}
          color="#f59e0b"
          bg="rgba(245,158,11,0.1)"
        />
        <StatCard
          icon={<CheckCircle />}
          label="Confirmed Visits"
          value={approvedBookings}
          color="#10b981"
          bg="rgba(16,185,129,0.1)"
        />
      </div>

      {/* Recent Bookings */}
      <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            Recent Bookings
          </h2>
          <button
            onClick={() => setActiveTab('bookings')}
            style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            View all →
          </button>
        </div>
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
            <Calendar size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p>No bookings yet. Browse properties to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bookings.slice(0, 3).map((b) => (
              <div
                key={b._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'var(--bg-secondary)',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{b.property?.title}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {b.property?.city} · 📅 {formatDate(b.visitDate)}
                  </span>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Wishlist */}
      <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            Saved Properties
          </h2>
          <button
            onClick={() => setActiveTab('wishlist')}
            style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            View all →
          </button>
        </div>
        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
            <Heart size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p>No saved properties yet. Heart a property to save it!</p>
          </div>
        ) : (
          <div className="properties-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {wishlist.slice(0, 3).map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                isWishlisted
                onWishlistToggle={handleWishlistRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHome;
