const express = require("express");
const { getNotifications, markAsRead } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");
const { userOnly } = require("../middleware/userMiddleware");

const router = express.Router();

router.get("/", protect,userOnly, getNotifications); // Fetch notifications for a user
router.put("/:id/read", protect, markAsRead); // Mark a notification as read

module.exports = router;
