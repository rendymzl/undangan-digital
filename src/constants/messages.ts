/**
 * Application messages and text constants
 */

// Success messages
export const SUCCESS_MESSAGES = {
  // Auth
  LOGIN_SUCCESS: 'Berhasil masuk',
  LOGOUT_SUCCESS: 'Berhasil logout',
  REGISTER_SUCCESS: 'Akun berhasil dibuat',
  
  // Data operations
  SAVE_SUCCESS: 'Data berhasil disimpan',
  UPDATE_SUCCESS: 'Data berhasil diperbarui',
  DELETE_SUCCESS: 'Data berhasil dihapus',
  UPLOAD_SUCCESS: 'File berhasil diunggah',
  
  // Specific actions
  COPY_SUCCESS: 'Berhasil disalin!',
  COPY_BANK_SUCCESS: (bank: string) => `Nomor ${bank} berhasil disalin!`,
  MESSAGE_COPY_SUCCESS: 'Pesan berhasil disalin!',
  RSVP_SUBMIT_SUCCESS: 'Ucapan berhasil dikirim',
  PAYMENT_APPROVE_SUCCESS: 'Pembayaran berhasil disetujui',
  PAYMENT_REJECT_SUCCESS: 'Pembayaran berhasil ditolak',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  // Generic
  GENERIC_ERROR: 'Terjadi kesalahan, silakan coba lagi',
  NETWORK_ERROR: 'Koneksi bermasalah, periksa internet Anda',
  UNAUTHORIZED: 'Anda tidak memiliki izin untuk melakukan aksi ini',
  NOT_FOUND: 'Data tidak ditemukan',
  
  // Data operations
  LOAD_FAILED: 'Gagal memuat data',
  SAVE_FAILED: 'Gagal menyimpan data',
  DELETE_FAILED: 'Gagal menghapus data',
  UPDATE_FAILED: 'Gagal memperbarui data',
  UPLOAD_FAILED: 'Gagal mengunggah file',
  
  // Specific errors
  INVITATION_LOAD_FAILED: 'Gagal memuat data undangan',
  INVITATION_CREATE_FAILED: 'Gagal membuat undangan',
  INVITATION_DELETE_FAILED: 'Gagal menghapus undangan',
  INVITATION_ID_FAILED: 'Gagal mendapatkan ID undangan setelah disimpan',
  INVITATIONS_LOAD_FAILED: 'Gagal memuat daftar undangan',
  
  PAYMENT_LOAD_FAILED: 'Gagal memuat bukti pembayaran',
  PAYMENT_UPLOAD_FAILED: 'Gagal mengupload bukti pembayaran',
  PAYMENT_APPROVE_FAILED: 'Gagal menyetujui pembayaran',
  PAYMENT_REJECT_FAILED: 'Gagal menolak pembayaran',
  PAYMENT_IMAGE_LOAD_FAILED: 'Gagal memuat gambar bukti',
  
  RSVP_SUBMIT_FAILED: 'Gagal mengirim ucapan',
  COPY_FAILED: 'Gagal menyalin teks',
  MESSAGE_COPY_FAILED: 'Gagal menyalin pesan',
  
  PREVIEW_LOAD_FAILED: 'Gagal memuat data preview',
  
  // Validation
  REQUIRED_FIELDS: 'Data wajib (nama mempelai & orang tua) tidak boleh kosong',
  INVALID_DATA: 'Data yang dimasukkan tidak valid',
  FILE_TOO_LARGE: 'Ukuran file terlalu besar',
  FILE_TYPE_INVALID: 'Tipe file tidak didukung',
} as const;

// Loading states
export const LOADING_MESSAGES = {
  DEFAULT: 'Memuat...',
  LOGIN: 'Masuk...',
  REGISTER: 'Mendaftar...',
  SAVING: 'Menyimpan...',
  UPLOADING: 'Mengunggah...',
  DELETING: 'Menghapus...',
  LOADING_DATA: 'Memuat data...',
  PROCESSING: 'Memproses...',
} as const;

// Warning messages
export const WARNING_MESSAGES = {
  UNSAVED_CHANGES: 'Anda memiliki perubahan yang belum disimpan',
  CONFIRM_DELETE: 'Apakah Anda yakin ingin menghapus data ini?',
  CONFIRM_LOGOUT: 'Apakah Anda yakin ingin keluar?',
  CONFIRM_CANCEL: 'Apakah Anda yakin ingin membatalkan?',
} as const;

// Info messages
export const INFO_MESSAGES = {
  NO_DATA: 'Tidak ada data',
  EMPTY_LIST: 'Daftar kosong',
  COMING_SOON: 'Fitur ini akan segera hadir',
  UNDER_MAINTENANCE: 'Sedang dalam pemeliharaan',
} as const;

// Button labels
export const BUTTON_LABELS = {
  // Actions
  SAVE: 'Simpan',
  CANCEL: 'Batal',
  DELETE: 'Hapus',
  EDIT: 'Edit',
  VIEW: 'Lihat',
  COPY: 'Salin',
  SHARE: 'Bagikan',
  DOWNLOAD: 'Unduh',
  UPLOAD: 'Unggah',
  
  // Navigation
  BACK: 'Kembali',
  NEXT: 'Selanjutnya',
  PREVIOUS: 'Sebelumnya',
  HOME: 'Beranda',
  DASHBOARD: 'Dashboard',
  
  // Auth
  LOGIN: 'Masuk',
  REGISTER: 'Daftar',
  LOGOUT: 'Keluar',
  
  // Specific actions
  TRY_AGAIN: 'Coba Lagi',
  RELOAD: 'Muat Ulang',
  REFRESH: 'Refresh',
  SUBMIT: 'Kirim',
  CONFIRM: 'Konfirmasi',
  
  // Loading states
  LOADING: 'Loading...',
  SAVING: 'Menyimpan...',
  UPLOADING: 'Mengunggah...',
} as const;

// Page titles
export const PAGE_TITLES = {
  HOME: 'Beranda',
  DASHBOARD: 'Dashboard',
  LOGIN: 'Masuk',
  REGISTER: 'Daftar',
  TEMPLATES: 'Template',
  CREATE_INVITATION: 'Buat Undangan',
  EDIT_INVITATION: 'Edit Undangan',
  PREVIEW: 'Preview',
  INVITE_GUESTS: 'Undang Tamu',
  ADMIN_PAYMENTS: 'Kelola Pembayaran',
  NOT_FOUND: 'Halaman Tidak Ditemukan',
  ERROR: 'Terjadi Kesalahan',
} as const;

// Placeholders
export const PLACEHOLDERS = {
  EMAIL: 'Masukkan email Anda',
  PASSWORD: 'Masukkan password',
  NAME: 'Masukkan nama',
  MESSAGE: 'Tulis pesan Anda...',
  SEARCH: 'Cari...',
  SELECT: 'Pilih...',
} as const;