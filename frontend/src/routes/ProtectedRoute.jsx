import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { DashboardSkeleton } from '../components/SkeletonLoader';

/**
 * ProtectedRoute
 * @param {string[]} allowedRoles - array of DB role values that can access the route
 * @param {string} redirectTo - path to redirect to when not authenticated
 */
const ProtectedRoute = ({ allowedRoles = [], redirectTo = '/user/login' }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <DashboardSkeleton />
      </div>
    );
  }

  // If user is not logged in, redirect to the appropriate login page
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // If user role is not allowed, redirect to home page
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Renders nested routes
  return <Outlet />;
};

export default ProtectedRoute;
