// routes/authRoutes.js
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyAuth, JWT_SECRET } = require('../middleware/auth');

// Helper to set HttpOnly cookie with security flags
const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,                     // Protects against XSS: JavaScript cannot read this cookie
    secure: isProduction,               // HTTPS only in production
    sameSite: isProduction ? 'none' : 'lax', // Lax for local development cross-port requests
    maxAge: 7 * 24 * 60 * 60 * 1000,    // 7 days expiration
    path: '/'
  });
};

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    
    let user = await User.findOne({ email: cleanEmail });
    if (user) return res.status(400).json({ message: 'User already exists with this email' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ 
      name, 
      email: cleanEmail, 
      password: hashedPassword, 
      role: 'user',
      loyaltyPoints: 450,
      tier: 'Gold VIP Member'
    });
    await user.save();

    // Sign JWT and set in HttpOnly cookie
    const token = jwt.sign({ id: user._id, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    setTokenCookie(res, token);

    // Notice: token is NOT sent in the response body for security
    res.status(201).json({ 
      success: true, 
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email, 
        role: 'user',
        loyaltyPoints: user.loyaltyPoints,
        tier: user.tier
      } 
    });
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
      setTokenCookie(res, token);

      return res.json({ 
        success: true,
        user: { 
          id: admin._id,
          name: admin.name || 'Salon Administrator', 
          email: admin.email, 
          role: 'admin',
          loyaltyPoints: admin.loyaltyPoints || 9999,
          tier: admin.tier || 'Admin Executive'
        } 
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
    setTokenCookie(res, token);

    // Return user object without token in body
    res.json({ 
      success: true,
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email, 
        role,
        loyaltyPoints: user.loyaltyPoints ?? 450,
        tier: user.tier || 'Gold VIP Member'
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Current User Session Route (Reads token from HttpOnly cookie)
router.get('/me', verifyAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      // Fallback for special admin account if created outside standard id
      if (req.user.email === 'admin123@gmail.com') {
        return res.json({
          success: true,
          user: {
            id: req.user.id,
            name: 'Salon Administrator',
            email: 'admin123@gmail.com',
            role: 'admin',
            loyaltyPoints: 9999,
            tier: 'Admin Executive'
          }
        });
      }
      return res.status(404).json({ message: 'User session not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints ?? 450,
        tier: user.tier || 'Gold VIP Member'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout Route (Clears HttpOnly cookie)
router.post('/logout', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;