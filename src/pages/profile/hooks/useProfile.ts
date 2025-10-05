import { useState, useEffect } from 'react';
import useApi from '@/hooks/shared/useApi';
import { type UserProfile } from '../types/profile';
import { profileApi } from '../services/profileApi';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const fetchProfileApi = useApi<UserProfile>();
  const updateProfileApi = useApi<UserProfile>();

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const result = await fetchProfileApi.execute(() => profileApi.getProfile());
      setProfile(result);
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const result = await updateProfileApi.execute(
        () => profileApi.updateProfile(updates),
        {
          showSuccessToast: true,
          successMessage: 'Profil berhasil diperbarui',
        }
      );
      setProfile(result);
      return result;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const refreshProfile = () => {
    loadProfile();
  };

  return {
    profile,
    isLoading: fetchProfileApi.loading || updateProfileApi.loading,
    error: fetchProfileApi.error || updateProfileApi.error,
    updateProfile,
    refreshProfile,
  };
};