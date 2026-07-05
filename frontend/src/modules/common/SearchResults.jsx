import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import PropertyCard from '../../components/PropertyCard';
import { PropertyCardSkeleton } from '../../components/SkeletonLoader';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight, RefreshCcw } from 'lucide-react';

const SearchResults = () => {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // Loading & State
  const [properties, setProperties] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  // Filters state (pre-populated from search params)
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [bathrooms, setBathrooms] = useState(searchParams.get('bathrooms') || '');
  const [furnished, setFurnished] = useState(searchParams.get('furnished') || '');
  const [parking, setParking] = useState(searchParams.get('parking') === 'true');
  const [petsAllowed, setPetsAllowed] = useState(searchParams.get('petsAllowed') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Synchronize state with search parameters when they change in URL
  useEffect(() => {
    setCity(searchParams.get('city') || '');
    setPropertyType(searchParams.get('propertyType') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setBedrooms(searchParams.get('bedrooms') || '');
    setBathrooms(searchParams.get('bathrooms') || '');
    setFurnished(searchParams.get('furnished') || '');
    setParking(searchParams.get('parking') === 'true');
    setPetsAllowed(searchParams.get('petsAllowed') === 'true');
    setSort(searchParams.get('sort') || '');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Load user wishlist IDs if user is a tenant
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user && user.role === 'tenant') {
        try {
          const response = await api.get('/wishlist');
          if (response.data.success) {
            const ids = new Set(response.data.data.map((item) => item._id));
            setWishlistIds(ids);
          }
        } catch (error) {
          console.error('Error fetching wishlist ids:', error.message);
        }
      }
    };
    fetchWishlist();
  }, [user]);

  // Fetch properties from API
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {};
      
      // Map filters to query parameters
      if (city) params.city = city.toLowerCase();
      if (propertyType) params.propertyType = propertyType;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (bedrooms) params.bedrooms = bedrooms;
      if (bathrooms) params.bathrooms = bathrooms;
      if (furnished) params.furnished = furnished;
      if (parking) params.parking = parking;
      if (petsAllowed) params.petsAllowed = petsAllowed;
      if (sort) params.sort = sort;
      if (searchQuery) params.search = searchQuery;
      
      // Page from searchParams
      params.page = searchParams.get('page') || 1;
      params.limit = 6; // Limit items per page

      const response = await api.get('/properties', { params });
      if (response.data.success) {
        setProperties(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error loading properties list:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Re-run properties fetch whenever search params change
  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  // Push filter states to Search Params in URL
  const applyFilters = () => {
    const newParams = new URLSearchParams();
    if (city) newParams.set('city', city);
    if (propertyType) newParams.set('propertyType', propertyType);
    if (minPrice) newParams.set('minPrice', minPrice);
    if (maxPrice) newParams.set('maxPrice', maxPrice);
    if (bedrooms) newParams.set('bedrooms', bedrooms);
    if (bathrooms) newParams.set('bathrooms', bathrooms);
    if (furnished) newParams.set('furnished', furnished);
    if (parking) newParams.set('parking', 'true');
    if (petsAllowed) newParams.set('petsAllowed', 'true');
    if (sort) newParams.set('sort', sort);
    if (searchQuery) newParams.set('search', searchQuery);
    
    // Reset to page 1 on filter apply
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setCity('');
    setPropertyType('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setBathrooms('');
    setFurnished('');
    setParking(false);
    setPetsAllowed(false);
    setSort('');
    setSearchQuery('');
    setSearchParams({}); // Clear URL
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      {/* Page Title & Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Explore Rental Listings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Found {pagination.total} verified houses available for rent
          </p>
        </div>

        {/* Global Text Search */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ width: '260px' }}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          />
          <button onClick={applyFilters} className="btn btn-primary" style={{ padding: '10px 16px' }}>
            Go
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }} className="search-layout">
        {/* Filter Sidebar */}
        <aside className="glass-panel" style={{
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          alignSelf: 'start',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }} className="filters-sidebar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} /> Filters
            </h3>
            <button 
              onClick={handleClearFilters}
              style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <RefreshCcw size={12} /> Clear All
            </button>
          </div>

          <hr style={{ borderColor: 'var(--border-color)' }} />

          {/* Location city */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">City Location</label>
            <input
              type="text"
              placeholder="e.g. Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Property Type */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="form-select"
            >
              <option value="">Any Type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Budget Range (₹)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px' }}
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px' }}
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Bedrooms</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="form-select"
            >
              <option value="">Any capacity</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </div>

          {/* Bathrooms */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Bathrooms</label>
            <select
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="form-select"
            >
              <option value="">Any capacity</option>
              <option value="1">1 Bathroom</option>
              <option value="2">2 Bathrooms</option>
              <option value="3">3+ Bathrooms</option>
            </select>
          </div>

          {/* Furnishing */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Furnishing</label>
            <select
              value={furnished}
              onChange={(e) => setFurnished(e.target.value)}
              className="form-select"
            >
              <option value="">Any status</option>
              <option value="yes">Fully Furnished</option>
              <option value="no">Unfurnished</option>
              <option value="semi">Semi-Furnished</option>
            </select>
          </div>

          {/* Amenities checklist checkboxes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={parking}
                onChange={(e) => setParking(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              Parking Available
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={petsAllowed}
                onChange={(e) => setPetsAllowed(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              Pets Allowed
            </label>
          </div>

          <button onClick={applyFilters} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Apply Filter
          </button>
        </aside>

        {/* Results Catalog */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Sorting Option & Toggle Filter Header */}
          <div className="glass-panel" style={{
            padding: '12px 20px',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
              Showing {properties.length} of {pagination.total} listings
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)' }} />
              <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Sort By:</label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  const newParams = new URLSearchParams(searchParams);
                  if (e.target.value) newParams.set('sort', e.target.value);
                  else newParams.delete('sort');
                  setSearchParams(newParams);
                }}
                className="form-select"
                style={{ padding: '4px 28px 4px 12px', width: 'auto', height: '32px', fontSize: '13px' }}
              >
                <option value="">Newest First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="views">Popularity (Views)</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="properties-grid">
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </div>
          ) : properties.length === 0 ? (
            <div className="glass-card" style={{ padding: '80px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              <div style={{ fontSize: '48px' }}>🔍</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700 }}>No Listings Match Your Filters</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '14px', lineHeight: '1.6' }}>
                We couldn't find any approved houses matching your search. Try resetting location keywords or widening the budget boundaries.
              </p>
              <button onClick={handleClearFilters} className="btn btn-secondary">
                Reset Searches
              </button>
            </div>
          ) : (
            <>
              <div className="properties-grid">
                {properties.map((property) => (
                  <PropertyCard 
                    key={property._id} 
                    property={property} 
                    isWishlisted={wishlistIds.has(property._id)}
                    onWishlistToggle={handleWishlistToggle}
                  />
                ))}
              </div>

              {/* Pagination Row */}
              {pagination.pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
                  {/* Prev page */}
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="theme-toggle-btn"
                    style={{ borderRadius: '8px', width: '36px', height: '36px', opacity: pagination.page === 1 ? 0.5 : 1 }}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Page numbers */}
                  {[...Array(pagination.pages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    const isCurrent = pageNum === pagination.page;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '14px',
                          backgroundColor: isCurrent ? 'var(--primary)' : 'var(--bg-secondary)',
                          color: isCurrent ? '#ffffff' : 'var(--text-primary)',
                          border: '1px solid ' + (isCurrent ? 'var(--primary)' : 'var(--border-color)')
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next page */}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="theme-toggle-btn"
                    style={{ borderRadius: '8px', width: '36px', height: '36px', opacity: pagination.page === pagination.pages ? 0.5 : 1 }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .search-layout {
            grid-template-columns: 1fr !important;
          }
          .filters-sidebar {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchResults;
