import { useEffect, useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { getInvitationsByUser, deleteInvitation } from "../features/invitations/invitationService";
import { themes } from "../types/theme";
import type { Invitation } from '@/types';
import { invitationFromApi } from '../utils/caseTransform';

// Fungsi format tanggal Indonesia
function formatTanggalIndo(tanggal: string | null | undefined) {
  if (!tanggal) return "-";
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const d = new Date(tanggal);
  if (isNaN(d.getTime())) return tanggal;
  const hariStr = hari[d.getDay()];
  const tgl = d.getDate();
  const bln = bulan[d.getMonth()];
  const thn = d.getFullYear();
  return `${hariStr}, ${tgl} ${bln} ${thn}`;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      setLoadingList(true);
      getInvitationsByUser(user.id).then(({ data }) => {
        // 1. Transformasi data seperti biasa
        const invitationsCamel: Invitation[] = (data || []).map(invitationFromApi);

        // BARU: Urutkan array berdasarkan properti 'createdAt'
        // Urutan descending (terbaru di atas)
        const sortedInvitations = invitationsCamel.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // 2. Simpan data yang sudah diurutkan ke state
        setInvitations(sortedInvitations);
        setLoadingList(false);
      });
    }
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [user, loading]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Yakin ingin menghapus undangan ini? Semua data terkait akan hilang.")) {
      await deleteInvitation(id);
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="w-full mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 w-full">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard Undangan</h1>
          <p className="text-gray-600 text-base">Selamat datang, <span className="font-semibold">{user.email}</span></p>
        </div>
        <Button asChild className="h-10 px-6 text-base font-semibold">
          <a href="/dashboard/buat-undangan">+ Buat Undangan Baru</a>
        </Button>
      </div>
      <div id="undangan-saya" className="mt-2">
        <h2 className="font-semibold mb-4 text-lg">Daftar Undangan Anda</h2>
        {loadingList ? (
          <div className="text-gray-500">Memuat data undangan...</div>
        ) : invitations.length === 0 ? (
          <div className="text-gray-400 text-center py-12">
            <p className="mb-2">Belum ada undangan yang dibuat.</p>
            <Button asChild variant="outline">
              <a href="/dashboard/buat-undangan">Buat Undangan Pertama</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {invitations.map((inv) => {
              const theme = themes.find(t => t.id === inv.themeId) || themes[0];
              // Ambil tanggal acara (akad prioritas, jika tidak ada pakai resepsi)
              const tanggalAcara = inv.tanggalAkad || inv.tanggalResepsi || "-";
              return (
                <Card key={inv.id} className="p-5 flex flex-col gap-2 border border-gray-200 shadow-sm rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-lg">{inv.namaPria} &amp; {inv.namaWanita}</span>
                    <span
                      className="px-2 py-1 rounded text-xs font-bold"
                      style={{ background: theme.secondaryColor, color: theme.primaryColor, fontFamily: theme.fontTitle }}
                    >
                      {theme.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">Tanggal Acara: <span className="font-semibold text-gray-700">{formatTanggalIndo(tanggalAcara)}</span></div>
                  <div className="text-xs text-gray-500 mb-2">Tema: {inv.themeId}</div>
                  <div className="flex gap-2 justify-end">
                    <Button asChild size="sm">
                      <a href={`/${inv.slug}`} target="_blank" rel="noopener noreferrer">Lihat Detail</a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a href={`/dashboard/amplop-digital/${inv.id}`}>Kelola Amplop Digital</a>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(inv.id!)}>Hapus</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 