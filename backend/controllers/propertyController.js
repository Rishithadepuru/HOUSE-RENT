const Property = require('../models/PropertySchema');
const Review = require('../models/Review');

// @desc    Get all properties (Public search with filtering & pagination)
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    const query = { status: 'approved' }; // Only show approved listings publicly

    // Filtering Options
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { city: { $regex: req.query.search, $options: 'i' } },
        { address: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    if (req.query.city) {
      query.city = req.query.city.toLowerCase().trim();
    }

    if (req.query.state) {
      query.state = req.query.state.toLowerCase().trim();
    }

    if (req.query.propertyType) {
      query.propertyType = req.query.propertyType.toLowerCase();
    }

    if (req.query.bedrooms) {
      query.bedrooms = parseInt(req.query.bedrooms);
    }

    if (req.query.bathrooms) {
      query.bathrooms = parseInt(req.query.bathrooms);
    }

    if (req.query.furnished) {
      query.furnished = req.query.furnished.toLowerCase();
    }

    if (req.query.parking) {
      query.parking = req.query.parking === 'true';
    }

    if (req.query.petsAllowed) {
      query.petsAllowed = req.query.petsAllowed === 'true';
    }

    // Budget range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseInt(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseInt(req.query.maxPrice);
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    // Sorting
    let sortBy = { createdAt: -1 }; // default: newest first
    if (req.query.sort) {
      if (req.query.sort === 'priceAsc') sortBy = { price: 1 };
      else if (req.query.sort === 'priceDesc') sortBy = { price: -1 };
      else if (req.query.sort === 'views') sortBy = { views: -1 };
    }

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone profileImage')
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: properties.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching listings',
    });
  }
};

// @desc    Get top featured properties
// @route   GET /api/properties/featured
// @access  Public
exports.getFeaturedProperties = async (req, res) => {
  try {
    // Return properties with status approved sorted by views/newest limit to 6
    const properties = await Property.find({ status: 'approved' })
      .populate('owner', 'name email phone profileImage')
      .sort({ views: -1, createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching featured listings',
    });
  }
};

// @desc    Get single property details & track views
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res) => {
  try {
    // Find property and update views
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('owner', 'name email phone profileImage');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    // Get reviews associated with this property
    const reviews = await Review.find({ property: req.params.id }).populate(
      'user',
      'name profileImage'
    );

    res.status(200).json({
      success: true,
      data: property,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching property details',
    });
  }
};

// @desc    Create new property listing
// @route   POST /api/properties
// @access  Private (Landlord or Admin)
exports.createProperty = async (req, res) => {
  try {
    // Add owner reference
    req.body.owner = req.user.id;

    // Normalize city and state for indexing
    if (req.body.city) req.body.city = req.body.city.toLowerCase().trim();
    if (req.body.state) req.body.state = req.body.state.toLowerCase().trim();

    // Default status is pending, unless created by Admin (auto-approve)
    if (req.user.role === 'admin') {
      req.body.status = 'approved';
    } else {
      req.body.status = 'pending';
    }

    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Property listing submitted successfully! Pending approval from Administrator.',
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating listing',
    });
  }
};

// @desc    Update property listing
// @route   PUT /api/properties/:id
// @access  Private (Owner or Admin)
exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    // Verify ownership or admin status
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You are not authorized to update this listing.',
      });
    }

    // Normalize city/state
    if (req.body.city) req.body.city = req.body.city.toLowerCase().trim();
    if (req.body.state) req.body.state = req.body.state.toLowerCase().trim();

    // If updated by landlord, reset approval status to pending
    if (req.user.role !== 'admin') {
      req.body.status = 'pending';
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: req.user.role === 'admin' 
        ? 'Property updated successfully!' 
        : 'Property updated successfully! Pending admin re-approval.',
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating property listing',
    });
  }
};

// @desc    Delete property listing
// @route   DELETE /api/properties/:id
// @access  Private (Owner or Admin)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    // Verify ownership or admin status
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You are not authorized to delete this listing.',
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Property listing deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting property listing',
    });
  }
};

// @desc    Upload multiple images for a property
// @route   POST /api/properties/:id/images
// @access  Private (Owner or Admin)
exports.uploadPropertyImages = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    // Verify ownership or admin status
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You are not authorized to edit this listing.',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image',
      });
    }

    // Append newly uploaded images paths
    const newImages = req.files.map((file) => `/uploads/${file.filename}`);
    property.images = [...property.images, ...newImages];
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully!',
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error uploading property images',
    });
  }
};

// @desc    Get listings owned by landlord
// @route   GET /api/properties/my-listings
// @access  Private (Landlord or Admin)
exports.getLandlordProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching owner listings',
    });
  }
};

// @desc    Get autocomplete search suggestions for cities
// @route   GET /api/properties/suggestions
// @access  Public
exports.getPropertySuggestions = async (req, res) => {
  try {
    const search = req.query.search || '';
    if (!search || search.length < 2) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Fetch distinct cities that are approved and match pattern
    const cities = await Property.distinct('city', {
      status: 'approved',
      city: { $regex: '^' + search, $options: 'i' },
    });

    // Make titles neat (capitalized)
    const suggestions = cities.map(
      (city) => city.charAt(0).toUpperCase() + city.slice(1)
    );

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching search suggestions',
    });
  }
};
