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
  const [isLocked, setIsLocked] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5); // pageSize tetap, tidak perlu diubah-ubah
  const [totalCount, setTotalCount] = useState(0);

  // Fungsi fetch ucapan dengan pagination
  const fetchUcapan = useCallback(
    async (invitationId: string, pageNum: number) => {
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
    },
    [pageSize]
  );

  // Efek untuk memuat data undangan & RSVP dari API
  useEffect(() => {
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

        if (transformedData.expiredAt) {
          const expiryTime = new Date(transformedData.expiredAt).getTime();
          const now = new Date().getTime();

          // Jika waktu sekarang sudah melewati waktu kedaluwarsa
          if (now > expiryTime) {
            setIsExpired(true); // Set status kedaluwarsa
          }
        }

        setInvitation(transformedData);

        const selectedTheme = themes.find(t => t.id === transformedData.themeId) || themes[0];
        setTheme(selectedTheme);

        await fetchUcapan(transformedData.id, 1);
      } catch (err) {
        console.error(err);
        toast.error((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, previewData, fetchUcapan]);

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

  // Fungsi submit ucapan, setelah submit reload halaman pertama ucapan
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

      // Setelah submit, reload halaman pertama dan reset page ke 1
      await fetchUcapan(invitation.id, 1);
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
    fetchUcapan: (invitationId: string, pageNum: number) => {
      // Pastikan pageNum valid (tidak kurang dari 1)
      const validPage = Math.max(1, pageNum);
      if (invitation) {
        fetchUcapan(invitationId, validPage);
      }
    },
  };
}