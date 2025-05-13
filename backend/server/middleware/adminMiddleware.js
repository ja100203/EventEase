// server/middleware/adminMiddleware.js

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized as an admin" });
  }
  next();
};

module.exports = { adminOnly };
