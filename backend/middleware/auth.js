/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header
 * Adds user information to req.user for protected routes
 */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const auth = req.header('Authorization');
  if (!auth) return res.status(401).json({ error: 'No token provided' });
  
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token format invalid' });
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
