// src/pages/ManageEvents.js
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import '../../styles/Organiser.css';
import '../../styles/main.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/ConfirmDialog'; // your custom confirm dialog

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editEventData, setEditEventData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/events/my-events');
      setEvents(res.data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      toast.error('❌ Unauthorized. Please log in again.');
    } finally {
      setLoading(false);
    }
  };

  // Open confirm dialog before delete
  const openConfirm = (id) => {
    setEventToDelete(id);
    setShowConfirm(true);
  };

  // Confirm delete handler
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/events/${eventToDelete}`);
      toast.success('✅ Event deleted successfully!');
      setEvents(prev => prev.filter(event => event._id !== eventToDelete));
    } catch (err) {
      console.error(err);
      toast.error('❌ Could not delete event.');
    } finally {
      setShowConfirm(false);
      setEventToDelete(null);
    }
  };

  const handleEditClick = (event) => {
    setEditEventData({ ...event, date: event.date.split('T')[0] });
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    setEditEventData({ ...editEventData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/events/my-events/${editEventData._id}`, editEventData);
      const updated = res.data;
      setEvents(prev => prev.map(ev => (ev._id === updated._id ? updated : ev)));
      setShowModal(false);
      toast.success('✅ Event updated successfully!');
    } catch (err) {
      console.error('Edit failed:', err);
      toast.error('❌ Failed to update event.');
    }
  };

  return (
    <div className="manage-events-container">
      <div className="event-header">
        <h2 className='event-title'>📅 My Events</h2>
        <button className="close-btn" onClick={() => navigate('/organizer/dashboard')}>❌</button>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p className='no-events'>You haven't created any events yet.</p>
      ) : (
        <div className="events-list">
          {events.map(event => (
            <div key={event._id} className="event-card">
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Tickets:</strong> {event.ticketsAvailable}</p>
              <p><strong>Price:</strong> ₹{event.price}</p>

              <div className="event-actions">
                <button onClick={() => handleEditClick(event)} className="edit-btn">Edit</button>
                <button onClick={() => openConfirm(event._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && editEventData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>✏️ Edit Event</h3>
            <form onSubmit={handleEditSubmit} className="edit-form">
              <label>Title:</label>
              <input type="text" name="title" value={editEventData.title} onChange={handleEditChange} required />

              <label>Date:</label>
              <input type="date" name="date" value={editEventData.date} onChange={handleEditChange} required />

              <label>Location:</label>
              <input type="text" name="location" value={editEventData.location} onChange={handleEditChange} required />

              <label>Tickets Available:</label>
              <input type="number" name="ticketsAvailable" value={editEventData.ticketsAvailable} onChange={handleEditChange} required />

              <label>Price (₹):</label>
              <input type="number" name="price" value={editEventData.price} onChange={handleEditChange} required />

              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Use correct prop names: open and onClose */}
      <ConfirmDialog
        open={showConfirm}
        message="Are you sure you want to delete this event?"
        onConfirm={handleDeleteConfirm}
        onClose={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default ManageEvents;


