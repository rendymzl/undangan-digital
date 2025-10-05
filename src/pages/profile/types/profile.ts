export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  
  // Address information
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  
  // Preferences
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  
  // Notification preferences
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  
  // Account information
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  language?: string;
  timezone?: string;
  theme?: 'light' | 'dark' | 'system';
  avatar?: string;
}

export interface NotificationPreferences {
  emailAddress: string;
  
  // Security notifications
  security: {
    newDeviceLogin: boolean;
    passwordChange: boolean;
    suspiciousActivity: boolean;
  };
  
  // Invitation-related notifications
  invitations: {
    newRSVP: boolean;
    invitationViewed: boolean;
    rsvpReminder: boolean;
    weeklyReport: boolean;
  };
  
  // Billing and payment notifications
  billing: {
    paymentSuccess: boolean;
    paymentFailed: boolean;
    subscriptionExpiring: boolean;
    newInvoice: boolean;
  };
  
  // Marketing and updates
  marketing: {
    newFeatures: boolean;
    tips: boolean;
    newsletter: boolean;
  };
  
  // General preferences
  general: {
    quietMode: boolean;
    dailyDigest: boolean;
    instantNotifications: boolean;
  };
  
  // Timing preferences
  timing: {
    startTime: string; // HH:MM format
    endTime: string;   // HH:MM format
    timezone: string;
  };
  
  // Frequency settings
  frequency: {
    maxPerDay: number;
    minInterval: number; // in minutes
  };
}

export interface NotificationHistory {
  id: string;
  title: string;
  message: string;
  type: 'security' | 'invitation' | 'billing' | 'marketing' | 'system';
  email: string;
  status: 'delivered' | 'failed' | 'pending';
  timestamp: string;
  read: boolean;
  metadata?: Record<string, any>;
}

export interface SecuritySettings {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  loginNotifications: boolean;
  sessionTimeout: number; // in minutes
}

export interface LoginHistory {
  id: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  device: string;
  success: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}