import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Organiser.css'; // External CSS

const OrganizerDashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <div className="dashboard-text">
          <h1>Control the Crowd</h1>
          <p>Manage everything seamlessly with <span className="highlight">EventEase</span>.</p>
        </div>

        <div className="dashboard-card">
          <h2>Welcome, Organizer <span role="img" aria-label="settings">⚙️</span></h2>
          <div className="button-group">
            <Link to="/organizer/create_events" className="dashboard-button red">Create Event</Link>
            <Link to="/organizer/manage_events" className="dashboard-button green">My Events</Link>
            <Link to="/organizer/booked_events" className="dashboard-button yellow">My Bookings</Link>
            <Link to="/organizer/analytics" className="dashboard-button teal">My Analytics</Link>
            <Link to="/organizer/private-party" className="dashboard-button blue">Upload Private Party CSV</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
