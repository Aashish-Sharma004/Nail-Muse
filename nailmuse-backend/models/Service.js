// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Essentials', 'Enhancements', 'Nail Art', 'Treatments'] 
  },
  price: { type: String, required: true }, // e.g. "$55+" or "$45"
  duration: { type: String, required: true }, // e.g. "45 mins"
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
