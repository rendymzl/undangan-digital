import type { ErrorInfo } from 'react';

export interface ErrorLogEntry {
  id: string;
  timestamp: Date;
  error: Error;
  component: string | undefined;
  userId?: string;
  route: string;
  userAgent: string;
  errorInfo: ErrorInfo | undefined;
  context: Record<string, any> | undefined;
}

class ErrorLogger {
  private logs: ErrorLogEntry[] = [];
  private maxLogs = 100;

  /**
   * Log an error with context information
   */
  logError(
    error: Error, 
    component?: string, 
    errorInfo?: ErrorInfo,
    context?: Record<string, any>
  ): string {
    const errorId = this.generateErrorId();
    
    const logEntry: ErrorLogEntry = {
      id: errorId,
      timestamp: new Date(),
      error,
      component,
      route: window.location.pathname,
      userAgent: navigator.userAgent,
      errorInfo,
      context,
    };

    // Add to local logs
    this.logs.unshift(logEntry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Logged: ${errorId}`);
      console.error('Error:', error);
      console.log('Component:', component);
      console.log('Route:', logEntry.route);
      console.log('Context:', context);
      if (errorInfo) {
        console.log('Component Stack:', errorInfo.componentStack);
      }
      console.groupEnd();
    }

    // Send to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(logEntry);
    }

    return errorId;
  }

  /**
   * Get recent error logs
   */
  getRecentLogs(limit: number = 10): ErrorLogEntry[] {
    return this.logs.slice(0, limit);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    totalErrors: number;
    errorsByComponent: Record<string, number>;
    recentErrorsCount: number;
  } {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const recentErrors = this.logs.filter(log => log.timestamp > oneHourAgo);
    
    const errorsByComponent: Record<string, number> = {};
    this.logs.forEach(log => {
      const component = log.component || 'Unknown';
      errorsByComponent[component] = (errorsByComponent[component] || 0) + 1;
    });

    return {
      totalErrors: this.logs.length,
      errorsByComponent,
      recentErrorsCount: recentErrors.length,
    };
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendToExternalService(logEntry: ErrorLogEntry): Promise<void> {
    try {
      // TODO: Replace with actual error reporting service (e.g., Sentry, LogRocket)
      // For now, we'll just store in localStorage as a fallback
      const existingLogs = localStorage.getItem('error_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      
      logs.unshift({
        ...logEntry,
        timestamp: logEntry.timestamp.toISOString(),
        error: {
          message: logEntry.error.message,
          stack: logEntry.error.stack,
          name: logEntry.error.name,
        },
      });

      // Keep only last 50 logs in localStorage
      if (logs.length > 50) {
        logs.splice(50);
      }

      localStorage.setItem('error_logs', JSON.stringify(logs));
    } catch (storageError) {
      console.error('Failed to store error log:', storageError);
    }
  }
}

// Create singleton instance
export const errorLogger = new ErrorLogger();

// Utility functions for common error logging scenarios
export const logComponentError = (
  error: Error, 
  componentName: string, 
  errorInfo?: ErrorInfo,
  context?: Record<string, any>
): string => {
  return errorLogger.logError(error, componentName, errorInfo, context);
};

export const logRouteError = (
  error: Error, 
  routeName: string,
  context?: Record<string, any>
): string => {
  return errorLogger.logError(error, `Route: ${routeName}`, undefined, context);
};

export const logFeatureError = (
  error: Error, 
  featureName: string,
  context?: Record<string, any>
): string => {
  return errorLogger.logError(error, `Feature: ${featureName}`, undefined, context);
};