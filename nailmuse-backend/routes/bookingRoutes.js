const router = require('express').Router();
const Booking = require('../models/Booking');

router.post('/create', async (req, res) => {
  try {
    let { userEmail, serviceTitle, technicianName, date, time, totalAmount } = req.body;
    
    // Clean and lowercase email to prevent mismatch
    const cleanEmail = userEmail ? userEmail.trim().toLowerCase() : '';

    const newBooking = new Booking({
      userEmail: cleanEmail,
      serviceTitle,
      technicianName,
      date,
      time,
      totalAmount
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
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