export interface PaymentProof {
    id: string;
    invitation_id: string;
    user_id: string;
    proof_image_url: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    invitations: {
        slug: string;
        nama_pria: string;
        nama_wanita: string;
    } | null;

    // --- ADD THIS LINE ---
    signed_proof_url?: string | null; // This property is added by the service
}