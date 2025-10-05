import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            404 - Halaman Tidak Ditemukan
          </CardTitle>
          <CardDescription className="text-gray-600">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman telah dipindahkan atau URL yang Anda masukkan salah.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Link>
            </Button>
            
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Halaman Sebelumnya
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-3">
              Atau kunjungi halaman populer:
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/templates">Lihat Template</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Masuk ke Akun</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;