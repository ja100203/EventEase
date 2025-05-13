import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import '../../styles/Attendee.css'; // Reusing the same styles

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/bookings/all');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (window.confirm('Cancel this booking?')) {
      try {
        await axios.delete(`/bookings/all/${id}`);
        fetchBookings();
      } catch (err) {
        console.error('Error canceling booking:', err);
      }
    }
  };

  if (loading) return <p>Loading all bookings...</p>;

  return (
    <div className="atendee-booking">
      <h3 className="my-bookings-title">All Bookings (Admin View)</h3>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Event</th>
                <th>Date</th>
                <th>Tickets</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.user?.name || 'User'}</td>
                  <td>{b.event?.title || 'N/A'}</td>
                  <td>{new Date(b.event?.date).toLocaleDateString()}</td>
                  <td>{b.numberOfTickets}</td>
                  <td>₹{b.totalPrice}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        b.paymentStatus === 'paid' ? 'status-paid' : 'status-pending'
                      }`}
                    >
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center flex-wrap">
                      <button
                        className="action-btn cancel"
                        onClick={() => cancelBooking(b._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingsList;
