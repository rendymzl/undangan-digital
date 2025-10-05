/**
 * UI constants and configuration
 */

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

// Common sizes
export const SIZES = {
  AVATAR: {
    SM: 32,
    MD: 40,
    LG: 48,
    XL: 64,
  },
  ICON: {
    SM: 16,
    MD: 20,
    LG: 24,
    XL: 32,
  },
  BUTTON_HEIGHT: {
    SM: 32,
    MD: 40,
    LG: 48,
  },
} as const;

// Color palette
export const COLORS = {
  PRIMARY: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    900: '#0c4a6e',
  },
  GRAY: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  SUCCESS: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  WARNING: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  ERROR: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
} as const;

// Form validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  MESSAGE_MAX_LENGTH: 500,
  SLUG_REGEX: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  SLUG_MIN_LENGTH: 3,
  SLUG_MAX_LENGTH: 50,
} as const;

// File upload limits
export const FILE_LIMITS = {
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  AUDIO: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ACCEPTED_TYPES: ['audio/mpeg', 'audio/mp3', 'audio/wav'],
    ACCEPTED_EXTENSIONS: ['.mp3', '.wav'],
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  RSVP_PAGE_SIZE: 20,
  GALLERY_PAGE_SIZE: 12,
} as const;

// Toast messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    SAVE: 'Data berhasil disimpan',
    UPDATE: 'Data berhasil diperbarui',
    DELETE: 'Data berhasil dihapus',
    UPLOAD: 'File berhasil diunggah',
    LOGIN: 'Berhasil masuk',
    LOGOUT: 'Berhasil keluar',
    REGISTER: 'Akun berhasil dibuat',
  },
  ERROR: {
    GENERIC: 'Terjadi kesalahan, silakan coba lagi',
    NETWORK: 'Koneksi bermasalah, periksa internet Anda',
    UNAUTHORIZED: 'Anda tidak memiliki izin untuk melakukan aksi ini',
    NOT_FOUND: 'Data tidak ditemukan',
    VALIDATION: 'Data yang dimasukkan tidak valid',
    FILE_TOO_LARGE: 'Ukuran file terlalu besar',
    FILE_TYPE_INVALID: 'Tipe file tidak didukung',
  },
  WARNING: {
    UNSAVED_CHANGES: 'Anda memiliki perubahan yang belum disimpan',
    CONFIRM_DELETE: 'Apakah Anda yakin ingin menghapus data ini?',
  },
} as const;

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  DRAFT_INVITATION: 'draft_invitation',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE_PREFERENCE: 'language_preference',
} as const;