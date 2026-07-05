const User = require('../models/UserSchema');
const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');
const Review = require('../models/Review');

// @desc    Get Platform Analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
exports.getAnalytics = async (req, res) => {
  try {
    // Total Counts
    const totalUsers = await User.countDocuments();
    const landlordsCount = await User.countDocuments({ role: 'landlord' });
    const tenantsCount = await User.countDocuments({ role: 'tenant' });
    
    const totalProperties = await Property.countDocuments();
    const approvedProperties = await Property.countDocuments({ status: 'approved' });
    const pendingProperties = await Property.countDocuments({ status: 'pending' });
    const rejectedProperties = await Property.countDocuments({ status: 'rejected' });

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const approvedBookings = await Booking.countDocuments({ status: 'approved' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    const totalReviews = await Review.countDocuments();

    // Average price of properties
    const priceStats = await Property.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, avgPrice: { $avg: '$price' }, maxPrice: { $max: '$price' }, minPrice: { $min: '$price' } } }
    ]);

    const avgPrice = priceStats.length > 0 ? Math.round(priceStats[0].avgPrice) : 0;
    const maxPrice = priceStats.length > 0 ? priceStats[0].maxPrice : 0;
    const minPrice = priceStats.length > 0 ? priceStats[0].minPrice : 0;

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          landlords: landlordsCount,
          users: tenantsCount,   // DB role is 'tenant', display as 'users'
        },
        properties: {
          total: totalProperties,
          approved: approvedProperties,
          pending: pendingProperties,
          rejected: rejectedProperties,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          approved: approvedBookings,
          completed: completedBookings,
        },
        reviews: {
          total: totalReviews,
        },
        pricing: {
          average: avgPrice,
          maximum: maxPrice,
          minimum: minPrice,
        }
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error loading platform analytics',
    });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error loading user directory',
    });
  }
};

// @desc    Get all properties for moderation
// @route   GET /api/admin/properties
// @access  Private (Admin only)
exports.getAllProperties = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    const properties = await Property.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error loading properties catalog',
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!['tenant', 'landlord', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user role selected',
    });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from editing their own role to avoid locking themselves out
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own Administrative role',
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role for '${user.name}' updated to '${role}' successfully!`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error changing user role',
    });
  }
};

// @desc    Approve/Reject property listing
// @route   PUT /api/admin/properties/:id/status
// @access  Private (Admin only)
exports.updatePropertyStatus = async (req, res) => {
  const { status } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid property status selection',
    });
  }

  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    property.status = status;
    await property.save();

    res.status(200).json({
      success: true,
      message: `Listing status updated to '${status}' successfully!`,
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating property status',
    });
  }
};
