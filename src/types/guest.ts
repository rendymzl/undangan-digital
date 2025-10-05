// Guest management types
export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  category: string;
  rsvpStatus: 'pending' | 'confirmed' | 'declined' | 'maybe';
  rsvpDate?: Date;
  guestCount: number;
  dietaryRestrictions?: string;
  notes?: string;
  invitationSent: boolean;
  invitationSentDate?: Date;
}

export interface RSVPAnalytics {
  totalInvited: number;
  totalResponded: number;
  confirmedCount: number;
  declinedCount: number;
  maybeCount: number;
  responseRate: number;
  dailyResponses: Array<{
    date: Date;
    count: number;
  }>;
}