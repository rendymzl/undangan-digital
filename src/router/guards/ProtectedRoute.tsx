import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import type { RouteGuardProps } from '@/router/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EnhancedProtectedRouteProps extends RouteGuardProps {
  requiredPermissions?: string[];
  fallbackComponent?: React.ComponentType;
}

/**
 * Enhanced ProtectedRoute component with better error handling and TypeScript support
 */
const ProtectedRoute: React.FC<EnhancedProtectedRouteProps> = ({
  children,
  fallback: FallbackComponent,
  redirectTo = '/login',
  requiredPermissions = [],
  fallbackComponent: CustomFallback
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

  // Check required permissions if specified
  if (requiredPermissions.length > 0) {
    const userPermissions = user.user_metadata?.permissions || [];
    const hasRequiredPermissions = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (!hasRequiredPermissions) {
      // Use custom fallback if provided
      if (CustomFallback) {
        return <CustomFallback />;
      }

      // Default insufficient permissions UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-amber-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Izin Tidak Mencukupi
              </CardTitle>
              <CardDescription className="text-gray-600">
                Anda tidak memiliki izin yang diperlukan untuk mengakses halaman ini.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <p className="text-sm text-amber-800">
                  <strong>Izin yang diperlukan:</strong> {requiredPermissions.join(', ')}
                </p>
              </div>
              
              <Button asChild className="w-full">
                <Link to="/dashboard">
                  Kembali ke Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Render children if all checks pass
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;