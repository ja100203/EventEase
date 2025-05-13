const express = require('express');
const { 
    createEvent, 
    getEvents, 
    getMyEvents,
    getEventById, 
    updateEvent, 
    deleteEvent ,
    getOrganizerEvents
} = require('../controllers/eventController');

const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

// Create a new event (Only organizers and admins can create events)
router.post('/', protect, roleMiddleware(['organizer', 'admin']), createEvent);

// Get all events (Public)
router.get('/', getEvents);

router.get('/my-events', protect, roleMiddleware(['organizer']), getMyEvents); // 👈 Add this line


// Get a single event by ID (Public)
router.get('/:id', getEventById);

// Update an event (Only the organizer who created it or an admin)
router.put('/my-events/:id', protect, roleMiddleware(['organizer','admin' ]), updateEvent);

// Delete an event (Only the organizer who created it or an admin)
router.delete('/:id', protect, roleMiddleware(['organizer', 'admin']), deleteEvent);

module.exports = router;
