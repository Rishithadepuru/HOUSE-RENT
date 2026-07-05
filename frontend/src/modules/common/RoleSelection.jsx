import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../../context/RoleContext';
import { AuthContext } from '../../context/AuthContext';

const roles = [
  {
    key: 'tenant',
    emoji: '👤',
    title: 'User',
    subtitle: 'Browse rental properties, save favorites, book properties, manage bookings, and update your profile.',
    loginPath: '/user/login',
    dashboardPath: '/dashboard/user',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    glowColor: 'rgba(79, 70, 229, 0.35)',
    bgAccent: 'rgba(79, 70, 229, 0.08)',
    borderHover: '#4f46e5',
    features: ['Browse Properties', 'Save Wishlist', 'Book Visits', 'Booking History'],
  },
  {
    key: 'landlord',
    emoji: '🏡',
    title: 'Landlord',
    subtitle: 'Add and manage properties, upload images, view booking requests, manage listings, and track analytics.',
    loginPath: '/landlord/login',
    dashboardPath: '/dashboard/landlord',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    glowColor: 'rgba(14, 165, 233, 0.35)',
    bgAccent: 'rgba(14, 165, 233, 0.08)',
    borderHover: '#0ea5e9',
    features: ['List Properties', 'Manage Bookings', 'View Analytics', 'Respond to Users'],
  },
  {
    key: 'admin',
    emoji: '👨‍💼',
    title: 'Admin',
    subtitle: 'Manage users, landlords, properties, bookings, reports, and platform analytics.',
    loginPath: '/admin/login',
    dashboardPath: '/dashboard/admin',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    bgAccent: 'rgba(16, 185, 129, 0.08)',
    borderHover: '#10b981',
    features: ['Platform Analytics', 'Manage Users', 'Approve Properties', 'View Reports'],
  },
];

const RoleSelection = () => {
  const { setRole } = useContext(RoleContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setRole(role.key);
    // If already logged in with that role, go to dashboard
    if (user && user.role === role.key) {
      navigate(role.dashboardPath);
    } else {
      navigate(role.loginPath);
    }
  };

  return (
    <div className="role-selection-page">
      {/* Animated Background Orbs */}
      <div className="role-orb role-orb-1" />
      <div className="role-orb role-orb-2" />
      <div className="role-orb role-orb-3" />

      <div className="role-selection-container">
        {/* Header */}
        <div className="role-selection-header">
          <div className="role-logo-badge">
            <span>H</span>
          </div>
          <h1 className="role-selection-title">
            House<span className="gradient-text">Hunt</span>
          </h1>
          <p className="role-selection-tagline">
            Your intelligent real estate companion
          </p>
          <div className="role-divider" />
          <h2 className="role-selection-subtitle">Select Your Role to Continue</h2>
          <p className="role-selection-hint">
            Choose how you'd like to use HouseHunt today
          </p>
        </div>

        {/* Role Cards */}
        <div className="role-cards-grid">
          {roles.map((role, index) => (
            <button
              key={role.key}
              className="role-card"
              onClick={() => handleRoleSelect(role)}
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {/* Card Glow Background */}
              <div
                className="role-card-glow"
                style={{ background: role.gradient, opacity: 0 }}
              />

              {/* Emoji Icon */}
              <div
                className="role-card-icon"
                style={{ background: role.bgAccent }}
              >
                <span className="role-card-emoji">{role.emoji}</span>
              </div>

              {/* Card Content */}
              <div className="role-card-content">
                <h3 className="role-card-title">{role.title}</h3>
                <p className="role-card-subtitle">{role.subtitle}</p>

                {/* Feature Pills */}
                <div className="role-card-features">
                  {role.features.map((f) => (
                    <span key={f} className="role-feature-pill">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div
                className="role-card-cta"
                style={{ background: role.gradient }}
              >
                <span>Continue as {role.title}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>

              {/* Hover border accent */}
              <div
                className="role-card-border-accent"
                style={{ background: role.gradient }}
              />
            </button>
          ))}
        </div>

        {/* Footer Note */}
        <p className="role-selection-footer">
          🔒 Secure, role-based access · All data is encrypted in transit
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
