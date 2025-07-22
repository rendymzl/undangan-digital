import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getInvitationBySlug, createUcapan } from "../features/invitations/invitationService";
import { getRSVPByInvitation } from '../features/rsvp/rsvpService';
import { themes } from "../types/theme";
import type { RSVP } from '@/types';
import CoverSection from "./undangan-sections/CoverSection";
import SalamSection from "./undangan-sections/SalamSection";
import AkadSection from "./undangan-sections/AkadSection";
import ResepsiSection from "./undangan-sections/ResepsiSection";
import CeritaSection from "./undangan-sections/CeritaSection";
import GaleriSection from "./undangan-sections/GaleriSection";
import UcapanDanRSVPSection from "./undangan-sections/UcapanDanRSVPSection";
import AmplopSection from "./undangan-sections/AmplopSection";
import PenutupSection from "./undangan-sections/PenutupSection";
import ProfileSection from "./undangan-sections/ProfileSection";
import { rsvpToApi, rsvpFromApi } from '../utils/caseTransform';
import { Heart } from 'lucide-react';

interface UndanganDetailPageProps {
  previewData?: any; // Data untuk mode preview
}

export default function UndanganDetailPage({ previewData }: UndanganDetailPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(!previewData);
  const [theme, setTheme] = useState(themes[0]);
  const [ucapanList, setUcapanList] = useState<RSVP[]>([]);
  const [isLocked, setIsLocked] = useState(!previewData);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Dummy data untuk preview RSVP
  const dummyUcapan: RSVP[] = [
    {
      id: '1',
      invitationId: 'preview',
      guestName: 'Budi Santoso',
      message: 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
      attendanceStatus: 'attending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      numberOfGuests: 2,
      contactInfo: '08123456789'
    },
    {
      id: '2',
      invitationId: 'preview',
      guestName: 'Siti Aminah',
      message: 'MasyaAllah, selamat ya! Barakallahu laka wa baraka alaika wa jamaa bainakuma fii khair.',
      attendanceStatus: 'attending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      numberOfGuests: 1,
      contactInfo: '08987654321'
    }
  ];

  // Dummy rekening untuk preview
  const dummyRekening = [
    {
      bank: 'BCA',
      accountNumber: '1234567890',
      accountName: 'Nama Pemilik',
      note: 'Kado pernikahan',
      qrUrl: '',
    },
    {
      bank: 'Mandiri',
      accountNumber: '0987654321',
      accountName: 'Nama Pemilik 2',
      note: '',
      qrUrl: '',
    },
  ];

  function toTitleCase(str: string) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  // Ambil data dari previewData jika mode preview, fallback ke data dari database
  const getData = (key: string, fallback: any = '') => previewData ? previewData[key] ?? fallback : data?.[key] ?? fallback;

  // Nama, panggilan, cerita, galeri, backsound, warna, dsb
  const namaPria = toTitleCase(getData('nama_pria'));
  const namaWanita = toTitleCase(getData('nama_wanita'));
  const namaPanggilanPria = toTitleCase(getData('nama_panggilan_pria') || namaPria.split(" ")[0]);
  const namaPanggilanWanita = toTitleCase(getData('nama_panggilan_wanita') || namaWanita.split(" ")[0]);
  const cerita = getData('cerita') || getData('cerita_cinta');
  const galeriAktif = getData('galeriAktif', true);
  const galeriFinal = getData('galeri', []);
  const backsoundFinal = getData('backsound_url', "/backsound/perfect-ed-sheeran.mp3");
  const rekeningFinal = getData('rekening', previewData ? dummyRekening : []);

  // Warna custom
  const customColors = previewData?.customColors || data?.custom_colors;
  const previewTheme = customColors
    ? {
        ...theme,
        primaryColor: customColors.primary,
        secondaryColor: customColors.secondary,
        backgroundColor: customColors.background,
        foregroundColor: customColors.foreground,
      }
    : theme;

  // Akad & Resepsi
  const tanggalAkad = getData('tanggal_akad');
  const waktuAkad = getData('waktu_akad_mulai');
  const lokasiAkad = getData('lokasi_akad');
  const lokasiAkadLat = getData('lokasi_akad_lat', null);
  const lokasiAkadLng = getData('lokasi_akad_lng', null);
  const tanggalResepsi = getData('tanggal_resepsi');
  const waktuResepsi = getData('waktu_resepsi_mulai');
  const lokasiResepsi = getData('lokasi_resepsi');
  const lokasiResepsiLat = getData('lokasi_resepsi_lat', null);
  const lokasiResepsiLng = getData('lokasi_resepsi_lng', null);

  useEffect(() => {
    const loadData = async () => {
      if (previewData) {
        setData(previewData);
        const selectedTheme = themes.find(t => t.id === previewData.tema) || themes[0];
        setTheme(selectedTheme);
        return;
      }

      if (!slug) return;

      try {
        const { data: invitationData } = await getInvitationBySlug(slug);
        if (invitationData) {
          console.log('Loaded invitation data:', invitationData);
          setData(invitationData);
          const selectedTheme = themes.find(t => t.id === invitationData.tema) || themes[0];
          setTheme(selectedTheme);
          if (invitationData.id) {
            fetchUcapan(invitationData.id, 1);
          }
        }
      } catch (error) {
        console.error('Error loading invitation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, previewData]);

  const fetchUcapan = async (invitationId: string, pageNum: number) => {
    if (previewData) return;
    try {
      const response = await getRSVPByInvitation(invitationId, pageNum, pageSize);
      if (response?.data) {
        setUcapanList(response.data.map(rsvpFromApi));
        setTotalCount(response.count || 0);
        setTotalPages(response.totalPages);
        setPage(response.page);
      }
    } catch (error) {
      console.error('Error fetching ucapan:', error);
    }
  };

  const handleUcapanSubmit = async (form: { guestName: string; message: string; attendanceStatus: 'attending' | 'not_attending' | 'pending' }) => {
    if (previewData || !data?.id) return;
    try {
      const rsvpData = rsvpToApi({
        id: '',
        invitationId: data.id,
        guestName: form.guestName,
        message: form.message,
        attendanceStatus: form.attendanceStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        numberOfGuests: 1,
        contactInfo: ''
      });
      await createUcapan(rsvpData);
      fetchUcapan(data.id, page);
    } catch (error) {
      console.error('Error submitting ucapan:', error);
    }
  };

  const getNamaTamu = () => {
    const params = new URLSearchParams(location.search);
    return params.get('to') || '';
  };

  const handleOpenUndangan = () => {
    setIsLocked(false);
    // Mulai backsound ketika undangan dibuka
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      setIsPlaying(true);
    }
  };

  const handleToggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Cleanup audio ketika component unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={backsoundFinal}
        loop
        preload="auto"
      />

      {/* Audio Control Button */}
      {!isLocked && (
        <button
          onClick={handleToggleAudio}
          className="fixed bottom-4 right-4 z-50 p-2 rounded-full shadow-xl border-2 border-white flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4"
          aria-label={isPlaying ? 'Pause Backsound' : 'Play Backsound'}
          style={{
            background: `linear-gradient(135deg, ${previewTheme.primaryColor}, ${previewTheme.secondaryColor})`,
            color: '#fff',
            boxShadow: '0 8px 32px 0 rgba(80, 0, 120, 0.25)'
          }}
        >
          {isPlaying ? (
            // Icon Pause (dua batang)
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor" />
            </svg>
          ) : (
            // Icon Play (segitiga)
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}

      <div className="w-full max-w-[480px] relative">
        {/* Cover Section */}
        <CoverSection 
          theme={previewTheme} 
          data={{ 
            namaPria, 
            namaWanita, 
            namaPanggilanPria, 
            namaPanggilanWanita
          }} 
          namaTamu={getNamaTamu()} 
          onOpen={handleOpenUndangan} 
          isLocked={isLocked} 
          isFullScreen={true} 
        />
        {/* Semua section lain hanya muncul setelah dibuka */}
        {!isLocked && (
          <>
            <SalamSection theme={previewTheme} />
            <ProfileSection
              theme={previewTheme}
              data={{
                namaPria,
                namaPanggilanPria,
                fotoPria: getData('fotoPria'),
                bioPria: getData('bioPria'),
                ortuPria: getData('ortu_pria'),
                namaWanita,
                namaPanggilanWanita,
                fotoWanita: getData('fotoWanita'),
                bioWanita: getData('bioWanita'),
                ortuWanita: getData('ortu_wanita'),
              }}
            />

            {/* Akad Section */}
            {tanggalAkad && waktuAkad && lokasiAkad && (
              <AkadSection 
                theme={previewTheme} 
                data={{ 
                  tanggal: tanggalAkad, 
                  waktuAkad, 
                  lokasiAkad,
                  lokasiAkadLat,
                  lokasiAkadLng,
                  lokasiAkadUrl: getData('lokasi_akad_url', null),
                  waktuAkadSelesai: getData('waktu_akad_selesai', null),
                  sampaiSelesai: getData('waktu_akad_sampai_selesai', false),
                }} 
              />
            )}

            {/* Resepsi Section */}
            {tanggalResepsi && waktuResepsi && lokasiResepsi && (
              <ResepsiSection 
                theme={previewTheme} 
                data={{ 
                  tanggal: tanggalResepsi, 
                  waktuResepsi, 
                  lokasiResepsi,
                  lokasiResepsiLat,
                  lokasiResepsiLng,
                  lokasiResepsiUrl: getData('lokasi_resepsi_url', null),
                  waktuResepsiSelesai: getData('waktu_resepsi_selesai', null),
                  sampaiSelesai: getData('waktu_resepsi_sampai_selesai', false),
                }} 
              />
            )}

            {/* Cerita Section */}
            {cerita && (
              <CeritaSection 
                theme={previewTheme} 
                data={{ cerita }} 
              />
            )}

            {/* Galeri Section */}
            {galeriAktif && galeriFinal && galeriFinal.length > 0 && (
              <GaleriSection 
                theme={previewTheme} 
                images={galeriFinal}
              />
            )}

            {/* RSVP Section */}
            <UcapanDanRSVPSection
              theme={previewTheme}
              ucapanList={previewData ? dummyUcapan : ucapanList}
              invitationId={data?.id || ""}
              onSubmit={handleUcapanSubmit}
              page={page}
              pageSize={pageSize}
              totalCount={previewData ? dummyUcapan.length : totalCount}
              onPageChange={(newPage) => data?.id && fetchUcapan(data.id, newPage)}
              isPreview={!!previewData}
            />

            {/* Amplop Section */}
            <div className="relative">
              <AmplopSection 
                theme={previewTheme} 
                data={{ 
                  namaPria, 
                  namaWanita, 
                  rekening: rekeningFinal
                }} 
              />
              {previewData ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="bg-white p-4 rounded-lg shadow-lg text-center max-w-[90%]">
                    <p className="text-gray-700 text-sm mb-2">
                      Ini adalah mode preview. Fitur amplop digital akan aktif pada undangan yang sudah dipublish.
                    </p>
                    <p className="text-xs text-gray-500">
                      Untuk menambah rekening amplop digital, silakan buka dashboard &gt; Kelola Amplop Digital pada undangan Anda.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Penutup Section */}
            <PenutupSection 
              theme={previewTheme} 
              data={{ 
                namaPria, 
                namaWanita
              }} 
            />
          </>
        )}
      </div>

      {/* Background overlay */}
      <div className="fixed inset-0 -z-10" style={{ 
        backgroundColor: theme.backgroundColor,
        backgroundImage: `linear-gradient(to bottom right, ${theme.backgroundColor}, ${theme.secondaryColor})`
      }} />
    </div>
  );
} 