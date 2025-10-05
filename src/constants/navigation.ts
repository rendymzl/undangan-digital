/**
 * Navigation and menu constants
 */

import { Home, Plus, Book, User, Settings, CreditCard, Users, BarChart3 } from 'lucide-react';
import { ROUTES } from './routes';

import type { NavigationItem } from '@/router/types';
import type { LucideIcon } from 'lucide-react';

// Main navigation items
export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: Home,
    requiresAuth: true,
  },
  {
    label: 'Buat Undangan',
    path: ROUTES.CREATE_INVITATION,
    icon: Plus,
    requiresAuth: true,
  },
  {
    label: 'Template',
    path: ROUTES.TEMPLATES,
    icon: Book,
  },
] as const;

// Dashboard sidebar menu
export const DASHBOARD_MENU: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: Home,
    requiresAuth: true,
  },
  {
    label: 'Buat Undangan',
    path: ROUTES.CREATE_INVITATION,
    icon: Plus,
    requiresAuth: true,
  },
  {
    label: 'Undangan Saya',
    path: ROUTES.DASHBOARD,
    icon: Book,
    requiresAuth: true,
  },
] as const;

// User menu items
export const USER_MENU: NavigationItem[] = [
  {
    label: 'Profil',
    path: '/profile',
    icon: User,
    requiresAuth: true,
  },
  {
    label: 'Pengaturan',
    path: '/settings',
    icon: Settings,
    requiresAuth: true,
  },
] as const;

// Admin menu items
export const ADMIN_MENU: NavigationItem[] = [
  {
    label: 'Kelola Pembayaran',
    path: ROUTES.MANAGE_PAYMENTS,
    icon: CreditCard,
    requiresAuth: true,
    roles: ['admin'],
  },
  {
    label: 'Kelola Pengguna',
    path: '/admin/users',
    icon: Users,
    requiresAuth: true,
    roles: ['admin'],
  },
  {
    label: 'Statistik',
    path: '/admin/statistics',
    icon: BarChart3,
    requiresAuth: true,
    roles: ['admin'],
  },
] as const;

// Public navigation (header/footer)
export const PUBLIC_NAVIGATION: NavigationItem[] = [
  {
    label: 'Beranda',
    path: ROUTES.HOME,
  },
  {
    label: 'Template',
    path: ROUTES.TEMPLATES,
  },
  {
    label: 'Tentang',
    path: '/about',
  },
  {
    label: 'Kontak',
    path: '/contact',
  },
] as const;

// Footer links
export const FOOTER_LINKS = {
  PRODUCT: [
    { label: 'Template', path: ROUTES.TEMPLATES },
    { label: 'Fitur', path: '/features' },
    { label: 'Harga', path: '/pricing' },
  ],
  COMPANY: [
    { label: 'Tentang Kami', path: '/about' },
    { label: 'Kontak', path: '/contact' },
    { label: 'Blog', path: '/blog' },
  ],
  SUPPORT: [
    { label: 'Bantuan', path: '/help' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Panduan', path: '/guide' },
  ],
  LEGAL: [
    { label: 'Syarat & Ketentuan', path: '/terms' },
    { label: 'Kebijakan Privasi', path: '/privacy' },
    { label: 'Cookie Policy', path: '/cookies' },
  ],
} as const;

// Breadcrumb configurations
export const BREADCRUMB_CONFIG: Record<string, { label: string; parent?: string }> = {
  [ROUTES.DASHBOARD]: { label: 'Dashboard' },
  [ROUTES.CREATE_INVITATION]: { label: 'Buat Undangan', parent: ROUTES.DASHBOARD },
  [ROUTES.CHOOSE_TEMPLATE]: { label: 'Pilih Template', parent: ROUTES.CREATE_INVITATION },
  [ROUTES.TEMPLATES]: { label: 'Template' },
  [ROUTES.LOGIN]: { label: 'Masuk' },
  [ROUTES.REGISTER]: { label: 'Daftar' },
  '/profile': { label: 'Profil', parent: ROUTES.DASHBOARD },
  '/settings': { label: 'Pengaturan', parent: ROUTES.DASHBOARD },
  [ROUTES.MANAGE_PAYMENTS]: { label: 'Kelola Pembayaran', parent: ROUTES.DASHBOARD },
} as const;

// Menu item interface for type safety
export interface MenuItem {
  label: string;
  path: string;
  icon?: LucideIcon;
  children?: MenuItem[];
  requiresAuth?: boolean;
  roles?: string[];
  permissions?: string[];
  badge?: string | number;
  disabled?: boolean;
}

// Helper functions
export const getMenuItemsByRole = (
  items: NavigationItem[],
  userRole?: string
): NavigationItem[] => {
  return items.filter(item => {
    if (!item.requiresAuth) return true;
    if (!userRole && item.requiresAuth) return false;
    if (item.roles && userRole && !item.roles.includes(userRole)) return false;
    return true;
  });
};

export const isActiveRoute = (currentPath: string, itemPath: string): boolean => {
  if (itemPath === ROUTES.HOME) {
    return currentPath === itemPath;
  }
  return currentPath.startsWith(itemPath);
};