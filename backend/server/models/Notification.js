const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['event_created', 'event_updated', 'booking_created'], // ← Add 'booking_created'
      default: "general",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
