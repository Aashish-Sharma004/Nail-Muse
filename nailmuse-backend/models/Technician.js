const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['All', 'Essentials', 'Nail Art', 'Extensions', 'Pedicure'], 
    default: 'Nail Art' 
  },
  rating: { type: Number, default: 5.0, min: 1, max: 5 },
  reviews: { type: Number, default: 0 },
  exp: { type: String, default: '3+ Years' },
  img: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80' 
  },
  badge: { type: String, default: '' },
  skills: [{ type: String }],
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Technician', technicianSchema);
