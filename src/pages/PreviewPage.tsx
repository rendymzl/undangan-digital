// Di dalam file PreviewPage.tsx

import React, { useState, useEffect } from 'react';
import UndanganDetailPage from './UndanganDetailPage';
import { invitationToApi, invitationFromApi, type InvitationFormData } from '@/utils/caseTransform';
import type { Invitation } from '@/types';

export default function PreviewPage() {
    const [previewData, setPreviewData] = useState<Invitation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const dataString = sessionStorage.getItem('previewData');
            if (!dataString) {
                throw new Error("Data preview tidak ditemukan.");
            }

            const formData: InvitationFormData = JSON.parse(dataString);

            // --- PERBAIKAN DI SINI ---
            // 1. Buat data API tiruan seperti sebelumnya
            const mockApiData = invitationToApi(formData);

            // 2. "Suntikkan" kembali data amplop digital ke data tiruan tersebut
            // Ini meniru hasil join dari database
            mockApiData.amplop_digital = formData.amplopDigital;
            // -------------------------

            // 3. Sekarang, ubah data tiruan yang sudah lengkap ke format undangan
            const invitationData = invitationFromApi(mockApiData);

            setPreviewData(invitationData);

        } catch (err: any) {
            console.error("Gagal memuat data preview:", err);
            setError(err.message || "Terjadi kesalahan.");
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) return <div>Memuat preview...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!previewData) return <div>Gagal memuat data preview.</div>;

    return <UndanganDetailPage previewData={previewData} />;
}