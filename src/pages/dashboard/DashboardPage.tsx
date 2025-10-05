import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { themes } from "@/types/theme";
import type { Invitation, RSVP } from '@/types';
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { invitationFromApi } from "@/utils/data-transform";
import { deleteInvitation, getInvitationsByUser } from "@/features/invitations/invitationService";
import { 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Send, 
  Plus,
  Calendar,
  Users,
  MessageSquare,
  CheckCircle,
  Clock
} from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { Badge } from "@/components/ui/badge";
import { PaymentModal } from "./PaymentModal";
import { RSVPListModal } from "./RSVPListModal";
import type { PaymentProof } from "@/types/payment";

// Import new dashboard components
import { 
  StatCard, 
  QuickActionButton, 
  RecentInvitations, 
  ActivityFeed 
} from "./components";
import { useDashboardStats, useDashboardData } from "./hooks";

// Fungsi format tanggal (tidak perlu diubah)
function formatTanggalIndo(tanggal: string | null | undefined): string {
  if (!tanggal) return "-";
  const d = new Date(tanggal);
  if (isNaN(d.getTime())) return tanggal;
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  
  // Use new dashboard hooks
  const { invitations, quickActions, activities, loading: dataLoading, error, refreshData } = useDashboardData();
  const { stats, trends } = useDashboardStats({ invitations });

  // State untuk modals
  const [viewingProof, setViewingProof] = useState<PaymentProof | null>(null);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvitationId, setSelectedInvitationId] = useState('');
  const [isRsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [selectedRsvps, setSelectedRsvps] = useState<RSVP[]>([]);

  const openRsvpModal = (rsvps: RSVP[]) => {
    setSelectedRsvps(rsvps);
    setRsvpModalOpen(true);
  };

  const openPaymentModal = (id: string) => {
    setSelectedInvitationId(id);
    setPaymentModalOpen(true);
  };

  const openProofModal = (invitation: Invitation) => {
    const proof = invitation.payment_proofs?.[0];
    if (proof) {
      setViewingProof(proof);
      setPaymentModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Yakin ingin menghapus undangan ini? Semua data terkait akan hilang.")) {
      const { error } = await deleteInvitation(id);
      if (error) {
        toast.error("Gagal menghapus undangan.");
      } else {
        await refreshData(); // Use the new refresh function
        toast.success("Undangan berhasil dihapus.");
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat sesi...</div>;
  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 pb-28 md:pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 w-full">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard Undangan</h1>
          <p className="text-gray-600 text-base">Selamat datang, <span className="font-semibold">{user.email}</span></p>
        </div>

        {/* Tombol "Buat Undangan Baru" di desktop */}
        <Button asChild className="hidden md:flex h-10 px-6 text-base font-semibold">
          <Link to="/dashboard/pilih-template">+ Buat Undangan Baru</Link>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Undangan"
          value={stats.totalInvitations}
          description="Undangan yang telah dibuat"
          icon={Calendar}
          trend={trends.invitations}
          color="blue"
        />
        <StatCard
          title="Undangan Aktif"
          value={stats.activeInvitations}
          description="Undangan yang masih berlaku"
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Total Tamu"
          value={stats.totalGuests}
          description="Jumlah tamu yang diundang"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="RSVP Konfirmasi"
          value={stats.confirmedRSVPs}
          description="Tamu yang sudah konfirmasi"
          icon={MessageSquare}
          trend={trends.rsvps}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickActionButton
              key={index}
              title={action.title}
              description={action.description}
              icon={action.icon}
              href={action.href}
              color={action.color}
            />
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Invitations */}
        <div className="lg:col-span-2">
          <RecentInvitations 
            invitations={invitations}
            maxItems={4}
            showViewAll={true}
          />
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <ActivityFeed 
            activities={activities}
            maxItems={6}
            showViewAll={true}
          />
        </div>
      </div>
      {/* Detailed Invitation List */}
      <div id="undangan-saya" className="mt-2">
        <h2 className="font-semibold mb-4 text-lg">Semua Undangan Anda</h2>
        {dataLoading ? (
          <div className="text-gray-500">Memuat data undangan...</div>
        ) : invitations.length === 0 ? (
          <div className="text-gray-400 text-center py-12 border-2 border-dashed rounded-lg">
            <p className="mb-4">Belum ada undangan yang dibuat.</p>
            <Button asChild variant="outline">
              <Link to="/dashboard/pilih-template">Buat Undangan Pertama Anda</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {invitations.map((inv) => {
              const baseTheme = themes.find(t => t.id === inv.themeId) || themes[0];
              const finalColors = inv.customColors || baseTheme.colors;
              const { mempelaiPria, mempelaiWanita, akad, resepsi, urutanMempelai } = inv;
              const namaTampil = urutanMempelai === 'wanita-pria' ? `${mempelaiWanita.nama} & ${mempelaiPria.nama}` : `${mempelaiPria.nama} & ${mempelaiWanita.nama}`;
              const tanggalAcara = akad.tanggal || resepsi.tanggal;
              const fullUrl = `${window.location.origin}/${inv.slug}`;
              const latestProof = inv.payment_proofs?.[0];
              const status = latestProof?.status;

              return (
                <Card
                  key={inv.id}
                  className="flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-2xl overflow-hidden p-0 border-0 gap-0"
                  style={{
                    background: finalColors.background,
                    color: finalColors.foreground,
                    border: `1.5px solid ${finalColors.secondary}`,
                  }}
                >
                  <CardHeader
                    className="rounded-t-2xl p-4 flex flex-col gap-0"
                    style={{
                      background: finalColors.primary,
                      color: finalColors.primaryForeground,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className={`truncate text-xl font-bold ${baseTheme.fontTitle}`}>
                        {namaTampil}
                      </CardTitle>
                    </div>
                    <CardDescription
                      className="text-sm mt-1 flex justify-between w-full"
                      style={{ color: finalColors.primaryForeground, opacity: 0.85, fontWeight: 500 }}
                    >
                      {formatTanggalIndo(tanggalAcara)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent
                    className="flex-grow p-4 flex flex-col"
                    style={{
                      background: finalColors.background,
                      color: finalColors.foreground,
                    }}
                  >

                    <div className="flex flex-col mb-3">
                      <div className="flex justify-between mb-3">
                        <span className="text-sm" style={{ color: finalColors.secondaryForeground }}>URL Undangan</span>
                        <button className="text-sm hover:underline" onClick={() => openRsvpModal(inv.rsvp)}>
                          {inv.rsvp.length} Ucapan
                        </button>
                      </div>
                      <div
                        className="flex items-center rounded-lg px-3 py-2 border text-sm break-all bg-opacity-50"
                        style={{
                          background: finalColors.secondary,
                          color: finalColors.primary,
                          borderColor: `${finalColors.primary}55`,
                        }}
                      >
                        <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 font-semibold" style={{ color: finalColors.primary }} title={fullUrl}>
                          <ExternalLink size={16} /> {fullUrl}
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      {inv.expiredAt ? (
                        status === 'pending' ? (
                          <Badge variant="secondary" className="cursor-pointer hover:bg-gray-300 w-fit" onClick={() => openProofModal(inv)}>
                            Menunggu Konfirmasi
                          </Badge>
                        ) : status === 'rejected' ? (
                          <Badge variant="destructive" className="cursor-pointer hover:bg-red-700 w-fit" onClick={() => openProofModal(inv)}>
                            Pembayaran Ditolak
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-3 flex-wrap justify-between">
                            <CountdownTimer expiryDate={inv.expiredAt} />
                            <Button size="sm" onClick={() => openPaymentModal(inv.id)} className="ml-1">
                              Aktifkan
                            </Button>
                          </div>
                        )
                      ) : (
                        <Badge className="bg-green-600 text-white w-fit">Aktif Selamanya</Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter
                    className="flex flex-row justify-between items-center gap-3 p-4"
                    style={{
                      borderTop: `1.5px solid ${finalColors.secondary}`,
                      background: finalColors.background,
                    }}
                  >
                    <Button asChild size="sm" variant="outline" className="p-2 h-9 flex items-center gap-1 rounded-lg font-medium" title="Undang Tamu" style={{ borderColor: finalColors.primary, color: finalColors.primary, background: finalColors.background }}>
                      <Link to={`/dashboard/undang-tamu/${inv.id}`} className="flex items-center gap-1">
                        <Send size={16} />
                        <span className="ml-1">Undang Tamu</span>
                      </Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline" className="p-2 h-9 w-9 flex items-center justify-center rounded-lg" title="Edit" style={{ borderColor: finalColors.primary, color: finalColors.primary, background: finalColors.background }}>
                        <Link to={`/dashboard/edit-undangan/${inv.id}`}>
                          <Pencil size={16} />
                        </Link>
                      </Button>
                      <Button size="sm" variant="destructive" className="p-2 h-9 w-9 flex items-center justify-center rounded-lg" title="Hapus" onClick={() => handleDelete(inv.id)} style={{ background: finalColors.secondary, color: finalColors.secondaryForeground, borderColor: finalColors.secondary }}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => { setPaymentModalOpen(false); setViewingProof(null); }}
        invitationId={selectedInvitationId}
        existingProof={viewingProof}
        onSuccess={refreshData}
      />
      <RSVPListModal
        isOpen={isRsvpModalOpen}
        onClose={() => setRsvpModalOpen(false)}
        rsvps={selectedRsvps}
      />
      <div className="md:hidden fixed bottom-0 left-0 right-0 px-4 py-3 bg-white/70 backdrop-blur-sm border-t z-50">
        <Button asChild className="w-full h-12 flex items-center justify-center font-semibold text-base">
          <Link to="/dashboard/pilih-template">
            <Plus className="h-5 w-5 mr-2" />
            Buat Undangan Baru
          </Link>
        </Button>
      </div>
    </div>
  );
}