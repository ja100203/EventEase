import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { auth } = useAuth();

  if (!auth) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    // Role not authorized
    return <Navigate to="/" replace />;
  }

  // Authorized
  return <Outlet />;
};

export default PrivateRoute;
