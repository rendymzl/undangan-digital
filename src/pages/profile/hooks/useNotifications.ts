import { useState, useEffect } from 'react';
import useApi from '@/hooks/shared/useApi';
import type { NotificationPreferences, NotificationHistory } from '../types/profile';
import { profileApi } from '../services/profileApi';

export const useNotifications = () => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationPreferences | null>(null);
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([]);
  
  const settingsApi = useApi<NotificationPreferences>();
  const historyApi = useApi<NotificationHistory[]>();
  // updateApi sekarang bertipe void, karena beberapa aksi tidak mengembalikan NotificationPreferences
  const updateApi = useApi<void>();

  useEffect(() => {
    loadNotificationData();
  }, []);

  const loadNotificationData = async () => {
    try {
      // Memuat pengaturan notifikasi
      const settings = await settingsApi.execute(() => profileApi.getNotificationPreferences());
      setNotificationSettings(settings);

      // Memuat riwayat notifikasi
      const history = await historyApi.execute(() => profileApi.getNotificationHistory());
      setNotificationHistory(history);
    } catch (error) {
      console.error('Gagal memuat data notifikasi:', error);
    }
  };

  const updateNotificationSettings = async (updates: any) => {
    try {
      if (!notificationSettings) throw new Error('Pengaturan notifikasi belum dimuat');
      // Menangani update objek bertingkat
      // Pastikan semua field yang diperlukan ada
      const updatedSettings: NotificationPreferences = JSON.parse(JSON.stringify(notificationSettings));
      
      // Parse key update (misal: "security.newDeviceLogin")
      Object.keys(updates).forEach(key => {
        if (key.includes('.')) {
          const [section, field] = key.split('.') as [keyof NotificationPreferences, string];
          // Pastikan section bertipe string dan bukan undefined
          if (section && !(section in updatedSettings) || typeof updatedSettings[section] !== 'object' || updatedSettings[section] === null) {
            // Inisialisasi objek jika belum ada
            (updatedSettings as any)[section] = {};
          }
          // Pastikan updatedSettings[section] sudah pasti ada dan bertipe object
          (updatedSettings as any)[section][field] = updates[key];
        } else {
          (updatedSettings as any)[key] = updates[key];
        }
      });

      // Pastikan semua properti wajib ada (jika NotificationPreferences tidak nullable)
      // Jika ada properti yang wajib, tambahkan pengecekan di sini

      const result = await useApi<NotificationPreferences>().execute(
        () => profileApi.updateNotificationPreferences(updatedSettings),
        {
          showSuccessToast: false, // Toast dihandle di komponen
        }
      );
      setNotificationSettings(result);
      return result;
    } catch (error) {
      console.error('Gagal memperbarui pengaturan notifikasi:', error);
      throw error;
    }
  };

  const clearNotificationHistory = async () => {
    try {
      await updateApi.execute(() => profileApi.clearNotificationHistory());
      setNotificationHistory([]);
    } catch (error) {
      console.error('Gagal menghapus riwayat notifikasi:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      await updateApi.execute(() => profileApi.markNotificationsAsRead());
      setNotificationHistory(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Gagal menandai semua notifikasi sebagai telah dibaca:', error);
      throw error;
    }
  };

  const sendTestEmail = async () => {
    try {
      await updateApi.execute(() => profileApi.sendTestNotification());
    } catch (error) {
      console.error('Gagal mengirim email percobaan:', error);
      throw error;
    }
  };

  return {
    notificationSettings,
    notificationHistory,
    isLoading: settingsApi.loading || historyApi.loading || updateApi.loading,
    error: settingsApi.error || historyApi.error || updateApi.error,
    updateNotificationSettings,
    clearNotificationHistory,
    markAllAsRead,
    sendTestEmail,
    refreshNotificationData: loadNotificationData,
  };
};