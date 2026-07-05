import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Mail, ArrowLeft, Send, Sparkles } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [simulatedLink, setSimulatedLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setMessage('');
    setSimulatedLink('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.data.success) {
        setMessage(response.data.message);
        if (response.data.resetLink) {
          setSimulatedLink(response.data.resetLink);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative'
    }}>
      <div className="hero-glow" style={{ top: '20%', left: '40%' }} />

      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '40px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800 }}>Forgot Password</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            We'll simulate an email recovery process to reset your password.
          </p>
        </div>

        {error && <div className="alert alert-danger" style={{ fontSize: '14px', margin: 0 }}>{error}</div>}
        {message && <div className="alert alert-success" style={{ fontSize: '14px', margin: 0 }}>{message}</div>}

        {simulatedLink && (
          <div className="glass-panel" style={{
            padding: '16px',
            borderRadius: '12px',
            background: 'var(--primary-light)',
            border: '1px dashed var(--primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={14} /> SIMULATED EMAIL INBOX LINK
            </span>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Since you are testing locally, click the link below to load the password reset screen:
            </p>
            <a 
              href={simulatedLink.replace('http://localhost:5173', '')} 
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--primary)',
                wordBreak: 'break-all',
                textDecoration: 'underline'
              }}
            >
              Reset My Password Page
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? 'Sending link...' : (
              <>
                Send Reset Link <Send size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <Link to="/login" style={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ArrowLeft size={16} /> Back to Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
