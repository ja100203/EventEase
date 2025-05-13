import React, { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '../../assets/Animation - 1745907305330.json';
import '../../styles/Organiser.css';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    ticketsAvailable: '',
    price: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Get token from localStorage
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token); // Add this log to check token
  
    if (!token) {
      alert('❌ Login session expired. Please login again.');
      return;
    }
  
    try {
      const res = await axios.post(
        '/events',
        {
          ...formData,
          ticketsAvailable: parseInt(formData.ticketsAvailable),
          price: parseFloat(formData.price)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      alert('✅ Event Created Successfully!');
      // You can redirect here if needed:
      navigate('/organizer/manage_events');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to create event. Please check your inputs or login again.');
    }
  };
  

  return (
    <div className="create-event-wrapper">
      <div className="create-event-left">
        <div className="create-event-card">
          <h2 className="create-event-title">Create Event</h2>
          <form className="create-event-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>

            <div className="input-row">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-row">
              <input
                type="number"
                name="ticketsAvailable"
                placeholder="Number of Tickets"
                value={formData.ticketsAvailable}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Ticket Price (₹)"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      </div>
      <div className="create-event-right">
        <Lottie animationData={animationData} className="event-lottie" />
      </div>
    </div>
  );
};

export default CreateEvent;
