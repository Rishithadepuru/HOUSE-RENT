import React from 'react';
import api from '../../services/api';

const AllUsers = ({ usersList, loadAdminData, currentUser }) => {
  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (response.data.success) {
        alert(response.data.message);
        loadAdminData(); // Reload
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user role.');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 20px', fontWeight: 700 }}>User Name</th>
              <th style={{ padding: '16px 20px', fontWeight: 700 }}>Email Address</th>
              <th style={{ padding: '16px 20px', fontWeight: 700 }}>Phone</th>
              <th style={{ padding: '16px 20px', fontWeight: 700 }}>Joined Date</th>
              <th style={{ padding: '16px 20px', fontWeight: 700 }}>Current Role</th>
              <th style={{ padding: '16px 20px', fontWeight: 700, textAlign: 'center' }}>Update Role Action</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((usr) => (
              <tr key={usr._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '16px 20px', fontWeight: 700 }}>{usr.name}</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>{usr.email}</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>{usr.phone}</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>{formatDate(usr.createdAt)}</td>
                <td style={{ padding: '16px 20px', textTransform: 'capitalize' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: usr.role === 'admin' ? 'var(--danger-light)' : usr.role === 'landlord' ? 'var(--primary-light)' : 'var(--bg-secondary)',
                    color: usr.role === 'admin' ? 'var(--danger)' : usr.role === 'landlord' ? 'var(--primary)' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '12px'
                  }}>
                    {usr.role}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                  <select
                    value={usr.role}
                    onChange={(e) => handleUpdateRole(usr._id, e.target.value)}
                    disabled={usr._id === currentUser?.id} // Cannot edit own role
                    className="form-select"
                    style={{ width: '130px', padding: '4px 8px', fontSize: '13px', display: 'inline-block', height: '32px' }}
                  >
                    <option value="tenant">Tenant</option>
                    <option value="landlord">Landlord</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
