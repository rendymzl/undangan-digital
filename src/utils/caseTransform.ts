import type { RSVP, Invitation, AmplopDigital, InvitationPhoto, UrutanMempelai, AcaraData, Theme, MempelaiData, GaleriFoto, CustomColors, CoverTipe } from '@/types';

// RSVP
export function rsvpFromApi(r: any): RSVP {
  return {
    id: r.id,
    invitationId: r.invitation_id,
    guestName: r.guest_name || r.nama,
    attendanceStatus: r.attendance_status || (r.kehadiran === 'Hadir' ? 'attending' : r.kehadiran === 'Tidak Hadir' ? 'not_attending' : 'pending'),
    message: r.message || r.ucapan,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    numberOfGuests: r.number_of_guests,
    contactInfo: r.contact_info,
  };
}

export function rsvpToApi(r: RSVP): any {
  const apiObj: any = {
    invitation_id: r.invitationId,
    guest_name: r.guestName,
    attendance_status: r.attendanceStatus,
    message: r.message,
  };
  if (r.numberOfGuests !== undefined) apiObj.number_of_guests = r.numberOfGuests;
  if (r.contactInfo !== undefined) apiObj.contact_info = r.contactInfo;
  // created_at dan updated_at biar Supabase yang generate
  return apiObj;
}

export interface MempelaiFormData extends MempelaiData {
  fotoFile: File | null;
}

// Interface utama untuk form, menggunakan struktur bersarang
export interface InvitationFormData {
  urutanMempelai: UrutanMempelai;
  lokasiResepsiSamaDenganAkad: boolean;

  mempelaiPria: MempelaiFormData;
  mempelaiWanita: MempelaiFormData;

  akad: AcaraData;
  adaAkad: boolean;
  resepsi: AcaraData;
  adaResepsi: boolean;

  // Properti level atas lainnya
  slug: string;
  ceritaCinta: string | null;
  amplopDigital: AmplopDigital[] | [];
  galeri: GaleriFoto[];
  coverUrl: string | null;
  coverTipe: CoverTipe;
  coverGambarPilihan: string | null;
  coverFile: File | null;
  themeId: string;
  galeriAktif: boolean;
  backsoundUrl: string | null;
  backsoundFile: File | null;
  customColors: CustomColors | null;
}

/**
 * Mengubah data dari API (snake_case, datar) menjadi format form (camelCase, bersarang).
 * Digunakan saat memuat data untuk halaman edit.
 */
export function invitationToForm(data: any): InvitationFormData {
  return {
    // Properti level atas
    slug: data.slug || "",
    urutanMempelai: data.urutan_mempelai || "pria-wanita",
    lokasiResepsiSamaDenganAkad: data.lokasi_resepsi_sama_dengan_akad || false,
    ceritaCinta: data.cerita_cinta || null,
    amplopDigital: (data.amplop_digital || []).map(amplopFromApi),
    coverUrl: data.cover_url || null,
    coverTipe: data.cover_tipe || 'upload',
    coverGambarPilihan: data.cover_gambar_pilihan || null,
    coverFile: data.cover_file || null,
    themeId: data.theme_id || "default",
    galeriAktif: data.galeri_aktif || false,
    galeri: data.galeri || [],
    backsoundUrl: data.backsound_url || null,
    backsoundFile: null,
    customColors: data.custom_colors || null,

    adaAkad: !!(data.tanggal_akad && data.lokasi_akad),
    adaResepsi: !!(data.tanggal_resepsi && data.lokasi_resepsi),

    // Objek untuk Mempelai Pria
    mempelaiPria: {
      nama: data.nama_pria || "",
      namaPanggilan: data.nama_panggilan_pria || null,
      anakKe: data.anak_ke_pria || null,
      bapak: data.bapak_pria || "",
      ibu: data.ibu_pria || "",
      almBapak: data.alm_bapak_pria || false,
      almIbu: data.alm_ibu_pria || false,
      instagram: data.instagram_pria || null,
      foto: data.foto_pria || null,
      fotoTipe: data.foto_pria_tipe || 'upload',
      fotoFile: null, // Selalu null saat memuat data awal
    },

    // Objek untuk Mempelai Wanita
    mempelaiWanita: {
      nama: data.nama_wanita || "",
      namaPanggilan: data.nama_panggilan_wanita || null,
      anakKe: data.anak_ke_wanita || null,
      bapak: data.bapak_wanita || "",
      ibu: data.ibu_wanita || "",
      almBapak: data.alm_bapak_wanita || false,
      almIbu: data.alm_ibu_wanita || false,
      instagram: data.instagram_wanita || null,
      foto: data.foto_wanita || null,
      fotoTipe: data.foto_wanita_tipe || 'upload',
      fotoFile: null,
    },

    // Objek untuk Akad
    akad: {
      tanggal: data.tanggal_akad || null,
      waktuMulai: data.waktu_akad_mulai || null,
      waktuSelesai: data.waktu_akad_selesai || null,
      waktuSampaiSelesai: data.waktu_akad_sampai_selesai || false,
      lokasi: data.lokasi_akad || null,
      lokasiLat: data.lokasi_akad_lat || null,
      lokasiLng: data.lokasi_akad_lng || null,
      lokasiUrl: data.lokasi_akad_url || null,
    },

    // Objek untuk Resepsi
    resepsi: {
      tanggal: data.tanggal_resepsi || null,
      waktuMulai: data.waktu_resepsi_mulai || null,
      waktuSelesai: data.waktu_resepsi_selesai || null,
      waktuSampaiSelesai: data.waktu_resepsi_sampai_selesai || false,
      lokasi: data.lokasi_resepsi || null,
      lokasiLat: data.lokasi_resepsi_lat || null,
      lokasiLng: data.lokasi_resepsi_lng || null,
      lokasiUrl: data.lokasi_resepsi_url || null,
    },
  };
}


/**
 * Mengubah data dari aplikasi (camelCase, bersarang) menjadi format API (snake_case, datar).
 * Digunakan sebelum menyimpan data (create atau update).
 */
export function invitationToApi(inv: Partial<Invitation>): any {
  return {
    // Properti level atas
    user_id: inv.userId,
    slug: inv.slug,
    urutan_mempelai: inv.urutanMempelai,
    lokasi_resepsi_sama_dengan_akad: inv.lokasiResepsiSamaDenganAkad,
    cerita_cinta: inv.ceritaCinta,
    cover_url: inv.coverUrl,
    cover_tipe: inv.coverTipe,
    cover_gambar_pilihan: inv.coverGambarPilihan,
    theme_id: inv.themeId,
    galeri_aktif: inv.galeriAktif,
    backsound_url: inv.backsoundUrl,
    custom_colors: inv.customColors,
    galeri: inv.galeri, // Pastikan galeri dioper

    // Data Mempelai Pria (diambil dari objek bersarang)
    nama_pria: inv.mempelaiPria?.nama,
    nama_panggilan_pria: inv.mempelaiPria?.namaPanggilan,
    anak_ke_pria: inv.mempelaiPria?.anakKe,
    bapak_pria: inv.mempelaiPria?.bapak,
    ibu_pria: inv.mempelaiPria?.ibu,
    alm_bapak_pria: inv.mempelaiPria?.almBapak,
    alm_ibu_pria: inv.mempelaiPria?.almIbu,
    instagram_pria: inv.mempelaiPria?.instagram,
    foto_pria: inv.mempelaiPria?.foto,
    foto_pria_tipe: inv.mempelaiPria?.fotoTipe,

    // Data Mempelai Wanita
    nama_wanita: inv.mempelaiWanita?.nama,
    nama_panggilan_wanita: inv.mempelaiWanita?.namaPanggilan,
    anak_ke_wanita: inv.mempelaiWanita?.anakKe,
    bapak_wanita: inv.mempelaiWanita?.bapak,
    ibu_wanita: inv.mempelaiWanita?.ibu,
    alm_bapak_wanita: inv.mempelaiWanita?.almBapak,
    alm_ibu_wanita: inv.mempelaiWanita?.almIbu,
    instagram_wanita: inv.mempelaiWanita?.instagram,
    foto_wanita: inv.mempelaiWanita?.foto,
    foto_wanita_tipe: inv.mempelaiWanita?.fotoTipe,

    // Data Akad
    tanggal_akad: inv.akad?.tanggal,
    waktu_akad_mulai: inv.akad?.waktuMulai,
    waktu_akad_selesai: inv.akad?.waktuSelesai,
    waktu_akad_sampai_selesai: inv.akad?.waktuSampaiSelesai,
    lokasi_akad: inv.akad?.lokasi,
    lokasi_akad_lat: inv.akad?.lokasiLat,
    lokasi_akad_lng: inv.akad?.lokasiLng,
    lokasi_akad_url: inv.akad?.lokasiUrl,

    // Data Resepsi
    tanggal_resepsi: inv.resepsi?.tanggal,
    waktu_resepsi_mulai: inv.resepsi?.waktuMulai,
    waktu_resepsi_selesai: inv.resepsi?.waktuSelesai,
    waktu_resepsi_sampai_selesai: inv.resepsi?.waktuSampaiSelesai,
    lokasi_resepsi: inv.resepsi?.lokasi,
    lokasi_resepsi_lat: inv.resepsi?.lokasiLat,
    lokasi_resepsi_lng: inv.resepsi?.lokasiLng,
    lokasi_resepsi_url: inv.resepsi?.lokasiUrl,
  };
}

/**
 * Mengubah data dari API (snake_case, datar) menjadi format interface Invitation (camelCase, bersarang).
 * Digunakan untuk menampilkan data di halaman detail atau dashboard.
 */
export function invitationFromApi(data: any): Invitation {
  return {
    // Properti level atas
    id: data.id,
    userId: data.user_id,
    slug: data.slug,
    createdAt: data.created_at,
    urutanMempelai: data.urutan_mempelai || "pria-wanita",
    lokasiResepsiSamaDenganAkad: data.lokasi_resepsi_sama_dengan_akad || false,
    ceritaCinta: data.cerita_cinta || null,
    coverUrl: data.cover_url || null,
    coverTipe: data.cover_tipe || 'upload',
    coverGambarPilihan: data.cover_gambar_pilihan || null,
    themeId: data.theme_id || "default",
    galeriAktif: data.galeri_aktif || false,
    backsoundUrl: data.backsound_url || null,
    customColors: data.custom_colors || null,
    galeri: (data.galeri || []).map(photoFromApi),
    amplopDigital: (data.amplop_digital || []).map(amplopFromApi),

    // Objek untuk Mempelai Pria
    mempelaiPria: {
      nama: data.nama_pria || "",
      namaPanggilan: data.nama_panggilan_pria || null,
      anakKe: data.anak_ke_pria || null,
      bapak: data.bapak_pria || "",
      ibu: data.ibu_pria || "",
      almBapak: data.alm_bapak_pria || false,
      almIbu: data.alm_ibu_pria || false,
      instagram: data.instagram_pria || null,
      foto: data.foto_pria || null,
      fotoTipe: data.foto_pria_tipe || 'upload',
    },

    // Objek untuk Mempelai Wanita
    mempelaiWanita: {
      nama: data.nama_wanita || "",
      namaPanggilan: data.nama_panggilan_wanita || null,
      anakKe: data.anak_ke_wanita || null,
      bapak: data.bapak_wanita || "",
      ibu: data.ibu_wanita || "",
      almBapak: data.alm_bapak_wanita || false,
      almIbu: data.alm_ibu_wanita || false,
      instagram: data.instagram_wanita || null,
      foto: data.foto_wanita || null,
      fotoTipe: data.foto_wanita_tipe || 'upload',
    },

    // Objek untuk Akad
    akad: {
      tanggal: data.tanggal_akad || null,
      waktuMulai: data.waktu_akad_mulai || null,
      waktuSelesai: data.waktu_akad_selesai || null,
      waktuSampaiSelesai: data.waktu_akad_sampai_selesai || false,
      lokasi: data.lokasi_akad || null,
      lokasiLat: data.lokasi_akad_lat || null,
      lokasiLng: data.lokasi_akad_lng || null,
      lokasiUrl: data.lokasi_akad_url || null,
    },

    // Objek untuk Resepsi
    resepsi: {
      tanggal: data.tanggal_resepsi || null,
      waktuMulai: data.waktu_resepsi_mulai || null,
      waktuSelesai: data.waktu_resepsi_selesai || null,
      waktuSampaiSelesai: data.waktu_resepsi_sampai_selesai || false,
      lokasi: data.lokasi_resepsi || null,
      lokasiLat: data.lokasi_resepsi_lat || null,
      lokasiLng: data.lokasi_resepsi_lng || null,
      lokasiUrl: data.lokasi_resepsi_url || null,
    },
  };
}

// AmplopDigital
export function amplopFromApi(a: any): AmplopDigital {
  return {
    id: a.id,
    invitationId: a.invitation_id,
    bank: a.bank,
    atasNama: a.atas_nama || a.nama,
    nomor: a.nomor || a.rekening,
    catatan: a.catatan,
    qrUrl: a.qr_url,
    createdAt: a.created_at,
  };
}

export function amplopToApi(a: AmplopDigital): any {
  return {
    invitation_id: a.invitationId,
    bank: a.bank,
    atas_nama: a.atasNama,
    nomor: a.nomor,
    catatan: a.catatan,
    qr_url: a.qrUrl,
    created_at: a.createdAt,
  };
}

// InvitationPhoto
export function photoFromApi(p: any): InvitationPhoto {
  return {
    id: p.id,
    invitationId: p.invitation_id,
    url: p.url || p.file_path,
    caption: p.caption,
    createdAt: p.created_at,
  };
}

export function photoToApi(p: InvitationPhoto): any {
  return {
    id: p.id,
    invitation_id: p.invitationId,
    url: p.url,
    caption: p.caption,
    created_at: p.createdAt,
  };
}