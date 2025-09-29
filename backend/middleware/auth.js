const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User model is needed for user lookup

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    // Attach user to the request (optional, but useful)
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};

module.exports = protect;
