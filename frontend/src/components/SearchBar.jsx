import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Home, DollarSign, ArrowRight } from 'lucide-react';
import api from '../services/api';

const SearchBar = () => {
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);

  // Close suggestions box on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch suggestions when city input changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.trim().length >= 2) {
        try {
          const response = await api.get(`/properties/suggestions?search=${city}`);
          if (response.data.success) {
            setSuggestions(response.data.data);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error.message);
        }
      } else {
        setSuggestions([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [city]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (city.trim()) params.append('city', city.trim().toLowerCase());
    if (propertyType) params.append('propertyType', propertyType);
    if (maxPrice) params.append('maxPrice', maxPrice);

    navigate(`/search?${params.toString()}`);
  };

  const selectSuggestion = (val) => {
    setCity(val);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <form 
      onSubmit={handleSearchSubmit}
      className="glass-panel"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 24px',
        borderRadius: 'var(--radius-xl)',
        gap: '24px',
        width: '100%',
        maxWidth: '960px',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border-glass)',
        position: 'relative'
      }}
      className="search-bar-form"
    >
      {/* City/Location Input */}
      <div style={{ flex: 2, position: 'relative', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={12} style={{ color: 'var(--primary)' }} /> LOCATION
        </span>
        <input
          type="text"
          placeholder="Where are you looking?"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '15px',
            fontWeight: 600,
            padding: '4px 0',
            width: '100%'
          }}
        />

        {/* Suggestion Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="glass-panel"
            style={{
              position: 'absolute',
              top: 'calc(100% + 20px)',
              left: 0,
              width: '100%',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              zIndex: 99
            }}
          >
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => selectSuggestion(item)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                  transition: 'background var(--transition-fast)'
                }}
                className="suggestion-item"
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <MapPin size={14} style={{ marginRight: '8px', display: 'inline', color: 'var(--text-muted)' }} /> {item}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="search-divider" style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-color)' }} />

      {/* Property Type Input */}
      <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Home size={12} style={{ color: 'var(--primary)' }} /> TYPE
        </span>
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '15px',
            fontWeight: 600,
            padding: '4px 0',
            width: '100%',
            cursor: 'pointer'
          }}
        >
          <option value="">Any Property Type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="condo">Condo</option>
          <option value="villa">Villa</option>
          <option value="studio">Studio</option>
        </select>
      </div>

      <div className="search-divider" style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-color)' }} />

      {/* Max Budget Input */}
      <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <DollarSign size={12} style={{ color: 'var(--primary)' }} /> BUDGET
        </span>
        <select
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '15px',
            fontWeight: 600,
            padding: '4px 0',
            width: '100%',
            cursor: 'pointer'
          }}
        >
          <option value="">Max Monthly Rent</option>
          <option value="3000">Under ₹3,000</option>
          <option value="6000">Under ₹6,000</option>
          <option value="9000">Under ₹9,000</option>
          <option value="12000">Under ₹12,000</option>
          <option value="15000">Under ₹15,000</option>
        </select>
      </div>

      {/* Search Action Button */}
      <button 
        type="submit" 
        className="btn btn-primary"
        style={{
          borderRadius: 'var(--radius-md)',
          padding: '14px 28px',
          whiteSpace: 'nowrap'
        }}
      >
        Search <ArrowRight size={18} />
      </button>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 768px) {
          .search-bar-form {
            flex-direction: column !important;
            padding: 24px !important;
            gap: 20px !important;
            border-radius: var(--radius-lg) !important;
          }
          .search-divider {
            display: none !important;
          }
          .search-bar-form > div {
            width: 100% !important;
          }
          .search-bar-form button {
            width: 100% !important;
          }
        }
      `}</style>
    </form>
  );
};

export default SearchBar;
