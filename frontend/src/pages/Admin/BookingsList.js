import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import '../../styles/Attendee.css';
import { useNavigate } from 'react-router-dom';
import '../../styles/main.css';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/ConfirmDialog'; // ✅ custom dialog

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const navigate = useNavigate();

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

  const handleCancelRequest = (id) => {
    setBookingToCancel(id);
    setShowConfirm(true);
  };

  const handleConfirmCancel = async () => {
  if (!bookingToCancel) {
    toast.error('Invalid booking ID');
    return;
  }

  try {
    await axios.delete(`/bookings/all/${bookingToCancel}`);
    toast.success('Booking deleted successfully!');

    // ⏩ Remove the deleted booking from the local state immediately
    setBookings(prev => prev.filter(b => b._id !== bookingToCancel));
  } catch (err) {
    console.error('Error canceling booking:', err.response?.data || err.message);
    toast.error('Failed to delete booking.');
  } finally {
    setShowConfirm(false);
    setBookingToCancel(null);
  }
};



  if (loading) return <p>Loading all bookings...</p>;

  return (
    <div className="atendee-booking">
      <div className="event-header">
        <h3 className="my-bookings-title">All Bookings</h3>
        <button className="close-btn" onClick={() => navigate('/admin/dashboard')}>❌</button>
      </div>

      {bookings.length === 0 ? (
        <p className='no-events'>No bookings found.</p>
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
                    <span className={`status-badge ${b.paymentStatus === 'paid' ? 'status-paid' : 'status-pending'}`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center flex-wrap">
                      <button
                        className="action-btn cancel"
                        onClick={() => handleCancelRequest(b._id)}
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

      {/* ✅ Custom Confirm Dialog */}
      <ConfirmDialog
        open={showConfirm}
        message="Are you sure you want to cancel this booking?"
        onClose={() => {
          setShowConfirm(false);
          setBookingToCancel(null);
        }}
        onConfirm={handleConfirmCancel}
      />

    </div>
  );
};

export default BookingsList;
