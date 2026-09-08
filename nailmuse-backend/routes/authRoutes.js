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
    user = new User({ name, email: cleanEmail, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { name: user.name, email: user.email } });
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

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;