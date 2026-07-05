import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import AllPropertiesCards from './AllPropertiesCards';

const AllProperties = () => {
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get('/properties');
        if (response.data.success) {
          setProperties(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      if (user && user.role === 'tenant') {
        try {
          const response = await api.get('/wishlist');
          if (response.data.success) {
            setWishlistIds(new Set(response.data.data.map(p => p._id)));
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error.message);
        }
      }
    };

    fetchProperties();
    fetchWishlist();
  }, [user]);

  const handleWishlistToggle = (propertyId, isSaved) => {
    const nextSet = new Set(wishlistIds);
    if (isSaved) {
      nextSet.add(propertyId);
    } else {
      nextSet.delete(propertyId);
    }
    setWishlistIds(nextSet);
  };

  return (
    <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
        🏡 Explore Available Properties
      </h2>
      <AllPropertiesCards
        properties={properties}
        loading={loading}
        wishlistIds={wishlistIds}
        onWishlistToggle={handleWishlistToggle}
      />
    </div>
  );
};

export default AllProperties;
