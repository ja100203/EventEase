import React, { useState } from 'react';
import { loginUser } from '../api/auth'; // your API call
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';
import loginVector from '../images/login.jpg';
import { toast } from 'react-toastify';
import ConfirmDialog from '../components/ConfirmDialog'; // adjust path if needed

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(() => () => {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const sanitizedData = {
        email: formData.email.trim(),
        password: formData.password.trim(),
      };

      const { data } = await loginUser(sanitizedData);
      console.log('Login response:', data);

      const { token, user } = data;

      localStorage.setItem('token', token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role,
        })
      );

      login({
        token,
        name: user.name,
        email: user.email,
        role: user.role,
        id: user._id || user.id,
      });

      toast.success('Login successful! 🎉');

      showConfirmation(`Welcome, ${user.name}! Do you want to go to your dashboard?`, () => {
        window.location.href = `/${user.role}/dashboard`; // or use navigate if using React Router
      });

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Login failed');
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

export default Login;
