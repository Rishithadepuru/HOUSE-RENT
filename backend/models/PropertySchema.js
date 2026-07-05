const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a property title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
      trim: true,
      lowercase: true,
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
      trim: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a monthly rental price'],
    },
    propertyType: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: ['apartment', 'house', 'condo', 'villa', 'studio'],
      lowercase: true,
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please specify number of bedrooms'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please specify number of bathrooms'],
    },
    area: {
      type: Number,
      required: [true, 'Please specify property area in sqft'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    furnished: {
      type: String,
      enum: ['yes', 'no', 'semi'],
      default: 'no',
    },
    parking: {
      type: Boolean,
      default: false,
    },
    petsAllowed: {
      type: Boolean,
      default: false,
    },
    virtualTourUrl: {
      type: String,
      default: '',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.index({ city: 1, price: 1 });
propertySchema.index({ status: 1 });

module.exports = mongoose.model('Property', propertySchema);
