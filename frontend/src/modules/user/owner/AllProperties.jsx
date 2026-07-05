import React from 'react';
import PropertyCard from '../../../components/PropertyCard';
import { Trash2 } from 'lucide-react';
import api from '../../../services/api';

const AllProperties = ({ myListings, triggerEditListing, setShowAddForm, loadDashboardData }) => {
  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you absolutely sure you want to delete this property listing? This cannot be undone.')) {
      return;
    }

    try {
      const response = await api.delete(`/properties/${propertyId}`);
      if (response.data.success) {
        alert(response.data.message);
        loadDashboardData();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete listing.');
    }
  };

  if (myListings.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>You haven't listed any houses yet.</p>
        <button onClick={() => setShowAddForm(true)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
          Create First Listing
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
      {myListings.map((property) => (
        <div key={property._id} style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <PropertyCard property={property} showAdminStatus={true} />
          
          {/* Edit/Delete Overlay Controls */}
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: 'var(--bg-secondary)',
            borderBottomLeftRadius: 'var(--radius-lg)',
            borderBottomRightRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            borderTop: 'none',
            marginTop: '-4px',
            zIndex: 2
          }}>
            <button 
              onClick={() => triggerEditListing(property)}
              className="btn btn-secondary" 
              style={{ flex: 1, padding: '8px', fontSize: '13px', borderRadius: '8px' }}
            >
              Edit Details
            </button>
            <button 
              onClick={() => handleDeleteProperty(property._id)}
              className="btn btn-danger" 
              style={{ padding: '8px 12px', borderRadius: '8px' }}
              aria-label="Delete listing"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllProperties;
