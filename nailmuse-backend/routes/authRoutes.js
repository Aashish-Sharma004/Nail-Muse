// routes/authRoutes.js
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nailmuse_secret_key_2026';

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    
    let user = await User.findOne({ email: cleanEmail });
    if (user) return res.status(400).json({ message: 'User already exists with this email' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email: cleanEmail, password: hashedPassword, role: 'user' });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { name: user.name, email: user.email, role: 'user' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Clean and normalize email input
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    // Dedicated Admin Credentials Check
    if (cleanEmail === 'admin123@gmail.com' && password === 'admin123') {
      let admin = await User.findOne({ email: 'admin123@gmail.com' });
      if (!admin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        admin = new User({
          name: 'Salon Administrator',
          email: 'admin123@gmail.com',
          password: hashedPassword,
          role: 'admin',
          loyaltyPoints: 9999,
          tier: 'Admin Executive'
        });
        await admin.save();
      } else if (admin.role !== 'admin') {
        admin.role = 'admin';
        await admin.save();
      }

      const token = jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ 
        token, 
        user: { name: admin.name || 'Salon Administrator', email: admin.email, role: 'admin' } 
      });
    }

    // Find user by normalized email
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const role = user.role || 'user';
    const token = jwt.sign({ id: user._id, email: user.email, role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email, role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;