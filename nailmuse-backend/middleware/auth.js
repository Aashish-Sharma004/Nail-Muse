// middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nailmuse_secret_key_2026';

const verifyAuth = (req, res, next) => {
  try {
    let token = null;

    // 1. Check HttpOnly cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    // 2. Fallback to Authorization header if present
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication required. Please sign in.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired session. Please log in again.' });
  }
};

module.exports = { verifyAuth, JWT_SECRET };
