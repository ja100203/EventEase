const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
    try {
const { title, description, date, location, ticketsAvailable, price, category } = req.body;

const event = new Event({
  title,
  description,
  date,
  location,
  ticketsAvailable,
  price,
  category, // ✅ added
  organizer: req.user.id,
});

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', 'name email');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
};

exports.getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user.id }).populate('organizer', 'name email');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your events', error });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'name email');
        if (!event) return res.status(404).json({ message: 'Event not found' });

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event', error });
    }
};

exports. updateEvent = async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user._id; // From protect middleware
    const userRole = req.user.role;
  
    try {
      const event = await Event.findById(eventId);
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      // Check if the logged-in user is the organizer of the event or an admin
      if (event.organizer.toString() !== userId.toString() && userRole !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this event' });
      }
  
const updatedFields = {
  title: req.body.title || event.title,
  date: req.body.date || event.date,
  location: req.body.location || event.location,
  ticketsAvailable: req.body.ticketsAvailable || event.ticketsAvailable,
  price: req.body.price || event.price,
  category: req.body.category || event.category, // ✅ added
};
  
      const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedFields, { new: true });
  
      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
exports.deleteEvent = async (req, res) => {
    try {
        console.log('Received delete request for:', req.params.id);
        
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        console.log('Event found:', event);

        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to delete this event' });
        }

        console.log('Deleting event...');
        await Event.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event', error });
    }
};
