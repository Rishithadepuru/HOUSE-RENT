import React from 'react';
import api from '../../services/api';
import PropertyCard from '../../components/PropertyCard';

const AllProperties = ({ pendingProperties, fetchPendingProperties, setAnalytics }) => {
  const handleStatusChange = async (propertyId, nextStatus) => {
    try {
      const response = await api.put(`/admin/properties/${propertyId}/status`, { status: nextStatus });
      if (response.data.success) {
        alert(response.data.message);
        // Reload pending properties
        fetchPendingProperties();
        // Also reload analytics
        const analRes = await api.get('/admin/analytics');
        if (analRes.data.success) {
          setAnalytics(analRes.data.data);
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to change property status.');
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>Pending Property Listings Review</h2>
      {pendingProperties.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>All property listings have been reviewed. There are zero pending submissions.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
          {pendingProperties.map((property) => (
            <PropertyCard 
              key={property._id} 
              property={property} 
              showAdminStatus={true} 
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProperties;
