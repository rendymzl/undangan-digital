import { themes } from "@/types/theme";
import { fontPairings } from "@/types/fontPairings";
import type { InvitationFormData } from "./caseTransform";

export const dummyInvitationData: InvitationFormData = {
  // Properti level atas
  slug: "raka-nadya-2030",
  urutanMempelai: "wanita-pria",
  lokasiResepsiSamaDenganAkad: false,
  ceritaCinta: "Kisah cinta kami berawal dari pertemuan tak terduga di sebuah kedai kopi. Dari obrolan ringan, kami menemukan banyak kesamaan dan kenyamanan. Seiring berjalannya waktu, benih-benih cinta tumbuh dan kami memutuskan untuk merajut masa depan bersama dalam ikatan suci pernikahan.",
  coverUrl: null,
  coverTipe: 'gambar',
  coverGambarPilihan: '/covers/cover1.jpg',
  coverFile: null,
  themeId: themes[1].id,
  galeriAktif: true,
  galeri: [
    {
      url: 'https://images.unsplash.com/photo-1608027066529-9bef24be33a6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // <-- URL dari internet
      caption: 'Momen Bahagia 1',
    },
    {
      url: 'https://images.unsplash.com/photo-1610948409549-225d90bc6d66?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // <-- URL dari internet
      caption: 'Momen Bahagia 2',
    },
    {
      url: 'https://images.unsplash.com/photo-1603213060894-6924801a1be6?q=80&w=766&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // <-- URL dari internet
      caption: 'Momen Bahagia 3',
    },
    {
      url: 'https://images.unsplash.com/photo-1566838318109-a8bffb91d082?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // <-- URL dari internet
      caption: 'Momen Bahagia 4',
    },
  ],
  backsoundUrl: "/backsound/perfect-ed-sheeran.mp3",
  customColors: null,
  adaAkad: true,
  adaResepsi: true,
  amplopDigital: [
    { bank: 'BCA', atasNama: 'Budi Sanjaya', nomor: '1234567890' },
    { bank: 'GoPay', atasNama: 'Budi Sanjaya', nomor: '08123456789' }
  ],
  backsoundFile: null,
  fontTitle: fontPairings[1].fontTitle,
  fontText: fontPairings[1].fontText,

  // Objek untuk Mempelai Pria
  mempelaiPria: {
    nama: "Raka Pratama",
    namaPanggilan: "Raka",
    anakKe: "1",
    bapak: "Jaya",
    ibu: "Wati",
    almBapak: false,
    almIbu: false,
    instagram: "",
    foto: "/avatar/pria1.png",
    fotoTipe: 'avatar',
    fotoFile: null,
  },

  // Objek untuk Mempelai Wanita
  mempelaiWanita: {
    nama: "Nadya Azzahra",
    namaPanggilan: "Nadya",
    anakKe: "2",
    bapak: "Lestari",
    ibu: "Rahayu",
    almBapak: false,
    almIbu: true,
    instagram: "",
    foto: "/avatar/wanita1.png", // <-- Diperbaiki
    fotoTipe: 'avatar',
    fotoFile: null,
  },

  // Objek untuk Akad
  akad: {
    tanggal: "2025-10-10",
    waktuMulai: "09:00",
    waktuSelesai: "11:00",
    waktuSampaiSelesai: false,
    lokasi: "Masjid Istiqlal, Jakarta Pusat",
    lokasiLat: -6.1701,
    lokasiLng: 106.831,
    lokasiUrl: "https://maps.app.goo.gl/ev2D2cUaRLY4Sjo37",
  },

  // Objek untuk Resepsi
  resepsi: {
    tanggal: "2025-10-11",
    waktuMulai: "19:00",
    waktuSelesai: "",
    waktuSampaiSelesai: true,
    lokasi: "Gedung Balai Kartini, Jakarta Selatan",
    lokasiLat: -6.2297,
    lokasiLng: 106.809,
    lokasiUrl: "https://maps.app.goo.gl/ev2D2cUaRLY4Sjo37",
  },
};