// Tipe untuk tabel invitations
export interface Invitation {
  id: string;
  userId: string;
  slug: string;
  namaPria: string;
  namaWanita: string;
  ortuPria: string;
  ortuWanita: string;
  tanggalAkad: string | null;
  waktuAkadMulai: string | null;
  waktuAkadSelesai: string | null;
  lokasiAkad: string;
  tanggalResepsi: string | null;
  waktuResepsiMulai: string | null;
  waktuResepsiSelesai: string | null;
  lokasiResepsi: string;
  ceritaCinta: string;
  coverUrl: string;
  createdAt: string;
  namaPanggilanPria: string;
  namaPanggilanWanita: string;
  themeId: string; // Sebelumnya 'tema'
  galeriAktif: boolean;

  // Properti baru ditambahkan
  lokasiAkadLat: number | null;
  lokasiAkadLng: number | null;
  lokasiAkadUrl: string | null;
  lokasiResepsiLat: number | null;
  lokasiResepsiLng: number | null;
  lokasiResepsiUrl: string | null;
  backsoundUrl: string | null;
  customColors: any | null; // Tipe 'any' atau tipe spesifik jika ada
}

// Tipe untuk tabel love_story
export interface LoveStory {
  id: string;
  invitationId: string;
  tahun?: string;
  judul?: string;
  deskripsi?: string;
  createdAt?: string;
} 