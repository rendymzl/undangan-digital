// Payment-related types
export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // in days
  features: string[];
  isPopular?: boolean;
}

export interface UserSubscription {
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  autoRenew: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  description: string;
  createdAt: Date;
  completedAt?: Date;
}