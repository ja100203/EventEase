const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  numberOfTickets: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, default: 'pending' }
},
{ timestamps: true } // ✅ THIS LINE IS REQUIRED
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
