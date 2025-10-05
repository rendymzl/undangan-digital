import { useState, useEffect } from 'react';
import useApi from '@/hooks/shared/useApi';
import type { SecuritySettings, LoginHistory } from '../types/profile';
import { profileApi } from '../services/profileApi';

export const useSecurity = () => {
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  
  const securityApi = useApi<SecuritySettings>();
  const loginHistoryApi = useApi<LoginHistory[]>();
  const changePasswordApi = useApi<void>();
  const twoFactorApi = useApi<any>();

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      // Load security settings (mock data for now)
      const mockSecuritySettings: SecuritySettings = {
        twoFactorEnabled: false,
        lastPasswordChange: '2024-01-15T08:00:00Z',
        emailVerified: true,
        phoneVerified: false,
        loginNotifications: true,
        sessionTimeout: 30, // minutes
      };
      setSecuritySettings(mockSecuritySettings);

      // Load login history
      const history = await loginHistoryApi.execute(() => profileApi.getLoginHistory());
      setLoginHistory(history);
    } catch (error) {
      console.error('Error loading security data:', error);
    }
  };

  const updateSecuritySettings = async (updates: Partial<SecuritySettings>) => {
    try {
      // Mock update for now
      setSecuritySettings(prev => prev ? { ...prev, ...updates } : null);
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating security settings:', error);
      throw error;
    }
  };

  const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
      // Menggunakan tipe SecuritySettings dari profileApi
      const securityData: SecuritySettings = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        twoFactorEnabled: securitySettings?.twoFactorEnabled ?? false,
        lastPasswordChange: securitySettings?.lastPasswordChange ?? '',
        emailVerified: securitySettings?.emailVerified ?? false,
        phoneVerified: securitySettings?.phoneVerified ?? false,
        loginNotifications: securitySettings?.loginNotifications ?? false,
        sessionTimeout: securitySettings?.sessionTimeout ?? 30,
      };

      await changePasswordApi.execute(
        () => profileApi.changePassword(data.currentPassword, data.newPassword, securityData),
        {
          showSuccessToast: true,
          successMessage: 'Password berhasil diubah',
        }
      );
      
      // Update tanggal perubahan password terakhir
      setSecuritySettings(prev => prev ? {
        ...prev,
        lastPasswordChange: new Date().toISOString()
      } : null);
    } catch (error) {
      console.error('Gagal mengubah password:', error);
      throw error;
    }
  };

  const enableTwoFactor = async () => {
    try {
      const result = await twoFactorApi.execute(() => profileApi.enableTwoFactor());
      return result;
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      throw error;
    }
  };

  const disableTwoFactor = async () => {
    try {
      const password = window.prompt('Masukkan password untuk konfirmasi:');
      if (!password) throw new Error('Password diperlukan');

      await twoFactorApi.execute(
        () => profileApi.disableTwoFactor(password),
        {
          showSuccessToast: true,
          successMessage: 'Two-factor authentication berhasil dinonaktifkan',
        }
      );

      setSecuritySettings(prev => prev ? {
        ...prev,
        twoFactorEnabled: false
      } : null);
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      throw error;
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, call API to terminate session
      // await profileApi.terminateSession(sessionId);
    } catch (error) {
      console.error('Error terminating session:', error);
      throw error;
    }
  };

  const exportData = async () => {
    try {
      await twoFactorApi.execute(
        () => profileApi.exportData(),
        {
          showSuccessToast: true,
          successMessage: 'Permintaan ekspor data berhasil. Link download akan dikirim ke email Anda.',
        }
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  };

  const deleteAccount = async (password: string) => {
    try {
      await twoFactorApi.execute(
        () => profileApi.requestAccountDeletion(password),
        {
          showSuccessToast: true,
          successMessage: 'Permintaan penghapusan akun berhasil dikirim',
        }
      );
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  return {
    securitySettings,
    loginHistory,
    isLoading: securityApi.loading || loginHistoryApi.loading || changePasswordApi.loading || twoFactorApi.loading,
    error: securityApi.error || loginHistoryApi.error || changePasswordApi.error || twoFactorApi.error,
    updateSecuritySettings,
    changePassword,
    enableTwoFactor,
    disableTwoFactor,
    terminateSession,
    exportData,
    deleteAccount,
    refreshSecurityData: loadSecurityData,
  };
};