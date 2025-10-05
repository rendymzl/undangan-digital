import type { ComponentType, ReactNode } from 'react';

export interface RouteConfig {
  path: string;
  element: ComponentType<any>;
  guard?: 'public' | 'protected' | 'admin';
  children?: RouteConfig[];
  meta?: {
    title?: string;
    description?: string;
    requiresAuth?: boolean;
    roles?: string[];
    permissions?: string[];
  };
}

export interface RouteGuardProps {
  children?: ReactNode;
  fallback?: ComponentType;
  redirectTo?: string;
}

export interface AdminRouteProps extends RouteGuardProps {
  requiredRole?: string[];
  onAccessDenied?: () => void;
}

export interface ProtectedRouteProps extends RouteGuardProps {
  requiredPermissions?: string[];
  fallbackComponent?: ComponentType;
}

// Route metadata for navigation and SEO
export interface RouteMetadata {
  title: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  noIndex?: boolean;
}

// Navigation item interface for building menus
export interface NavigationItem {
  label: string;
  path: string;
  icon?: ComponentType<any>;
  children?: NavigationItem[];
  requiresAuth?: boolean;
  roles?: string[];
  permissions?: string[];
}