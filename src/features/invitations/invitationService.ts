import { supabase } from '../../lib/supabaseClient';
import type { Invitation } from '@/types';
import type { RSVP } from '@/types';
import { invitationToApi } from '@/utils/caseTransform';

export async function createInvitation(data: Invitation) {
  // Jangan sertakan field id saat insert, biarkan Supabase/autoincrement yang generate
  const apiData = invitationToApi(data);
  delete apiData.id;
  return await supabase.from('invitations').insert([apiData]);
}

export async function getInvitationsByUser(userId: string) {
  return await supabase.from('invitations').select('*').eq('user_id', userId).order('created_at', { ascending: false });
}

export const getInvitationBySlug = async (slug: string) => {
  // Ambil data undangan
  const { data: invitation, error: invitationError } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .single();

  if (invitationError) {
    throw invitationError;
  }

  // Ambil foto-foto
  const { data: photos, error: photosError } = await supabase
    .from('invitation_photos')
    .select('*')
    .eq('invitation_id', invitation.id)
    .order('created_at', { ascending: true });

  if (photosError) {
    console.error('Error fetching photos:', photosError);
  }

  // Ambil amplop digital
  const { data: rekening, error: rekeningError } = await supabase
    .from('amplop_digital')
    .select('*')
    .eq('invitation_id', invitation.id)
    .order('created_at', { ascending: true });

  if (rekeningError) {
    console.error('Error fetching rekening:', rekeningError);
  }

  // Ambil love story
  const { data: loveStory, error: loveStoryError } = await supabase
    .from('love_story')
    .select('*')
    .eq('invitation_id', invitation.id)
    .order('created_at', { ascending: true });

  if (loveStoryError) {
    console.error('Error fetching love story:', loveStoryError);
  }

  // Gabungkan semua data
  return {
    data: {
      ...invitation,
      galeri: photos?.map(p => p.url) || [],
      rekening: rekening?.map(r => ({
        bank: r.bank,
        accountName: r.atas_nama,
        accountNumber: r.nomor
      })) || [],
      cerita: loveStory?.map(s => `${s.tahun} - ${s.judul}\n${s.deskripsi}`).join('\n\n') || ''
    }
  };
};

export async function createUcapan(data: RSVP) {
  return await supabase.from('rsvp').insert([data]);
}

export async function deleteInvitation(id: string) {
  return await supabase.from('invitations').delete().eq('id', id);
} 