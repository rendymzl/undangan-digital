/**
 * Global error handler for unhandled errors and promise rejections
 */

import { errorLogger } from './errorLogger';

export interface GlobalErrorHandlerOptions {
  enableConsoleLogging?: boolean;
  enableReporting?: boolean;
  onError?: (error: Error, context: string) => void;
}

class GlobalErrorHandler {
  private options: GlobalErrorHandlerOptions;
  private isInitialized = false;

  constructor(options: GlobalErrorHandlerOptions = {}) {
    this.options = {
      enableConsoleLogging: true,
      enableReporting: process.env.NODE_ENV === 'production',
      ...options,
    };
  }

  /**
   * Initialize global error handlers
   */
  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Handle uncaught JavaScript errors
    window.addEventListener('error', this.handleError.bind(this));

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));

    // Handle React error boundary errors (if not caught by boundaries)
    if (typeof window !== 'undefined') {
      const originalConsoleError = console.error;
      console.error = (...args: any[]) => {
        // Check if this is a React error boundary error
        const errorMessage = args[0];
        if (typeof errorMessage === 'string' && errorMessage.includes('React')) {
          this.handleReactError(args);
        }
        originalConsoleError.apply(console, args);
      };
    }

    this.isInitialized = true;
    
    if (this.options.enableConsoleLogging) {
      console.log('🛡️ Global error handler initialized');
    }
  }

  /**
   * Handle uncaught JavaScript errors
   */
  private handleError(event: ErrorEvent): void {
    const error = event.error || new Error(event.message);
    const context = `Global Error - ${event.filename}:${event.lineno}:${event.colno}`;

    this.logError(error, context, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: error.stack,
    });
  }

  /**
   * Handle unhandled promise rejections
   */
  private handlePromiseRejection(event: PromiseRejectionEvent): void {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    const context = 'Unhandled Promise Rejection';

    this.logError(error, context, {
      reason: event.reason,
      promise: event.promise,
    });

    // Prevent the default browser behavior (logging to console)
    event.preventDefault();
  }

  /**
   * Handle React-specific errors
   */
  private handleReactError(args: any[]): void {
    try {
      const errorMessage = args[0];
      const error = new Error(errorMessage);
      const context = 'React Error';

      this.logError(error, context, {
        reactError: true,
        args: args,
      });
    } catch (e) {
      // Ignore errors in error handling
    }
  }

  /**
   * Log error with context
   */
  private logError(error: Error, context: string, metadata: Record<string, any> = {}): void {
    // Log to our error logger
    const errorId = errorLogger.logError(error, context, undefined, {
      ...metadata,
      globalHandler: true,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });

    // Console logging
    if (this.options.enableConsoleLogging) {
      console.group(`🚨 Global Error: ${errorId}`);
      console.error('Error:', error);
      console.log('Context:', context);
      console.log('Metadata:', metadata);
      console.groupEnd();
    }

    // Custom error handler
    if (this.options.onError) {
      try {
        this.options.onError(error, context);
      } catch (e) {
        console.error('Error in custom error handler:', e);
      }
    }

    // Report to external service in production
    if (this.options.enableReporting) {
      this.reportError(error, context, metadata, errorId);
    }
  }

  /**
   * Report error to external service
   */
  private async reportError(
    error: Error, 
    context: string, 
    metadata: Record<string, any>,
    errorId: string
  ): Promise<void> {
    try {
      // TODO: Integrate with error reporting service (e.g., Sentry)
      // For now, we'll just store in localStorage
      const errorReport = {
        id: errorId,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        context,
        metadata,
        timestamp: new Date().toISOString(),
      };

      const existingReports = localStorage.getItem('global_error_reports');
      const reports = existingReports ? JSON.parse(existingReports) : [];
      
      reports.unshift(errorReport);
      
      // Keep only last 20 reports
      if (reports.length > 20) {
        reports.splice(20);
      }

      localStorage.setItem('global_error_reports', JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to report error:', e);
    }
  }

  /**
   * Manually report an error
   */
  public reportManualError(error: Error, context: string, metadata?: Record<string, any>): void {
    this.logError(error, context, { ...metadata, manual: true });
  }

  /**
   * Get error statistics
   */
  public getErrorStats(): {
    totalErrors: number;
    recentErrors: number;
    errorsByContext: Record<string, number>;
  } {
    try {
      const reports = JSON.parse(localStorage.getItem('global_error_reports') || '[]');
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      const recentErrors = reports.filter((report: any) => 
        new Date(report.timestamp) > oneHourAgo
      ).length;

      const errorsByContext: Record<string, number> = {};
      reports.forEach((report: any) => {
        const context = report.context || 'Unknown';
        errorsByContext[context] = (errorsByContext[context] || 0) + 1;
      });

      return {
        totalErrors: reports.length,
        recentErrors,
        errorsByContext,
      };
    } catch (e) {
      return {
        totalErrors: 0,
        recentErrors: 0,
        errorsByContext: {},
      };
    }
  }

  /**
   * Clear all error reports
   */
  public clearErrorReports(): void {
    localStorage.removeItem('global_error_reports');
  }
}

// Create and export singleton instance
export const globalErrorHandler = new GlobalErrorHandler();

// Initialize automatically in browser environment
if (typeof window !== 'undefined') {
  globalErrorHandler.initialize();
}