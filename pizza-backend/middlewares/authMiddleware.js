const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Handle admin token (which doesn't have an 'id' but has 'role: "admin"')
    if (decoded.role === 'admin' && !decoded.id) {
      req.user = { email: decoded.email, role: 'admin' };
      return next();
    }

    // Handle regular user token (which has an 'id')
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is admin
exports.isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};