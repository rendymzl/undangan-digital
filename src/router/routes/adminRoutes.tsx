import React from 'react';
import { Route } from 'react-router-dom';
import ManagePaymentsPage from '@/pages/admin/ManagePaymentsPage';
import { AdminRoute } from '@/router/guards';

/**
 * Admin routes that require admin role
 */
export const AdminRoutes = () => (
  <Route element={<AdminRoute />}>
    <Route path="/admin/manage-payments" element={<ManagePaymentsPage />} />
  </Route>
);

export const adminRouteConfig = [
  {
    path: '/admin/manage-payments',
    element: ManagePaymentsPage,
    guard: 'admin' as const,
    meta: {
      title: 'Kelola Pembayaran - Admin',
      description: 'Kelola pembayaran pengguna',
      requiresAuth: true,
      roles: ['admin']
    }
  }
];