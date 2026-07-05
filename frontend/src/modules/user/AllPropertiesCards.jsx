import React from 'react';
import PropertyCard from '../../components/PropertyCard';
import { PropertyCardSkeleton } from '../../components/SkeletonLoader';

const AllPropertiesCards = ({ properties, loading, wishlistIds, onWishlistToggle }) => {
  if (loading) {
    return (
      <div className="properties-grid">
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No properties match the search criteria.</p>
      </div>
    );
  }

  return (
    <div className="properties-grid">
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
          isWishlisted={wishlistIds ? wishlistIds.has(property._id) : false}
          onWishlistToggle={onWishlistToggle}
        />
      ))}
    </div>
  );
};

export default AllPropertiesCards;
