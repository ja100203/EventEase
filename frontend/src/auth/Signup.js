import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { signupUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import '../styles/signup.css';
import signupVector from '../images/signup.jpg';
import { toast } from 'react-toastify';
import ConfirmDialog from '../components/ConfirmDialog';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(() => () => {});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const showConfirmation = (message, onConfirmAction) => {
    setConfirmMessage(message);
    setConfirmAction(() => onConfirmAction);
    setConfirmOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signupUser(formData);
      const data = res.data;

      console.log('Signup success:', data);

      login({
        token: data.token,
        role: data.role,
        name: data.name,
        email: data.email,
        id: data.id,
      });

      toast.success(`🎉 Welcome, ${data.name}! You’ve signed up successfully.`);

      showConfirmation(`Hi ${data.name}, want to go to your dashboard?`, () => {
        if (data.role === 'admin') navigate('/admin/dashboard');
        else if (data.role === 'organizer') navigate('/organizer/dashboard');
        else if (data.role === 'attendee') navigate('/attendee/dashboard');
        else navigate('/home');
      });

    } catch (err) {
      console.error('Signup error:', err.response || err);
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-background">
      <div className="signup-container">
        <div className="signup-image">
          <img src={signupVector} alt="Event booking illustration" />
        </div>

        <div className="signup-card">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <select
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="organizer">Organizer</option>
              <option value="attendee">Attendee</option>
            </select>
            <button type="submit" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        message={confirmMessage}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          confirmAction();
          setConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default Signup;
