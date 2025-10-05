import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // in days
  features: string[];
  limits: {
    invitations: number | 'unlimited';
    guests: number | 'unlimited';
    templates: number | 'unlimited';
    validity: number; // days
  };
  isPopular?: boolean;
}

export interface UseSubscriptionOptions {
  onPlanChange?: (planId: string) => void;
  onPaymentSuccess?: (planId: string) => void;
  onPaymentError?: (error: string) => void;
}

export default function useSubscription({
  onPlanChange,
  onPaymentSuccess,
  onPaymentError,
}: UseSubscriptionOptions = {}) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('bank_transfer');

  // Available subscription plans
  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Gratis',
      price: 0,
      duration: 0, // permanent
      features: [
        '1 undangan aktif',
        'Maksimal 50 tamu',
        '5 template dasar',
        'Customization terbatas',
        'RSVP tracking dasar',
        'Watermark Menantikan'
      ],
      limits: {
        invitations: 1,
        guests: 50,
        templates: 5,
        validity: 30,
      },
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 49000,
      duration: 30,
      features: [
        '3 undangan aktif',
        'Maksimal 200 tamu',
        '50+ template premium',
        'Full customization',
        'Advanced analytics',
        'Tanpa watermark',
        'Bulk WhatsApp sending'
      ],
      limits: {
        invitations: 3,
        guests: 200,
        templates: 50,
        validity: 60,
      },
      isPopular: true,
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: 89000,
      duration: 60,
      features: [
        'Unlimited undangan',
        'Unlimited tamu',
        'Semua template + exclusive',
        'Custom CSS',
        'Custom domain',
        'Priority support',
        'API access'
      ],
      limits: {
        invitations: 'unlimited',
        guests: 'unlimited',
        templates: 'unlimited',
        validity: 90,
      },
    },
    {
      id: 'business',
      name: 'Business',
      price: 299000,
      duration: 365,
      features: [
        'Semua fitur Ultimate',
        'Multi-user dashboard',
        'Custom branding',
        'Dedicated support',
        'SLA guarantee',
        'Training & onboarding'
      ],
      limits: {
        invitations: 'unlimited',
        guests: 'unlimited',
        templates: 'unlimited',
        validity: 365,
      },
    },
  ];

  // Select a plan
  const selectPlan = useCallback((planId: string) => {
    setSelectedPlan(planId);
    onPlanChange?.(planId);
  }, [onPlanChange]);

  // Process subscription upgrade/change
  const processSubscription = useCallback(async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      toast.error('Plan tidak ditemukan');
      return;
    }

    if (plan.price === 0) {
      // Free plan - no payment needed
      toast.success('Berhasil beralih ke plan gratis');
      onPaymentSuccess?.(planId);
      return;
    }

    setIsProcessing(true);

    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate payment success/failure
      const isSuccess = Math.random() > 0.1; // 90% success rate
      
      if (isSuccess) {
        toast.success(`Berhasil upgrade ke ${plan.name}!`);
        onPaymentSuccess?.(planId);
      } else {
        throw new Error('Pembayaran gagal diproses');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
      toast.error(errorMessage);
      onPaymentError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [plans, onPaymentSuccess, onPaymentError]);

  // Get plan by ID
  const getPlan = useCallback((planId: string) => {
    return plans.find(p => p.id === planId);
  }, [plans]);

  // Calculate discount for yearly billing
  const calculateYearlyDiscount = useCallback((monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 12;
    const discountedPrice = yearlyPrice * 0.8; // 20% discount
    const savings = yearlyPrice - discountedPrice;
    
    return {
      yearlyPrice: discountedPrice,
      savings,
      discountPercentage: 20,
    };
  }, []);

  // Format currency
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Compare plans
  const comparePlans = useCallback((planIds: string[]) => {
    return planIds.map(id => getPlan(id)).filter(Boolean) as SubscriptionPlan[];
  }, [getPlan]);

  return {
    // State
    plans,
    selectedPlan,
    isProcessing,
    paymentMethod,
    
    // Actions
    selectPlan,
    processSubscription,
    setPaymentMethod,
    
    // Utilities
    getPlan,
    calculateYearlyDiscount,
    formatCurrency,
    comparePlans,
  };
}