const Booking = require("../models/Booking");
const Event = require("../models/Event");
const asyncHandler = require("express-async-handler");
const { createNotification } = require("./notificationController");

// Confirm Booking with Notification (used after payment)
const confirmBooking = asyncHandler(async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, user: req.user._id });
    await booking.save();

    await createNotification(
      req.user._id,
      "Your booking has been confirmed! 🎉",
      "booking_confirmation"
    );

    global.io.emit("receiveNotification", {
      user: req.user._id,
      message: "Your booking has been confirmed! 🎉",
      type: "booking_confirmation",
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error });
  }
});

// Create a new booking
const createBooking = asyncHandler(async (req, res) => {
  const { eventId, numberOfTickets } = req.body;

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  if (event.ticketsAvailable < numberOfTickets) {
    res.status(400);
    throw new Error("Not enough tickets available");
  }

  const totalPrice = event.price * numberOfTickets;

  const booking = await Booking.create({
    user: req.user._id,
    event: eventId,
    numberOfTickets,
    totalPrice,
    paymentStatus: "pending",
  });

  event.ticketsAvailable -= numberOfTickets;
  await event.save();

  await createNotification(
    req.user._id,
    `Your booking for "${event.title}" is created. Please complete the payment.`,
    "booking_created"
  );

  global.io.emit("receiveNotification", {
    user: req.user._id,
    message: `Your booking for "${event.title}" is created. Please complete the payment.`,
    type: "booking_created",
  });

  res.status(201).json({ message: "Booking created successfully", booking });
});

// Get all bookings (Admin only)
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("event", "title date location")
    .populate("user", "name email");  // 👈 Important line to fix the issue
  res.status(200).json(bookings);
});


// Get all bookings for the logged-in user
const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("event", "title date location");
  res.status(200).json(bookings);
});

// Get booking by ID
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("event", "title date location");
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  res.status(200).json(booking);
});

// Cancel a booking
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('user', 'name email');
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const event = await Event.findById(booking.event);
  if (event) {
    event.ticketsAvailable += booking.numberOfTickets;
    await event.save();
  }

  await booking.deleteOne();

  // Notify the actual user who made the booking
  await createNotification(
    booking.user._id,
    `Your booking for "${event?.title || 'an event'}" has been cancelled.`,
    "booking_cancelled"
  );

  global.io.emit("receiveNotification", {
    user: booking.user._id,
    message: `Your booking for "${event?.title || 'an event'}" has been cancelled.`,
    type: "booking_cancelled",
  });

  res.status(200).json({ message: "Booking cancelled successfully" });
});


// Get all events created by the organizer
const getOrganizerEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id }).select("title date location ticketsAvailable");
  res.status(200).json(events);
});

// Get all bookings for events created by the organizer
const getBookingsForOrganizerEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id }).select("_id title");

  const eventIds = events.map(event => event._id.toString());

  const bookings = await Booking.find({ event: { $in: eventIds } })
    .populate("event", "title")
    .populate("user", "name email");

  const eventBookingsMap = {};

  // Initialize with all events
  events.forEach(event => {
    eventBookingsMap[event._id] = {
      event: event,
      bookings: []
    };
  });

  // Fill in bookings
  bookings.forEach(booking => {
    const eventId = booking.event._id.toString();
    eventBookingsMap[eventId].bookings.push({
      _id: booking._id,
      userName: booking.user.name,
      userEmail: booking.user.email,
      createdAt: booking.createdAt
    });
  });

  const result = Object.values(eventBookingsMap);
  res.status(200).json(result);
});

module.exports = {
  confirmBooking,
  createBooking,
  getAllBookings,
  getBookings,
  getBookingById,
  cancelBooking,
  getOrganizerEvents,
  getBookingsForOrganizerEvents,
};
