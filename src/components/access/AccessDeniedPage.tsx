import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Home, Mail, Clock, User, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { securityAudit } from '@/router/utils/securityUtils';
import { EMAIL_ADDRESSES, EMAIL_TEMPLATES, createSupportEmail } from '@/constants/contact';

interface AccessDeniedPageProps {
  title?: string;
  description?: string;
  attemptedPath?: string;
  requiredRole?: string[];
  requiredPermissions?: string[];
  showUserInfo?: boolean;
  onAccessDenied?: () => void;
}

const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  title = "Akses Ditolak",
  description = "Anda tidak memiliki izin untuk mengakses halaman ini.",
  attemptedPath,
  requiredRole = [],
  requiredPermissions = [],
  showUserInfo = true,
  onAccessDenied
}) => {
  const { user } = useAuth();

  useEffect(() => {
    // Log the access attempt for security audit
    if (user && attemptedPath) {
      securityAudit.logAccessAttempt({
        userId: user.id,
        ...(user.email && { userEmail: user.email }),
        ...(user.user_metadata?.role && { userRole: user.user_metadata.role }),
        attemptedPath,
        timestamp: new Date(),
        success: false,
        reason: `Missing required role/permissions`
      });
    }

    // Call custom access denied handler
    if (onAccessDenied) {
      onAccessDenied();
    }
  }, [user, attemptedPath, onAccessDenied]);

  const handleRequestAccess = () => {
    const body = `
Halo Admin,

Saya memerlukan akses ke halaman berikut:

Detail Permintaan:
- Halaman: ${attemptedPath || 'Tidak diketahui'}
- Role yang diperlukan: ${requiredRole.join(', ') || 'Tidak diketahui'}
- Permissions yang diperlukan: ${requiredPermissions.join(', ') || 'Tidak ada'}

Alasan memerlukan akses:
[Silakan jelaskan alasan Anda memerlukan akses ini]

Terima kasih atas perhatiannya.

Best regards,
${user?.email || 'User'}
    `;

    const emailUrl = createSupportEmail(
      EMAIL_TEMPLATES.ACCESS_REQUEST.SUBJECT,
      body,
      {
        ...(user?.id && { userId: user.id }),
        ...(user?.email && { email: user.email }),
        ...(user?.user_metadata?.role && { role: user.user_metadata.role }),
      }
    );

    window.open(emailUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Access Details */}
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-red-800 mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Detail Akses
            </h4>
            <div className="space-y-2 text-xs text-red-700">
              {attemptedPath && (
                <div className="flex justify-between">
                  <span>Halaman:</span>
                  <span className="font-mono">{attemptedPath}</span>
                </div>
              )}
              {showUserInfo && user && (
                <>
                  <div className="flex justify-between">
                    <span>Role Anda:</span>
                    <span className="font-mono">{user.user_metadata?.role || 'Tidak ada'}</span>
                  </div>
                  {requiredRole.length > 0 && (
                    <div className="flex justify-between">
                      <span>Role diperlukan:</span>
                      <span className="font-mono">{requiredRole.join(', ')}</span>
                    </div>
                  )}
                  {requiredPermissions.length > 0 && (
                    <div className="flex justify-between">
                      <span>Permissions diperlukan:</span>
                      <span className="font-mono">{requiredPermissions.join(', ')}</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between">
                <span>Waktu:</span>
                <span className="font-mono">{new Date().toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Catatan Keamanan:</strong> Percobaan akses ini telah dicatat untuk audit keamanan.
              Jika Anda merasa ini adalah kesalahan, silakan hubungi administrator sistem.
            </AlertDescription>
          </Alert>

          {/* User Info */}
          {showUserInfo && user && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Informasi Akun
              </h4>
              <div className="text-xs text-blue-700 space-y-1">
                <div>Email: {user.email}</div>
                <div>User ID: {user.id}</div>
                <div>Terdaftar: {new Date(user.created_at).toLocaleDateString('id-ID')}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button asChild className="w-full">
              <Link to="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Dashboard
              </Link>
            </Button>

            <Button
              onClick={handleRequestAccess}
              variant="outline"
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Minta Akses ke Admin
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500">
              Butuh bantuan? Hubungi{' '}
              <a
                href={EMAIL_ADDRESSES.SUPPORT}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                support@menantikan.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDeniedPage;