// src/App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import '../src/styles/main.css'
// 👉 Import ToastContainer and CSS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <>
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
        {/* 👇 Place ToastContainer here (usually once, globally) */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />
      </AuthProvider>
    </BrowserRouter>
  </>
);

export default App;
