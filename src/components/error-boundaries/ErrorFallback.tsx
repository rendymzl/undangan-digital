import React from 'react';
import type { ErrorFallbackProps } from './types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CustomErrorFallbackProps extends ErrorFallbackProps {
  variant?: 'minimal' | 'card' | 'page';
  title?: string;
  description?: string;
  showErrorDetails?: boolean;
}

const ErrorFallback: React.FC<CustomErrorFallbackProps> = ({
  error,
  resetError,
  errorId,
  variant = 'card',
  title,
  description,
  showErrorDetails = process.env.NODE_ENV === 'development'
}) => {
  const defaultTitle = "Terjadi Kesalahan";
  const defaultDescription = "Komponen ini mengalami masalah. Silakan coba lagi.";

  // Minimal variant for small components
  if (variant === 'minimal') {
    return (
      <Alert variant="destructive" className="my-2">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-sm">
            {title || "Error"}
          </span>
          <Button
            onClick={resetError}
            variant="outline"
            size="sm"
            className="ml-2 h-6 px-2"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Page variant for full-page errors
  if (variant === 'page') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              {title || defaultTitle}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {description || defaultDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showErrorDetails && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm font-medium text-red-800 mb-1">Error Details:</p>
                <p className="text-xs text-red-700 font-mono break-all">
                  {error.message}
                </p>
                {errorId && (
                  <p className="text-xs text-red-600 mt-1">
                    Error ID: {errorId}
                  </p>
                )}
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={resetError}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default card variant
  return (
    <Card className="my-4 border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <CardTitle className="text-base text-red-900">
            {title || defaultTitle}
          </CardTitle>
        </div>
        <CardDescription className="text-red-700">
          {description || defaultDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {showErrorDetails && (
          <div className="bg-white border border-red-200 rounded-md p-3 mb-4">
            <p className="text-sm font-medium text-red-800 mb-1">Error Details:</p>
            <p className="text-xs text-red-700 font-mono break-all">
              {error.message}
            </p>
            {errorId && (
              <p className="text-xs text-red-600 mt-1">
                Error ID: {errorId}
              </p>
            )}
          </div>
        )}
        
        <Button 
          onClick={resetError}
          variant="outline"
          size="sm"
          className="border-red-300 text-red-700 hover:bg-red-100"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Coba Lagi
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorFallback;