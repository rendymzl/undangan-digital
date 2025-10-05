// Dashboard-specific types
export interface DashboardStats {
  totalInvitations: number;
  activeInvitations: number;
  totalGuests: number;
  confirmedRSVPs: number;
  pendingRSVPs: number;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType;
  href: string;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: 'invitation_created' | 'guest_added' | 'rsvp_received' | 'payment_made';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}