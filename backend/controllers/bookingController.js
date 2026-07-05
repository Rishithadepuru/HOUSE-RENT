const Booking = require('../models/BookingSchema');
const Property = require('../models/PropertySchema');

// @desc    Request a property visit (Book Visit)
// @route   POST /api/bookings
// @access  Private (Tenant only)
exports.createBooking = async (req, res) => {
  const { propertyId, visitDate, visitTime, message } = req.body;

  try {
    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    if (!property.isAvailable || property.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This property listing is currently unavailable for visits',
      });
    }

    // Check if tenant has already booked a pending visit on this property
    const existingBooking = await Booking.findOne({
      tenant: req.user.id,
      property: propertyId,
      status: 'pending',
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending visit request for this property',
      });
    }

    const booking = await Booking.create({
      tenant: req.user.id,
      property: propertyId,
      visitDate,
      visitTime,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Visit request submitted successfully! The owner will contact you shortly.',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error booking visit',
    });
  }
};

// @desc    Get bookings made by logged in tenant
// @route   GET /api/bookings/tenant
// @access  Private (Tenant only)
exports.getTenantBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user.id })
      .populate({
        path: 'property',
        select: 'title address city state price images owner',
        populate: {
          path: 'owner',
          select: 'name email phone',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching booking requests',
    });
  }
};

// @desc    Get bookings submitted to landlord's properties
// @route   GET /api/bookings/landlord
// @access  Private (Landlord or Admin)
exports.getLandlordBookings = async (req, res) => {
  try {
    // Find all properties owned by landlord
    const myProperties = await Property.find({ owner: req.user.id }).select('_id');
    const myPropertyIds = myProperties.map((p) => p._id);

    // Find bookings targeting these properties
    const bookings = await Booking.find({ property: { $in: myPropertyIds } })
      .populate('tenant', 'name email phone profileImage')
      .populate('property', 'title address city price images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching booking requests',
    });
  }
};

// @desc    Update booking/visit request status
// @route   PUT /api/bookings/:id
// @access  Private (Landlord or Admin)
exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  if (!['approved', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request status updating visit request',
    });
  }

  try {
    const booking = await Booking.findById(req.params.id).populate('property');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Visit request not found',
      });
    }

    // Verify ownership of the property or admin status
    if (
      booking.property.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You are not authorized to manage this booking.',
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Visit request marked as ${status} successfully!`,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating booking status',
    });
  }
};
