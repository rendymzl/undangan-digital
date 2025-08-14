import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getInvitationById } from '@/features/invitations/invitationService';
import type { Invitation } from '@/types';
import { toast } from 'sonner';
import { UrlInputForm } from '@/components/generate-pesan/UrlInputForm';
import { PesanGenerator } from '../../components/generate-pesan/PesanGenerator';
import { invitationFromApi } from '@/utils/caseTransform';

export default function UndangTamuPage() {
    const { invitationId } = useParams<{ invitationId: string }>();
    const [invitation, setInvitation] = useState<Invitation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Jika tidak ada ID, jangan lakukan apa-apa, tampilkan form input
        if (!invitationId) {
            setLoading(false);
            return;
        }

        // Jika ada ID, ambil data undangan
        setLoading(true);
        getInvitationById(invitationId).then(({ data, error }) => {
            if (error || !data) {
                toast.error("Gagal memuat data undangan.");
                return;
            }
            console.log('data', data)
            setInvitation(invitationFromApi(data));
            setLoading(false);
        });
    }, [invitationId]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto py-8 px-4">
            {invitation ? (
                // Jika data undangan ada, tampilkan generator pesan
                <>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-1">Generate Pesan Undangan</h1>
                        <p className="text-muted-foreground">
                            Untuk undangan: <span className="font-semibold">{invitation.mempelaiPria.nama} & {invitation.mempelaiWanita.nama}</span>
                        </p>
                    </div>
                    <PesanGenerator invitation={invitation} />
                </>
            ) : (
                // Jika tidak ada data undangan, tampilkan form input URL
                <UrlInputForm />
            )}
        </div>
    );
}