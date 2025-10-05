import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AppRoutes } from '@/router';
import { AppErrorBoundary } from '@/components/error-boundaries';
import { configManager, printEnvReport } from '@/config';
// import { TOAST_MESSAGES } from '@/constants/ui';
import { globalErrorHandler } from '@/utils/error';
import { architectureTestRunner } from '@/utils/test';

import type { AppConfig } from '@/config';

// Loading component
const AppLoading: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg font-medium">Menantikan</p>
      <p className="text-gray-500 text-sm mt-2">Memuat aplikasi...</p>
    </div>
  </div>
);

// Error component for initialization failures
const AppInitError: React.FC<{ error: Error; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Gagal Memuat Aplikasi</h2>
      <p className="text-gray-600 mb-4">
        Terjadi kesalahan saat menginisialisasi aplikasi. Silakan periksa konfigurasi Anda.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-left">
          <p className="text-sm font-medium text-red-800 mb-1">Error Details:</p>
          <p className="text-xs text-red-700 font-mono break-all">{error.message}</p>
        </div>
      )}
      <button
        onClick={onRetry}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  </div>
);

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  const [config, setConfig] = useState<AppConfig | null>(null);

  const initializeApp = async () => {
    try {
      setInitError(null);
      
      // Validate environment variables in development
      if (process.env.NODE_ENV === 'development') {
        printEnvReport();
      }
      
      // Initialize configuration manager
      await configManager.initialize();
      const appConfig = configManager.getConfig();
      setConfig(appConfig);
      
      // Initialize global error handler
      globalErrorHandler.initialize();
      
      // Log successful initialization
      if (appConfig.app.debug) {
        console.log('🚀 App initialized successfully', {
          version: appConfig.app.version,
          environment: appConfig.app.environment,
          features: appConfig.features,
        });
        
        // Run architecture validation in development
        setTimeout(() => {
          architectureTestRunner.runAllTests().then(result => {
            if (result.overallSuccess) {
              console.log('✅ Architecture validation passed');
            } else {
              console.warn('⚠️ Architecture validation found issues');
            }
          });
        }, 1000);
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setInitError(error as Error);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  // Show loading state
  if (!isInitialized && !initError) {
    return <AppLoading />;
  }

  // Show error state
  if (initError) {
    return <AppInitError error={initError} onRetry={initializeApp} />;
  }

  // Main app
  return (
    <AppErrorBoundary>
      <Toaster 
        richColors 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'white',
            border: '1px solid #e5e7eb',
            color: '#374151',
          },
        }}
      />
      <Router>
        <AppRoutes />
      </Router>
    </AppErrorBoundary>
  );
}

export default App;
