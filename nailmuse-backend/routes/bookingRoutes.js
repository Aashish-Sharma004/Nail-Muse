const router = require('express').Router();
const Booking = require('../models/Booking');
const User = require('../models/User');

router.post('/create', async (req, res) => {
  try {
    let {
      userEmail,
      serviceTitle,
      technicianName,
      date,
      time,
      basePrice,
      addons,
      serviceFee,
      discount,
      couponCode,
      paymentMethod,
      totalAmount,
      notes
    } = req.body;
    
    // Clean and lowercase email to prevent mismatch
    const cleanEmail = userEmail ? userEmail.trim().toLowerCase() : '';

    const newBooking = new Booking({
      userEmail: cleanEmail,
      serviceTitle: serviceTitle || 'Signature Service',
      technicianName: technicianName || 'Assigned Specialist',
      date: date || new Date().toLocaleDateString(),
      time: time || '10:00 AM',
      basePrice: Number(basePrice) || 0,
      addons: Array.isArray(addons) ? addons : [],
      serviceFee: Number(serviceFee) || 3.50,
      discount: Number(discount) || 0,
      couponCode: couponCode || '',
      paymentMethod: paymentMethod || 'Pay in Studio',
      paymentStatus: paymentMethod === 'Card' || paymentMethod === 'UPI' ? 'Paid' : 'Pay at Salon',
      totalAmount: Number(totalAmount) || 0,
      notes: notes || '',
      status: 'Confirmed'
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings (for Admin Dashboard) with optional search & filter
router.get('/', async (req, res) => {
  try {
    const { status, technician, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (technician && technician !== 'All') {
      query.technicianName = technician;
    }
    if (search) {
      query.$or = [
        { userEmail: { $regex: search, $options: 'i' } },
        { serviceTitle: { $regex: search, $options: 'i' } },
        { technicianName: { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get salon operational stats & analytics
router.get('/stats', async (req, res) => {
  try {
    const bookings = await Booking.find();
    
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    
    const statusCounts = {
      Confirmed: 0,
      'In-Service': 0,
      Completed: 0,
      Cancelled: 0,
      Pending: 0
    };

    const technicianCounts = {};
    const serviceCounts = {};

    bookings.forEach(b => {
      // Status count
      const st = b.status || 'Confirmed';
      statusCounts[st] = (statusCounts[st] || 0) + 1;

      // Technician count
      if (b.technicianName) {
        technicianCounts[b.technicianName] = (technicianCounts[b.technicianName] || 0) + 1;
      }

      // Service count
      if (b.serviceTitle) {
        serviceCounts[b.serviceTitle] = (serviceCounts[b.serviceTitle] || 0) + 1;
      }
    });

    res.json({
      totalBookings,
      totalRevenue,
      statusCounts,
      technicianCounts,
      serviceCounts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update booking status (with automatic reward points on completion)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'In-Service', 'Completed', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = status;
    let pointsAwarded = 0;
    let updatedUser = null;

    // Automatically award reward points when service is Completed
    if (status === 'Completed' && !booking.pointsAwarded) {
      // 1 reward point per $1 spent, minimum 50 points
      pointsAwarded = Math.max(50, Math.round(Number(booking.totalAmount) || 50));
      
      const cleanEmail = booking.userEmail ? booking.userEmail.trim().toLowerCase() : '';
      const user = await User.findOne({ email: cleanEmail });
      
      if (user) {
        user.loyaltyPoints = (user.loyaltyPoints || 0) + pointsAwarded;
        
        // Dynamic Tier Progression based on total loyalty points
        if (user.loyaltyPoints >= 1200) {
          user.tier = 'Diamond Sanctuary VIP';
        } else if (user.loyaltyPoints >= 700) {
          user.tier = 'Platinum Elite Member';
        } else if (user.loyaltyPoints >= 300) {
          user.tier = 'Gold VIP Member';
        } else {
          user.tier = 'Silver Member';
        }
        
        await user.save();
        updatedUser = {
          id: user._id,
          name: user.name,
          email: user.email,
          loyaltyPoints: user.loyaltyPoints,
          tier: user.tier
        };
      }

      booking.pointsAwarded = true;
      booking.rewardPointsEarned = pointsAwarded;
    }

    await booking.save();

    res.json({ 
      message: pointsAwarded > 0 
        ? `Service marked Completed! ${pointsAwarded} reward points automatically awarded to customer.` 
        : 'Status updated successfully', 
      booking,
      pointsAwarded,
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete or cancel a booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking removed successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings for a user (with email cleanup)
router.get('/user/:email', async (req, res) => {
  try {
    const cleanEmail = req.params.email ? req.params.email.trim().toLowerCase() : '';
    const bookings = await Booking.find({ userEmail: cleanEmail }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;