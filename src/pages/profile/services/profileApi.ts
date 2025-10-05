import { apiClient } from '@/services/api/client';
import type { UserProfile, ProfileUpdateRequest, NotificationPreferences, SecuritySettings, LoginHistory, ActivityLog, NotificationHistory } from '../types/profile';

// Mock data for development
const mockProfile: UserProfile = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+62 812 3456 7890',
  avatar: '',
  bio: 'Seorang wedding planner yang berpengalaman dalam membuat undangan digital yang indah dan berkesan.',
  birthDate: '1990-05-15',
  gender: 'male',
  address: 'Jl. Sudirman No. 123',
  city: 'Jakarta',
  postalCode: '12345',
  country: 'Indonesia',
  language: 'id',
  timezone: 'Asia/Jakarta',
  theme: 'system',
  notifications: {
    email: true,
    sms: true,
    push: true,
    marketing: false,
  },
  emailVerified: true,
  phoneVerified: false,
  twoFactorEnabled: false,
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-01-20T10:30:00Z',
  lastLoginAt: '2024-01-20T09:15:00Z',
};

export const profileApi = {
  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For now, return mock data
    // TODO: Replace with actual API call
    // const response = await apiClient.get('/profile');
    // return response.data;
    return mockProfile;
  },

  // Update user profile
  updateProfile: async (updates: ProfileUpdateRequest): Promise<UserProfile> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For now, return updated mock data
    // TODO: Replace with actual API call
    // const response = await apiClient.put('/profile', updates);
    // return response.data;
    
    const updatedProfile = { ...mockProfile, ...updates, updatedAt: new Date().toISOString() };
    return updatedProfile;
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    // Tidak perlu mengatur headers 'Content-Type', biarkan browser yang mengatur secara otomatis
    const response = await apiClient.post('/profile/avatar', formData);

    // Pastikan response bertipe { avatarUrl: string }
    if (
      typeof response === 'object' &&
      response !== null &&
      'data' in response &&
      typeof (response as any).data === 'object' &&
      (response as any).data !== null &&
      'avatarUrl' in (response as any).data
    ) {
      return (response as any).data as { avatarUrl: string };
    } else {
      throw new Error('Response dari server tidak sesuai format yang diharapkan');
    }
  },

  // Remove avatar
  removeAvatar: async (): Promise<void> => {
    await apiClient.delete('/profile/avatar');
  },

  // Get notification preferences
  getNotificationPreferences: async (): Promise<NotificationPreferences> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock notification preferences
    // TODO: Replace with actual API call
    // const response = await apiClient.get('/profile/notifications');
    // return response.data;
    
    const mockPreferences: NotificationPreferences = {
      emailAddress: 'john.doe@example.com',
      security: {
        newDeviceLogin: true,
        passwordChange: true,
        suspiciousActivity: true,
      },
      invitations: {
        newRSVP: true,
        invitationViewed: false,
        rsvpReminder: true,
        weeklyReport: true,
      },
      billing: {
        paymentSuccess: true,
        paymentFailed: true,
        subscriptionExpiring: true,
        newInvoice: true,
      },
      marketing: {
        newFeatures: false,
        tips: false,
        newsletter: false,
      },
      general: {
        quietMode: false,
        dailyDigest: false,
        instantNotifications: true,
      },
      timing: {
        startTime: '08:00',
        endTime: '22:00',
        timezone: 'Asia/Jakarta',
      },
      frequency: {
        maxPerDay: 10,
        minInterval: 15,
      },
    };
    
    return mockPreferences;
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences: NotificationPreferences): Promise<NotificationPreferences> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // TODO: Replace with actual API call
    // const response = await apiClient.put('/profile/notifications', preferences);
    // return response.data;
    
    return preferences;
  },

  // Get notification history
  getNotificationHistory: async (limit = 50): Promise<NotificationHistory[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock notification history
    // TODO: Replace with actual API call
    // const response = await apiClient.get(`/profile/notifications/history?limit=${limit}`);
    // return response.data;
    
    const mockHistory: NotificationHistory[] = [
      {
        id: '1',
        title: 'RSVP Baru Diterima',
        message: 'John Smith telah memberikan konfirmasi kehadiran untuk undangan pernikahan Anda.',
        type: 'invitation',
        email: 'john.doe@example.com',
        status: 'delivered',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        read: false,
      },
      {
        id: '2',
        title: 'Pembayaran Berhasil',
        message: 'Pembayaran untuk paket Premium sebesar Rp 99.000 telah berhasil diproses.',
        type: 'billing',
        email: 'john.doe@example.com',
        status: 'delivered',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        read: true,
      },
      {
        id: '3',
        title: 'Login dari Perangkat Baru',
        message: 'Terdeteksi login dari perangkat baru: iPhone di Jakarta, Indonesia.',
        type: 'security',
        email: 'john.doe@example.com',
        status: 'delivered',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: true,
      },
      {
        id: '4',
        title: 'Undangan Dilihat',
        message: '5 tamu baru telah melihat undangan pernikahan Anda dalam 24 jam terakhir.',
        type: 'invitation',
        email: 'john.doe@example.com',
        status: 'delivered',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        read: true,
      },
      {
        id: '5',
        title: 'Langganan Akan Berakhir',
        message: 'Langganan Premium Anda akan berakhir dalam 7 hari. Perpanjang sekarang untuk melanjutkan.',
        type: 'billing',
        email: 'john.doe@example.com',
        status: 'failed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        read: true,
      },
    ];
    
    return mockHistory.slice(0, limit);
  },

  // Clear notification history
  clearNotificationHistory: async (): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // TODO: Replace with actual API call
    // await apiClient.delete('/profile/notifications/history');
  },

  // Mark notifications as read
  markNotificationsAsRead: async (): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // TODO: Replace with actual API call
    // await apiClient.post('/profile/notifications/mark-read');
  },

  // Send test notification
  sendTestNotification: async (): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // TODO: Replace with actual API call
    // await apiClient.post('/profile/notifications/test');
  },

  // Security settings
  changePassword: async (currentPassword: string, newPassword: string, data: SecuritySettings): Promise<void> => {
    await apiClient.post('/profile/change-password', data);
  },

  // Two-factor authentication
  enableTwoFactor: async (): Promise<{ qrCode: string; secret: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock QR code and secret
    // TODO: Replace with actual API call
    // const response = await apiClient.post('/profile/2fa/enable');
    // return response.data;
    
    return {
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 transparent PNG as placeholder
      secret: 'JBSWY3DPEHPK3PXP'
    };
  },

  verifyTwoFactor: async (token: string): Promise<{ backupCodes: string[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock verification - accept any 6-digit code for demo
    if (token.length !== 6) {
      throw new Error('Invalid verification code');
    }
    
    // TODO: Replace with actual API call
    // const response = await apiClient.post('/profile/2fa/verify', { token });
    // return response.data;
    
    return {
      backupCodes: [
        'ABC123', 'DEF456', 'GHI789', 'JKL012',
        'MNO345', 'PQR678', 'STU901', 'VWX234'
      ]
    };
  },

  disableTwoFactor: async (password: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock password validation
    if (!password) {
      throw new Error('Password is required');
    }
    
    // TODO: Replace with actual API call
    // await apiClient.post('/profile/2fa/disable', { password });
  },

  // Login history
  getLoginHistory: async (limit = 20): Promise<LoginHistory[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock login history data
    // TODO: Replace with actual API call
    // const response = await apiClient.get(`/profile/login-history?limit=${limit}`);
    // return response.data;
    
    const mockHistory: LoginHistory[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Jakarta, Indonesia',
        device: 'Chrome di Windows',
        success: true,
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        location: 'Jakarta, Indonesia',
        device: 'Safari di iPhone',
        success: true,
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Jakarta, Indonesia',
        device: 'Chrome di Windows',
        success: false,
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        location: 'Jakarta, Indonesia',
        device: 'Safari di macOS',
        success: true,
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Jakarta, Indonesia',
        device: 'Chrome di Windows',
        success: true,
      },
    ];
    
    return mockHistory.slice(0, limit);
  },

  // Activity log
  getActivityLog: async (limit = 50): Promise<ActivityLog[]> => {
    const response = await apiClient.get(`/profile/activity?limit=${limit}`);
    if (
      typeof response === 'object' &&
      response !== null &&
      'data' in response
    ) {
      return response.data as ActivityLog[];
    }
    throw new Error('Data aktivitas tidak valid');
  },

  // Account deletion
  requestAccountDeletion: async (password: string): Promise<void> => {
    await apiClient.post('/profile/delete-account', { password });
  },

  // Data export
  exportData: async (): Promise<{ downloadUrl: string }> => {
    const response = await apiClient.post('/profile/export-data');
    if (
      typeof response === 'object' &&
      response !== null &&
      'data' in response
    ) {
      return response.data as { downloadUrl: string };
    }
    throw new Error('Data ekspor tidak valid');
  },

  // Email verification
  sendEmailVerification: async (): Promise<void> => {
    await apiClient.post('/profile/verify-email');
  },

  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post('/profile/verify-email/confirm', { token });
  },

  // Phone verification
  sendPhoneVerification: async (phone: string): Promise<void> => {
    await apiClient.post('/profile/verify-phone', { phone });
  },

  verifyPhone: async (phone: string, code: string): Promise<void> => {
    await apiClient.post('/profile/verify-phone/confirm', { phone, code });
  },
};