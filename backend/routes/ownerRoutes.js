const express = require('express');
const router = Router = express.Router();

const {
  createProperty,
  getLandlordProperties,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
} = require('../controllers/ownerController');

const {
  getLandlordBookings,
  updateBookingStatus,
} = require('../controllers/ownerController');

const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Landlord/Owner Property management
router.post('/properties', protect, authorize('landlord', 'admin'), createProperty);
router.get('/properties/my-listings/all', protect, authorize('landlord', 'admin'), getLandlordProperties);
router.put('/properties/:id', protect, authorize('landlord', 'admin'), updateProperty);
router.delete('/properties/:id', protect, authorize('landlord', 'admin'), deleteProperty);
router.post(
  '/properties/:id/images',
  protect,
  authorize('landlord', 'admin'),
  upload.array('images', 10),
  uploadPropertyImages
);

// Landlord/Owner Booking request management
router.get('/bookings/landlord', protect, authorize('landlord', 'admin'), getLandlordBookings);
router.put('/bookings/:id', protect, authorize('landlord', 'admin'), updateBookingStatus);

module.exports = router;
