import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import PropertyCard from '../../components/PropertyCard';

const Wishlist = ({ wishlist, handleWishlistRemove }) => {
  return (
    <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>
        💜 Saved Wishlist ({wishlist.length})
      </h2>
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Heart size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            You haven't saved any properties to your wishlist yet.
          </p>
          <Link to="/search" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="properties-grid">
          {wishlist.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              isWishlisted
              onWishlistToggle={handleWishlistRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
