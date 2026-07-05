import React from 'react';
import OwnerHome from './OwnerHome';

/**
 * OwnerDashboardLayout — Route-level shell for the Landlord/Owner dashboard.
 * OwnerHome is self-contained with analytics, tabs, and form management,
 * so this layout simply renders it in the correct module path expected by AppRoutes.
 */
const OwnerDashboardLayout = () => {
  return <OwnerHome />;
};

export default OwnerDashboardLayout;
