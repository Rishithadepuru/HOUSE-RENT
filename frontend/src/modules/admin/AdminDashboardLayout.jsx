import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { DashboardSkeleton } from '../../components/SkeletonLoader';
import { AuthContext } from '../../context/AuthContext';
import AdminHome from './AdminHome';
import AllProperty from './AllProperty';
import AllUsers from './AllUsers';

const AdminDashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [pendingProperties, setPendingProperties] = useState([]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const analRes = await api.get('/admin/analytics');
      if (analRes.data.success) {
        setAnalytics(analRes.data.data);
      }

      const usersRes = await api.get('/admin/users');
      if (usersRes.data.success) {
        setUsersList(usersRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching admin details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const fetchPendingProperties = async () => {
    try {
      const response = await api.get('/admin/properties', { params: { status: 'pending' } });
      if (response.data.success) {
        setPendingProperties(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching pending properties:', error.message);
    }
  };

  useEffect(() => {
    if (activeTab === 'properties') {
      fetchPendingProperties();
    }
  }, [activeTab]);

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Administrative Control</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Overview system health, moderate user listings, and approve land listing submissions.
        </p>
      </div>

      {loading && !analytics ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Top Tabs */}
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '28px' }}>
            <button 
              onClick={() => setActiveTab('analytics')}
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: activeTab === 'analytics' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'analytics' ? '3px solid var(--primary)' : 'none',
                paddingBottom: '12px',
                marginBottom: '-13px'
              }}
            >
              Platform Overview
            </button>
            <button 
              onClick={() => setActiveTab('properties')}
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: activeTab === 'properties' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'properties' ? '3px solid var(--primary)' : 'none',
                paddingBottom: '12px',
                marginBottom: '-13px'
              }}
            >
              Pending Listings ({pendingProperties.length})
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'users' ? '3px solid var(--primary)' : 'none',
                paddingBottom: '12px',
                marginBottom: '-13px'
              }}
            >
              Manage Users ({usersList.length})
            </button>
          </div>

          {/* Render Active Tab Content */}
          {activeTab === 'analytics' && analytics && (
            <AdminHome analytics={analytics} />
          )}

          {activeTab === 'properties' && (
            <AllProperty 
              pendingProperties={pendingProperties} 
              fetchPendingProperties={fetchPendingProperties} 
              setAnalytics={setAnalytics} 
            />
          )}

          {activeTab === 'users' && (
            <AllUsers 
              usersList={usersList} 
              loadAdminData={loadAdminData} 
              currentUser={user} 
            />
          )}

        </>
      )}

      <style>{`
        @media (max-width: 900px) {
          .stats-sections {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 820px) {
          .analytics-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .analytics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardLayout;
