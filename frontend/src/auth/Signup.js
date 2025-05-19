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

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await signupUser(formData); // API call
    const data = res.data; // ✅ Extract actual response body

    console.log("Signup success:", data);

    // Pass proper structure to login()
    login({
      token: data.token,
      role: data.role,
      name: data.name,
      email: data.email,
      id: data.id,
    });

    // Redirect based on role
    if (data.role === 'admin') navigate('/admin/dashboard');
    else if (data.role === 'organizer') navigate('/organizer/dashboard');
    else if (data.role === 'attendee') navigate('/attendee/dashboard');
    else navigate('/home');
  } catch (err) {
    console.error("Signup error:", err.response || err);
    alert(err.response?.data?.message || 'Signup failed');
  }
};


  return (
    <div className="signup-background">
      <div className="signup-container">
        {/* Left Side - Image */}
        <div className="signup-image">
          <img src={signupVector} alt="Event booking illustration" />
        </div>

        {/* Right Side - Form */}
        <div className="signup-card">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              required
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <select
              required
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="organizer">Organizer</option>
              <option value="attendee">Attendee</option>
            </select>
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
