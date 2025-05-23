import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import '../../styles/Attendee.css'; // Reusing styles
import '../../styles/main.css'
import { useNavigate } from 'react-router-dom';

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('/payment/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(res.data);
      } catch (err) {
        console.error("Failed to fetch payments", err);
        setError("Unable to fetch payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

      const navigate = useNavigate();
  

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="atendee-booking">
  <div className="event-header">
      <h3 className="my-bookings-title">All Payments (Admin View)</h3>
        <button className="close-btn" onClick={() => navigate('/admin/dashboard')}>❌</button>
      </div>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Status</th>
                <th>Transaction ID</th>
                <th>Event</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>₹{p.amount} {p.currency?.toUpperCase()}</td>
                  <td>
                    <span className={`status-badge ${p.status === 'completed' ? 'status-paid' : 'status-pending'}`}>
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{p.transactionId}</td>
                  <td>{p.booking?.event || 'N/A'}</td>
                  <td>{p.user?.name} <br /> <small>{p.user?.email}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentsList;
