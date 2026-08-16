import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useAuthStore();

  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
  console.log('PrivateRoute - user:', user);
  console.log('PrivateRoute - required role:', role);

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (role) {
    if (!user) {
      console.log('User data not loaded yet');
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    if (user.role !== role) {
      console.log(`User role ${user.role} does not match required role ${role}`);
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
