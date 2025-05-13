import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('auth')) || null);
  const navigate = useNavigate();

  const login = (userData) => {
    setAuth(userData);
    localStorage.setItem('auth', JSON.stringify(userData));

    const { role } = userData.user; // ✅ FIXED this line

    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'organizer') navigate('/organizer/dashboard');
    else if (role === 'attendee') navigate('/attendee/dashboard');
    else navigate('/');
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
