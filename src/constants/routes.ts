/**
 * Application route constants
 */

// Public routes
export const PUBLIC_ROUTES = {
  HOME: '/',
  TEMPLATES: '/templates',
  LOGIN: '/login',
  REGISTER: '/register',
  PREVIEW_DRAFT: '/preview/draft',
  INVITATION_DETAIL: '/:slug',
} as const;

// Protected routes
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  CREATE_INVITATION: '/dashboard/buat-undangan',
  EDIT_INVITATION: '/dashboard/edit-undangan/:id',
  CHOOSE_TEMPLATE: '/dashboard/pilih-template',
  INVITE_GUESTS: '/dashboard/undang-tamu/:invitationId',
  INVITE_GUESTS_BASE: '/dashboard/undang-tamu/',
} as const;

// Admin routes
export const ADMIN_ROUTES = {
  MANAGE_PAYMENTS: '/admin/manage-payments',
} as const;

// Error routes
export const ERROR_ROUTES = {
  NOT_FOUND: '/404',
  ERROR: '/error',
} as const;

// All routes combined
export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...PROTECTED_ROUTES,
  ...ADMIN_ROUTES,
  ...ERROR_ROUTES,
} as const;

// Route groups for easier management
export const ROUTE_GROUPS = {
  PUBLIC: Object.values(PUBLIC_ROUTES),
  PROTECTED: Object.values(PROTECTED_ROUTES),
  ADMIN: Object.values(ADMIN_ROUTES),
  ERROR: Object.values(ERROR_ROUTES),
} as const;

// Helper functions
export const isPublicRoute = (path: string): boolean => {
  return ROUTE_GROUPS.PUBLIC.includes(path as any);
};

export const isProtectedRoute = (path: string): boolean => {
  return ROUTE_GROUPS.PROTECTED.some(route => {
    // Handle dynamic routes
    if (route.includes(':')) {
      const pattern = route.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(path);
    }
    return route === path;
  });
};

export const isAdminRoute = (path: string): boolean => {
  return ROUTE_GROUPS.ADMIN.includes(path as any);
};