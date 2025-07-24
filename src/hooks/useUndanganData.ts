import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getInvitationBySlug, createUcapan } from '@/features/invitations/invitationService';
import { getRSVPByInvitation } from '@/features/rsvp/rsvpService';
import { themes, type Invitation, type RSVP, type Theme } from '@/types';
import { invitationFromApi, rsvpFromApi, rsvpToApi } from '@/utils/caseTransform';
import { toast } from 'sonner';

export function useUndanganData(previewData?: Invitation) {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();

  const [invitation, setInvitation] = useState<Invitation | null>(previewData || null);
  const [theme, setTheme] = useState<Theme>(themes[0]);
  const [ucapanList, setUcapanList] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(!previewData);
  const [isLocked, setIsLocked] = useState(!previewData);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // atau sesuai kebutuhan
  const [totalCount, setTotalCount] = useState(0);

  const fetchUcapan = useCallback(async (invitationId: string, pageNum: number) => {
    try {
      const response = await getRSVPByInvitation(invitationId, pageNum, pageSize);
      if (response?.data) {
        setUcapanList(response.data.map(rsvpFromApi));
        setTotalCount(response.count || 0);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Gagal memuat ucapan:', error);
      toast.error('Gagal memuat ucapan.');
    }
  }, [pageSize]);

  // Efek untuk memuat data undangan & RSVP dari API
  useEffect(() => {
    // Jika ada previewData, gunakan itu dan jangan fetch dari API
    if (previewData) {
      setInvitation(previewData);
      const selectedTheme = themes.find(t => t.id === previewData.themeId) || themes[0];
      setTheme(selectedTheme);
      setLoading(false);
      return;
    }

    if (!slug) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const { data: apiData, error } = await getInvitationBySlug(slug);
        if (error || !apiData) {
          throw new Error("Undangan tidak ditemukan");
        }

        const transformedData = invitationFromApi(apiData);
        setInvitation(transformedData);

        const selectedTheme = themes.find(t => t.id === transformedData.themeId) || themes[0];
        setTheme(selectedTheme);

        await fetchUcapan(transformedData.id, 1);

        // Fetch ucapan setelah data undangan berhasil didapat
        // const response = await getRSVPByInvitation(transformedData.id, 1, 5); // Ambil halaman pertama
        // if (response?.data) {
        //   setUcapanList(response.data.map(rsvpFromApi));
        // }
      } catch (err) {
        console.error(err);
        toast.error((err as Error).message);
        // Anda bisa arahkan pengguna ke halaman 404 di sini
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, previewData]);

  // Fungsi untuk aksi-aksi pengguna
  const handleOpenUndangan = () => {
    setIsLocked(false);
    audioRef.current?.play().catch(console.error);
    setIsPlaying(true);
  };

  const handleToggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleUcapanSubmit = async (form: { guestName: string; message: string; attendanceStatus: 'attending' | 'not_attending' | 'pending' }) => {
    if (!invitation) return;
    try {
      const rsvpData = rsvpToApi({
        invitationId: invitation.id,
        guestName: form.guestName,
        message: form.message,
        attendanceStatus: form.attendanceStatus
      });
      await createUcapan(rsvpData);
      toast.success("Terima kasih atas ucapan dan konfirmasinya!");

      // Muat ulang daftar ucapan untuk menampilkan yang terbaru
      const response = await getRSVPByInvitation(invitation.id, 1, 5);
      if (response?.data) {
        setUcapanList(response.data.map(rsvpFromApi));
      }
    } catch (err) {
      toast.error("Gagal mengirim ucapan.");
      console.error(err);
    }
  };

  // Ambil nama tamu dari parameter URL (?to=...)
  const guestName = new URLSearchParams(location.search).get('to') || '';

  // Kembalikan semua state dan fungsi yang dibutuhkan oleh komponen UI
  return {
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
    handleUcapanSubmit,
    page,
    pageSize,
    totalCount,
    fetchUcapan,
  };
}