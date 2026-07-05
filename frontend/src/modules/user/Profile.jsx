import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Upload, Save, CheckCircle, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, loading: authLoading } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    if (profileFile) formData.append('profileImage', profileFile);
    const res = await updateProfile(formData);
    if (res.success) {
      setProfileSuccess(res.message || 'Profile updated successfully!');
      setProfileFile(null);
      setProfilePreview(null);
    } else {
      setProfileError(res.error || 'Failed to update profile.');
    }
  };

  const avatarSrc = profilePreview
    || (user?.profileImage
      ? (user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`)
      : null);

  return (
    <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
        Profile Settings
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
        Update your personal information and profile picture.
      </p>

      {profileSuccess && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          <CheckCircle size={18} /> {profileSuccess}
        </div>
      )}
      {profileError && (
        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
          <AlertCircle size={18} /> {profileError}
        </div>
      )}

      <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Avatar Upload */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="Profile"
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
            />
          ) : (
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '28px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <label
            className="btn btn-secondary"
            style={{ cursor: 'pointer', padding: '10px 16px', fontSize: '13px' }}
          >
            <Upload size={16} /> Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              style={{ display: 'none' }}
            />
          </label>
          {profileFile && (
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{profileFile.name}</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '220px', margin: 0 }}>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: '220px', margin: 0 }}>
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Email Address (Read-only)</label>
          <input
            type="email"
            value={email}
            className="form-input"
            disabled
            style={{ opacity: 0.6, cursor: 'not-allowed' }}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={authLoading}
          style={{ alignSelf: 'start', padding: '12px 28px' }}
        >
          <Save size={18} /> {authLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
