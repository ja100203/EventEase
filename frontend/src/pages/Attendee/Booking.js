// src/components/BookingModal.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import '../../styles/Attendee.css';

const Booking= ({ eventId, onClose }) => {
  const [event, setEvent] = useState(null);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/events/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  const handleBooking = async () => {
    try {
      const res = await axios.post('/bookings', {
        eventId,
        numberOfTickets,
      });
      setBooking(res.data.booking);
      alert('Booking successful!');
    } catch (err) {
      console.error(err);
      alert('Failed to book tickets');
    }
  };

  const handlePayment = async () => {
    try {
      if (!booking || !booking._id || !booking.totalPrice) {
        alert("Booking data missing.");
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
          alert("🎉 Payment Successful!");
          onClose(); // Close modal
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
      console.error("Error initiating payment:", error);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h3>Book Tickets</h3>
            <div className="event-details">
              <h4>{event.title}</h4>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Price per ticket:</strong> ₹{event.price}</p>
            </div>

            {!booking ? (
              <div>
                <label>No. of Tickets:</label>
                <input
                  type="number"
                  value={numberOfTickets}
                  onChange={(e) => setNumberOfTickets(e.target.value)}
                  min="1"
                  max={event?.ticketsAvailable || 10}
                />
                <button onClick={handleBooking}>Confirm Booking</button>
              </div>
            ) : (
              <div className="confirmed">
                <p>Tickets: {booking.numberOfTickets}</p>
                <p>Total: ₹{booking.totalPrice}</p>
                <button className="pay-btn" onClick={handlePayment}>Pay Now</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Booking;
