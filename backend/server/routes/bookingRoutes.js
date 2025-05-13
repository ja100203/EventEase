const express = require("express");
const {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  getBookingsForOrganizerEvents,
  getOrganizerEvents,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const { userOnly } = require("../middleware/userMiddleware");

const router = express.Router();

// Organizer routes
router.get("/organizer/events", protect, getOrganizerEvents);
router.get("/organizer/organized-events", protect, getBookingsForOrganizerEvents);

// Admin route
router.get("/all", protect, adminOnly, getAllBookings);
router.delete('/all/:id', protect, adminOnly, cancelBooking);

// User routes
router.post("/", protect, userOnly, createBooking);
router.get("/", protect, userOnly, getBookings);
router.get("/:id", protect, userOnly, getBookingById);
router.delete("/:id", protect, userOnly, cancelBooking);

module.exports = router;
