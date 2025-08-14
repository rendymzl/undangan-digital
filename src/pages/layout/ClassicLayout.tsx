import React from 'react';
import type { Invitation, RSVP } from '@/types';
import type { Theme } from '@/types/theme';
import { formatOrangTua } from '@/utils/formatOrangTua'; // Pastikan path ini benar
import SalamSection from '../undangan-sections/SalamSection';
import ProfileSection from '../undangan-sections/ProfileSection';
import AcaraSection from '../undangan-sections/AcaraSection';
import CeritaSection from '../undangan-sections/CeritaSection';
import GaleriSection from '../undangan-sections/GaleriSection';
import UcapanDanRSVPSection from '../undangan-sections/UcapanDanRSVPSection';
import AmplopSection from '../undangan-sections/AmplopSection';
import PenutupSection from '../undangan-sections/PenutupSection';

// Props yang diterima oleh komponen layout
interface LayoutProps {
    invitation: Invitation;
    theme: Theme;
    ucapanList: RSVP[];
    handleUcapanSubmit: (form: { guestName: string; message: string; attendanceStatus: 'attending' | 'not_attending' | 'pending' }) => Promise<void>;
    // --- Tambahkan Props Paginasi ---
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (newPage: number) => void;
    // Tambahan: apakah ini mode preview
    isPreview?: boolean;
}

const ClassicLayout: React.FC<LayoutProps> = ({
    invitation,
    theme,
    ucapanList,
    handleUcapanSubmit,
    page,
    pageSize,
    totalCount,
    onPageChange,
    isPreview = false
}) => {
    // Destructuring data untuk mempermudah akses
    const {
        mempelaiPria,
        mempelaiWanita,
        akad,
        resepsi,
        urutanMempelai,
        ceritaCinta,
        galeri,
        galeriAktif,
        amplopDigital
    } = invitation;

    return (
        <>
            {/* Render setiap section secara berurutan */}
            <SalamSection theme={theme} />

            <ProfileSection
                theme={theme}
                data={{
                    mempelai1: urutanMempelai === 'pria-wanita' ? mempelaiPria : mempelaiWanita,
                    mempelai2: urutanMempelai === 'pria-wanita' ? mempelaiWanita : mempelaiPria,
                }}
                mempelai1IsPria={urutanMempelai === 'pria-wanita'}
            />

            {akad.tanggal && <AcaraSection title="Akad Nikah" theme={theme} data={akad} />}
            {resepsi.tanggal && <AcaraSection title="Resepsi" theme={theme} data={resepsi} />}

            {ceritaCinta && <CeritaSection theme={theme} data={{ cerita: ceritaCinta }} />}

            {galeriAktif && galeri && galeri.length > 0 && (
                <GaleriSection theme={theme} images={galeri.map(foto => foto.url)} />
            )}

            {/* --- Lengkapi Props Paginasi di Sini --- */}
            <UcapanDanRSVPSection
                theme={theme}
                ucapanList={ucapanList}
                invitationId={invitation.id}
                onSubmit={handleUcapanSubmit}
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={onPageChange}
                isPreview={isPreview}
            />

            {amplopDigital && amplopDigital.length > 0 && (
                <AmplopSection
                    theme={theme}
                    data={{
                        namaPria: mempelaiPria.nama,
                        namaWanita: mempelaiWanita.nama,
                        rekening: amplopDigital,
                    }}
                />
            )}

            <PenutupSection
                theme={theme}
                data={{
                    namaPria: mempelaiPria.namaPanggilan || mempelaiPria.nama.split(' ')[0],
                    namaWanita: mempelaiWanita.namaPanggilan || mempelaiWanita.nama.split(' ')[0],
                }}
            />
        </>
    );
};

export default ClassicLayout;