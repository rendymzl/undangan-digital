/**
 * API endpoints and configuration constants
 */

// Supabase configuration
export const SUPABASE_CONFIG = {
  TABLES: {
    INVITATIONS: 'invitations',
    USERS: 'users',
    RSVP: 'rsvp',
    AMPLOP_DIGITAL: 'amplop_digital',
    PAYMENT_PROOFS: 'payment_proofs',
    GALLERY: 'gallery',
  },
  STORAGE: {
    PHOTOS: 'photos',
    BACKSOUND: 'backsound',
    COVERS: 'covers',
  },
  AUTH: {
    PROVIDERS: ['email'],
    REDIRECT_URL: process.env.NODE_ENV === 'production' 
      ? 'https://menantikan.com/auth/callback'
      : 'http://localhost:5173/auth/callback',
  },
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  
  // Invitation endpoints
  INVITATIONS: {
    LIST: '/invitations',
    CREATE: '/invitations',
    GET: (id: string) => `/invitations/${id}`,
    UPDATE: (id: string) => `/invitations/${id}`,
    DELETE: (id: string) => `/invitations/${id}`,
    BY_SLUG: (slug: string) => `/invitations/slug/${slug}`,
    BY_USER: (userId: string) => `/invitations/user/${userId}`,
  },
  
  // RSVP endpoints
  RSVP: {
    LIST: (invitationId: string) => `/invitations/${invitationId}/rsvp`,
    CREATE: (invitationId: string) => `/invitations/${invitationId}/rsvp`,
    UPDATE: (id: string) => `/rsvp/${id}`,
    DELETE: (id: string) => `/rsvp/${id}`,
  },
  
  // Amplop digital endpoints
  AMPLOP: {
    LIST: (invitationId: string) => `/invitations/${invitationId}/amplop`,
    CREATE: (invitationId: string) => `/invitations/${invitationId}/amplop`,
    UPDATE: (id: string) => `/amplop/${id}`,
    DELETE: (id: string) => `/amplop/${id}`,
  },
  
  // Gallery endpoints
  GALLERY: {
    LIST: (invitationId: string) => `/invitations/${invitationId}/gallery`,
    UPLOAD: (invitationId: string) => `/invitations/${invitationId}/gallery/upload`,
    DELETE: (id: string) => `/gallery/${id}`,
  },
  
  // Admin endpoints
  ADMIN: {
    PAYMENTS: '/admin/payments',
    USERS: '/admin/users',
    STATISTICS: '/admin/statistics',
  },
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Request timeouts
export const TIMEOUTS = {
  DEFAULT: 10000, // 10 seconds
  UPLOAD: 30000,  // 30 seconds
  LONG_RUNNING: 60000, // 1 minute
} as const;