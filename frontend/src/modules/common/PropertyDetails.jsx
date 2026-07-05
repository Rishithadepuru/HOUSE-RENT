import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { PropertyDetailsSkeleton } from '../../components/SkeletonLoader';
import PropertyCard from '../../components/PropertyCard';
import {
  MapPin,
  Calendar,
  Clock,
  Send,
  Star,
  ShieldCheck,
  User,
  ExternalLink,
  Info,
  CheckCircle,
  Sparkles,
  Phone,
  Mail,
  Locate,
  BookOpen
} from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Core States
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Image index
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Visit Booking Form state
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [visitMessage, setVisitMessage] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Review Form state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Inquiry Form state
  const [inquiryName, setInquiryName] = useState(user ? user.name : '');
  const [inquiryEmail, setInquiryEmail] = useState(user ? user.email : '');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState('');

  // Fetch Property Details
  useEffect(() => {
    const fetchPropertyData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/properties/${id}`);
        if (response.data.success) {
          setProperty(response.data.data);
          setReviews(response.data.reviews || []);
          setActiveImgIdx(0);

          // Fetch similar properties of same type or city
          const similarResponse = await api.get('/properties', {
            params: {
              city: response.data.data.city,
              propertyType: response.data.data.propertyType,
              limit: 3
            }
          });
          if (similarResponse.data.success) {
            // Exclude current property from suggestions
            const filtered = similarResponse.data.data.filter((p) => p._id !== id);
            setSimilarProperties(filtered);
          }
        }
      } catch (error) {
        console.error('Error fetching property detail:', error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyData();
  }, [id]);

  if (loading) {
    return <PropertyDetailsSkeleton />;
  }

  if (!property) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '16px' }}>Listing Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          The property listing you are trying to view does not exist or has been deleted.
        </p>
        <Link to="/search" className="btn btn-primary">
          Return to Catalog
        </Link>
      </div>
    );
  }

  // Handle Booking scheduling
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to book a property visit.');
      navigate('/login');
      return;
    }

    if (user.role !== 'tenant') {
      setBookingError('Only Tenants can request property visits.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess('');

    try {
      const response = await api.post('/bookings', {
        propertyId: property._id,
        visitDate,
        visitTime,
        message: visitMessage
      });

      if (response.data.success) {
        setBookingSuccess(response.data.message);
        setVisitDate('');
        setVisitMessage('');
      }
    } catch (error) {
      setBookingError(error.response?.data?.message || 'Failed to submit visit request.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Handle Review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit reviews.');
      navigate('/login');
      return;
    }

    if (user.role !== 'tenant') {
      setReviewError('Only Tenants who have rented/viewed this property can submit reviews.');
      return;
    }

    setReviewError('');
    setReviewSuccess('');

    try {
      const response = await api.post('/reviews', {
        propertyId: property._id,
        rating: userRating,
        comment: userComment
      });

      if (response.data.success) {
        setReviewSuccess(response.data.message);
        setReviews([response.data.data, ...reviews]);
        setUserComment('');
      }
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Failed to post review. You might have already reviewed this listing.');
    }
  };

  // Handle simulated email Inquiry
  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySuccess('Inquiry message successfully transmitted to landlord! They will reach out via email/phone.');
    setInquiryMessage('');
  };

  const getImageUrl = (img) => {
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  const calculateAvgRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Simulated Nearby Places
  const nearbyPlaces = [
    { type: 'Metro Station', name: 'Downtown Central Line', distance: '0.4 km' },
    { type: 'School', name: 'Valley View International School', distance: '1.2 km' },
    { type: 'Supermarket', name: 'HyperCity Megamart', distance: '0.8 km' },
    { type: 'Hospital', name: 'St. Jude Specialty Hospital', distance: '2.5 km' }
  ];

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
        <div>
          <span className="badge badge-approved" style={{ marginBottom: '8px' }}>{property.propertyType}</span>
          <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px', lineHeight: '1.2' }}>{property.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <MapPin size={16} style={{ color: 'var(--primary)' }} />
            <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{property.address}, {property.city}, {property.state}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}>
          <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)' }}>₹{property.price.toLocaleString('en-IN')}</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>monthly rental pricing</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
        <div style={{
          height: '480px',
          width: '100%',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)'
        }} className="main-image-container">
          <img
            src={getImageUrl(property.images[activeImgIdx] || '')}
            alt={property.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {property.images.length > 1 && (
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {property.images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImgIdx(idx)}
                style={{
                  width: '120px',
                  height: '80px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: `3px solid ${idx === activeImgIdx ? 'var(--primary)' : 'transparent'}`,
                  transition: 'border var(--transition-fast)'
                }}
              >
                <img src={getImageUrl(img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Details vs Booking Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }} className="details-layout">
        
        {/* Left Side: Descriptions, Amenities, Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Key Specs Panel */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            textAlign: 'center'
          }} className="property-specs">
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700 }}>BEDROOMS</div>
              <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>{property.bedrooms}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700 }}>BATHROOMS</div>
              <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>{property.bathrooms}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700 }}>AREA SIZE</div>
              <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>{property.area} sqft</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700 }}>FURNISHED</div>
              <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px', textTransform: 'capitalize' }}>{property.furnished}</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>About This Home</h2>
            <p style={{
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              fontSize: '15px',
              whiteSpace: 'pre-line'
            }}>
              {property.description}
            </p>
          </div>

          {/* Amenities checklist */}
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>Property Amenities</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px'
            }} className="amenities-list">
              {property.amenities.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
                  <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Virtual Tour Support */}
          {property.virtualTourUrl && (
            <div className="glass-panel" style={{
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(79, 70, 229, 0.08) 100%)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} style={{ color: 'var(--accent)' }} /> 3D Virtual Tour Available
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                  Walk through the corridors of this penthouse digitally right now.
                </p>
              </div>
              <a
                href={property.virtualTourUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent"
                style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '8px' }}
              >
                Launch Tour <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Location Map Preview */}
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>Location Map</h2>
            <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                height: '240px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid var(--border-color)'
              }}>
                {/* SVG Mock Map Grid */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  opacity: 0.15,
                  backgroundImage: 'radial-gradient(var(--text-primary) 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }} />
                
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 2,
                  animation: 'pulse 2s infinite'
                }}>
                  <Locate size={20} />
                </div>
                <div style={{ zIndex: 2, textAlign: 'center', padding: '0 20px' }}>
                  <h4 style={{ fontWeight: 700 }}>Map Location Locked</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'capitalize' }}>
                    {property.address}, {property.city}
                  </p>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address + ' ' + property.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Google Maps <ExternalLink size={12} />
                </a>
              </div>

              {/* Nearby list */}
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Nearby Amenities & Points of Interest</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="nearby-grid">
                  {nearbyPlaces.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '13px' }}>
                      <span style={{ fontWeight: 700 }} className="gradient-text">{item.type}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{item.name} ({item.distance})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border-color)' }} />

          {/* Reviews & Ratings */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Reviews ({reviews.length})</h2>
              {reviews.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <Star size={18} style={{ color: 'var(--warning)', fill: 'var(--warning)' }} />
                  <span>{calculateAvgRating()} out of 5 stars</span>
                </div>
              )}
            </div>

            {/* List Reviews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  No reviews have been written for this property listing yet.
                </p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '12px'
                        }}>
                          {rev.user.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>{rev.user.name}</span>
                      </div>
                      
                      {/* Star Rating display */}
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            style={{
                              color: 'var(--warning)',
                              fill: i < rev.rating ? 'var(--warning)' : 'transparent'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Review Form (Tenants only) */}
            {(!user || user.role === 'tenant') && (
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Submit Your Rating & Review</h3>
                
                {reviewSuccess && <div className="alert alert-success" style={{ fontSize: '14px' }}>{reviewSuccess}</div>}
                {reviewError && <div className="alert alert-danger" style={{ fontSize: '14px' }}>{reviewError}</div>}

                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Score Rating</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setUserRating(val)}
                          style={{ color: 'var(--warning)' }}
                        >
                          <Star size={24} fill={val <= userRating ? 'var(--warning)' : 'transparent'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Review Comment</label>
                    <textarea
                      placeholder="Share your experience renting or visiting this house..."
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      className="form-input"
                      style={{ minHeight: '100px', resize: 'vertical' }}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'start', padding: '10px 20px', fontSize: '14px' }}>
                    Post Review
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Visit Scheduler & Direct Inquiry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Visit Booking Form Card */}
          <div className="glass-card" style={{ padding: '24px', border: '1.5px solid var(--primary-light)', boxShadow: 'var(--shadow-xl)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={18} style={{ color: 'var(--primary)' }} /> Schedule a Visit
            </h3>

            {bookingSuccess && <div className="alert alert-success" style={{ fontSize: '13px', padding: '10px' }}>{bookingSuccess}</div>}
            {bookingError && <div className="alert alert-danger" style={{ fontSize: '13px', padding: '10px' }}>{bookingError}</div>}

            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Select Date</label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]} // cannot book past dates
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Time Slot</label>
                <select
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  className="form-select"
                >
                  <option value="09:00 AM">09:00 AM - 11:00 AM</option>
                  <option value="11:00 AM">11:00 AM - 01:00 PM</option>
                  <option value="01:00 PM">01:00 PM - 03:00 PM</option>
                  <option value="03:00 PM">03:00 PM - 05:00 PM</option>
                  <option value="05:00 PM">05:00 PM - 07:00 PM</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Introduce Yourself</label>
                <textarea
                  placeholder="Tell the owner when you can visit or ask specific questions..."
                  value={visitMessage}
                  onChange={(e) => setVisitMessage(e.target.value)}
                  className="form-input"
                  style={{ minHeight: '80px', resize: 'vertical', fontSize: '13px' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Submitting...' : 'Request Tour Visit'}
              </button>
            </form>
          </div>

          {/* Landlord/Owner Info Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={18} style={{ color: 'var(--primary)' }} /> Listed By Landlord
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              {property.owner.profileImage ? (
                <img 
                  src={`http://localhost:5000${property.owner.profileImage}`} 
                  alt={property.owner.name} 
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  {property.owner.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{property.owner.name}</h4>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified Landlord</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} style={{ color: 'var(--primary)' }} /> {property.owner.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} style={{ color: 'var(--primary)' }} /> {property.owner.email}
              </div>
            </div>

            <hr style={{ borderColor: 'var(--border-color)', marginBottom: '20px' }} />

            {/* Direct inquiry form */}
            <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700 }}>Send Direct Inquiry</h4>
              
              {inquirySuccess && <div className="alert alert-success" style={{ fontSize: '11px', padding: '8px' }}>{inquirySuccess}</div>}

              <input
                type="text"
                placeholder="Your Name"
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '13px' }}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={inquiryEmail}
                onChange={(e) => setInquiryEmail(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '13px' }}
                required
              />
              <textarea
                placeholder="Type your message here..."
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                className="form-input"
                style={{ minHeight: '60px', resize: 'vertical', fontSize: '13px', padding: '8px 12px' }}
                required
              />
              <button type="submit" className="btn btn-secondary" style={{ width: '100%', fontSize: '12px', padding: '8px', display: 'flex', gap: '4px' }}>
                <Send size={12} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <section style={{ marginTop: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>Similar Listings in {property.city}</h2>
          <div className="properties-grid">
            {similarProperties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        </section>
      )}

      {/* Keyframes pulse animation injection */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
        }
        @media (max-width: 900px) {
          .details-layout {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .property-specs {
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
          }
          .amenities-list {
            grid-template-columns: 1fr 1fr !important;
          }
          .nearby-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;
