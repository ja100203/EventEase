const Notification = require("../models/Notification");

// ✅ Create a new notification
const createNotification = async (userId, message, type, eventId = null) => {
  try {
    const newNotification = new Notification({
      user: userId,
      message,
      type,
      event: eventId,
    });
    await newNotification.save();
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// ✅ Get all notifications for a user
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications", error });
  }
};

// ✅ Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    notification.read = true;
    await notification.save();
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification", error });
  }
};

module.exports = { createNotification, getNotifications, markAsRead };
