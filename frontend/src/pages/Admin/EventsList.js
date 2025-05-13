import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap'; // 🆕 added
import 'bootstrap/dist/css/bootstrap.min.css'; // 🆕 added
import '../../styles/Admin.css';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/events');
      const data = res.data || [];
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...events];

    if (searchTerm.trim()) {
      filtered = filtered.filter((event) =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (event) =>
          event.category?.toLowerCase() === selectedCategory.toLowerCase().trim()
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date).toISOString().split('T')[0];
        return eventDate === selectedDate;
      });
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, selectedDate, events]);

  const deleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`/events/${id}`);
        fetchEvents(); // refresh list
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setEditTitle(event.title);
    setEditDate(new Date(event.date).toISOString().split('T')[0]);
    setEditLocation(event.location);
    setEditCategory(event.category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedEvent) return;
  
    try {
      const updatedEvent = {
        title: editTitle,
        date: editDate,
        location: editLocation,
        category: editCategory,
      };
  
      const token = localStorage.getItem('token'); // or wherever you stored it after login
  
      await axios.put(
        `/events/my-events/${selectedEvent._id}`,
        updatedEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      fetchEvents();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  
  return (
    <div className="events-container">
      <div className="events-header">
        <h1>All Events</h1>
      </div>

      {/* Filters */}
      <div className="search-filter-container">
        <div className="search-box">
          <FaSearch className="icon" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-btn category-filter">
          <FaFilter className="icon" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="General">General</option>
            <option value="Fun">Fun</option>
            <option value="Tech">Tech</option>
          </select>
        </div>

        <div className="filter-btn date-filter">
          <FaCalendarAlt className="icon" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>
      </div>

      {/* Events */}
      {loading ? (
        <p className="loading">Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <p className="no-events">No events found</p>
      ) : (
        <div className="event-cards">
          {filteredEvents.map((event) => (
            <div className="event-card" key={event._id}>
              <div className="event-card-content">
                <div className="event-tag">{event.category || 'General'}</div>
                <h3>{event.title}</h3>
                <p className="event-date">
                  📅 {new Date(event.date).toLocaleDateString()}
                </p>
                <p>📍 {event.location}</p>
                <div className="button-group">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(event)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteEvent(event._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: '50vh' }}>
          <Form>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formDate" className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formLocation" className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formCategory" className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              >
                <option value="General">General</option>
                <option value="Fun">Fun</option>
                <option value="Tech">Tech</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EventsList;
