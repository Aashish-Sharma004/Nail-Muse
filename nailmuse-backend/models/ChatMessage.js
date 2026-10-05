// models/ChatMessage.js
const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  // A session ID groups messages from an anonymous or logged-in visitor
  sessionId: { type: String, required: true, index: true },

  // Visitor info (filled from auth cookie or guest form)
  senderName:  { type: String, default: 'Guest' },
  senderEmail: { type: String, default: '' },

  // 'user' = visitor, 'bot' = auto-reply, 'admin' = salon staff
  sender: { type: String, enum: ['user', 'bot', 'admin'], required: true },

  text: { type: String, required: true },

  // Admin can mark a whole conversation as resolved
  resolved: { type: Boolean, default: false },

  // Soft read receipt — admin has seen this message
  readByAdmin: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
