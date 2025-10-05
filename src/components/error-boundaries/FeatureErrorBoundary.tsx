import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import type { ErrorBoundaryState, ErrorBoundaryProps } from './types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface FeatureErrorBoundaryProps extends ErrorBoundaryProps {
  children: ReactNode;
  featureName?: string;
  showMinimal?: boolean;
}

class FeatureErrorBoundary extends Component<FeatureErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: FeatureErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('FeatureErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log feature-specific error
    console.error('Feature error logged:', {
      feature: this.props.featureName || 'unknown',
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  override componentDidUpdate(prevProps: FeatureErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys) {
        const hasResetKeyChanged = resetKeys.some(
          (key, index) => prevProps.resetKeys?.[index] !== key
        );
        if (hasResetKeyChanged) {
          this.resetErrorBoundary();
        }
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  override render() {
    if (this.state.hasError) {
      const { fallback: Fallback, featureName, showMinimal } = this.props;
      
      if (Fallback && this.state.error) {
        return (
          <Fallback 
            error={this.state.error} 
            resetError={this.resetErrorBoundary}
            errorId={`feature-error-${featureName || 'unknown'}`}
          />
        );
      }

      // Minimal error display for small components
      if (showMinimal) {
        return (
          <div className="p-2 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm text-red-700">
                  {featureName ? `${featureName} error` : 'Component error'}
                </span>
              </div>
              <Button
                onClick={this.resetErrorBoundary}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
          </div>
        );
      }

      // Standard error display
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <p className="font-medium mb-1">
                {featureName 
                  ? `Terjadi masalah pada fitur ${featureName}`
                  : 'Terjadi masalah pada komponen ini'
                }
              </p>
              <p className="text-sm opacity-90">
                Fitur ini sementara tidak dapat digunakan. Silakan coba lagi.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <p className="text-xs font-mono mt-2 opacity-75 break-all">
                  {this.state.error.message}
                </p>
              )}
            </div>
            <Button
              onClick={this.resetErrorBoundary}
              variant="outline"
              size="sm"
              className="ml-4 shrink-0"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Coba Lagi
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default FeatureErrorBoundary;