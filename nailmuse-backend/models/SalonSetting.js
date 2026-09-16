// models/SalonSetting.js
const mongoose = require('mongoose');

const salonSettingSchema = new mongoose.Schema({
  bannerText: { 
    type: String, 
    default: '✨ Spring Glam Special: 20% off all Gel-X & Nail Art sets with code GLAM20' 
  },
  bannerActive: { type: Boolean, default: true },
  promoCode: { type: String, default: 'GLAM20' },
  discountPercent: { type: Number, default: 20 },
  salonHours: { type: String, default: 'Mon-Sat: 9:00 AM - 7:00 PM | Sun: 10:00 AM - 5:00 PM' },
  phoneContact: { type: String, default: '+1 (555) 342-6873' },
  salonAddress: { type: String, default: '452 Beverly Blvd, Suite 200, Los Angeles, CA' }
}, { timestamps: true });

module.exports = mongoose.model('SalonSetting', salonSettingSchema);
