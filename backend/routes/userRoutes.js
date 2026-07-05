const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const {
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');

const {
  getWishlist,
  toggleWishlistItem,
} = require('../controllers/wishlistController');

const {
  createReview,
  getPropertyReviews,
  deleteReview,
} = require('../controllers/reviewController');

const {
  createBooking,
  getTenantBookings,
} = require('../controllers/bookingController');

const {
  getProperties,
  getFeaturedProperties,
  getPropertySuggestions,
  getProperty,
} = require('../controllers/propertyController');

const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', protect, getMe);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password/:token', resetPassword);

// User Profile Routes
router.get('/users/profile', protect, getUserProfile);
router.put('/users/profile', protect, upload.single('profileImage'), updateUserProfile);

// Wishlist Routes
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/toggle', protect, toggleWishlistItem);

// Review Routes
router.post('/reviews', protect, authorize('tenant'), createReview);
router.get('/reviews/property/:id', getPropertyReviews);
router.delete('/reviews/:id', protect, deleteReview);

// Booking Routes for Tenant/User
router.post('/bookings', protect, authorize('tenant'), createBooking);
router.get('/bookings/tenant', protect, authorize('tenant'), getTenantBookings);
router.get('/bookings/user', protect, authorize('tenant'), getTenantBookings);

// Public Property Routes
router.get('/properties', getProperties);
router.get('/properties/featured', getFeaturedProperties);
router.get('/properties/suggestions', getPropertySuggestions);
router.get('/properties/:id', getProperty);

module.exports = router;
