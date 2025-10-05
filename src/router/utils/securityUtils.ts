/**
 * Security utilities for route access control and audit logging
 */

export interface AccessAttempt {
  userId: string;
  userEmail?: string;
  userRole?: string;
  attemptedPath: string;
  timestamp: Date;
  success: boolean;
  reason?: string;
}

class SecurityAudit {
  private attempts: AccessAttempt[] = [];
  private maxAttempts = 1000;

  /**
   * Log an access attempt for security audit
   */
  logAccessAttempt(attempt: AccessAttempt): void {
    this.attempts.unshift(attempt);

    // Keep only the most recent attempts
    if (this.attempts.length > this.maxAttempts) {
      this.attempts = this.attempts.slice(0, this.maxAttempts);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const status = attempt.success ? '✅ ALLOWED' : '❌ DENIED';
      console.log(`[SECURITY AUDIT] ${status}`, {
        user: `${attempt.userEmail} (${attempt.userId})`,
        role: attempt.userRole,
        path: attempt.attemptedPath,
        reason: attempt.reason,
        timestamp: attempt.timestamp.toISOString()
      });
    }

    // Store in localStorage for persistence
    try {
      const existingLogs = localStorage.getItem('security_audit_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];

      logs.unshift({
        ...attempt,
        timestamp: attempt.timestamp.toISOString()
      });

      // Keep only last 100 logs in localStorage
      if (logs.length > 100) {
        logs.splice(100);
      }

      localStorage.setItem('security_audit_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to store security audit log:', error);
    }
  }

  /**
   * Get recent access attempts
   */
  getRecentAttempts(limit: number = 50): AccessAttempt[] {
    return this.attempts.slice(0, limit);
  }

  /**
   * Get failed access attempts for a specific user
   */
  getFailedAttempts(userId: string, timeWindow: number = 3600000): AccessAttempt[] {
    const cutoff = new Date(Date.now() - timeWindow);
    return this.attempts.filter(attempt =>
      attempt.userId === userId &&
      !attempt.success &&
      attempt.timestamp > cutoff
    );
  }

  /**
   * Check if user has too many failed attempts
   */
  isUserBlocked(userId: string, maxFailedAttempts: number = 5): boolean {
    const failedAttempts = this.getFailedAttempts(userId);
    return failedAttempts.length >= maxFailedAttempts;
  }

  /**
   * Get security statistics
   */
  getSecurityStats(): {
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
    uniqueUsers: number;
    recentFailures: number;
  } {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const recentFailures = this.attempts.filter(attempt =>
      !attempt.success && attempt.timestamp > oneHourAgo
    ).length;

    const uniqueUsers = new Set(this.attempts.map(attempt => attempt.userId)).size;
    const successfulAttempts = this.attempts.filter(attempt => attempt.success).length;
    const failedAttempts = this.attempts.filter(attempt => !attempt.success).length;

    return {
      totalAttempts: this.attempts.length,
      successfulAttempts,
      failedAttempts,
      uniqueUsers,
      recentFailures
    };
  }

  /**
   * Clear all audit logs
   */
  clearLogs(): void {
    this.attempts = [];
    localStorage.removeItem('security_audit_logs');
  }
}

// Create singleton instance
export const securityAudit = new SecurityAudit();

/**
 * Validate user role against required roles
 */
export const validateUserRole = (
  userRole: string | undefined,
  requiredRoles: string[]
): { isValid: boolean; reason?: string } => {
  if (!userRole) {
    return { isValid: false, reason: 'No role assigned' };
  }

  if (!requiredRoles.includes(userRole)) {
    return {
      isValid: false,
      reason: `Role '${userRole}' not in required roles: ${requiredRoles.join(', ')}`
    };
  }

  return { isValid: true };
};

/**
 * Validate user permissions against required permissions
 */
export const validateUserPermissions = (
  userPermissions: string[] = [],
  requiredPermissions: string[]
): { isValid: boolean; missingPermissions?: string[] } => {
  const missingPermissions = requiredPermissions.filter(
    permission => !userPermissions.includes(permission)
  );

  if (missingPermissions.length === 0) {
    return { isValid: true };
  }

  return {
    isValid: false,
    missingPermissions
  };
};

/**
 * Generate secure session token for additional verification
 */
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Check if current session is secure
 */
export const isSecureSession = (): boolean => {
  // Check if running over HTTPS in production
  if (process.env.NODE_ENV === 'production' && location.protocol !== 'https:') {
    return false;
  }

  // Additional security checks can be added here
  return true;
};