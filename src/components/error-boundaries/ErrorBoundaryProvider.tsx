import React from 'react';
import FeatureErrorBoundary from './FeatureErrorBoundary';
import { logComponentError } from '@/utils/error';

import type { ReactNode } from 'react';

interface ErrorBoundaryProviderProps {
  children: ReactNode;
  featureName: string;
  fallback?: React.ComponentType<any>;
  showMinimal?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Provider component that wraps features with error boundaries
 */
export const ErrorBoundaryProvider: React.FC<ErrorBoundaryProviderProps> = ({
  children,
  featureName,
  fallback,
  showMinimal = false,
  onError,
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log the error
    logComponentError(error, featureName, errorInfo, {
      featureName,
      timestamp: new Date().toISOString(),
    });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  };

  return (
    <FeatureErrorBoundary
      featureName={featureName}
      fallback={fallback}
      showMinimal={showMinimal}
      onError={handleError}
    >
      {children}
    </FeatureErrorBoundary>
  );
};

/**
 * HOC for wrapping components with error boundaries
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  featureName: string,
  options?: {
    fallback?: React.ComponentType<any>;
    showMinimal?: boolean;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  }
) => {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundaryProvider
      featureName={featureName}
      fallback={options?.fallback}
      showMinimal={options?.showMinimal}
      onError={options?.onError}
    >
      <Component {...props} />
    </ErrorBoundaryProvider>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};