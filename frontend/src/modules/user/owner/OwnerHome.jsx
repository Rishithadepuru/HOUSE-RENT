import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import api from '../../../services/api';
import { DashboardSkeleton } from '../../../components/SkeletonLoader';
import {
  Building,
  Plus,
  CalendarCheck,
  TrendingUp,
  Check,
} from 'lucide-react';
import AllProperties from './AllProperties';
import AllBookings from './AllBookings';
import PropertyForm from './PropertyForm';

import AddProperty from './AddProperty';

const OwnerHome = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('listings');
  const [loading, setLoading] = useState(true);

  // Data states
  const [myListings, setMyListings] = useState([]);
  const [visitRequests, setVisitRequests] = useState([]);

  // Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const listRes = await api.get('/properties/my-listings/all');
      if (listRes.data.success) {
        setMyListings(listRes.data.data);
      }

      const visitsRes = await api.get('/bookings/landlord');
      if (visitsRes.data.success) {
        setVisitRequests(visitsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching landlord dashboard details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const triggerEditListing = (property) => {
    setEditingProperty(property);
    setEditMode(true);
    setShowAddForm(true);
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditMode(false);
    setEditingProperty(null);
  };

  const calculateTotalViews = () => {
    return myListings.reduce((sum, item) => sum + (item.views || 0), 0);
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Landlord Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            List rentals, review tenant visits, and evaluate catalog analytics.
          </p>
        </div>

        <button 
          onClick={() => { closeForm(); setShowAddForm(true); }}
          className="btn btn-primary"
          style={{ display: 'flex', gap: '8px' }}
        >
          <Plus size={18} /> Add New Property
        </button>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Analytics Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '40px'
          }} className="analytics-grid">
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700 }}>TOTAL PROPERTIES</div>
              <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                {myListings.length}
                <Building size={28} style={{ color: 'var(--primary)' }} />
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700 }}>TOTAL VIEWS</div>
              <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                {calculateTotalViews()}
                <TrendingUp size={28} style={{ color: 'var(--accent)' }} />
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700 }}>PENDING VISITS</div>
              <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                {visitRequests.filter(v => v.status === 'pending').length}
                <CalendarCheck size={28} style={{ color: 'var(--warning)' }} />
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700 }}>APPROVED ACTIVE LISTINGS</div>
              <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                {myListings.filter(l => l.status === 'approved').length}
                <Check size={28} style={{ color: 'var(--success)' }} />
              </div>
            </div>
          </div>

          {/* Primary View Selector tabs */}
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '28px' }}>
            <button 
              onClick={() => setActiveTab('listings')}
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: activeTab === 'listings' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'listings' ? '3px solid var(--primary)' : 'none',
                paddingBottom: '12px',
                marginBottom: '-13px'
              }}
            >
              My Listed Properties ({myListings.length})
            </button>
            <button 
              onClick={() => setActiveTab('visits')}
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: activeTab === 'visits' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'visits' ? '3px solid var(--primary)' : 'none',
                paddingBottom: '12px',
                marginBottom: '-13px'
              }}
            >
              Visit Bookings Queue ({visitRequests.length})
            </button>
          </div>

          {/* Render Views based on State */}
          {showAddForm ? (
            editMode ? (
              <PropertyForm 
                editMode={true}
                editingProperty={editingProperty}
                closeForm={closeForm}
                loadDashboardData={loadDashboardData}
              />
            ) : (
              <AddProperty 
                closeForm={closeForm}
                loadDashboardData={loadDashboardData}
              />
            )
          ) : (
            <>
              {activeTab === 'listings' && (
                <AllProperties 
                  myListings={myListings} 
                  triggerEditListing={triggerEditListing} 
                  setShowAddForm={setShowAddForm}
                  loadDashboardData={loadDashboardData}
                />
              )}
              {activeTab === 'visits' && (
                <AllBookings 
                  visitRequests={visitRequests} 
                  loadDashboardData={loadDashboardData} 
                />
              )}
            </>
          )}
        </>
      )}

      <style>{`
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

export default OwnerHome;
