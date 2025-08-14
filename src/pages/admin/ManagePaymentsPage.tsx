import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { getPendingPayments, approvePayment, rejectPayment } from '@/features/invitations/paymentService'; // <-- 1. Import dari service
import type { PaymentProof } from '@/types/payment';

export default function ManagePaymentsPage() {
    const [payments, setPayments] = useState<PaymentProof[]>([]);
    const [loading, setLoading] = useState(true);

    const loadPayments = useCallback(() => {
        setLoading(true);
        getPendingPayments().then(({ data, error }) => {
            if (error) {
                toast.error("Gagal memuat bukti pembayaran.");
                console.error(error);
            }
            setPayments(data || []);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        loadPayments();
    }, [loadPayments]);

    const handleApprove = async (paymentId: string, invitationId: string) => {
        if (window.confirm("Yakin ingin menyetujui pembayaran ini? Undangan akan diaktifkan selamanya.")) {
            try {
                await approvePayment(paymentId, invitationId);
                toast.success("Pembayaran disetujui, undangan telah diaktifkan.");
                loadPayments(); // Muat ulang daftar
            } catch (error: any) {
                toast.error(error.message || "Gagal menyetujui pembayaran.");
            }
        }
    };

    const handleReject = async (paymentId: string) => {
        if (window.confirm("Yakin ingin menolak bukti pembayaran ini?")) {
            try {
                await rejectPayment(paymentId);
                toast.warning("Pembayaran telah ditolak.");
                loadPayments(); // Muat ulang daftar
            } catch (error: any) {
                toast.error(error.message || "Gagal menolak pembayaran.");
            }
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Manajemen Pembayaran</h1>
                <p className="text-muted-foreground">Setujui atau tolak bukti pembayaran yang diupload pengguna.</p>
            </div>

            {loading ? <p>Memuat...</p> : (
                <div className="space-y-4">
                    {payments.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">Tidak ada bukti pembayaran yang menunggu konfirmasi.</p>
                        </div>
                    ) : (
                        payments.map(p => (
                            <Card key={p.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Undangan: {p.invitations?.nama_pria || 'N/A'} & {p.invitations?.nama_wanita || 'N/A'}
                                    </CardTitle>
                                    <CardDescription>
                                        Tanggal Upload: {new Date(p.created_at).toLocaleString('id-ID')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col md:flex-row items-start gap-4">
                                    {/* --- PERBAIKAN DI SINI --- */}
                                    {/* Conditionally render the image and link only if the URL exists */}
                                    {p.signed_proof_url ? (
                                        <a href={p.signed_proof_url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                                            <img src={p.signed_proof_url} alt="Bukti Pembayaran" className="w-full md:w-48 h-48 object-cover rounded border" />
                                        </a>
                                    ) : (
                                        <div className="w-full md:w-48 h-48 flex items-center justify-center bg-gray-100 rounded text-sm text-center text-gray-500">
                                            Gagal memuat gambar bukti.
                                        </div>
                                    )}

                                    <div className="flex-grow">
                                        <p><strong>Slug:</strong> {p.invitations?.slug || 'N/A'}</p>
                                        <p><strong>Status:</strong> <span className="font-semibold text-yellow-600">{p.status}</span></p>
                                        <div className="flex gap-2 mt-4">
                                            <Button onClick={() => handleApprove(p.id, p.invitation_id)}>Setujui & Aktifkan</Button>
                                            <Button variant="destructive" onClick={() => handleReject(p.id)}>Tolak</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}