import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Attendee.css';
// import eventVector from '../assets/event_vector.svg'; // use any illustration

const AttendeeDashboard = () => {
  return (
    <div className="attendee-dashboard">
      <div className="dashboard-wrapper">
        <div className="left-section">
         {/* <img src={eventVector} alt="Event Vector" className="event-vector animate-float" />*/}
          <h1 className="dashboard-title">Step into the Spotlight</h1>
          <p className="dashboard-subtitle">Celebrate every moment with <span className="highlight">EventEase</span>.</p>
        </div>

        <div className="right-section dashboard-card animate-fade-in">
          <h2>Welcome, Attendee 👋</h2>
          <div className="dashboard-links">
            <Link to="/attendee/events" className="dashboard-button red">Browse Events</Link>
            <Link to="/attendee/bookings" className="dashboard-button green">My Bookings</Link>
            <Link to="/attendee/notifications" className="dashboard-button gold">Notifications</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeDashboard;
