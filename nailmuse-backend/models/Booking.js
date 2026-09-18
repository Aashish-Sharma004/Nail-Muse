// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  serviceTitle: { type: String, required: true },
  technicianName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  basePrice: { type: Number, default: 0 },
  addons: [
    {
      name: { type: String },
      price: { type: Number, default: 0 }
    }
  ],
  serviceFee: { type: Number, default: 3.50 },
  discount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['Card', 'UPI', 'Pay in Studio', 'Pay at Salon'],
    default: 'Pay in Studio'
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'In-Service', 'Completed', 'Cancelled'],
    default: 'Confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Pay at Salon'],
    default: 'Pay at Salon'
  },
  pointsAwarded: {
    type: Boolean,
    default: false
  },
  rewardPointsEarned: {
    type: Number,
    default: 0
  },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);