import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load auth from localStorage on first render
    const storedAuth = JSON.parse(localStorage.getItem('auth'));
    if (storedAuth) {
      setAuth(storedAuth);
    }
  }, []);

  const login = (userData) => {
    setAuth(userData);
    localStorage.setItem('auth', JSON.stringify(userData));

    const { role } = userData;
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
