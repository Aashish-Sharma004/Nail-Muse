const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loyaltyPoints: { type: Number, default: 450 },
  tier: { type: String, default: 'Gold Tier' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);