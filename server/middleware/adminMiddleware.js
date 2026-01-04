// server/middleware/adminMiddleware.js
module.exports = function (req, res, next) {
  // Check if user is authenticated and has admin role
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized - User not authenticated' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }

  next();
};
