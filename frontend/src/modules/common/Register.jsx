import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { RoleContext } from '../../context/RoleContext';
import { User, Mail, Phone, Lock, UserPlus, ArrowRight, ArrowLeft } from 'lucide-react';

const Register = ({ roleType }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const { user, register, loading, authError, setAuthError } = useContext(AuthContext);
  const { setRole } = useContext(RoleContext);
  const navigate = useNavigate();

  const getRoleConfig = () => {
    switch (roleType) {
      case 'tenant':
        return {
          title: 'User Registration',
          icon: '👤',
          gradient: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, rgba(0,0,0,0) 70%)',
          btnBg: 'var(--primary)',
          btnShadow: 'none',
          loginLink: '/user/login',
          badgeClass: 'auth-role-badge--tenant',
          btnLabel: 'Create User Account'
        };
      case 'landlord':
        return {
          title: 'Landlord Registration',
          icon: '🏡',
          gradient: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(0,0,0,0) 70%)',
          btnBg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          btnShadow: '0 4px 14px 0 rgba(14,165,233,0.35)',
          loginLink: '/landlord/login',
          badgeClass: 'auth-role-badge--landlord',
          btnLabel: 'Create Landlord Account'
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
    if (!name || !email || !phone || !password) {
      setAuthError('Please fill in all details');
      return;
    }
    await register({ name, email, phone, password, role: roleType });
  };

  return (
    <div className="auth-page-wrapper">
      <div
        className="hero-glow"
        style={{
          top: '25%',
          left: roleType === 'landlord' ? '60%' : '30%',
          transform: 'translate(-50%, -50%)',
          background: config.gradient,
        }}
      />

      <div className="auth-card glass-card">
        <Link to={config.loginLink} className="auth-back-link">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <div className={`auth-role-badge ${config.badgeClass}`}>
          {config.icon} {config.title}
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
            {roleType === 'tenant' ? 'Join HouseHunt and find your perfect home' : 'Join HouseHunt to start listing properties'}
          </p>
        </div>

        {authError && (
          <div className="alert alert-danger" style={{ fontSize: '14px', padding: '10px 16px', margin: 0 }}>
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User
                size={18}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                id={`${roleType}-reg-name`}
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                id={`${roleType}-reg-email`}
                type="email"
                placeholder="john@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone
                size={18}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                id={`${roleType}-reg-phone`}
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                id={`${roleType}-reg-password`}
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          {/* Role locked indicator */}
          <div
            style={{
              background: roleType === 'landlord' ? 'var(--accent-light)' : 'var(--primary-light)',
              border: `1px solid ${roleType === 'landlord' ? 'rgba(14,165,233,0.2)' : 'rgba(79,70,229,0.2)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              fontSize: '13px',
              color: roleType === 'landlord' ? 'var(--accent)' : 'var(--primary)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {config.icon} Registering as: <strong>{roleType === 'tenant' ? 'User' : 'Landlord'}</strong>
          </div>

          <button
            id={`${roleType}-reg-submit`}
            type="submit"
            className="btn"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '4px',
              background: config.btnBg,
              color: '#fff',
              boxShadow: config.btnShadow,
              border: roleType === 'tenant' ? '' : 'none'
            }}
          >
            {loading ? 'Creating Account...' : <><UserPlus size={18} /> {config.btnLabel}</>}
          </button>
        </form>

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
          Already have an account?{' '}
          <Link
            to={config.loginLink}
            style={{ color: roleType === 'landlord' ? 'var(--accent)' : 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '2px' }}
          >
            Sign In <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
