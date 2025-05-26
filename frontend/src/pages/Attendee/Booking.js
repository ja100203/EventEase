import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import '../../styles/Attendee.css';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/ConfirmDialog';

const Booking = ({ eventId, onClose }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [event, setEvent] = useState(null);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/events/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event:', err);
        toast.error('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  const handleBooking = async () => {
    try {
      const response = await axios.post(
        '/bookings',
        { eventId, numberOfTickets },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.status === 201) {
        toast.success('🎟 Booking created! Please proceed to payment.');
        setBooking(response.data.booking);
        setBookingConfirmed(true);
      } else {
        toast.error('Booking failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error booking event.');
    }
  };

  const handleConfirmClick = () => {
    setConfirmOpen(true);
  };

  const handlePayment = async () => {
    try {
      if (!booking || !booking._id || !booking.totalPrice) {
        toast.warn('Booking details missing.');
        return;
      }

      const res = await axios.post(
        '/payment/create-payment',
        {
          bookingId: booking._id,
          amount: booking.totalPrice,
          currency: 'INR',
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      const { id: order_id, amount, currency } = res.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'EventEase',
        description: 'Event Ticket Payment',
        order_id,
        handler: async function (response) {
          await axios.post(
            '/payment/verify-payment',
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
          );
          toast.success('🎉 Payment Successful!');
          onClose(); // Close modal after payment
        },
        prefill: {
          name: 'Jahnavi Lenka',
          email: 'jahnavi2003lenka@gmail.com',
          contact: '9999999999',
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Payment failed. Try again.');
    }
  };

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        {loading ? (
          <p>Loading event...</p>
        ) : (
          <>
            <h3>Book Tickets</h3>
            <div className="event-details">
              <h4>{event.title}</h4>
              <p>{event.description}</p>
              <p>
                <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>Price per ticket:</strong> ₹{event.price}
              </p>
            </div>

            {!bookingConfirmed ? (
              <div>
                <label>No. of Tickets:</label>
                <input
                  type="number"
                  value={numberOfTickets}
                  onChange={(e) => setNumberOfTickets(Number(e.target.value))}
                  min="1"
                  max={event.ticketsAvailable || 10}
                />
                <button onClick={handleConfirmClick}>Confirm Booking</button>
              </div>
            ) : (
              <div>
                <p>
                  ✅ Booking confirmed for <strong>{numberOfTickets}</strong> ticket(s).
                </p>
                <p>
                  Total Amount: ₹<strong>{booking.totalPrice}</strong>
                </p>
                <button onClick={handlePayment}>Pay Now</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to confirm this booking?"
        onConfirm={() => {
          setConfirmOpen(false);
          handleBooking();
        }}
        onClose={() => {
          setConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default Booking;
