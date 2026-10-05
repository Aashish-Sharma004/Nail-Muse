const ChatMessage = require('../models/ChatMessage');

// ──────────────────────────────────────────────
// Smart FAQ Bot Engine
// Matches keywords and returns curated replies
// ──────────────────────────────────────────────
function getBotReply(text) {
  const t = text.toLowerCase();

  if (/(cancel|cancell?ation|reschedul)/i.test(t)) {
    return `✨ **Cancellation Policy:** You can cancel or reschedule your appointment up to **24 hours** before your scheduled time at no charge. Last-minute cancellations (under 24h) may incur a 50% service fee. To cancel, visit *My Appointments* in your dashboard or reply here and we'll sort it out!`;
  }

  if (/(book|appointment|schedul|reserv)/i.test(t)) {
    return `💅 **Booking an Appointment:** Head to our [Services](/services) page, choose your treatment, pick your favourite nail artist and a time slot that works for you — it only takes 2 minutes! If you need help choosing a service, just ask!`;
  }

  if (/(gel.?x|gel x|hard gel|acrylic|sns|dip)/i.test(t)) {
    return `💎 **Gel-X & Nail Extensions:** Gel-X extensions typically last **3–5 weeks** with proper care. We recommend avoiding prolonged water exposure and using cuticle oil daily. Fill appointments are available from week 3 onwards. Want to book one?`;
  }

  if (/(price|cost|how much|pricing|rate|fee)/i.test(t)) {
    return `💰 **Pricing:** Our services start from just **$25** for a basic manicure up to **$120** for premium nail art sets. You can view our full up-to-date price list on the [Services](/services) page. Loyalty members also receive exclusive discounts! 🎁`;
  }

  if (/(hour|open|clos|tim|when|schedule)/i.test(t)) {
    return `🕐 **Studio Hours:**\n• Monday – Saturday: **9:00 AM – 7:00 PM**\n• Sunday: **10:00 AM – 5:00 PM**\n\nWalk-ins welcome based on availability. We recommend booking ahead to secure your preferred time!`;
  }

  if (/(loyalty|points|reward|tier|vip|redeem)/i.test(t)) {
    return `🏆 **Loyalty Rewards:** Every completed service earns you **points** automatically. Tiers unlock exclusive perks:\n• 🥈 Silver (0–299 pts)\n• 🥇 Gold (300–699 pts)\n• 💎 Platinum (700–1199 pts)\n• 👑 Diamond (1200+ pts)\n\nCheck your points in your [Dashboard](/dashboard)!`;
  }

  if (/(park|locat|address|where|direction|find)/i.test(t)) {
    return `📍 **Location & Parking:** We are conveniently located with free parking right outside the studio. Visit our [Contact](/contact) page for the full address, map, and directions!`;
  }

  if (/(photo|inspir|design|art|idea|nail art)/i.test(t)) {
    return `🎨 **Nail Art & Designs:** Absolutely bring inspiration photos! You can send us reference images via Instagram DM or show them to your nail artist at the appointment. Our artists specialise in everything from minimalist to intricate designs.`;
  }

  if (/(hello|hi|hey|howdy|greet)/i.test(t)) {
    return `👋 **Hello there, gorgeous!** Welcome to NailMuse Studio. I'm your virtual assistant — ask me anything about bookings, pricing, services, or hours and I'll help right away! For personalised help, our team is just a message away.`;
  }

  if (/(thank|thanks|thx|appreciate)/i.test(t)) {
    return `💕 **You're so welcome!** If you have any other questions, don't hesitate to ask. We can't wait to pamper you at NailMuse! ✨`;
  }

  // No keyword match — escalate to human
  return null;
}

exports.sendMessage = async (req, res) => {
  try {
    const { sessionId, senderName, senderEmail, text } = req.body;

    if (!sessionId || !text?.trim()) {
      return res.status(400).json({ message: 'sessionId and text are required.' });
    }

    // Persist the user message
    const userMsg = await ChatMessage.create({
      sessionId,
      senderName: senderName || 'Guest',
      senderEmail: senderEmail || '',
      sender: 'user',
      text: text.trim(),
    });

    // ── Smart FAQ bot engine ──────────────────
    const botReply = getBotReply(text.trim());
    let botMsg = null;
    if (botReply) {
      botMsg = await ChatMessage.create({
        sessionId,
        senderName: 'NailMuse Assistant',
        senderEmail: '',
        sender: 'bot',
        text: botReply,
        readByAdmin: true, // bots messages don't need admin review
      });
    }

    res.status(201).json({ userMessage: userMsg, botMessage: botMsg });
  } catch (err) {
    console.error('Chat POST error:', err);
    res.status(500).json({ message: 'Failed to save message.' });
  }
};

exports.getSessionMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ sessionId: req.params.sessionId })
      .sort({ createdAt: 1 })
      .lean();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
};

exports.getAdminConversations = async (req, res) => {
  try {
    // Aggregate: one doc per sessionId with latest message + unread count
    const conversations = await ChatMessage.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$sessionId',
          senderName:  { $first: { $cond: [{ $eq: ['$sender', 'user'] }, '$senderName', '$$REMOVE'] } },
          senderEmail: { $first: { $cond: [{ $eq: ['$sender', 'user'] }, '$senderEmail', '$$REMOVE'] } },
          lastMessage: { $first: '$text' },
          lastSender:  { $first: '$sender' },
          lastAt:      { $first: '$createdAt' },
          resolved:    { $first: '$resolved' },
          unreadCount: {
            $sum: { $cond: [{ $and: [{ $eq: ['$sender', 'user'] }, { $eq: ['$readByAdmin', false] }] }, 1, 0] }
          },
        }
      },
      { $sort: { lastAt: -1 } }
    ]);

    res.json(conversations);
  } catch (err) {
    console.error('Chat admin conversations error:', err);
    res.status(500).json({ message: 'Failed to fetch conversations.' });
  }
};

exports.getAdminSessionThread = async (req, res) => {
  try {
    // Mark all user messages as read
    await ChatMessage.updateMany(
      { sessionId: req.params.sessionId, sender: 'user', readByAdmin: false },
      { $set: { readByAdmin: true } }
    );

    const messages = await ChatMessage.find({ sessionId: req.params.sessionId })
      .sort({ createdAt: 1 })
      .lean();

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch thread.' });
  }
};

exports.adminReply = async (req, res) => {
  try {
    const { sessionId, text } = req.body;
    if (!sessionId || !text?.trim()) {
      return res.status(400).json({ message: 'sessionId and text required.' });
    }

    const msg = await ChatMessage.create({
      sessionId,
      senderName: 'NailMuse Team',
      senderEmail: 'admin@nailmuse.com',
      sender: 'admin',
      text: text.trim(),
      readByAdmin: true,
    });

    res.status(201).json(msg);
  } catch (err) {
    console.error('Admin reply error:', err);
    res.status(500).json({ message: 'Failed to send reply.' });
  }
};

exports.markResolved = async (req, res) => {
  try {
    const { resolved } = req.body;
    await ChatMessage.updateMany(
      { sessionId: req.params.sessionId },
      { $set: { resolved: Boolean(resolved) } }
    );
    res.json({ message: `Conversation marked as ${resolved ? 'resolved' : 'open'}.` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update resolved status.' });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ sessionId: req.params.sessionId });
    res.json({ message: 'Conversation deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete conversation.' });
  }
};
