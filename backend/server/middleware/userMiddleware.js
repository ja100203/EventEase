
const userOnly = (req, res, next) => {
    if (req.user && req.user.role === "attendee") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied: Users only" });
    }
  };
  
  module.exports = { userOnly };
  