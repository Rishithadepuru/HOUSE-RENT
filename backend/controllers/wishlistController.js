const Wishlist = require('../models/Wishlist');
const Property = require('../models/PropertySchema');

// @desc    Get logged in user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
      path: 'properties',
      populate: {
        path: 'owner',
        select: 'name email phone',
      },
    });

    // Create empty wishlist if it doesn't exist for some reason
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, properties: [] });
    }

    res.status(200).json({
      success: true,
      data: wishlist.properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching wishlist',
    });
  }
};

// @desc    Add or Remove property from wishlist (Toggle)
// @route   POST /api/wishlist/toggle
// @access  Private
exports.toggleWishlistItem = async (req, res) => {
  const { propertyId } = req.body;

  try {
    // Validate property existence
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, properties: [] });
    }

    const index = wishlist.properties.indexOf(propertyId);
    let message = '';

    if (index > -1) {
      // Remove if exists
      wishlist.properties.splice(index, 1);
      message = 'Property removed from saved wishlist successfully!';
    } else {
      // Add if not exists
      wishlist.properties.push(propertyId);
      message = 'Property saved to wishlist successfully!';
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      message,
      data: wishlist.properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error toggling wishlist item',
    });
  }
};
