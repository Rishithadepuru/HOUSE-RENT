import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  Heart, 
  BedDouble, 
  Bath, 
  Maximize2, 
  MapPin, 
  Eye, 
  ChevronRight 
} from 'lucide-react';

const PropertyCard = ({ 
  property, 
  isWishlisted: initialWishlisted = false, 
  onWishlistToggle = null,
  showAdminStatus = false,
  onStatusChange = null 
}) => {
  const { user } = useContext(AuthContext);
  const [isSaved, setIsSaved] = useState(initialWishlisted);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      alert('Please log in as a Tenant to save properties to your wishlist.');
      navigate('/login');
      return;
    }

    if (user.role !== 'tenant') {
      alert('Only Tenants can save properties to wishlists.');
      return;
    }

    setSaving(true);
    try {
      const response = await api.post('/wishlist/toggle', { propertyId: property._id });
      if (response.data.success) {
        setIsSaved(!isSaved);
        if (onWishlistToggle) {
          onWishlistToggle(property._id, !isSaved);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error.message);
    } finally {
      setSaving(false);
    }
  };

  const getImageUrl = () => {
    if (property.images && property.images.length > 0) {
      const firstImage = property.images[0];
      return firstImage.startsWith('http') ? firstImage : `http://localhost:5000${firstImage}`;
    }
    return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'; // fallback
  };

  const handleCardClick = () => {
    navigate(`/property/${property._id}`);
  };

  const formatPrice = (val) => {
    return val.toLocaleString('en-IN');
  };

  const getStatusBadge = () => {
    const status = property.status;
    return <span className={`badge badge-${status}`} style={{ fontSize: '11px', padding: '4px 8px' }}>{status}</span>;
  };

  return (
    <div 
      className="glass-card" 
      onClick={handleCardClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {/* Property Image Container */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img 
          src={getImageUrl()} 
          alt={property.title} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-slow)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        
        {/* Wishlist Button (Tenants only or unauthenticated) */}
        {(!user || user.role === 'tenant') && (
          <button
            onClick={handleWishlistClick}
            disabled={saving}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              border: 'none',
              zIndex: 10,
              color: isSaved ? 'var(--danger)' : '#64748b',
              transition: 'all var(--transition-fast)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }}
          >
            <Heart size={18} fill={isSaved ? 'var(--danger)' : 'transparent'} />
          </button>
        )}

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px', zIndex: 10 }}>
          <span style={{
            backgroundColor: 'var(--primary)',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            {property.propertyType}
          </span>
          {showAdminStatus && getStatusBadge()}
        </div>

        {/* Price Tag Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(9, 13, 22, 0.75)',
          backdropFilter: 'blur(8px)',
          padding: '6px 12px',
          borderRadius: '8px',
          color: '#fff',
          fontWeight: 700,
          fontSize: '15px',
          border: '1px solid rgba(255,255,255,0.1)',
          zIndex: 10
        }}>
          ₹{formatPrice(property.price)} <span style={{ fontSize: '11px', fontWeight: 500 }}>/ month</span>
        </div>
      </div>

      {/* Property Details Container */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{
          fontSize: '17px',
          fontWeight: 700,
          marginBottom: '8px',
          lineHeight: '1.3',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          height: '44px'
        }}>
          {property.title}
        </h3>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
          <MapPin size={14} style={{ color: 'var(--primary)' }} />
          <span style={{ textTransform: 'capitalize' }}>{property.city}, {property.state}</span>
        </div>

        {/* Specs Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-secondary)',
          padding: '10px 12px',
          borderRadius: '10px',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          marginBottom: '20px',
          marginTop: 'auto'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BedDouble size={15} /> {property.bedrooms} Bed
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bath size={15} /> {property.bathrooms} Bath
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Maximize2 size={15} /> {property.area} sqft
          </span>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '0 0 16px 0' }} />

        {/* Views / Action Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <Eye size={14} /> {property.views} views
          </span>
          <span style={{ 
            fontSize: '13px', 
            fontWeight: 700, 
            color: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2px' 
          }}>
            View Details <ChevronRight size={14} />
          </span>
        </div>

        {/* Admin approval/rejection quick panel */}
        {showAdminStatus && user?.role === 'admin' && property.status === 'pending' && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => onStatusChange(property._id, 'approved')}
              className="btn btn-primary" 
              style={{ flex: 1, padding: '6px', fontSize: '12px', borderRadius: '6px' }}
            >
              Approve
            </button>
            <button 
              onClick={() => onStatusChange(property._id, 'rejected')}
              className="btn btn-danger" 
              style={{ flex: 1, padding: '6px', fontSize: '12px', borderRadius: '6px' }}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
