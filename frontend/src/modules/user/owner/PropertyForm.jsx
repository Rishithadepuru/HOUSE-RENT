import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Upload, Save, X, AlertTriangle } from 'lucide-react';

const PropertyForm = ({ editMode, editingProperty, closeForm, loadDashboardData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [price, setPrice] = useState('');
  const [propertyType, setPropertyType] = useState('apartment');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [area, setArea] = useState('');
  const [furnished, setFurnished] = useState('no');
  const [parking, setParking] = useState(false);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [virtualTourUrl, setVirtualTourUrl] = useState('');
  const [amenitiesText, setAmenitiesText] = useState('WiFi, AC, Security');

  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    if (editMode && editingProperty) {
      setTitle(editingProperty.title);
      setDescription(editingProperty.description);
      setAddress(editingProperty.address);
      setCity(editingProperty.city);
      setState(editingProperty.state);
      setPrice(editingProperty.price);
      setPropertyType(editingProperty.propertyType);
      setBedrooms(editingProperty.bedrooms.toString());
      setBathrooms(editingProperty.bathrooms.toString());
      setArea(editingProperty.area.toString());
      setFurnished(editingProperty.furnished);
      setParking(editingProperty.parking);
      setPetsAllowed(editingProperty.petsAllowed);
      setVirtualTourUrl(editingProperty.virtualTourUrl);
      setAmenitiesText(editingProperty.amenities.join(', '));
    }
  }, [editMode, editingProperty]);

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const amenities = amenitiesText.split(',').map((item) => item.trim()).filter((item) => item.length > 0);

    const payload = {
      title,
      description,
      address,
      city,
      state,
      price: parseInt(price),
      propertyType,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      area: parseInt(area),
      furnished,
      parking,
      petsAllowed,
      virtualTourUrl,
      amenities
    };

    try {
      if (editMode) {
        const response = await api.put(`/properties/${editingProperty._id}`, payload);
        if (response.data.success) {
          setFormSuccess(response.data.message);
          if (imageFiles.length > 0) {
            await uploadPropertyImages(editingProperty._id);
          }
          setTimeout(() => {
            closeForm();
            loadDashboardData();
          }, 2000);
        }
      } else {
        const response = await api.post('/properties', payload);
        if (response.data.success) {
          const newPropertyId = response.data.data._id;
          setFormSuccess(response.data.message);
          if (imageFiles.length > 0) {
            await uploadPropertyImages(newPropertyId);
          }
          setTimeout(() => {
            closeForm();
            loadDashboardData();
          }, 2000);
        }
      }
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to submit property listing details.');
    }
  };

  const uploadPropertyImages = async (propertyId) => {
    setUploadingImages(true);
    const formData = new FormData();
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('images', imageFiles[i]);
    }

    try {
      await api.post(`/properties/${propertyId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadSuccess('Listing images uploaded successfully!');
    } catch (error) {
      console.error('Image upload failed:', error.message);
      setFormError('Property details saved, but image uploads failed.');
    } finally {
      setUploadingImages(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800 }}>
          {editMode ? 'Edit Property Details' : 'Add Property Listing'}
        </h2>
        <button onClick={closeForm} className="theme-toggle-btn">
          <X size={20} />
        </button>
      </div>

      {formError && <div className="alert alert-danger">{formError}</div>}
      {formSuccess && <div className="alert alert-success">{formSuccess}</div>}

      <form onSubmit={handlePropertySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Title */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Property Listing Title</label>
          <input
            type="text"
            placeholder="e.g. Modern Penthouse with Rooftop Deck"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            required
          />
        </div>

        {/* Description */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Listing Description</label>
          <textarea
            placeholder="Provide details about rooms, neighborhood amenities, water/electricity status, transport access..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            style={{ minHeight: '120px', resize: 'vertical' }}
            required
          />
        </div>

        {/* Address, City, State */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 2, minWidth: '200px', margin: 0 }}>
            <label className="form-label">Street Address</label>
            <input
              type="text"
              placeholder="e.g. 404 Elm Street, Flat 20"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: '150px', margin: 0 }}>
            <label className="form-label">City Location</label>
            <input
              type="text"
              placeholder="e.g. Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: '150px', margin: 0 }}>
            <label className="form-label">State Name</label>
            <input
              type="text"
              placeholder="e.g. Maharashtra"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Price, Type, Area */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '150px', margin: 0 }}>
            <label className="form-label">Monthly Rent (₹)</label>
            <input
              type="number"
              placeholder="e.g. 10000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: '150px', margin: 0 }}>
            <label className="form-label">Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="form-select"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: '150px', margin: 0 }}>
            <label className="form-label">Property Area (sqft)</label>
            <input
              type="number"
              placeholder="e.g. 1500"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Capacity configurations */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '120px', margin: 0 }}>
            <label className="form-label">Bedrooms</label>
            <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="form-select">
              <option value="1">1 Bed</option>
              <option value="2">2 Beds</option>
              <option value="3">3 Beds</option>
              <option value="4">4+ Beds</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: '120px', margin: 0 }}>
            <label className="form-label">Bathrooms</label>
            <select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="form-select">
              <option value="1">1 Bath</option>
              <option value="2">2 Baths</option>
              <option value="3">3+ Baths</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: '150px', margin: 0 }}>
            <label className="form-label">Furnishing Status</label>
            <select value={furnished} onChange={(e) => setFurnished(e.target.value)} className="form-select">
              <option value="no">Unfurnished</option>
              <option value="semi">Semi-Furnished</option>
              <option value="yes">Fully Furnished</option>
            </select>
          </div>
        </div>

        {/* Amenities String */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Listing Amenities (comma-separated)</label>
          <input
            type="text"
            value={amenitiesText}
            onChange={(e) => setAmenitiesText(e.target.value)}
            className="form-input"
            placeholder="e.g. WiFi, Air Conditioning, Gym, Swimming Pool, Parking, Power Backup"
          />
        </div>

        {/* Checkboxes, Virtual Tour URL */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', fontWeight: 600 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={parking}
                onChange={(e) => setParking(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              Dedicated Parking Spot
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={petsAllowed}
                onChange={(e) => setPetsAllowed(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              Pets Welcomed
            </label>
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: '240px', margin: 0 }}>
            <label className="form-label">3D Virtual Tour URL (Optional)</label>
            <input
              type="url"
              placeholder="e.g. https://my.matterport.com/show/?m=..."
              value={virtualTourUrl}
              onChange={(e) => setVirtualTourUrl(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {/* Image Upload Input */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Property Photos (Optional)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <label className="btn btn-secondary" style={{ display: 'inline-flex', cursor: 'pointer', margin: 0, padding: '10px 16px', fontSize: '13px' }}>
              <Upload size={16} /> Choose Image Files
              <input
                type="file"
                onChange={(e) => setImageFiles(Array.from(e.target.files))}
                style={{ display: 'none' }}
                accept="image/*"
                multiple
              />
            </label>
            {imageFiles.length > 0 && (
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {imageFiles.length} file(s) selected
              </span>
            )}
            {uploadSuccess && <span style={{ fontSize: '13px', color: 'var(--success)', fontWeight: 600 }}>{uploadSuccess}</span>}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          padding: '12px 16px',
          borderRadius: '8px',
          color: 'var(--warning)',
          fontSize: '13px',
          fontWeight: 600,
          marginTop: '10px'
        }}>
          <AlertTriangle size={16} />
          <span>NOTE: Creating or editing details resets listing status to 'pending' for Administrative audit.</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '12px 24px' }}
            disabled={uploadingImages}
          >
            <Save size={18} /> {editMode ? 'Update Listing Details' : 'Publish Property Listing'}
          </button>
          <button 
            type="button" 
            onClick={closeForm}
            className="btn btn-secondary"
            style={{ padding: '12px 24px' }}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default PropertyForm;
