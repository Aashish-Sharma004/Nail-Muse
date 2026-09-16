// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  serviceTitle: { type: String, required: true },
  technicianName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  totalAmount: { type: Number, required: true },
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
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);