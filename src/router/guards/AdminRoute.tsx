import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import type { AdminRouteProps } from '@/router/types';

import { logRouteError } from '@/utils/error';
import { AccessDeniedPage } from '@/components/access';

interface EnhancedAdminRouteProps extends AdminRouteProps {
  requiredRole?: string[];
  onAccessDenied?: () => void;
}

/**
 * Enhanced AdminRoute component with proper role-based access control
 */
const AdminRoute: React.FC<EnhancedAdminRouteProps> = ({
  children,
  fallback: FallbackComponent,
  redirectTo = '/login',
  requiredRole = ['admin'],
  onAccessDenied
}) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check admin role
  const userRole = user?.user_metadata?.role;
  const hasRequiredRole = requiredRole.includes(userRole);

  if (!hasRequiredRole) {
    // Log access attempt for security audit
    logRouteError(
      new Error(`Unauthorized admin access attempt by user ${user.id}`),
      `Admin Route: ${location.pathname}`,
      {
        userId: user.id,
        userEmail: user.email,
        userRole: userRole,
        requiredRole: requiredRole,
        attemptedPath: location.pathname,
        timestamp: new Date().toISOString()
      }
    );

    // Use custom fallback if provided
    if (FallbackComponent) {
      return <FallbackComponent />;
    }

    // Use enhanced AccessDeniedPage
    return (
      <AccessDeniedPage
        title="Akses Admin Ditolak"
        description="Anda tidak memiliki izin untuk mengakses halaman admin. Halaman ini hanya dapat diakses oleh administrator."
        attemptedPath={location.pathname}
        requiredRole={requiredRole}
        {...(onAccessDenied && { onAccessDenied })}
        showUserInfo={true}
      />
    );
  }

  // Render children if all checks pass
  return children ? <>{children}</> : <Outlet />;
};

export default AdminRoute;