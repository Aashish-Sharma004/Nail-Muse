const router = require('express').Router();
const Booking = require('../models/Booking');

router.post('/create', async (req, res) => {
  try {
    let { userEmail, serviceTitle, technicianName, date, time, totalAmount, notes } = req.body;
    
    // Clean and lowercase email to prevent mismatch
    const cleanEmail = userEmail ? userEmail.trim().toLowerCase() : '';

    const newBooking = new Booking({
      userEmail: cleanEmail,
      serviceTitle,
      technicianName,
      date,
      time,
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

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'In-Service', 'Completed', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(400).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Status updated successfully', booking });
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