import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import SearchBar from '../../components/SearchBar';
import PropertyCard from '../../components/PropertyCard';
import { PropertyCardSkeleton } from '../../components/SkeletonLoader';
import { 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Building2, 
  Clock, 
  Users, 
  ArrowRight,
  BookmarkCheck
} from 'lucide-react';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/properties/featured');
        if (response.data.success) {
          setFeatured(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching featured listings:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const popularLocations = [
    { name: 'Mumbai', count: '140+ Properties', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80' },
    { name: 'Bangalore', count: '90+ Properties', img: 'https://images.unsplash.com/photo-1590647180371-d68a9f6bd10f?auto=format&fit=crop&w=400&q=80' },
    { name: 'Delhi', count: '65+ Properties', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80' }
  ];

  return (
    <div style={{ position: 'relative' }}>
      {/* Background Hero Blurs */}
      <div className="hero-glow" style={{ top: '10%', left: '10%' }} />
      <div className="hero-glow" style={{ top: '40%', right: '5%', background: 'var(--accent-light)' }} />

      {/* Hero Section */}
      <section style={{
        padding: '120px 0 80px 0',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>
        <div className="container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          {/* Tagline Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: 700,
            border: '1px solid rgba(79, 70, 229, 0.15)'
          }}>
            <Sparkles size={14} /> The Elite Standard of House Rental Platforms
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: '64px',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            maxWidth: '850px',
            lineHeight: '1.15',
            marginBottom: '10px'
          }} className="hero-title">
            Find Your Next <span className="gradient-text">Dream Sanctuary</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '18px',
            maxWidth: '620px',
            lineHeight: '1.6',
            marginBottom: '32px'
          }}>
            Explore premium houses, luxury apartments, and cozy studios verified by our quality control experts. Rent with zero hassle.
          </p>

          {/* Global Search Bar */}
          <SearchBar />
        </div>
      </section>

      {/* Popular Locations */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Destinations
              </span>
              <h2 style={{ fontSize: '32px', fontWeight: 800, marginTop: '4px' }}>Explore Popular Locations</h2>
            </div>
            <Link to="/search" style={{ fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All Locations <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '30px'
          }} className="locations-grid">
            {popularLocations.map((loc, idx) => (
              <Link 
                to={`/search?city=${loc.name.toLowerCase()}`}
                key={idx}
                className="glass-card"
                style={{
                  position: 'relative',
                  height: '240px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '24px'
                }}
              >
                <img 
                  src={loc.img} 
                  alt={loc.name} 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 1,
                    transition: 'transform var(--transition-slow)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(9,13,22,0.85) 100%)',
                  zIndex: 2
                }} />
                
                <div style={{ position: 'relative', zIndex: 3, color: '#fff' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>{loc.name}</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>{loc.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section style={{ padding: '60px 0', backgroundColor: 'var(--bg-secondary)', transition: 'background var(--transition-normal)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Handpicked
              </span>
              <h2 style={{ fontSize: '32px', fontWeight: 800, marginTop: '4px' }}>Featured Listings</h2>
            </div>
            <Link to="/search" style={{ fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Explore More Listings <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="properties-grid">
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </div>
          ) : featured.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No featured properties are currently listed. Please seed the database.</p>
            </div>
          ) : (
            <div className="properties-grid">
              {featured.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Benefits
          </span>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginTop: '4px', marginBottom: '48px' }}>
            Why Renters Trust HouseHunt
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '30px'
          }} className="features-grid">
            <div className="glass-card" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700 }}>100% Verified Listings</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Every house is carefully vetted by our inspectors. We match photographs, title ownerships, and physical addresses.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Premium Virtual Tours</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Tour listings virtually with high-definition digital walks. Make informed decisions before booking physical visits.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Schedule Visits Instantly</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Book visits directly on landlord calendars with a click. Confirm timings and coordinate via chat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Counter */}
      <section style={{
        padding: '60px 0',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '40px',
            textAlign: 'center'
          }} className="stats-container">
            <div>
              <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--primary)' }}>12,000+</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>Happy Tenants</div>
            </div>
            <div style={{ width: '1px', height: '50px', backgroundColor: 'var(--border-color)' }} className="stats-divider" />
            <div>
              <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--primary)' }}>2,500+</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>Verified Properties</div>
            </div>
            <div style={{ width: '1px', height: '50px', backgroundColor: 'var(--border-color)' }} className="stats-divider" />
            <div>
              <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--primary)' }}>99%</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Reviews
          </span>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginTop: '4px', marginBottom: '48px' }}>
            What Our Community Says
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '30px'
          }} className="testimonials-grid">
            <div className="glass-card" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.6' }}>
                "HouseHunt completely changed my house rental search experience. I managed to locate a luxury apartment in Mumbai, schedule a tour, and sign the agreements in just under 4 days. The dark theme is very soothing too!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)'
                }} />
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Rohan Sharma</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tenant, Mumbai</span>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.6' }}>
                "As a property owner, verifying documents and managing tenant visits was always a nightmare. HouseHunt automated listings approvals and visitor queries seamlessly. I filled both of my villas in Bangalore in two weeks!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
                }} />
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Preeti Hegde</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Landlord, Bangalore</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section style={{ padding: '80px 0 100px 0' }}>
        <div className="container">
          <div className="glass-panel" style={{
            padding: '60px 40px',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)',
            border: '1px solid var(--border-glass)'
          }}>
            <h2 style={{ fontSize: '38px', fontWeight: 800, maxWidth: '600px' }}>
              Ready to List or Discover Your Next Space?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '500px', lineHeight: '1.6' }}>
              Join thousands of tenants and property owners managing leases seamlessly on our premium platform.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/search" className="btn btn-primary">
                Browse Properties <ArrowRight size={18} />
              </Link>
              <Link to="/register?role=landlord" className="btn btn-secondary">
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CSS adjustments for responsive home page */}
      <style>{`
        @media (max-width: 900px) {
          .hero-title {
            font-size: 48px !important;
          }
        }
        @media (max-width: 768px) {
          .locations-grid, .features-grid, .testimonials-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .stats-container {
            flex-direction: column !important;
            gap: 24px !important;
          }
          .stats-divider {
            display: none !important;
          }
          .hero-title {
            font-size: 38px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
