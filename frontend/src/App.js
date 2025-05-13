// src/App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';

const App = () => (
  <>
  <BrowserRouter future={{ v7_relativeSplatPath: true }}>
    <AuthProvider>
    <Navbar/>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
  </>
);

export default App;
