import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import '../../styles/Organiser.css'; // External CSS
import { useNavigate } from 'react-router-dom';

const OrganizerAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get("/analytics/organizerstats");
        setStats(data);
      } catch (err) {
        console.error("Error fetching organizer analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
const navigate = useNavigate();

  if (loading) return <div className="statLoading">Loading organizer stats...</div>;

  return (
    <div className="statContainer">
      <div className="event-header">
        <h2 className="statHeader">📈 Organizer Dashboard</h2>
        <button className="close-btn" onClick={() => navigate('/organizer/dashboard')}>❌</button>
      </div>

      <div className="statCardContainer">
        <StatCard title="Your Total Events" value={stats?.totalEvents} icon="event" />
        <StatCard title="Tickets Sold" value={stats?.totalTicketsSold} icon="ticket" />
        <StatCard title="Your Revenue" value={`₹${stats?.totalRevenue}`} icon="revenue" />
        {stats?.mostPopularEvent && (
          <StatCard
            title="Top Event"
            value={`${stats.mostPopularEvent.title} (${stats.mostPopularEvent.ticketsSold} tickets)`}
            icon="star"
          />
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className={`statCard ${icon}`}>
    <div className="statIcon">
      <i className={`material-icons ${icon}`}>{icon}</i>
    </div>
    <h3 className="statTitle">{title}</h3>
    <p className="statValue">{value}</p>
  </div>
);

export default OrganizerAnalytics;
