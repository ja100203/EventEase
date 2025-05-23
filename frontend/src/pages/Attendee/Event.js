import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { FaSearch, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import BookingModal from '../Attendee/Booking';
import '../../styles/Attendee.css';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import '../../styles/main.css';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/ConfirmDialog'; // Update the path as needed

const Events = () => {
  const options = [
    { value: '', label: 'All Categories' },
    { value: 'General', label: 'General' },
    { value: 'Fun', label: 'Fun' },
    { value: 'Tech', label: 'Tech' },
  ];

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: '#1f1f1f',
      borderColor: '#1f1f1f',
      color: '#ffff',
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? '#f43f5e' : '#ffe6f0',
      color: isFocused ? '#ffff' : '#1c1e22',
    }),
    singleValue: (base) => ({
      ...base,
      color: '#ffff',
    }),
  };

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(() => () => {});

  const navigate = useNavigate();

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

  const showConfirmation = (message, onConfirmAction) => {
    setConfirmMessage(message);
    setConfirmAction(() => onConfirmAction);
    setConfirmOpen(true);
  };

  const handleViewDetails = (eventId) => {
    showConfirmation('Do you want to book this event?', () => {
      setSelectedEventId(eventId);
      setShowModal(true);
      toast.success('Proceeding to booking...');
    });
  };

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="events-container">
      <div className="event-header">
        <h2 className='event-title'>📅 Discover Events</h2>
        <button className="close-btn" onClick={() => navigate('/attendee/dashboard')}>❌</button>
      </div>

      <header className="search-header">
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
            <Select
              options={options}
              styles={customStyles}
              onChange={(selected) => setSelectedCategory(selected.value)}
              defaultValue={options[0]}
            />
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

      {showModal && selectedEventId && (
        <BookingModal
          eventId={selectedEventId}
          onClose={() => {
            setShowModal(false);
            setSelectedEventId(null);
            toast.info('Booking modal closed');
          }}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        message={confirmMessage}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          confirmAction();
          setConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default Events;
