import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import "../../styles/Admin.css"; // This should now contain the organiser-stats style

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get("/analytics/stats");
        setStats(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="statContainer">
        <p className="statLoading">Loading Analytics...</p>
      </div>
    );
  }

  return (
    <div className="statContainer">
      <h1 className="statHeader">Admin Analytics</h1>
      <div className="statCardContainer">
        <StatCard
          icon="event"
          title="Total Events"
          value={stats?.totalEvents}
          type="event"
        />
        <StatCard
          icon="tickets"
          title="Tickets Sold"
          value={stats?.totalTicketsSold}
          type="ticket"
        />
        <StatCard
          icon="payments"
          title="Total Revenue"
          value={`₹${stats?.totalRevenue}`}
          type="revenue"
        />
        {stats?.mostPopularEvent && (
          <StatCard
            icon="star"
            title="Most Popular Event"
            value={`${stats.mostPopularEvent.title} (${stats.mostPopularEvent.ticketsSold} tickets)`}
            type="star"
          />
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className={`statCard ${icon}`}>
    <div className="statIcon">
      <i className={`material-icons ${icon}`}>{icon}</i>
    </div>
    <h3 className="statTitle">{title}</h3>
    <p className="statValue">{value}</p>
  </div>
);

export default AnalyticsDashboard;
