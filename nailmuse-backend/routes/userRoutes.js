// routes/userRoutes.js
const router = require('express').Router();
const User = require('../models/User');
const Booking = require('../models/Booking');

// GET all registered clients with appointment count & loyalty stats
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    // Attach booking stats per user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const bookingCount = await Booking.countDocuments({ userEmail: u.email });
        return {
          ...u.toObject(),
          bookingCount
        };
      })
    );

    res.json(usersWithStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update user loyalty points and VIP tier
router.patch('/:id/loyalty', async (req, res) => {
  try {
    const { loyaltyPoints, tier } = req.body;
    const updateFields = {};
    if (loyaltyPoints !== undefined) updateFields.loyaltyPoints = Number(loyaltyPoints);
    if (tier) updateFields.tier = tier;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User loyalty updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
