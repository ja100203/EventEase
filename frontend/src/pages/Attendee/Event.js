import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { FaSearch, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import BookingModal from '../Attendee/Booking'; // 🆕 import your modal component
import '../../styles/Attendee.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [selectedEventId, setSelectedEventId] = useState(null); // 🆕
  const [showModal, setShowModal] = useState(false); // 🆕

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/events');
        const data = res.data || [];
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

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

  const handleViewDetails = (eventId) => {
    setSelectedEventId(eventId);
    setShowModal(true);
  };

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="events-container">
      <header className="events-header">
        <h1>Discover Events</h1>
        <div className="search-filter-container">
          <div className="search-box">
            <FaSearch className="icon" />
            <input
              type="text"
              placeholder="Search events..."
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
      </header>

      <div className="event-cards">
        {filteredEvents.length === 0 ? (
          <p className="no-events">No events found</p>
        ) : (
          filteredEvents.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-card-content">
                <div className="event-tag">{event.category || "General"}</div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p className="event-date">
                  <FaCalendarAlt className="icon" />
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p>{event.location}</p>
              </div>
              <button onClick={() => handleViewDetails(event._id)}>View Details</button>
            </div>
          ))
        )}
      </div>

      {/* 🧾 Booking Modal */}
      {showModal && selectedEventId && (
        <BookingModal
          eventId={selectedEventId}
          onClose={() => {
            setShowModal(false);
            setSelectedEventId(null);
          }}
        />
      )}
    </div>
  );
};

export default Events;
