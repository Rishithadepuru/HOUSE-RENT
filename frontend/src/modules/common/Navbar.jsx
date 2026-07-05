import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { RoleContext } from '../../context/RoleContext';
import {
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Home,
  Search,
  LayoutDashboard,
  ChevronDown,
  Bell,
  Settings,
  User,
  Shield,
} from 'lucide-react';

const ROLE_CONFIG = {
  tenant: {
    emoji: '👤',
    label: 'User',
    loginPath: '/user/login',
    dashboardPath: '/dashboard/user',
    color: '#4f46e5',
  },
  landlord: {
    emoji: '🏡',
    label: 'Landlord',
    loginPath: '/landlord/login',
    dashboardPath: '/dashboard/landlord',
    color: '#0ea5e9',
  },
  admin: {
    emoji: '👨‍💼',
    label: 'Admin',
    loginPath: '/admin/login',
    dashboardPath: '/dashboard/admin',
    color: '#10b981',
  },
};

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { selectedRole, setRole } = useContext(RoleContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const roleDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target)) {
        setRoleDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setRole(null);
    navigate('/');
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  // Map DB role 'tenant' → dashboard route '/dashboard/user'
  const getRoleDisplayKey = (dbRole) => dbRole; // key in ROLE_CONFIG matches DB role

  const handleRoleSwitch = (roleKey) => {
    setRole(roleKey);
    setRoleDropdownOpen(false);
    const config = ROLE_CONFIG[roleKey];
    if (user && user.role === roleKey) {
      navigate(config.dashboardPath);
    } else {
      navigate(config.loginPath);
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    // 'tenant' role → /dashboard/user
    if (user.role === 'tenant') return '/dashboard/user';
    return `/dashboard/${user.role}`;
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const activeRole = user ? ROLE_CONFIG[user.role] : (selectedRole ? ROLE_CONFIG[selectedRole] : null);

  return (
    <header
      className="glass-panel"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '72px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        transition: 'background var(--transition-normal)',
      }}
    >
      <div
        className="container"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        {/* ───── Brand Logo ───── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '19px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            H
          </div>
          <span
            style={{
              fontSize: '21px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              fontFamily: 'var(--font-heading)',
            }}
          >
            House<span className="gradient-text">Hunt</span>
          </span>
        </Link>

        {/* ───── Desktop Nav Links ───── */}
        <nav
          className="desktop-nav"
          style={{ display: 'flex', alignItems: 'center', gap: '28px' }}
        >
          <Link
            to="/browse"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              fontSize: '14px',
              color: isActive('/browse') ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
          >
            <Home size={17} /> Home
          </Link>
          <Link
            to="/search"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              fontSize: '14px',
              color: isActive('/search') ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
          >
            <Search size={17} /> Properties
          </Link>
          {user && (
            <Link
              to={getDashboardPath()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
                fontSize: '14px',
                color: location.pathname.startsWith('/dashboard') ? 'var(--primary)' : 'var(--text-secondary)',
                transition: 'color var(--transition-fast)',
              }}
            >
              <LayoutDashboard size={17} /> Dashboard
            </Link>
          )}
        </nav>

        {/* ───── Desktop Right Controls ───── */}
        <div
          className="desktop-actions"
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          {/* Role Switcher Dropdown */}
          <div ref={roleDropdownRef} style={{ position: 'relative' }}>
            <button
              id="role-switcher-btn"
              className="navbar-dropdown-btn"
              onClick={() => {
                setRoleDropdownOpen((o) => !o);
                setProfileDropdownOpen(false);
                setNotifOpen(false);
              }}
              aria-expanded={roleDropdownOpen}
              aria-label="Switch role"
            >
              {activeRole ? (
                <>
                  <span>{activeRole.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: '13px' }}>{activeRole.label}</span>
                </>
              ) : (
                <span style={{ fontWeight: 700, fontSize: '13px' }}>Role</span>
              )}
              <ChevronDown
                size={15}
                style={{
                  transition: 'transform 0.2s ease',
                  transform: roleDropdownOpen ? 'rotate(180deg)' : 'none',
                }}
              />
            </button>

            {roleDropdownOpen && (
              <div className="navbar-dropdown-menu" id="role-dropdown-menu">
                <div className="navbar-dropdown-header">Switch Role</div>
                {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    id={`role-switch-${key}`}
                    className={`navbar-dropdown-item ${(user?.role === key || (!user && selectedRole === key)) ? 'navbar-dropdown-item--active' : ''}`}
                    onClick={() => handleRoleSwitch(key)}
                    style={{ '--role-color': cfg.color }}
                  >
                    <span className="navbar-dropdown-emoji">{cfg.emoji}</span>
                    <span>{cfg.label}</span>
                    {user?.role === key && (
                      <span className="navbar-dropdown-active-dot" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Notification Bell (authenticated only) */}
          {user && (
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                id="notification-bell-btn"
                className="navbar-icon-btn"
                onClick={() => {
                  setNotifOpen((o) => !o);
                  setRoleDropdownOpen(false);
                  setProfileDropdownOpen(false);
                }}
                aria-label="Notifications"
              >
                <Bell size={19} />
                <span className="notification-badge">3</span>
              </button>

              {notifOpen && (
                <div className="navbar-dropdown-menu navbar-notif-panel" id="notification-panel">
                  <div className="navbar-dropdown-header">Notifications</div>
                  <div className="notif-item notif-item--unread">
                    <div className="notif-dot" />
                    <div>
                      <p className="notif-title">Booking Request Received</p>
                      <p className="notif-time">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="notif-item notif-item--unread">
                    <div className="notif-dot" />
                    <div>
                      <p className="notif-title">Property Approved</p>
                      <p className="notif-time">1 hour ago</p>
                    </div>
                  </div>
                  <div className="notif-item">
                    <div className="notif-dot notif-dot--read" />
                    <div>
                      <p className="notif-title">New Review Posted</p>
                      <p className="notif-time">Yesterday</p>
                    </div>
                  </div>
                  <Link
                    to={getDashboardPath()}
                    className="notif-view-all"
                    onClick={() => setNotifOpen(false)}
                  >
                    View all notifications →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Profile Avatar / Auth Buttons */}
          {user ? (
            <div ref={profileDropdownRef} style={{ position: 'relative' }}>
              <button
                id="profile-avatar-btn"
                className="profile-avatar-btn"
                onClick={() => {
                  setProfileDropdownOpen((o) => !o);
                  setRoleDropdownOpen(false);
                  setNotifOpen(false);
                }}
                aria-expanded={profileDropdownOpen}
                aria-label="Profile menu"
              >
                {user.profileImage ? (
                  <img
                    src={
                      user.profileImage.startsWith('http')
                        ? user.profileImage
                        : `http://localhost:5000${user.profileImage}`
                    }
                    alt={user.name}
                    className="profile-avatar-img"
                  />
                ) : (
                  <div className="profile-avatar-initials">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="profile-avatar-info">
                  <span className="profile-avatar-name">{user.name.split(' ')[0]}</span>
                  <span
                    className="profile-avatar-role"
                    style={{ color: ROLE_CONFIG[user.role]?.color }}
                  >
                    {user.role}
                  </span>
                </div>
                <ChevronDown
                  size={15}
                  style={{
                    color: 'var(--text-muted)',
                    transition: 'transform 0.2s ease',
                    transform: profileDropdownOpen ? 'rotate(180deg)' : 'none',
                  }}
                />
              </button>

              {profileDropdownOpen && (
                <div
                  className="navbar-dropdown-menu"
                  id="profile-dropdown-menu"
                  style={{ minWidth: '190px', right: 0 }}
                >
                  <div className="navbar-dropdown-header" style={{ paddingBottom: '8px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{user.name}</div>
                    <div
                      style={{
                        fontSize: '12px',
                        textTransform: 'capitalize',
                        color: ROLE_CONFIG[user.role]?.color,
                        fontWeight: 600,
                      }}
                    >
                      {user.role}
                    </div>
                  </div>
                  <Link
                    to={getDashboardPath()}
                    className="navbar-dropdown-item"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <User size={16} /> My Profile
                  </Link>
                  <Link
                    to={getDashboardPath()}
                    className="navbar-dropdown-item"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link
                    to={getDashboardPath()}
                    className="navbar-dropdown-item"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <Settings size={16} /> Settings
                  </Link>
                  <div className="navbar-dropdown-divider" />
                  <button
                    id="profile-logout-btn"
                    className="navbar-dropdown-item navbar-dropdown-item--danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                to={activeRole ? activeRole.loginPath : '/user/login'}
                className="btn btn-secondary"
                style={{ padding: '7px 16px', fontSize: '13px', borderRadius: '8px' }}
              >
                Log In
              </Link>
              <Link
                to={
                  activeRole && activeRole.label !== 'Admin'
                    ? `/${activeRole.label.toLowerCase()}/register`
                    : '/user/register'
                }
                className="btn btn-primary"
                style={{ padding: '7px 16px', fontSize: '13px', borderRadius: '8px' }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* ───── Mobile Menu Toggle ───── */}
        <button
          id="mobile-menu-toggle"
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ───── Mobile Drawer ───── */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          style={{
            position: 'absolute',
            top: '72px',
            left: 0,
            width: '100%',
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: 'var(--shadow-lg)',
            animation: 'slideIn 0.25s ease',
          }}
        >
          <Link
            to="/browse"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
          >
            <Home size={18} /> Home
          </Link>
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
          >
            <Search size={18} /> Search Properties
          </Link>
          {user && (
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
            >
              <LayoutDashboard size={18} /> My Dashboard
            </Link>
          )}

          <hr style={{ borderColor: 'var(--border-color)' }} />

          {/* Mobile Role Switcher */}
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.05em' }}>
              Switch Role
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => { handleRoleSwitch(key); setMobileMenuOpen(false); }}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    border: `1.5px solid ${user?.role === key || selectedRole === key ? cfg.color : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    background: user?.role === key || selectedRole === key ? `${cfg.color}18` : 'var(--bg-surface)',
                    fontWeight: 700,
                    fontSize: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{cfg.emoji}</span>
                  <span>{cfg.label}</span>
                </button>
              ))}
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border-color)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>Theme Mode</span>
            <button onClick={toggleTheme} className="theme-toggle-btn">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {user.profileImage ? (
                  <img
                    src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`}
                    alt={user.name}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      border: '2px solid var(--primary)',
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 700 }}>{user.name}</div>
                  <div
                    style={{
                      fontSize: '12px',
                      textTransform: 'capitalize',
                      fontWeight: 600,
                      color: ROLE_CONFIG[user.role]?.color,
                    }}
                  >
                    {/* Map 'tenant' DB role to display as 'User' */}
                    {user.role === 'tenant' ? 'User' : user.role}
                  </div>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                to={activeRole ? activeRole.loginPath : '/user/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ textAlign: 'center' }}
              >
                Log In
              </Link>
              <Link
                to={
                  activeRole && activeRole.label !== 'Admin'
                    ? `/${activeRole.label.toLowerCase()}/register`
                    : '/user/register'
                }
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
                style={{ textAlign: 'center' }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ───── Responsive CSS ───── */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav, .desktop-actions {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
