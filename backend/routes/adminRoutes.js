const express = require('express');
const router = express.Router();

const {
  getAnalytics,
  getAllUsers,
  getAllProperties,
  updateUserRole,
  updatePropertyStatus,
} = require('../controllers/adminController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// Analytics and Admin Management
router.get('/admin/analytics', protect, authorize('admin'), getAnalytics);
router.get('/admin/users', protect, authorize('admin'), getAllUsers);
router.get('/admin/properties', protect, authorize('admin'), getAllProperties);
router.put('/admin/users/:id/role', protect, authorize('admin'), updateUserRole);
router.put('/admin/properties/:id/status', protect, authorize('admin'), updatePropertyStatus);

module.exports = router;
