import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Admin.css'; // new CSS file

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-wrapper">
        <div className="left-section">
          <h1 className="dashboard-title">Control the Crowd</h1>
          <p className="dashboard-subtitle">Manage everything seamlessly with <span className="highlight">EventEase</span>.</p>
        </div>

        <div className="right-section dashboard-card animate-fade-in">
          <h2>Welcome, Admin ⚙️</h2>
          <div className="dashboard-links">
            <Link to="/admin/events" className="dashboard-button red">Manage Events</Link>
            <Link to="/admin/bookings" className="dashboard-button green">View Bookings</Link>
            <Link to="/admin/payments" className="dashboard-button gold">All Payments</Link>
            <Link to="/admin/analytics" className="dashboard-button blue">My Analytics</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
