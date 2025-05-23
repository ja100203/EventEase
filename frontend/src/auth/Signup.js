import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { signupUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import '../styles/signup.css';
import signupVector from '../images/signup.jpg';

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
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
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

      setMessage(`🎉 Welcome, ${data.name}! You’ve signed up successfully.`);
      
      // Redirect based on role
      if (data.role === 'admin') navigate('/admin/dashboard');
      else if (data.role === 'organizer') navigate('/organizer/dashboard');
      else if (data.role === 'attendee') navigate('/attendee/dashboard');
      else navigate('/home');

    } catch (err) {
      console.error('Signup error:', err.response || err);
      alert(err.response?.data?.message || 'Signup failed');
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
          {message && <p className="success-message">{message}</p>}
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
    </div>
  );
};

export default Signup;
