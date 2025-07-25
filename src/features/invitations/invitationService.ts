import { supabase } from '../../lib/supabaseClient';
import type { Invitation } from '@/types';
import type { RSVP } from '@/types';
import { invitationToApi } from '@/utils/caseTransform';

export function createInvitation(apiData: any) {
  // 'apiData' adalah objek yang Anda tampilkan di console.log
  return supabase
    .from('invitations')
    .insert([apiData]) // <-- Pastikan data dibungkus dalam array
    .select('id')      // <-- Penting untuk mendapatkan ID kembali
    .single();         // <-- Kembalikan satu baris hasil
}

export async function getInvitationsByUser(userId: string) {
  return await supabase.from('invitations').select('*').eq('user_id', userId).order('created_at', { ascending: false });
}

export async function getInvitationBySlug(slug: string) {
  // Gunakan satu query untuk mengambil undangan beserta semua data terkaitnya
  const response = await supabase
    .from('invitations')
    .select(`
      *,
      invitation_photos(*),
      amplop_digital(*),
      love_story(*)
    `)
    .eq('slug', slug)
    .single();

  // Langsung kembalikan hasil dari Supabase, yang sudah dalam format { data, error }
  return response;
}

// Fungsi untuk mengambil satu undangan berdasarkan ID
export async function getInvitationById(id: string) {
  // --- PERBAIKI QUERY DI SINI ---
  const response = await supabase
    .from('invitations')
    // Ambil semua data dari invitations DAN semua data terkait dari tabel lain
    .select(`
      *,
      amplop_digital(*)
    `)
    .eq('id', id)
    .single();

  return response;
}

// Fungsi untuk memperbarui undangan
export async function updateInvitation(id: string, apiData: any) {
  // Tidak ada lagi transformasi di sini.
  // Fungsi ini hanya bertugas mengirim data ke Supabase.
  return supabase
    .from('invitations')
    .update(apiData)
    .eq('id', id);
}

export async function createUcapan(data: RSVP) {
  return await supabase.from('rsvp').insert([data]);
}

export async function deleteInvitation(id: string) {
  return await supabase.from('invitations').delete().eq('id', id);
} 