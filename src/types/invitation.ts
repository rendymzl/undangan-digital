import type { AmplopDigital } from "./amplop";
import type { GaleriFoto } from "./galery";

export type UrutanMempelai = 'pria-wanita' | 'wanita-pria';
export type FotoTipe = 'upload' | 'avatar' | 'tanpa_foto';
export type CoverTipe = 'warna' | 'gambar' | 'upload';

export interface CustomColors {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
}

// Tipe untuk tabel invitations
export interface MempelaiData {
  nama: string;
  namaPanggilan: string | null;
  anakKe: string | null;
  bapak: string;
  ibu: string;
  almBapak: boolean;
  almIbu: boolean;
  instagram: string | null;
  foto: string | null;
  fotoTipe: FotoTipe;
}

// Tipe untuk data acara (bisa digunakan untuk akad dan resepsi)
export interface AcaraData {
  tanggal: string | null;
  waktuMulai: string | null;
  waktuSelesai: string | null;
  waktuSampaiSelesai: boolean;
  lokasi: string | null;
  lokasiLat: number | null;
  lokasiLng: number | null;
  lokasiUrl: string | null;
}

// Interface utama yang baru dan lebih terstruktur
export interface Invitation {
  id: string;
  userId: string;
  slug: string;
  createdAt: string;
  urutanMempelai: UrutanMempelai;

  mempelaiPria: MempelaiData;
  mempelaiWanita: MempelaiData;

  akad: AcaraData;
  resepsi: AcaraData;
  lokasiResepsiSamaDenganAkad: boolean;

  ceritaCinta: string | null;
  amplopDigital: AmplopDigital[] | null;
  coverUrl: string | null;
  coverTipe: CoverTipe;
  coverGambarPilihan: string | null;
  themeId: string;
  galeriAktif: boolean;
  backsoundUrl: string | null;
  customColors: CustomColors | null;
  galeri: GaleriFoto[] | null;
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