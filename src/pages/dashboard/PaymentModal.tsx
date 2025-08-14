import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/features/auth/useAuth';
import qrCode from '../../assets/qr.png';
import type { PaymentProof } from '@/types/payment';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    invitationId: string;
    existingProof?: PaymentProof | null;
    onSuccess: () => void;
}

export const PaymentModal: React.FC<Props> = ({ isOpen, onClose, invitationId, existingProof, onSuccess }) => {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // --- 1. State baru untuk menampung signed URL ---
    const [signedImageUrl, setSignedImageUrl] = useState<string | null>(null);
    const [isLoadingUrl, setIsLoadingUrl] = useState(false);

    // --- 2. useEffect untuk men-generate signed URL saat modal dibuka ---
    useEffect(() => {
        if (existingProof && existingProof.proof_image_url) {
            setIsLoadingUrl(true);

            // --- PERBAIKAN DI SINI ---
            // Langsung gunakan `existingProof.proof_image_url` sebagai path file
            const filePath = existingProof.proof_image_url;

            supabase.storage
                .from('proofs')
                .createSignedUrl(filePath, 60 * 5)
                .then(({ data, error }) => {
                    if (error) {
                        console.error("Gagal membuat signed URL:", error);
                        toast.error("Gagal memuat gambar bukti.");
                        setSignedImageUrl(null);
                    } else {
                        setSignedImageUrl(data.signedUrl);
                    }
                    setIsLoadingUrl(false);
                });
        } else {
            setSignedImageUrl(null);
        }
    }, [existingProof]);

    const handleSubmit = async () => {
        if (!file || !user) {
            toast.error("Harap pilih file bukti pembayaran.");
            return;
        }

        // --- TAMBAHKAN PEMBATASAN UKURAN DI SINI ---
        const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

        if (file.size > MAX_FILE_SIZE) {
            toast.error("Ukuran file terlalu besar. Maksimal 2 MB.");
            return; // Hentikan proses
        }
        // -----------------------------------------
        setIsUploading(true);
        try {
            const fileName = `${user.id}/proof-${invitationId}-${Date.now()}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('proofs')
                .upload(fileName, file);
            if (uploadError) throw uploadError;

            const proofImageUrl = uploadData.path;

            // --- PERBAIKAN LOGIKA DI SINI ---
            if (existingProof?.id) {
                // Jika sudah ada bukti (mode update), jalankan UPDATE
                const { error: updateError } = await supabase
                    .from('payment_proofs')
                    .update({ proof_image_url: proofImageUrl, status: 'pending' }) // Update gambar & reset status ke pending
                    .eq('id', existingProof.id);

                if (updateError) throw updateError;

            } else {
                // Jika ini bukti baru, jalankan INSERT
                const { error: insertError } = await supabase
                    .from('payment_proofs')
                    .insert({
                        invitation_id: invitationId,
                        user_id: user.id,
                        proof_image_url: proofImageUrl,
                    });
                if (insertError) throw insertError;
            }

            toast.success("Bukti pembayaran berhasil diupload! Mohon tunggu konfirmasi.");
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Gagal mengupload bukti pembayaran.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{existingProof ? "Bukti Pembayaran Terkirim" : "Aktivasi Undangan Selamanya"}</DialogTitle>
                    <DialogDescription>
                        {existingProof ? "Bukti pembayaran Anda sedang menunggu konfirmasi. Anda bisa mengunggah ulang jika ada kesalahan." : "Lakukan pembayaran untuk mengaktifkan undangan Anda secara permanen."}
                    </DialogDescription>
                </DialogHeader>

                {/* --- 3. Tampilkan bukti lama menggunakan signed URL dari state --- */}
                {existingProof && (
                    <div className="my-4">
                        <Label>Bukti yang Sudah Di-upload:</Label>
                        {isLoadingUrl ? (
                            <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md mt-1">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            </div>
                        ) : signedImageUrl ? (
                            <a href={signedImageUrl} target="_blank" rel="noopener noreferrer">
                                <img src={signedImageUrl} alt="Bukti terkirim" className="w-full h-48 object-contain rounded-md border mt-1" />
                            </a>
                        ) : (
                            <p className="text-sm text-red-500 mt-1">Gagal memuat gambar bukti.</p>
                        )}
                    </div>
                )}

                <div className="space-y-4">
                    {!existingProof && (
                        <>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground line-through">Rp 85.000</p>
                                <p className="text-4xl font-bold text-primary">Rp 49.000</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <p className="font-semibold">Transfer ke Rekening:</p>
                                <p>Bank BCA: 1234567890</p>
                                <p>a.n. Menantikan</p>
                                <img src={qrCode} alt="QR Code" className="w-40 h-40 mx-auto mt-2" />
                            </div>
                        </>
                    )}

                    <div>
                        <Label htmlFor="proof-upload">
                            {existingProof ? "Upload Ulang Bukti Pembayaran (jika salah)" : "Upload Bukti Pembayaran"}
                        </Label>
                        <Input id="proof-upload" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Tutup</Button>
                    <Button onClick={handleSubmit} disabled={isUploading || !file}>
                        {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {existingProof ? 'Kirim Ulang' : 'Konfirmasi Pembayaran'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};