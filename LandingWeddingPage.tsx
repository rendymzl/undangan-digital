import { JSX, createSignal, onMount } from "solid-js";
import { FlipbookTheme } from "../../themes/flipbookThemes";
import OrnamenSVG from "./ornamen/topSVG";
import dummyInvitation from "../../data/dummyInvitation";
import { Ucapan } from "@/types/models";

// Section imports
import CoverPage from "./pages/CoverPage";
import SalamPage from "./pages/SalamPage";
import ProfilPage from "./pages/ProfilPage";
import AkadPage from "./pages/AkadPage";
import ResepsiPage from "./pages/ResepsiPage";
import GaleriPage from "./pages/GaleriPage";
import CeritaPage from "./pages/CeritaPage";
import UcapanPage from "./pages/UcapanPage";
import RSVPPage from "./pages/RSVPPage";
import AmplopPage from "./pages/AmplopPage";
import PenutupPage from "./pages/PenutupPage";
import UcapanDanRSVPPage from "./pages/UcapanDanRSVPPage";

interface LandingWeddingPageProps {
  theme: FlipbookTheme;
  data: typeof dummyInvitation & { id?: string };
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = createSignal<string>("");
  let interval: any;
  onMount(() => {
    function update() {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("Acara telah berlangsung");
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${days} hari ${hours} jam ${minutes} menit ${seconds} detik`);
    }
    update();
    interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  });
  return <div class="text-lg font-bold text-center mt-2" style={{ color: "#fff", background: "#0008", padding: "8px 16px", 'border-radius': "12px" }}>{timeLeft()}</div>;
}

function CountdownCard({ targetDate, theme }: { targetDate: string; theme: any }) {
  const [timeLeft, setTimeLeft] = createSignal<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  let interval: any;
  onMount(() => {
    function update() {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }
    update();
    interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  });
  return (
    <div class="backdrop-blur bg-white/60 rounded-2xl shadow-lg px-6 py-3 flex flex-col items-center justify-center min-w-[210px]" style={{ color: theme.primary, border: `1.5px solid ${theme.primary}` }}>
      {timeLeft() ? (
        <div class="flex gap-3 items-end">
          <div class="flex flex-col items-center">
            <span class="text-2xl md:text-3xl font-extrabold leading-none" style={{ color: theme.primary }}>{timeLeft()!.days}</span>
            <span class="text-xs font-medium text-gray-600">hari</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-2xl md:text-3xl font-extrabold leading-none" style={{ color: theme.primary }}>{timeLeft()!.hours}</span>
            <span class="text-xs font-medium text-gray-600">jam</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-2xl md:text-3xl font-extrabold leading-none" style={{ color: theme.primary }}>{timeLeft()!.minutes}</span>
            <span class="text-xs font-medium text-gray-600">menit</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-2xl md:text-3xl font-extrabold leading-none" style={{ color: theme.primary }}>{timeLeft()!.seconds}</span>
            <span class="text-xs font-medium text-gray-600">detik</span>
          </div>
        </div>
      ) : (
        <span class="text-base font-bold text-gray-700">Acara telah berlangsung</span>
      )}
    </div>
  );
}

export default function LandingWeddingPage({ theme, data }: LandingWeddingPageProps): JSX.Element {
  // Sticky navbar
  const sections = [
    {
      id: "cover", label: "Cover", icon: () => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" stroke="currentColor" stroke-width="1.5" /><path d="M8 11h8M8 15h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
      )
    },
    {
      id: "profil", label: "Profil", icon: () => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5" /><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="currentColor" stroke-width="1.5" /></svg>
      )
    },
    {
      id: "akad", label: "Akad", icon: () => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M6 12V7a6 6 0 0 1 12 0v5" stroke="currentColor" stroke-width="1.5" /><rect x="4" y="12" width="16" height="8" rx="2" stroke="currentColor" stroke-width="1.5" /></svg>
      )
    },
    {
      id: "resepsi", label: "Resepsi", icon: () => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M4 17v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" stroke="currentColor" stroke-width="1.5" /><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5" /></svg>
      )
    },
    {
      id: "galeri", label: "Galeri", icon: () => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5" /><path d="M3 17l5.5-6.5a2 2 0 0 1 3 0L17 17" stroke="currentColor" stroke-width="1.5" /><circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" /></svg>
      )
    },
    {
      id: "cerita", label: "Cerita", icon: () => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M5 19V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14l-7-3-7 3Z" stroke="currentColor" stroke-width="1.5" /></svg>
      )
    },
    {
      id: "ucapan", label: "Ucapan", icon: () => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-1.9.73A8.5 8.5 0 1 1 12 3.5a8.38 8.38 0 0 1 .73 1.9A8.5 8.5 0 0 1 21 11.5Z" stroke="currentColor" stroke-width="1.5" /><path d="M15 9h.01M12 12h.01M9 9h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
      )
    },
    {
      id: "rsvp", label: "RSVP", icon: () => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5" /><path d="M7 9h10M7 13h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
      )
    },
    {
      id: "amplop", label: "Amplop", icon: () => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" stroke-width="1.5" /><path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="1.5" /></svg>
      )
    },
    {
      id: "penutup", label: "Penutup", icon: () => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" /><path d="M8 12h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
      )
    },
  ];
  return (
    <div class="w-full min-h-screen bg-white relative flex flex-col">
      {/* Konten utama scrollable, beri padding bawah agar nav tidak ketutup */}
      <div class="flex-1 w-full max-w-2xl mx-auto px-0 md:px-4" style={{ 'padding-bottom': "72px" }}>
        {/* Cover + Countdown */}
        <section id="cover" class="relative">
          <CoverPage theme={theme} data={{
            ...data,
            namaPanggilanPria: data.namaPanggilanPria || data.namaPria.split(' ')[0],
            namaPanggilanWanita: data.namaPanggilanWanita || data.namaWanita.split(' ')[0],
          }} namaTamu="Nama Tamu" onOpen={() => { }} isLocked={false} isFullScreen={true} />
          <div class="absolute left-1/2 -translate-x-1/2 bottom-8">
            <CountdownCard targetDate={data.tanggal} theme={theme} />
          </div>
        </section>
        <section id="profil" class="min-h-screen flex flex-col justify-center"><SalamPage theme={theme} /><ProfilPage theme={theme} /></section>
        <section id="akad">
          <AkadPage theme={theme} data={data} />
        </section>
        <section id="resepsi">
          <ResepsiPage theme={theme} data={data} />
        </section>
        {/* <section id="galeri"><GaleriPage theme={theme} /></section> */}
        <section id="cerita"><CeritaPage theme={theme} data={data} /></section>
        <section id="ucapan-rsvp">
          <UcapanDanRSVPPage 
            theme={theme} 
            ucapanList={data.ucapan?.map((u: any) => ({
              id: u.id,
              guest_name: u.guest_name ?? u.nama ?? "",
              message: u.message ?? u.ucapan ?? "",
              created_at: u.created_at ?? u.createdAt ?? "",
            })) as Ucapan[]}
            invitationId={data.id || ""}
            onSubmit={async (formData: { guestName: string; message: string; attendanceStatus: 'attending' | 'not_attending' | 'pending' }) => {
              // Simulasi API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              console.log('Data ucapan:', formData);
              // Tidak perlu return value karena prop mengharapkan Promise<void>
            }}
          />
        </section>

        <section id="amplop">
          <AmplopPage theme={theme} data={data} />
        </section>
        <section id="penutup" class="min-h-screen flex flex-col justify-center"><PenutupPage theme={theme} /></section>
      </div>
    </div>
  );
}
