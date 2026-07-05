const Review = require('../models/Review');
const Property = require('../models/PropertySchema');

// @desc    Add review for a property
// @route   POST /api/reviews
// @access  Private (Tenant only)
exports.createReview = async (req, res) => {
  const { propertyId, rating, comment } = req.body;

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    // Check if property is approved
    if (property.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'You cannot review a listing that is not approved',
      });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      property: propertyId,
      user: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this property listing',
      });
    }

    const review = await Review.create({
      user: req.user.id,
      property: propertyId,
      rating: parseInt(rating),
      comment,
    });

    // Populate review details to send back
    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name profileImage'
    );

    res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      data: populatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating review',
    });
  }
};

// @desc    Get all reviews for a property
// @route   GET /api/reviews/property/:id
// @access  Public
exports.getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.id })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching property reviews',
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner of review or Admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Verify review owner or Admin status
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You cannot delete this review.',
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting review',
    });
  }
};
