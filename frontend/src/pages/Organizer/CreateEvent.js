import React, { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '../../assets/Animation - 1745907305330.json';
import '../../styles/Organiser.css';
import Select from 'react-select';
import { toast } from 'react-toastify';

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'General', label: 'General' },
  { value: 'Fun', label: 'Fun' },
  { value: 'Tech', label: 'Tech' },
];

const customStyles = {
  container: (base) => ({
    ...base,
    width: '100%',
    height: '3rem'
  }),
  control: (base, state) => ({
    ...base,
    width: '100%',
    height: '3rem',
    backgroundColor: '#121212',
    borderRadius: '8px',
    border: '1px solid #444',
    boxShadow: state.isFocused ? '0 0 0 1px #ff007f' : 'none',
    color: '#fff',
    '&:hover': {
      borderColor: '#ff007f',
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#f43f5e',
    width: '100%',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? '#f43f5e' // pink on hover
      : '#1e1e1e',
    color: '#fff',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#f43f5e',
      height: '2rem'
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: '#fff',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#aaa',
  }),
};


const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    ticketsAvailable: '',
    price: '',
    category: '' // ✅ Add this
  });


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

      toast.success("✅ Event Created Successfully!");
      // You can redirect here if needed:
      navigate('/organizer/manage_events');
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to create event. Please check your inputs or login again.");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="create-event">
      <div className="event-header">
        <h2 className='event-title'>Create Your Own Event</h2>
        <button className="close-btn" onClick={() => navigate('/organizer/dashboard')}>❌</button>
      </div>
      <div className="create-event-wrapper">
        <div className="create-event-left">
          <div className="create-event-card">
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
                <Select
                  options={categoryOptions}
                  styles={customStyles}
                  placeholder="Select Category"
                  onChange={(selectedOption) =>
                    setFormData(prev => ({
                      ...prev,
                      category: selectedOption.value
                    }))
                  }
                />
              </div>
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
    </div>
  );
};

export default CreateEvent;
