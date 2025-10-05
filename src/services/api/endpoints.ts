// API endpoint constants
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },

  // Invitations
  INVITATIONS: {
    LIST: '/invitations',
    CREATE: '/invitations',
    GET: (id: string) => `/invitations/${id}`,
    UPDATE: (id: string) => `/invitations/${id}`,
    DELETE: (id: string) => `/invitations/${id}`,
    DUPLICATE: (id: string) => `/invitations/${id}/duplicate`,
    PUBLISH: (id: string) => `/invitations/${id}/publish`,
    ANALYTICS: (id: string) => `/invitations/${id}/analytics`,
  },

  // Guests
  GUESTS: {
    LIST: (invitationId: string) => `/invitations/${invitationId}/guests`,
    CREATE: (invitationId: string) => `/invitations/${invitationId}/guests`,
    GET: (invitationId: string, guestId: string) => `/invitations/${invitationId}/guests/${guestId}`,
    UPDATE: (invitationId: string, guestId: string) => `/invitations/${invitationId}/guests/${guestId}`,
    DELETE: (invitationId: string, guestId: string) => `/invitations/${invitationId}/guests/${guestId}`,
    BULK_IMPORT: (invitationId: string) => `/invitations/${invitationId}/guests/bulk-import`,
    BULK_DELETE: (invitationId: string) => `/invitations/${invitationId}/guests/bulk-delete`,
  },

  // RSVP
  RSVP: {
    LIST: (invitationId: string) => `/invitations/${invitationId}/rsvp`,
    UPDATE: (invitationId: string, guestId: string) => `/invitations/${invitationId}/rsvp/${guestId}`,
    ANALYTICS: (invitationId: string) => `/invitations/${invitationId}/rsvp/analytics`,
    EXPORT: (invitationId: string) => `/invitations/${invitationId}/rsvp/export`,
  },

  // Distribution
  DISTRIBUTION: {
    SEND: (invitationId: string) => `/invitations/${invitationId}/send`,
    SCHEDULE: (invitationId: string) => `/invitations/${invitationId}/schedule`,
    STATUS: (invitationId: string) => `/invitations/${invitationId}/delivery-status`,
    HISTORY: (invitationId: string) => `/invitations/${invitationId}/send-history`,
  },

  // Templates
  TEMPLATES: {
    LIST: '/templates',
    GET: (id: string) => `/templates/${id}`,
    CATEGORIES: '/templates/categories',
  },

  // Payments
  PAYMENTS: {
    PLANS: '/payments/plans',
    SUBSCRIPTION: '/payments/subscription',
    CREATE_PAYMENT: '/payments/create',
    VERIFY_PAYMENT: '/payments/verify',
    HISTORY: '/payments/history',
    INVOICES: '/payments/invoices',
    CANCEL_SUBSCRIPTION: '/payments/subscription/cancel',
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    INVITATION: (id: string) => `/analytics/invitations/${id}`,
    OVERVIEW: '/analytics/overview',
    EXPORT: '/analytics/export',
  },

  // User Profile
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    CHANGE_PASSWORD: '/profile/password',
    UPLOAD_AVATAR: '/profile/avatar',
    DELETE_ACCOUNT: '/profile/delete',
    EXPORT_DATA: '/profile/export',
  },

  // Settings
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
    NOTIFICATIONS: '/settings/notifications',
    INTEGRATIONS: '/settings/integrations',
  },

  // Support
  SUPPORT: {
    TICKETS: '/support/tickets',
    CREATE_TICKET: '/support/tickets',
    GET_TICKET: (id: string) => `/support/tickets/${id}`,
    FAQ: '/support/faq',
    SEARCH_FAQ: '/support/faq/search',
  },

  // File Upload
  UPLOAD: {
    IMAGE: '/upload/image',
    DOCUMENT: '/upload/document',
    BULK: '/upload/bulk',
  },
} as const;

// Helper function to build URL with query parameters
export function buildUrl(endpoint: string, params?: Record<string, any>): string {
  if (!params) return endpoint;

  const url = new URL(endpoint, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.pathname + url.search;
}