import { supabase } from '../../lib/supabaseClient';
import type { InvitationPhoto } from '@/types';

export async function uploadPhoto(file: File, invitationId: string) {
  const filePath = `${invitationId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from('invitation_photos').upload(filePath, file);
  return { data, error, filePath };
}

export async function addPhotoMetadata(data: InvitationPhoto) {
  return await supabase.from('invitation_photos').insert([
    data
  ]);
}

export async function getGalleryPhotos(invitationId: string) {
  return await supabase.from('invitation_photos').select('*').eq('invitation_id', invitationId).order('created_at', { ascending: true });
} 