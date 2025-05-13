const Event = require("../models/Event");
const Booking = require("../models/Booking");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");


// ✅ Get event statistics
const getEventStats = asyncHandler(async (req, res) => {
  try {
    const [totalEvents, bookings, revenueAgg, popularEventAgg] = await Promise.all([
      Event.countDocuments(), // Total events
      Booking.aggregate([
        {
          $group: {
            _id: null,
            totalTickets: { $sum: "$numberOfTickets" },
          }
        }
      ]),
      Booking.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
          }
        }
      ]),
      Booking.aggregate([
        {
          $group: {
            _id: "$event",
            ticketsSold: { $sum: "$numberOfTickets" }
          }
        },
        {
          $sort: { ticketsSold: -1 }
        },
        {
          $limit: 1
        },
        {
          $lookup: {
            from: "events", // match collection name (it’s plural of model)
            localField: "_id",
            foreignField: "_id",
            as: "eventDetails"
          }
        },
        {
          $unwind: "$eventDetails"
        },
        {
          $project: {
            _id: 0,
            eventId: "$_id",
            title: "$eventDetails.title",
            ticketsSold: 1
          }
        }
      ])
    ]);

    const totalTicketsSold = bookings[0]?.totalTickets || 0;
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
    const mostPopularEvent = popularEventAgg[0] || null;

    res.status(200).json({
      totalEvents,
      totalTicketsSold,
      totalRevenue,
      mostPopularEvent
    });

  } catch (error) {
    console.error("Error fetching event stats:", error);
    res.status(500).json({ message: "Error fetching event statistics", error });
  }
});



const getOrganizerStats = async (req, res) => {
    try {
      const organizerId = req.user._id;
  
      // Find all events created by this organizer
      const events = await Event.find({ organizer: organizerId });
  
      const eventIds = events.map(event => event._id);
  
      // Get bookings related to those events
      const bookings = await Booking.find({ event: { $in: eventIds } });
  
      const totalTicketsSold = bookings.reduce((sum, booking) => sum + booking.numberOfTickets, 0);
      const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  
      // Find most popular event
      let mostPopularEvent = { title: "N/A", ticketsSold: 0 };
  
      for (let event of events) {
        const ticketCount = bookings
          .filter(b => b.event.toString() === event._id.toString())
          .reduce((sum, b) => sum + b.numberOfTickets, 0);
  
        if (ticketCount > mostPopularEvent.ticketsSold) {
          mostPopularEvent = {
            title: event.title,
            ticketsSold: ticketCount,
          };
        }
      }
  
      res.status(200).json({
        totalEvents: events.length,
        totalTicketsSold,
        totalRevenue,
        mostPopularEvent,
      });
  
    } catch (err) {
      console.error("Error fetching organizer stats:", err.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  

module.exports = {
  getEventStats,
  getOrganizerStats
};
