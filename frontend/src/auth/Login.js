import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css'; // Make sure path is correct
import loginVector from '../images/login.jpg';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(formData);
      console.log('Login response:', data);

      // Extract the token and user data from the response
      const { token, user } = data;

      // Store the token and user information in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Use the context to update user state
      login(data);  // This will also update context if you're using it across the app

      // Optionally, you can navigate to a protected page like dashboard
      // navigate('/dashboard');  // Use navigate to redirect user to dashboard after login (if needed)
      
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-image">
          <img src={loginVector} alt="Event booking illustration" />
        </div>
        <div className="login-card">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
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
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
