import { useEffect, useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { getInvitationsByUser, deleteInvitation } from "../features/invitations/invitationService";
import { themes } from "../types/theme";
import type { Invitation } from '@/types';
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { invitationFromApi } from "@/utils/caseTransform";

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
    if (user) {
      setLoadingList(true);
      getInvitationsByUser(user.id)
        .then(({ data, error }) => {
          if (error) {
            toast.error("Gagal memuat daftar undangan.");
            console.error(error);
            return;
          }
          const transformedData: Invitation[] = (data || []).map(invitationFromApi);
          const sortedData = transformedData.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setInvitations(sortedData);
        })
        .finally(() => {
          setLoadingList(false);
        });
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Yakin ingin menghapus undangan ini? Semua data terkait akan hilang.")) {
      const { error } = await deleteInvitation(id);
      if (error) {
        toast.error("Gagal menghapus undangan.");
      } else {
        setInvitations((prev) => prev.filter((inv) => inv.id !== id));
        toast.success("Undangan berhasil dihapus.");
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat sesi...</div>;
  if (!user) {
    // Arahkan ke halaman login jika user tidak ditemukan setelah loading selesai
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 w-full">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard Undangan</h1>
          <p className="text-gray-600 text-base">Selamat datang, <span className="font-semibold">{user.email}</span></p>
        </div>
        <Button asChild className="h-10 px-6 text-base font-semibold">
          <Link to="/dashboard/buat-undangan">+ Buat Undangan Baru</Link>
        </Button>
      </div>
      <div id="undangan-saya" className="mt-2">
        <h2 className="font-semibold mb-4 text-lg">Daftar Undangan Anda</h2>
        {loadingList ? (
          <div className="text-gray-500">Memuat data undangan...</div>
        ) : invitations.length === 0 ? (
          <div className="text-gray-400 text-center py-12 border-2 border-dashed rounded-lg">
            <p className="mb-4">Belum ada undangan yang dibuat.</p>
            <Button asChild variant="outline">
              <Link to="/dashboard/buat-undangan">Buat Undangan Pertama Anda</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {invitations.map((inv) => {
              const theme = themes.find(t => t.id === inv.themeId) || themes[0];

              // <-- PERBAIKAN: Ambil data dari objek bersarang
              const { mempelaiPria, mempelaiWanita, akad, resepsi } = inv;

              // Tentukan nama mempelai berdasarkan urutan
              const namaTampil = inv.urutanMempelai === 'wanita-pria'
                ? `${mempelaiWanita.nama} & ${mempelaiPria.nama}`
                : `${mempelaiPria.nama} & ${mempelaiWanita.nama}`;

              const tanggalAcara = akad.tanggal || resepsi.tanggal;

              return (
                <Card key={inv.id} className="p-5 flex flex-col justify-between gap-4 border shadow-sm rounded-xl hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg truncate">{namaTampil}</h3>
                      <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: theme.secondaryColor, color: theme.primaryColor }}>
                        {theme.name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Tanggal Acara: <span className="font-semibold text-gray-700">{formatTanggalIndo(tanggalAcara)}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      URL: /{inv.slug}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end pt-4 border-t">
                    <Button asChild size="sm">
                      <a href={`/${inv.slug}`} target="_blank" rel="noopener noreferrer">Lihat</a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/dashboard/edit-undangan/${inv.id}`}>Edit</Link>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(inv.id)}>Hapus</Button>
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