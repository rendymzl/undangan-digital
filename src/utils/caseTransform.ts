import type { RSVP, Invitation, AmplopDigital, InvitationPhoto } from '@/types';

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

// Invitation
export function invitationFromApi(inv: any): Invitation {
  return {
    // Properti yang sudah ada
    id: inv.id,
    userId: inv.user_id,
    slug: inv.slug,
    namaPria: inv.nama_pria,
    namaWanita: inv.nama_wanita,
    ortuPria: inv.ortu_pria,
    ortuWanita: inv.ortu_wanita,
    tanggalAkad: inv.tanggal_akad,
    waktuAkadMulai: inv.waktu_akad_mulai,
    waktuAkadSelesai: inv.waktu_akad_selesai,
    lokasiAkad: inv.lokasi_akad,
    tanggalResepsi: inv.tanggal_resepsi,
    waktuResepsiMulai: inv.waktu_resepsi_mulai,
    waktuResepsiSelesai: inv.waktu_resepsi_selesai,
    lokasiResepsi: inv.lokasi_resepsi,
    ceritaCinta: inv.cerita_cinta,
    coverUrl: inv.cover_url,
    createdAt: inv.created_at,
    namaPanggilanPria: inv.nama_panggilan_pria,
    namaPanggilanWanita: inv.nama_panggilan_wanita,
    themeId: inv.tema,
    galeriAktif: inv.galeri_aktif,

    // Properti baru ditambahkan
    lokasiAkadLat: inv.lokasi_akad_lat,
    lokasiAkadLng: inv.lokasi_akad_lng,
    lokasiAkadUrl: inv.lokasi_akad_url,
    lokasiResepsiLat: inv.lokasi_resepsi_lat,
    lokasiResepsiLng: inv.lokasi_resepsi_lng,
    lokasiResepsiUrl: inv.lokasi_resepsi_url,
    backsoundUrl: inv.backsound_url,
    customColors: inv.custom_colors,
  };
}

export function invitationToApi(inv: Partial<Invitation>): any {
  return {
    // Properti yang sudah ada
    id: inv.id,
    user_id: inv.userId,
    slug: inv.slug,
    nama_pria: inv.namaPria,
    nama_wanita: inv.namaWanita,
    ortu_pria: inv.ortuPria,
    ortu_wanita: inv.ortuWanita,
    tanggal_akad: inv.tanggalAkad,
    waktu_akad_mulai: inv.waktuAkadMulai,
    waktu_akad_selesai: inv.waktuAkadSelesai,
    lokasi_akad: inv.lokasiAkad,
    tanggal_resepsi: inv.tanggalResepsi,
    waktu_resepsi_mulai: inv.waktuResepsiMulai,
    waktu_resepsi_selesai: inv.waktuResepsiSelesai,
    lokasi_resepsi: inv.lokasiResepsi,
    cerita_cinta: inv.ceritaCinta,
    cover_url: inv.coverUrl,
    created_at: inv.createdAt,
    nama_panggilan_pria: inv.namaPanggilanPria,
    nama_panggilan_wanita: inv.namaPanggilanWanita,
    tema: inv.themeId,
    galeri_aktif: inv.galeriAktif,

    // Properti baru ditambahkan
    lokasi_akad_lat: inv.lokasiAkadLat,
    lokasi_akad_lng: inv.lokasiAkadLng,
    lokasi_akad_url: inv.lokasiAkadUrl,
    lokasi_resepsi_lat: inv.lokasiResepsiLat,
    lokasi_resepsi_lng: inv.lokasiResepsiLng,
    lokasi_resepsi_url: inv.lokasiResepsiUrl,
    backsound_url: inv.backsoundUrl,
    custom_colors: inv.customColors,
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
    id: a.id,
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