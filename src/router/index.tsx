
import { Routes, Route } from 'react-router-dom';
import { RouteErrorBoundary } from '@/components/error-boundaries';

// Import page components
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import UndanganDetailPage from '@/pages/UndanganDetailPage';
import PreviewPage from '@/pages/PreviewPage';
import SemuaTemplatePage from '@/pages/SemuaTemplatePage';
import { NotFoundPage } from '@/pages/error';

// Import layout
import DashboardLayout from '@/components/layout/DashboardLayout';

// Import protected components
import DashboardPage from '@/pages/dashboard/DashboardPage';
import BuatUndanganPage from '@/pages/dashboard/BuatUndanganPage';
import PilihTemplatePage from '@/pages/dashboard/PilihTemplatePage';
import UndangTamuPage from '@/pages/dashboard/UndangTamuPage';

// Import profile components
import { UserProfilePage } from '@/pages/profile';
import { SecuritySettingsPage } from '@/pages/profile/SecuritySettingsPage';
import { NotificationSettingsPage } from '@/pages/profile/NotificationSettingsPage';

// Import support components
import { HelpCenterPage } from '@/pages/support/HelpCenterPage';
import { SupportTicketPage } from '@/pages/support/SupportTicketPage';

// Import admin components
import ManagePaymentsPage from '@/pages/admin/ManagePaymentsPage';

// Import route guards
import ProtectedRoute from './guards/ProtectedRoute';
import AdminRoute from './guards/AdminRoute';

/**
 * Main router configuration that combines all route types
 */
export const AppRoutes = () => (
  <RouteErrorBoundary routeName="App Routes">
    <Routes>
      {/* Public routes - accessible to everyone */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/templates" element={<SemuaTemplatePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/preview/draft" element={<PreviewPage />} />

      {/* Protected routes with dashboard layout - require authentication */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="buat-undangan" element={<BuatUndanganPage />} />
        <Route path="pilih-template" element={<PilihTemplatePage />} />
        <Route path="undang-tamu" element={<UndangTamuPage />} />
        <Route path="undang-tamu/:id" element={<UndangTamuPage />} />
        <Route path="edit-undangan/:id" element={<BuatUndanganPage />} />
        
        {/* Placeholder routes for new menu items */}
        <Route path="rsvp" element={<div className="p-6"><h1 className="text-2xl font-bold">RSVP Management</h1><p className="text-gray-600 mt-2">Fitur ini akan segera hadir!</p></div>} />
        <Route path="kirim-undangan" element={<div className="p-6"><h1 className="text-2xl font-bold">Kirim Undangan</h1><p className="text-gray-600 mt-2">Fitur ini akan segera hadir!</p></div>} />
        <Route path="pembayaran" element={<div className="p-6"><h1 className="text-2xl font-bold">Pembayaran</h1><p className="text-gray-600 mt-2">Fitur ini akan segera hadir!</p></div>} />
        <Route path="transaksi" element={<div className="p-6"><h1 className="text-2xl font-bold">Riwayat Transaksi</h1><p className="text-gray-600 mt-2">Fitur ini akan segera hadir!</p></div>} />
        <Route path="statistik" element={<div className="p-6"><h1 className="text-2xl font-bold">Statistik</h1><p className="text-gray-600 mt-2">Fitur ini akan segera hadir!</p></div>} />
        <Route path="profil" element={<UserProfilePage />} />
        <Route path="keamanan" element={<SecuritySettingsPage />} />
        <Route path="notifikasi" element={<NotificationSettingsPage />} />
        <Route path="bantuan" element={<HelpCenterPage />} />
        <Route path="support-tickets" element={<SupportTicketPage />} />
        <Route path="pengaturan" element={<div className="p-6"><h1 className="text-2xl font-bold">Pengaturan</h1><p className="text-gray-600 mt-2">Fitur ini akan segera hadir!</p></div>} />

      </Route>

      {/* Admin routes - require admin role */}
      <Route path="/admin/payments" element={
        <AdminRoute requiredRole={['admin', 'super-admin']}>
          <ManagePaymentsPage />
        </AdminRoute>
      } />

      {/* Dynamic route for invitations - should be last */}
      <Route path="/:slug" element={<UndanganDetailPage />} />

      {/* 404 route - must be last */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </RouteErrorBoundary>
);

// Export route configurations for potential use in navigation, breadcrumbs, etc.
export { publicRouteConfig } from './routes/publicRoutes';
export { protectedRouteConfig } from './routes/protectedRoutes';
export { adminRouteConfig } from './routes/adminRoutes';

// Export guards
export * from './guards';

// Export utilities
export * from './utils/routeUtils';
export * from './utils/securityUtils';

// Export types
export type {
  RouteConfig,
  RouteGuardProps,
  AdminRouteProps,
  ProtectedRouteProps,
  RouteMetadata,
  NavigationItem
} from './types';