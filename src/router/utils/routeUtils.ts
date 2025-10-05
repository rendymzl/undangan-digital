import type { RouteConfig, NavigationItem } from '../types';

/**
 * Check if user has access to a specific route
 */
export const hasRouteAccess = (
  route: RouteConfig,
  user: any
): boolean => {
  if (!route.meta?.requiresAuth) {
    return true;
  }

  if (!user) {
    return false;
  }

  // Check roles if specified
  if (route.meta.roles && route.meta.roles.length > 0) {
    const userRole = user.user_metadata?.role;
    if (!route.meta.roles.includes(userRole)) {
      return false;
    }
  }

  // Check permissions if specified
  if (route.meta.permissions && route.meta.permissions.length > 0) {
    const userPermissions = user.user_metadata?.permissions || [];
    const hasAllPermissions = route.meta.permissions.every(permission =>
      userPermissions.includes(permission)
    );
    if (!hasAllPermissions) {
      return false;
    }
  }

  return true;
};

/**
 * Filter navigation items based on user access
 */
export const filterNavigationByAccess = (
  items: NavigationItem[],
  user: any
): NavigationItem[] => {
  return items.filter(item => {
    // Check if user has access to this item
    if (item.requiresAuth && !user) {
      return false;
    }

    if (item.roles && item.roles.length > 0) {
      const userRole = user?.user_metadata?.role;
      if (!item.roles.includes(userRole)) {
        return false;
      }
    }

    if (item.permissions && item.permissions.length > 0) {
      const userPermissions = user?.user_metadata?.permissions || [];
      const hasAllPermissions = item.permissions.every(permission =>
        userPermissions.includes(permission)
      );
      if (!hasAllPermissions) {
        return false;
      }
    }

    // Recursively filter children
    if (item.children) {
      item.children = filterNavigationByAccess(item.children, user);
    }

    return true;
  });
};

/**
 * Get route metadata for SEO and page titles
 */
export const getRouteMetadata = (
  path: string,
  routes: RouteConfig[]
): RouteConfig['meta'] | null => {
  for (const route of routes) {
    if (route.path === path) {
      return route.meta || null;
    }
    
    if (route.children) {
      const childMeta = getRouteMetadata(path, route.children);
      if (childMeta) {
        return childMeta;
      }
    }
  }
  
  return null;
};

/**
 * Generate breadcrumb items from current path
 */
export const generateBreadcrumbs = (
  path: string,
  routes: RouteConfig[]
): Array<{ label: string; path: string }> => {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; path: string }> = [];
  
  let currentPath = '';
  
  for (const segment of segments) {
    currentPath += `/${segment}`;
    
    const route = findRouteByPath(currentPath, routes);
    if (route && route.meta?.title) {
      breadcrumbs.push({
        label: route.meta.title,
        path: currentPath
      });
    } else {
      // Fallback to segment name
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        path: currentPath
      });
    }
  }
  
  return breadcrumbs;
};

/**
 * Find route configuration by path
 */
export const findRouteByPath = (
  path: string,
  routes: RouteConfig[]
): RouteConfig | null => {
  for (const route of routes) {
    if (route.path === path) {
      return route;
    }
    
    if (route.children) {
      const childRoute = findRouteByPath(path, route.children);
      if (childRoute) {
        return childRoute;
      }
    }
  }
  
  return null;
};

/**
 * Check if current path matches route pattern
 */
export const matchesRoute = (currentPath: string, routePath: string): boolean => {
  // Simple pattern matching - can be enhanced with more complex patterns
  if (routePath.includes(':')) {
    const pattern = routePath.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(currentPath);
  }
  
  return currentPath === routePath;
};