import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface PaymentStatus {
  subscriptionId: string;
  planId: string;
  planName: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  remainingDays: number;
  usageStats: {
    invitationsUsed: number;
    guestsUsed: number;
    templatesUsed: number;
  };
}

export interface UsePaymentStatusOptions {
  userId?: string;
  onStatusChange?: (status: PaymentStatus) => void;
}

export default function usePaymentStatus({
  userId,
  onStatusChange,
}: UsePaymentStatusOptions = {}) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch payment status
  const fetchPaymentStatus = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStatus: PaymentStatus = {
        subscriptionId: 'sub_123',
        planId: 'premium',
        planName: 'Premium',
        status: 'active',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        autoRenew: true,
        remainingDays: 15,
        usageStats: {
          invitationsUsed: 2,
          guestsUsed: 85,
          templatesUsed: 12,
        },
      };

      setPaymentStatus(mockStatus);
      onStatusChange?.(mockStatus);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payment status';
      setError(errorMessage);
      toast.error('Gagal memuat status pembayaran');
    } finally {
      setIsLoading(false);
    }
  }, [userId, onStatusChange]);

  // Toggle auto renewal
  const toggleAutoRenewal = useCallback(async (enabled: boolean) => {
    if (!paymentStatus) return;

    try {
      setIsLoading(true);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPaymentStatus(prev => prev ? {
        ...prev,
        autoRenew: enabled
      } : null);
      
      toast.success(`Auto renewal ${enabled ? 'diaktifkan' : 'dinonaktifkan'}`);
      
    } catch (err) {
      toast.error('Gagal mengubah pengaturan auto renewal');
    } finally {
      setIsLoading(false);
    }
  }, [paymentStatus]);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    if (!paymentStatus) return;

    try {
      setIsLoading(true);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPaymentStatus(prev => prev ? {
        ...prev,
        status: 'cancelled',
        autoRenew: false
      } : null);
      
      toast.success('Subscription berhasil dibatalkan');
      
    } catch (err) {
      toast.error('Gagal membatalkan subscription');
    } finally {
      setIsLoading(false);
    }
  }, [paymentStatus]);

  // Reactivate subscription
  const reactivateSubscription = useCallback(async () => {
    if (!paymentStatus) return;

    try {
      setIsLoading(true);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPaymentStatus(prev => prev ? {
        ...prev,
        status: 'active',
        autoRenew: true
      } : null);
      
      toast.success('Subscription berhasil diaktifkan kembali');
      
    } catch (err) {
      toast.error('Gagal mengaktifkan kembali subscription');
    } finally {
      setIsLoading(false);
    }
  }, [paymentStatus]);

  // Check if subscription is expiring soon
  const isExpiringSoon = paymentStatus ? paymentStatus.remainingDays <= 7 : false;

  // Check if subscription is expired
  const isExpired = paymentStatus ? paymentStatus.status === 'expired' : false;

  // Get usage percentage
  const getUsagePercentage = useCallback((type: 'invitations' | 'guests' | 'templates') => {
    if (!paymentStatus) return 0;
    
    // This would be based on plan limits - mock implementation
    const limits = {
      invitations: 3,
      guests: 200,
      templates: 50,
    };
    
    const used = paymentStatus.usageStats[`${type}Used`];
    const limit = limits[type];
    
    return (used / limit) * 100;
  }, [paymentStatus]);

  useEffect(() => {
    fetchPaymentStatus();
  }, [fetchPaymentStatus]);

  return {
    // State
    paymentStatus,
    isLoading,
    error,
    isExpiringSoon,
    isExpired,
    
    // Actions
    fetchPaymentStatus,
    toggleAutoRenewal,
    cancelSubscription,
    reactivateSubscription,
    
    // Utilities
    getUsagePercentage,
  };
}