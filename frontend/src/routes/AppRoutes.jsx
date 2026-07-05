import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Entry Point
import RoleSelection from '../modules/common/RoleSelection';

// Unified Auth Pages
import Login from '../modules/common/Login';
import Register from '../modules/common/Register';

// Shared Auth Pages
import ForgotPassword from '../modules/common/ForgotPassword';
import ResetPassword from '../modules/common/ResetPassword';

// Public Pages
import SearchResults from '../modules/common/SearchResults';
import PropertyDetails from '../modules/common/PropertyDetails';
import Home from '../modules/common/Home';

// Dashboards (Protected)
import UserDashboardLayout from '../modules/user/UserDashboardLayout';
import OwnerDashboardLayout from '../modules/user/owner/OwnerDashboardLayout';
import AdminDashboardLayout from '../modules/admin/AdminDashboardLayout';

// Route Guard Wrapper
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Role Selection — App Entry Point */}
      <Route path="/" element={<RoleSelection />} />

      {/* Browse / Search (accessible to all) */}
      <Route path="/browse" element={<Home />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/property/:id" element={<PropertyDetails />} />

      {/* ── User Auth Routes ── */}
      <Route path="/user/login" element={<Login roleType="tenant" />} />
      <Route path="/user/register" element={<Register roleType="tenant" />} />

      {/* ── Landlord Auth Routes ── */}
      <Route path="/landlord/login" element={<Login roleType="landlord" />} />
      <Route path="/landlord/register" element={<Register roleType="landlord" />} />

      {/* ── Admin Auth Route ── */}
      <Route path="/admin/login" element={<Login roleType="admin" />} />

      {/* ── Shared Auth Pages ── */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* ── Legacy Redirects (old /tenant/* → /user/*) ── */}
      <Route path="/tenant/login" element={<Navigate to="/user/login" replace />} />
      <Route path="/tenant/register" element={<Navigate to="/user/register" replace />} />
      <Route path="/dashboard/tenant" element={<Navigate to="/dashboard/user" replace />} />
      {/* old generic /login and /register */}
      <Route path="/login" element={<Navigate to="/user/login" replace />} />
      <Route path="/register" element={<Navigate to="/user/register" replace />} />

      {/* ── User Protected Routes (DB role = 'tenant') ── */}
      <Route element={<ProtectedRoute allowedRoles={['tenant']} redirectTo="/user/login" />}>
        <Route path="/dashboard/user" element={<UserDashboardLayout />} />
      </Route>

      {/* ── Landlord Protected Routes ── */}
      <Route element={<ProtectedRoute allowedRoles={['landlord']} redirectTo="/landlord/login" />}>
        <Route path="/dashboard/landlord" element={<OwnerDashboardLayout />} />
      </Route>

      {/* ── Admin Protected Routes ── */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login" />}>
        <Route path="/dashboard/admin" element={<AdminDashboardLayout />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
