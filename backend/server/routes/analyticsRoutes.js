const express = require("express");
const { getEventStats ,getOrganizerStats} = require("../controllers/analyticsController"); // adjust path if needed
const { protect } = require("../middleware/authMiddleware"); // optional

const router = express.Router();

// Admin only analytics route (or change to 'protect' if you want all users)
router.get("/stats", protect, getEventStats);
router.get("/organizerstats", protect, getOrganizerStats);


module.exports = router;
