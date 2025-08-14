import { supabase } from '@/lib/supabaseClient';
import type { PaymentProof } from '@/types/payment';

/**
 * Mengambil semua bukti pembayaran yang berstatus 'pending'.
 * Fungsi ini juga akan membuat URL aman (signed URL) untuk setiap gambar bukti
 * agar bisa ditampilkan dengan aman di halaman admin.
 * @returns Objek { data, error } yang berisi daftar pembayaran.
 */
export async function getPendingPayments() {
    const { data: rawData, error } = await supabase
        .from('payment_proofs')
        .select('*, invitations(slug, nama_pria, nama_wanita)')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching pending payments:", error);
        return { data: null, error };
    }
    if (!rawData) {
        return { data: [], error: null };
    }

    const dataWithSignedUrls = await Promise.all(
        rawData.map(async (proof) => {
            // --- PERBAIKAN DI SINI ---
            // Langsung gunakan `proof.proof_image_url` sebagai path file
            const filePath = proof.proof_image_url;

            const { data: signedUrlData, error: signedUrlError } = await supabase
                .storage
                .from('proofs')
                .createSignedUrl(filePath, 60 * 5); // URL berlaku selama 5 menit

            if (signedUrlError) {
                console.error('Error creating signed URL for proof:', proof.id, signedUrlError);
                return { ...proof, signed_proof_url: null };
            }

            return { ...proof, signed_proof_url: signedUrlData.signedUrl };
        })
    );

    return { data: dataWithSignedUrls as PaymentProof[], error: null };
}

/**
 * Menyetujui pembayaran dan mengaktifkan undangan selamanya.
 * @param paymentId ID dari bukti pembayaran.
 * @param invitationId ID dari undangan yang terkait.
 */
export async function approvePayment(paymentId: string, invitationId: string) {
    // Gunakan transaction untuk memastikan kedua operasi berhasil atau keduanya gagal
    const { error } = await supabase.rpc('approve_payment_and_activate_invitation', {
        p_payment_id: paymentId,
        p_invitation_id: invitationId
    });

    if (error) {
        throw error;
    }
    return { error: null };
}

/**
 * Menolak bukti pembayaran.
 * @param paymentId ID dari bukti pembayaran.
 */
export async function rejectPayment(paymentId: string) {
    return supabase
        .from('payment_proofs')
        .update({ status: 'rejected' })
        .eq('id', paymentId);
}