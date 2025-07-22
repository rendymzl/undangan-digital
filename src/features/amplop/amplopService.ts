import { supabase } from '../../lib/supabaseClient';

export interface AmplopDigital {
  id: string;
  invitation_id: string;
  bank: string;
  atas_nama: string;
  nomor: string;
  catatan?: string;
  qr_url?: string;
  created_at?: string;
}

export async function getAmplopByInvitation(invitationId: string): Promise<AmplopDigital[]> {
  const { data, error } = await supabase
    .from('amplop_digital')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function addAmplop(amplop: Omit<AmplopDigital, 'id' | 'created_at'>): Promise<AmplopDigital> {
  const { data, error } = await supabase
    .from('amplop_digital')
    .insert([amplop])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateAmplop(id: string, amplop: Partial<AmplopDigital>): Promise<AmplopDigital> {
  const { data, error } = await supabase
    .from('amplop_digital')
    .update(amplop)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAmplop(id: string): Promise<void> {
  const { error } = await supabase
    .from('amplop_digital')
    .delete()
    .eq('id', id);
  if (error) throw error;
} 