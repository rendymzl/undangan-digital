import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorPageProps {
  title?: string;
  description?: string;
  error?: Error;
  showErrorDetails?: boolean;
  onRetry?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  title = "Terjadi Kesalahan",
  description = "Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu tentang masalah ini.",
  error,
  showErrorDetails = false,
  onRetry
}) => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleReportError = () => {
    const subject = encodeURIComponent('Laporan Error - Menantikan App');
    const body = encodeURIComponent(`
Halo Tim Support,

Saya mengalami error saat menggunakan aplikasi Menantikan.

Detail Error:
- Waktu: ${new Date().toLocaleString('id-ID')}
- URL: ${window.location.href}
- User Agent: ${navigator.userAgent}
${error ? `- Error Message: ${error.message}` : ''}

Mohon bantuan untuk mengatasi masalah ini.

Terima kasih.
    `);
    
    window.open(`mailto:support@menantikan.com?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showErrorDetails && error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm font-medium text-red-800 mb-2">Detail Error:</p>
              <div className="bg-white rounded border p-3">
                <p className="text-xs font-mono text-red-700 break-all">
                  {error.message}
                </p>
                {error.stack && (
                  <details className="mt-2">
                    <summary className="text-xs text-red-600 cursor-pointer hover:text-red-800">
                      Stack Trace
                    </summary>
                    <pre className="text-xs text-red-600 mt-1 whitespace-pre-wrap break-all">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            {onRetry && (
              <Button 
                onClick={onRetry}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
            )}
            
            <Button 
              onClick={handleReload}
              variant={onRetry ? "outline" : "default"}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Muat Ulang Halaman
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Link>
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-3 text-center">
              Masalah masih berlanjut?
            </p>
            <Button 
              onClick={handleReportError}
              variant="ghost" 
              size="sm"
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Laporkan Masalah
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage;