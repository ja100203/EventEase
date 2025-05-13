const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    location: String,
    ticketsAvailable: { type: Number, required: true },
    price: { type: Number, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,  required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
