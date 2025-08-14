export type AttendanceStatus = 'attending' | 'not_attending' | 'pending';

export interface RSVP {
  id?: string;
  invitationId: string;
  guestName: string;
  attendanceStatus: AttendanceStatus;
  numberOfGuests?: number;
  contactInfo?: string;
  createdAt?: string;
  updatedAt?: string;
  message?: string;
} 