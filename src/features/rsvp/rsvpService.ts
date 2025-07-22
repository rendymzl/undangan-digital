import { supabase } from "../../lib/supabaseClient";
import type { RSVP } from "@/types";

export const getRSVPByInvitation = async (invitationId: string, page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  // Ambil total count terlebih dahulu
  const { count } = await supabase
    .from('rsvp')
    .select('*', { count: 'exact', head: true })
    .eq('invitation_id', invitationId);

  // Ambil data dengan pagination
  const { data, error } = await supabase
    .from('rsvp')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) {
    throw error;
  }

  return {
    data,
    count,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize)
  };
};

export const createUcapan = async (rsvp: RSVP) => {
  const { data, error } = await supabase
    .from('rsvp')
    .insert([{
      invitation_id: rsvp.invitationId,
      guest_name: rsvp.guestName,
      message: rsvp.message,
      attendance_status: rsvp.attendanceStatus,
      number_of_guests: rsvp.numberOfGuests,
      contact_info: rsvp.contactInfo
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}; 