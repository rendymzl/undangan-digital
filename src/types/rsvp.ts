export interface RSVP {
  id?: string;
  invitationId: string;
  guestName: string;
  attendanceStatus: 'attending' | 'not_attending' | 'pending';
  numberOfGuests?: number;
  contactInfo?: string;
  createdAt?: string;
  updatedAt?: string;
  message?: string;
} 