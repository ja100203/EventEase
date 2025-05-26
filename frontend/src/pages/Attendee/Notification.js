import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import '../../styles/Attendee.css';
import { useNavigate } from 'react-router-dom';
import '../../styles/main.css'


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const navigate = useNavigate();

  const markAsRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div className="atendee-payment ">
 <div className="event-header">
      <h3 className="notification-title">My Notifications</h3>
        <button className="close-btn" onClick={() => navigate('/attendee/dashboard')}>❌</button>
      </div>  

      {notifications.length === 0 ? (
        <p className='no-events'>No notifications available</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`notification-card ${notification.read ? 'read' : 'unread'}`}
          >
            <div className="notification-message">
              {notification.message}
            </div>
            <div className="notification-meta">
              <small>{new Date(notification.createdAt).toLocaleString()}</small>
              {!notification.read && (
                <button
                  className="mark-read-btn"
                  onClick={() => markAsRead(notification._id)}
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
