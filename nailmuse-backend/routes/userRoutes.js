// routes/userRoutes.js
const router = require('express').Router();
const User = require('../models/User');
const Booking = require('../models/Booking');

// GET all registered clients with appointment count & loyalty stats
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    // Attach booking stats and segmentation metrics per user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const userBookings = await Booking.find({ userEmail: u.email });
        const bookingCount = userBookings.length;
        const completedBookings = userBookings.filter(b => b.status === 'Completed').length;
        const totalSpent = userBookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + (b.totalAmount || 0), 0);
        
        // Is new customer: registered in last 14 days OR has <= 1 booking
        const userCreatedAt = u.createdAt ? new Date(u.createdAt).getTime() : Date.now();
        const daysSinceJoined = (Date.now() - userCreatedAt) / (1000 * 60 * 60 * 24);
        const isNewCustomer = daysSinceJoined <= 14 || bookingCount <= 1;

        // Is VIP / Regular: 2+ visits OR 500+ loyalty points OR VIP/Elite/Diamond tier
        const isVipOrRegular = bookingCount >= 2 || (u.loyaltyPoints || 0) >= 500 || 
          (u.tier && (u.tier.includes('VIP') || u.tier.includes('Elite') || u.tier.includes('Diamond')));

        return {
          ...u.toObject(),
          bookingCount,
          completedBookings,
          totalSpent,
          daysSinceJoined: Math.floor(daysSinceJoined),
          isNewCustomer,
          isVipOrRegular
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
