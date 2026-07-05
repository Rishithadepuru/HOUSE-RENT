import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { RoleContext } from '../../context/RoleContext';
import { Mail, Lock, LogIn, ArrowRight, ArrowLeft, Shield } from 'lucide-react';

const Login = ({ roleType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, loading, authError, setAuthError } = useContext(AuthContext);
  const { setRole } = useContext(RoleContext);
  const navigate = useNavigate();

  // Role Configuration
  const getRoleConfig = () => {
    switch (roleType) {
      case 'tenant':
        return {
          title: 'User Portal',
          icon: '👤',
          gradient: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, rgba(0,0,0,0) 70%)',
          btnBg: 'var(--primary)',
          btnShadow: 'none',
          link: '/user/register',
          linkText: 'Register as User',
          badgeClass: 'auth-role-badge--tenant',
        };
      case 'landlord':
        return {
          title: 'Landlord Portal',
          icon: '🏡',
          gradient: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(0,0,0,0) 70%)',
          btnBg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          btnShadow: '0 4px 14px 0 rgba(14,165,233,0.35)',
          link: '/landlord/register',
          linkText: 'Register as Landlord',
          badgeClass: 'auth-role-badge--landlord',
        };
      case 'admin':
        return {
          title: 'Admin Access',
          icon: '👨‍💼', // Using an icon if needed, though admin login used a Shield
          gradient: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)',
          btnBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          btnShadow: '0 4px 14px 0 rgba(16,185,129,0.35)',
          link: null,
          badgeClass: 'auth-role-badge--admin',
        };
      default:
        return {};
    }
  };

  const config = getRoleConfig();

  useEffect(() => {
    setAuthError(null);
    setRole(roleType);
  }, [roleType, setAuthError, setRole]);

  useEffect(() => {
    if (user) {
      if (user.role === 'tenant') navigate('/dashboard/user');
      else navigate(`/dashboard/${user.role}`);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please fill in all details');
      return;
    }
    await login(email, password);
  };

  return (
    <div className="auth-page-wrapper">
      <div
        className="hero-glow"
        style={{
          top: '25%',
          left: roleType === 'landlord' ? '60%' : roleType === 'admin' ? '50%' : '30%',
          transform: 'translate(-50%, -50%)',
          background: config.gradient,
        }}
      />

      <div className="auth-card glass-card">
        <Link to="/" className="auth-back-link">
          <ArrowLeft size={16} /> Back to Role Selection
        </Link>

        {roleType === 'admin' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  background: 'var(--success)',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                }}
              >
                <Shield size={32} />
              </div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Admin Access</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
                Restricted access — authorized personnel only
              </p>
            </div>
          </>
        ) : (
          <>
            <div className={`auth-role-badge ${config.badgeClass}`}>
              {config.icon} {config.title}
            </div>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Welcome Back</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
                {roleType === 'tenant' ? 'Sign in to find your perfect rental home' : 'Sign in to manage your properties'}
              </p>
            </div>
          </>
        )}

        {authError && (
          <div className="alert alert-danger" style={{ fontSize: '14px', padding: '10px 16px', margin: 0 }}>
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">{roleType === 'admin' ? 'Admin Email' : 'Email Address'}</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                id={`${roleType}-login-email`}
                type="email"
                placeholder={roleType === 'admin' ? 'admin@househunt.com' : 'name@email.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>
                Forgot?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                id={`${roleType}-login-password`}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <button
            id={`${roleType}-login-submit`}
            type="submit"
            className="btn"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '8px',
              background: config.btnBg,
              color: '#fff',
              boxShadow: config.btnShadow,
              border: roleType === 'tenant' ? '' : 'none', // Inherit from .btn-primary for tenant
            }}
          >
            {loading ? 'Signing In...' : (
              <>
                <LogIn size={18} />
                {roleType === 'admin' ? 'Access Admin Panel' : `Sign In as ${roleType === 'tenant' ? 'User' : 'Landlord'}`}
              </>
            )}
          </button>
        </form>

        {config.link && (
          <div
            style={{
              textAlign: 'center',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '20px',
              marginTop: '8px',
            }}
          >
            Don't have an account?{' '}
            <Link
              to={config.link}
              style={{ color: roleType === 'landlord' ? 'var(--accent)' : 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '2px' }}
            >
              {config.linkText} <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
