import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { DashboardSkeleton } from '../../components/SkeletonLoader';
import {
  User,
  Heart,
  Calendar,
  Home,
  TrendingUp,
} from 'lucide-react';
import UserHome from './UserHome';
import Wishlist from './Wishlist';
import BookingHistory from './BookingHistory';
import Profile from './Profile';

export const SideNavBtn = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      borderRadius: '10px',
      width: '100%',
      textAlign: 'left',
      fontWeight: 700,
      fontSize: '14px',
      fontFamily: 'var(--font-heading)',
      backgroundColor: active ? 'var(--primary-light)' : 'transparent',
      color: active ? 'var(--primary)' : 'var(--text-secondary)',
      border: active ? '1px solid rgba(79,70,229,0.2)' : '1px solid transparent',
      transition: 'all 0.2s ease',
      position: 'relative',
    }}
  >
    {React.cloneElement(icon, { size: 17 })}
    {label}
    {badge > 0 && (
      <span
        style={{
          marginLeft: 'auto',
          background: 'var(--primary)',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 800,
          borderRadius: '999px',
          padding: '1px 7px',
          minWidth: '20px',
          textAlign: 'center',
        }}
      >
        {badge}
      </span>
    )}
  </button>
);

const UserDashboardLayout = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingData, setLoadingData] = useState(false);

  // Data
  const [wishlist, setWishlist] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Load data for active tab
  useEffect(() => {
    const load = async () => {
      setLoadingData(true);
      try {
        if (activeTab === 'wishlist' || activeTab === 'overview') {
          const r = await api.get('/wishlist');
          if (r.data.success) setWishlist(r.data.data);
        }
        if (activeTab === 'bookings' || activeTab === 'overview') {
          const r = await api.get('/bookings/user');
          if (r.data.success) setBookings(r.data.data);
        }
      } catch (err) {
        console.error('Dashboard data error:', err.message);
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [activeTab]);

  const handleWishlistRemove = (propertyId) => {
    setWishlist((prev) => prev.filter((p) => p._id !== propertyId));
  };

  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;

  // Avatar src
  const avatarSrc = user?.profileImage
    ? (user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`)
    : null;

  return (
    <div style={{ padding: '40px 0 80px', minHeight: '80vh' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
              👋 Welcome, {user?.name?.split(' ')[0]}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              Manage your bookings, wishlist, and account from your personal dashboard.
            </p>
          </div>
          <Link to="/search" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
            <Home size={16} /> Browse Properties
          </Link>
        </div>

        {/* Dashboard Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '28px' }} className="dashboard-layout">
          {/* Sidebar */}
          <aside
            className="glass-panel"
            style={{ padding: '20px', borderRadius: '20px', alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
            {/* Avatar block */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 0 20px',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '12px',
              }}
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.name}
                  style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
                />
              ) : (
                <div
                  style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '30px',
                    fontFamily: 'var(--font-heading)',
                    border: '3px solid var(--primary)',
                    boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontWeight: 800, fontSize: '15px', fontFamily: 'var(--font-heading)' }}>{user?.name}</h4>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--primary)',
                    background: 'var(--primary-light)',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    display: 'inline-block',
                    marginTop: '4px',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  👤 User
                </span>
              </div>
            </div>

            <SideNavBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<TrendingUp />} label="Overview" />
            <SideNavBtn active={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')} icon={<Heart />} label="Saved Wishlist" badge={wishlist.length} />
            <SideNavBtn active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} icon={<Calendar />} label="Booking History" badge={pendingBookings} />
            <SideNavBtn active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User />} label="My Profile" />
          </aside>

          {/* Main Content */}
          <main>
            {loadingData || authLoading ? (
              <DashboardSkeleton />
            ) : (
              <>
                {activeTab === 'overview' && (
                  <UserHome 
                    bookings={bookings} 
                    wishlist={wishlist} 
                    setActiveTab={setActiveTab} 
                    handleWishlistRemove={handleWishlistRemove} 
                  />
                )}
                {activeTab === 'wishlist' && (
                  <Wishlist 
                    wishlist={wishlist} 
                    handleWishlistRemove={handleWishlistRemove} 
                  />
                )}
                {activeTab === 'bookings' && (
                  <BookingHistory bookings={bookings} />
                )}
                {activeTab === 'profile' && (
                  <Profile />
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDashboardLayout;
