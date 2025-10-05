import type { Invitation } from '@/types';
import { useUndanganData } from '@/hooks/useUndanganData';

// Import komponen-komponen section
import CoverSection from "./undangan-sections/CoverSection";
import { Music } from 'lucide-react';

// Import komponen-komponen layout
import ClassicLayout from './layout/ClassicLayout';
import ExpiredInvitationPage from './undangan-sections/ExpiredInvitationPage';
// import ModernLayout from './layout/ModernLayout'; // Pastikan file ini ada

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
    isExpired,
    isPlaying,
    audioRef,
    guestName,
    handleOpenUndangan,
    handleToggleAudio,
    handleUcapanSubmit,
    page,
    pageSize,
    totalCount,
    fetchUcapan,
  } = useUndanganData(previewData);

  // Tentukan apakah ini mode preview
  const isPreview = !!previewData;

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Tampilkan pesan jika undangan tidak ditemukan
  if (!invitation) {
    return <div className="min-h-screen flex items-center justify-center">Undangan tidak ditemukan.</div>;
  }

  // --- PERBAIKAN UTAMA DI SINI ---
  // Gabungkan tema dasar dengan warna kustom secara lebih sederhana
  const finalTheme = {
    ...theme,
    // Jika ada customColors, gunakan itu. Jika tidak, gunakan colors default dari tema.
    colors: invitation.customColors || theme.colors,
  };

  const DEFAULT_BACKSOUND_URL = '/backsound/wedding-day.mp3';

  // Tentukan nama tamu akhir (finalGuestName) di luar renderLayout agar bisa digunakan di mana saja
  const finalGuestName = previewData ? "Nama Tamu" : guestName;

  // Fungsi untuk memilih dan me-render layout
  const renderLayout = () => {
    const layoutProps = {
      invitation,
      theme: finalTheme,
      ucapanList,
      handleUcapanSubmit,
      page,
      pageSize,
      totalCount,
      onPageChange: (newPage: number) => fetchUcapan(invitation.id, newPage),
      isPreview, // tambahkan isPreview ke props layout
    };

    switch (finalTheme.layout) {
      // case 'modern':
      //   return <ModernLayout {...layoutProps} />;
      case 'classic':
      default:
        return <ClassicLayout {...layoutProps} />;
    }
  };

  if (isExpired) {
    return <ExpiredInvitationPage />;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center" style={{ background: finalTheme.colors.background }}>
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
          style={{
            background: finalTheme.colors.primary,
            color: finalTheme.colors.primaryForeground, // Gunakan warna kontras
          }}
          aria-label={isPlaying ? "Pause Music" : "Play Music"}
        >
          <Music className={`transition-transform duration-300 ${isPlaying ? 'animate-pulse' : ''}`} />
        </button>
      )}

      <div className="w-full max-w-[480px] relative">
        <CoverSection
          theme={finalTheme}
          data={{
            namaPria: invitation.mempelaiPria.nama,
            namaWanita: invitation.mempelaiWanita.nama,
            namaPanggilanPria: invitation.mempelaiPria.namaPanggilan,
            namaPanggilanWanita: invitation.mempelaiWanita.namaPanggilan,
            urutanMempelai: invitation.urutanMempelai,
            tanggal: invitation.akad.tanggal || invitation.resepsi.tanggal,
            coverTipe: invitation.coverTipe,
            coverUrl: invitation.coverUrl,
            coverGambarPilihan: invitation.coverGambarPilihan,
          }}
          namaTamu={finalGuestName}
          onOpen={handleOpenUndangan}
          isLocked={isLocked}
          isFullScreen={true}
        />

        {!isLocked && (
          renderLayout()
        )}
      </div>
    </div>
  );
}