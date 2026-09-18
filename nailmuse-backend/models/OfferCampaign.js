// models/OfferCampaign.js
const mongoose = require('mongoose');

const offerCampaignSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  headline: { type: String, default: 'Exclusive Salon Offer' },
  message: { type: String, required: true },
  promoCode: { type: String, default: '' },
  discount: { type: String, default: '' },
  validUntil: { type: String, default: '' },
  recipientType: {
    type: String,
    enum: ['all', 'individual', 'tier'],
    default: 'all'
  },
  recipients: [{ type: String }],
  recipientCount: { type: Number, default: 0 },
  sentBy: { type: String, default: 'admin@nailmuse.com' },
  previewUrl: { type: String, default: '' },
  status: { type: String, default: 'Sent' }
}, { timestamps: true });

module.exports = mongoose.model('OfferCampaign', offerCampaignSchema);
