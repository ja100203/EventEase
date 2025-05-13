import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { auth } = useAuth();

  const user = auth?.user;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Allowed
  return <Outlet />;
};

export default PrivateRoute;
