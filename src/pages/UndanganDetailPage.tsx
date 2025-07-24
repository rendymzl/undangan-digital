import React from 'react';
import type { Invitation } from '@/types';

// Import semua komponen section yang dibutuhkan
import CoverSection from "./undangan-sections/CoverSection";
import SalamSection from "./undangan-sections/SalamSection";
import ProfileSection from "./undangan-sections/ProfileSection";
import AkadSection from "./undangan-sections/AkadSection";
import ResepsiSection from "./undangan-sections/ResepsiSection";
import CeritaSection from "./undangan-sections/CeritaSection";
import GaleriSection from "./undangan-sections/GaleriSection";
import UcapanDanRSVPSection from "./undangan-sections/UcapanDanRSVPSection";
import AmplopSection from "./undangan-sections/AmplopSection";
import PenutupSection from "./undangan-sections/PenutupSection";
import { Music } from 'lucide-react';
import { useUndanganData } from '@/hooks/useUndanganData';
import { formatOrangTua } from '@/utils/formatOrangTua';
import AcaraSection from './AcaraSection';

interface UndanganDetailPageProps {
  previewData?: Invitation;
}

export default function UndanganDetailPage({ previewData }: UndanganDetailPageProps) {
  // Panggil hook untuk mendapatkan semua data dan logika
  const {
    invitation,
    theme,
    ucapanList,
    loading,
    isLocked,
    isPlaying,
    audioRef,
    guestName,
    handleOpenUndangan,
    handleToggleAudio,
    page,
    pageSize,
    totalCount,
    fetchUcapan,
    handleUcapanSubmit,
  } = useUndanganData(previewData);

  // Tampilkan loading state saat data sedang diambil
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Tampilkan pesan jika undangan tidak ditemukan setelah loading selesai
  if (!invitation) {
    return <div className="min-h-screen flex items-center justify-center">Undangan tidak ditemukan.</div>;
  }

  // Siapkan props untuk komponen-komponen section
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

  // Gabungkan tema dasar dengan warna kustom dari pengguna
  const finalTheme = {
    ...theme,
    primaryColor: invitation.customColors?.primary || theme.primaryColor,
    secondaryColor: invitation.customColors?.secondary || theme.secondaryColor,
    backgroundColor: invitation.customColors?.background || theme.backgroundColor,
    foregroundColor: invitation.customColors?.foreground || theme.foregroundColor,
  };

  const DEFAULT_BACKSOUND_URL = '/backsound/wedding-day.mp3';

  return (
    <div className="w-full min-h-screen flex flex-col items-center" style={{ background: finalTheme.backgroundColor }}>
      <audio
        ref={audioRef}
        src={invitation.backsoundUrl || DEFAULT_BACKSOUND_URL}
        loop
        preload="auto"
      />

      {/* Tombol Kontrol Audio */}
      {!isLocked && (
        <button
          onClick={handleToggleAudio}
          className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-white"
          style={{ background: finalTheme.primaryColor }}
          aria-label={isPlaying ? "Pause Music" : "Play Music"}
        >
          <Music className={`transition-transform duration-300 ${isPlaying ? 'animate-pulse' : ''}`} />
        </button>
      )}

      <div className="w-full max-w-[480px] relative">
        <CoverSection
          theme={finalTheme}
          data={{
            namaPria: mempelaiPria.nama,
            namaWanita: mempelaiWanita.nama,
            namaPanggilanPria: mempelaiWanita.namaPanggilan,
            namaPanggilanWanita: mempelaiWanita.namaPanggilan,
            tanggal: akad.tanggal || resepsi.tanggal,
            // --- TAMBAHKAN PROPERTI BERIKUT ---
            coverTipe: invitation.coverTipe,
            coverUrl: invitation.coverUrl,
            coverGambarPilihan: invitation.coverGambarPilihan,
          }}
          namaTamu={guestName}
          onOpen={handleOpenUndangan}
          isLocked={isLocked}
          isFullScreen={true}
        />

        {!isLocked && (
          <>
            <SalamSection theme={finalTheme} />
            <ProfileSection
              theme={finalTheme}
              data={{
                mempelai1: urutanMempelai === 'pria-wanita' ? mempelaiPria : mempelaiWanita,
                mempelai2: urutanMempelai === 'pria-wanita' ? mempelaiWanita : mempelaiPria,
              }}
              // --- KIRIM PROPS BARU DI SINI ---
              formatOrangTua={formatOrangTua}
              mempelai1IsPria={urutanMempelai === 'pria-wanita'}
            />
            {akad.tanggal && akad.lokasi && (
              <AcaraSection title="Akad Nikah" theme={finalTheme} data={akad} />
            )}
            {resepsi.tanggal && resepsi.lokasi && (
              <AcaraSection title="Resepsi" theme={finalTheme} data={resepsi} />
            )}
            {ceritaCinta && (
              <CeritaSection
                theme={finalTheme}
                data={{ cerita: ceritaCinta }}
              />
            )}
            {galeriAktif && galeri && galeri.length > 0 && (
              <GaleriSection
                theme={finalTheme}
                images={galeri.map(foto => foto.url)}
              />
            )}
            <UcapanDanRSVPSection
              theme={finalTheme}
              ucapanList={ucapanList}
              invitationId={invitation.id}
              onSubmit={handleUcapanSubmit}
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={(newPage) => fetchUcapan(invitation.id, newPage)}
            />
            {amplopDigital && amplopDigital.length > 0 && (
              <AmplopSection
                theme={finalTheme}
                data={{
                  namaPria: mempelaiPria.nama,
                  namaWanita: mempelaiWanita.nama,
                  rekening: amplopDigital,
                }}
              />
            )}
            <PenutupSection
              theme={finalTheme}
              data={{
                namaPria: mempelaiPria.namaPanggilan || mempelaiPria.nama.split(' ')[0],
                namaWanita: mempelaiWanita.namaPanggilan || mempelaiWanita.nama.split(' ')[0],
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}