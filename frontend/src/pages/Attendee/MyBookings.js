import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Attendee.css';
import '../../styles/main.css';
import ConfirmDialog from '../../components/ConfirmDialog';
import {  toast } from 'react-toastify';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, bookingId: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/bookings', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        toast.error("Failed to load bookings.");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const confirmCancel = (id) => {
    setConfirmDialog({ open: true, bookingId: id });
  };

const handleCancel = async () => {
  console.log("handleCancel called for bookingId:", confirmDialog.bookingId);
  setConfirmDialog({ open: false, bookingId: null });
  try {
    await axios.delete(`/bookings/${confirmDialog.bookingId}`);
    setBookings(prev => prev.filter(b => b._id !== confirmDialog.bookingId));
    console.log("Booking cancelled successfully, showing toast");
    toast.success('Booking cancelled successfully');
  } catch (err) {
    console.error(err);
    toast.error('Failed to cancel booking');
  }
};

  const handlePayment = async (booking) => {
    try {
      if (!booking || !booking._id || !booking.totalPrice) {
        toast.error("Missing booking data. Cannot proceed with payment.");
        return;
      }

      const res = await axios.post(
        "/payment/create-payment",
        {
          bookingId: booking._id,
          amount: booking.totalPrice,
          currency: "INR",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { id: order_id, amount, currency } = res.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "EventEase",
        description: "Event Ticket Payment",
        order_id,
        handler: async function (response) {
          await axios.post(
            "/payment/verify-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          toast.success("🎉 Payment Successful!");
          navigate("/dashboard");
        },
        prefill: {
          name: "Jahnavi Lenka",
          email: "jahnavi2003lenka@gmail.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error.response?.data || error.message);
      toast.error("Payment failed. Try again.");
    }
  };

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <div className="atendee-booking">
      <div className="event-header">
        <h2 className='event-title'>My Bookings</h2>
        <button className="close-btn" onClick={() => navigate('/attendee/dashboard')}>❌</button>
      </div>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Location</th>
                <th>Tickets</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.event?.title || 'N/A'}</td>
                  <td>{new Date(b.event?.date).toLocaleDateString()}</td>
                  <td>{b.event?.location}</td>
                  <td>{b.numberOfTickets}</td>
                  <td>₹{b.totalPrice}</td>
                  <td>
                    <span
                      className={`status-badge ${b.paymentStatus === 'paid' ? 'status-paid' : 'status-pending'}`}
                    >
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center flex-wrap">
                      <button className="action-btn cancel" onClick={() => confirmCancel(b._id)}>
                        Cancel
                      </button>
                      {b.paymentStatus === 'pending' && (
                        <button className="action-btn pay" onClick={() => handlePayment(b)}>
                          Pay Now
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        message="Are you sure you want to cancel this booking?"
        onClose={() => setConfirmDialog({ open: false, bookingId: null })}
        onConfirm={handleCancel}
      />
    </div>
  );
};

export default MyBookings;
