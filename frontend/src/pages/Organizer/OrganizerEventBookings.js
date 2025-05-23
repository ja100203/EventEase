import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import '../../styles/Organiser.css'; // External CSS
import { useNavigate } from 'react-router-dom';


const OrganizerEventBookings = () => {
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("📌 OrganizerEventBookings component mounted");
    const fetchOrganizerEventBookings = async () => {
      try {
        const response = await axios.get("/bookings/organizer/organized-events");
        setOrganizedEvents(response.data); // [{ event, bookings: [...] }, ...]
      } catch (error) {
        console.error("Failed to fetch organizer event bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizerEventBookings();
  }, []);

  const navigate = useNavigate();


  if (loading) return <p className="organizer-loading">Loading event bookings...</p>;

  return (
    <div className="organizer-bookings-container">
      <div className="event-header">
        <h2 className="organizer-heading">Your Events & Their Bookings</h2>
        <button className="close-btn" onClick={() => navigate('/organizer/dashboard')}>❌</button>
      </div>

      {organizedEvents.length === 0 ? (
        <p className="organizer-empty">You haven't created any events yet.</p>
      ) : (
        organizedEvents.map(({ event, bookings }) => (
          <div key={event._id} className="event-block">
            <h3 className="booking-title">{event.title}</h3>

            {bookings.length === 0 ? (
              <p className="no-bookings">No bookings for this event yet.</p>
            ) : (
              <div className="table-wrapper">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>User Name</th>
                      <th>User Email</th>
                      <th>Booking Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.userName}</td>
                        <td>{booking.userEmail}</td>
                        <td>{booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrganizerEventBookings;
