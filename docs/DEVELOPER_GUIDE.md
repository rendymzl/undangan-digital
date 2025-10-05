# Developer Guide - Menantikan

This guide provides detailed information for developers working on the Menantikan project.

## 🏗️ Architecture Overview

### Design Principles

1. **Feature-Based Organization** - Code is organized by features, not by file types
2. **Separation of Concerns** - Clear boundaries between UI, business logic, and data
3. **Error Resilience** - Comprehensive error handling at all levels
4. **Type Safety** - Full TypeScript coverage with strict mode
5. **Developer Experience** - Tools and patterns that enhance productivity

### Core Concepts

#### Error Boundaries
The application implements a comprehensive multi-layered error boundary system:

```typescript
// App-level - catches all unhandled errors at the root
<AppErrorBoundary>
  <App />
</AppErrorBoundary>

// Route-level - isolates routing errors and provides route-specific fallbacks
<RouteErrorBoundary routeName="Dashboard">
  <Routes />
</RouteErrorBoundary>

// Feature-level - prevents feature failures from crashing the entire app
<FeatureErrorBoundary 
  featureName="Authentication"
  showMinimal={true}
  onError={(error, errorInfo) => {
    logError(error, 'Authentication', errorInfo);
  }}
>
  <LoginForm />
</FeatureErrorBoundary>

// Error Boundary Provider - provides error context throughout the app
<ErrorBoundaryProvider>
  <App />
</ErrorBoundaryProvider>
```

**Error Boundary Features:**
- **Context-aware logging** - Errors are logged with component and user context
- **Graceful degradation** - Components fail gracefully with user-friendly messages
- **Error recovery** - Built-in mechanisms to recover from errors
- **Development debugging** - Enhanced error information in development mode

#### Route Guards
Enhanced access control system with comprehensive security features:

```typescript
// Protected routes - require authentication with fallback options
<ProtectedRoute 
  fallback={<LoginPage />}
  redirectTo="/login"
>
  <DashboardPage />
</ProtectedRoute>

// Admin routes - require specific roles with audit logging
<AdminRoute 
  requiredRole={['admin', 'super-admin']}
  onAccessDenied={() => {
    toast.error('Access denied: Insufficient permissions');
    logSecurityEvent('unauthorized_admin_access', user);
  }}
>
  <AdminPanel />
</AdminRoute>
```

**Route Guard Features:**
- **TypeScript Integration** - Full type safety for route configurations
- **Security Audit Logging** - All access attempts are logged for security monitoring
- **Flexible Fallbacks** - Customizable fallback components and redirect behavior
- **Role-Based Access Control** - Granular permission system with multiple role support
- **User Feedback** - Clear messaging for access denied scenarios

#### Configuration Management System
Comprehensive configuration management with environment validation and user preferences:

```typescript
import { configManager } from '@/config/configManager';
import { useConfig, useTheme, useFeatureFlags } from '@/hooks/useConfig';

// Programmatic Configuration Access
const config = configManager.getConfig();
const isFeatureEnabled = configManager.isFeatureEnabled('newFeature');
configManager.setTheme('dark');

// React Hook Usage
const MyComponent = () => {
  const { config, updateConfig } = useConfig();
  const { theme, setTheme, systemTheme } = useTheme();
  const { isEnabled, toggleFeature } = useFeatureFlags();

  return (
    <div style={{ backgroundColor: theme.colors.background }}>
      {isEnabled('newFeature') && <NewFeature />}
      <button onClick={() => setTheme('dark')}>
        Switch to Dark Theme
      </button>
    </div>
  );
};
```

**Configuration Features:**
- **Environment Validation** - Comprehensive validation of environment variables with detailed error reporting
- **Theme Management** - Light/dark theme with system preference detection and user override
- **Feature Flags** - Runtime feature toggling with persistent user preferences
- **User Preferences** - Persistent storage of user settings and preferences
- **Type Safety** - Full TypeScript support with strict type checking

## 📁 Directory Structure Guide

### Components (`src/components/`)

```
components/
├── ui/                 # Base UI components (Radix UI wrappers)
├── shared/             # Shared business components
├── error-boundaries/   # Comprehensive error handling system
│   ├── AppErrorBoundary.tsx      # Root-level error boundary
│   ├── RouteErrorBoundary.tsx    # Route-specific error handling
│   ├── FeatureErrorBoundary.tsx  # Feature-specific error isolation
│   ├── ErrorBoundaryProvider.tsx # Error boundary context provider
│   └── ErrorFallback.tsx         # Error fallback UI components
├── layout/            # Layout components
│   ├── Layout.tsx           # Main application layout
│   └── DashboardLayout.tsx  # Dashboard-specific layout
└── access/            # Access control components
    └── AccessDeniedPage.tsx # User-friendly access denied page
```

**Guidelines:**
- Components are organized by functionality and reusability
- All components include comprehensive TypeScript interfaces
- Error boundaries are implemented at appropriate levels
- Layout components provide consistent structure across the application
- Access control components provide clear user feedback

### Constants (`src/constants/`)

```
constants/
├── routes.ts      # Route path constants and navigation
├── api.ts         # API endpoint constants and configurations
├── ui.ts          # UI-related constants (colors, sizes, etc.)
├── messages.ts    # User-facing messages and notifications
├── navigation.ts  # Navigation menu configurations
└── contact.ts     # Contact information and social links
```

**Guidelines:**
- Constants are organized by domain for better maintainability
- All constants include TypeScript types and JSDoc documentation
- Route constants are used consistently throughout the application
- Message constants support internationalization patterns
- API constants include endpoint configurations and default values

### Configuration (`src/config/`)

```
config/
├── configManager.ts # Centralized configuration management
├── envValidator.ts  # Environment variable validation
├── env.ts          # Environment-specific configurations
└── theme.ts        # Theme configuration and management
```

**Guidelines:**
- Configuration is centralized and type-safe
- Environment validation provides clear error messages
- Theme configuration supports system preferences
- All configurations include proper TypeScript types

### Features (`src/features/`)

```
features/
├── auth/
│   ├── components/    # Auth-specific components
│   ├── hooks/         # Auth hooks (useAuth)
│   ├── services/      # API services
│   ├── types/         # Auth types
│   └── utils/         # Auth utilities
└── [feature]/
    ├── components/
    ├── hooks/
    ├── services/
    ├── types/
    └── utils/
```

**Guidelines:**
- Each feature should be self-contained
- Export public APIs through index files
- Use feature-specific error boundaries
- Follow consistent internal structure

### Router (`src/router/`)

```
router/
├── index.tsx              # Main router configuration with error boundaries
├── routes/
│   ├── publicRoutes.tsx   # Public accessible routes (landing, login, etc.)
│   └── protectedRoutes.tsx # Authentication required routes (dashboard, profile)
├── guards/
│   ├── ProtectedRoute.tsx # Enhanced authentication guard with TypeScript
│   └── AdminRoute.tsx     # Role-based authorization guard with audit logging
└── utils/
    ├── routeUtils.ts      # Route helper functions and navigation utilities
    └── securityUtils.ts   # Security validation and audit logging utilities
```

**Guidelines:**
- Routes are organized by access level for better maintainability
- All route guards include comprehensive TypeScript types
- Security audit logging is implemented for admin route access
- Error boundaries are integrated at the router level
- Consistent route patterns with proper fallback handling

### Utils (`src/utils/`)

```
utils/
├── data-transform/        # Data transformation utilities
│   ├── caseTransform.ts   # Text case transformations (camelCase, kebab-case, etc.)
│   └── formValidator.ts   # Form validation utilities with TypeScript types
├── color/                 # Color manipulation utilities
│   └── paletteGenerator.ts # Color palette generation and manipulation
├── form/                  # Form handling utilities
│   └── submissionHandler.ts # Form submission logic with error handling
├── error/                 # Comprehensive error handling system
│   ├── globalErrorHandler.ts # Global error handler for unhandled errors
│   └── errorLogger.ts        # Error logging with context and user information
├── test/                  # Testing and validation utilities
│   ├── testRunner.ts         # Architecture test runner for development
│   ├── errorBoundaryTest.ts  # Error boundary functionality tests
│   └── routeGuardTest.ts     # Route guard validation and security tests
├── test-data/             # Test data utilities
│   └── dummyData.ts          # Mock data for development and testing
└── dev/                   # Development utilities
    ├── importValidator.ts    # Import pattern validation and analysis
    └── importGuide.md        # Import organization guidelines
```

**Guidelines:**
- Utilities are organized by functionality for better discoverability
- All functions include comprehensive TypeScript types and JSDoc documentation
- Error handling utilities provide context-aware logging
- Development utilities help maintain code quality and architecture
- Test utilities enable architecture validation during development

## 🎯 Development Patterns

### Component Patterns

#### Basic Component Structure
```typescript
import React from 'react';
import { Button } from '@/components/ui/button';
import { FeatureErrorBoundary } from '@/components/error-boundaries';

import type { ComponentProps } from './types';

interface MyComponentProps extends ComponentProps {
  title: string;
  onAction: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onAction,
  ...props 
}) => {
  return (
    <FeatureErrorBoundary featureName="MyComponent">
      <div {...props}>
        <h2>{title}</h2>
        <Button onClick={onAction}>
          Action
        </Button>
      </div>
    </FeatureErrorBoundary>
  );
};

export default MyComponent;
```

#### Hook Patterns
```typescript
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api';
import { logError } from '@/utils/error';

import type { User } from '@/types/user';

export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await apiClient.getUser(userId);
      setUser(userData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      logError(error, 'useUser');
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
};
```

### Error Handling Patterns

#### Component Error Boundaries
```typescript
// Wrap components that might fail
<FeatureErrorBoundary 
  featureName="UserProfile"
  showMinimal={true}
  onError={(error, errorInfo) => {
    // Custom error handling
    logError(error, 'UserProfile', errorInfo);
  }}
>
  <UserProfile userId={userId} />
</FeatureErrorBoundary>
```

#### Service Error Handling
```typescript
import { logError } from '@/utils/error';

export const userService = {
  async getUser(id: string): Promise<User> {
    try {
      const response = await fetch(`/api/users/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      logError(error as Error, 'userService.getUser', undefined, {
        userId: id,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  },
};
```

### State Management Patterns

#### Configuration Usage
```typescript
import { useConfig, useTheme, useFeatureFlags } from '@/hooks/useConfig';

const MyComponent = () => {
  const { config } = useConfig();
  const { theme, setTheme } = useTheme();
  const { isEnabled } = useFeatureFlags();

  const showNewFeature = isEnabled('newFeature');
  const isDarkMode = theme.colors.background === '#000000';

  return (
    <div>
      {showNewFeature && <NewFeature />}
      <button onClick={() => setTheme('dark')}>
        Toggle Theme
      </button>
    </div>
  );
};
```

## 🔧 Development Tools

### Built-in Development Tools

#### Architecture Testing & Validation
```bash
# Comprehensive Development Scripts
npm run dev-tools:all       # Run all architecture tests and validations
npm run analyze-imports     # Analyze import patterns and path alias usage
npm run validate-structure  # Validate project structure and organization
npm run dev-tools          # Interactive development tools menu
npm run check-all          # Run all quality checks (lint, type-check, structure)
```

#### Browser Console Testing (Development Mode)
```javascript
// Architecture Validation
runArchitectureTests()      # Run comprehensive architecture tests
validateArchitecture()      # Get detailed architecture health report

// Error Handling Testing
testErrorBoundaries()       # Test error boundary functionality
errorLogger.getErrorStats() # View error logging statistics
globalErrorHandler.test()   # Test global error handling

// Route Security Testing
testRouteGuards()          # Validate route guard behavior
hasRouteAccess(route, user) # Test route access permissions
logSecurityEvent('test')    # Test security audit logging

// Configuration Testing
configManager.validate()   # Validate configuration integrity
testThemeSystem()          # Test theme switching functionality
```

**Testing Features:**
- **Real-time Validation** - Architecture tests run automatically in development
- **Comprehensive Coverage** - Tests cover error boundaries, route guards, and configuration
- **Security Testing** - Route access and security audit logging validation
- **Performance Monitoring** - Import analysis and bundle optimization checks

### Code Quality Tools

#### TypeScript Configuration
- Strict mode enabled
- Path aliases configured
- Comprehensive type checking
- Import organization rules

#### ESLint Configuration
- React and TypeScript rules
- Import organization enforcement
- Code quality rules
- Consistent formatting

### Development Workflow

#### Before Starting Development
```bash
# Validate project structure
npm run validate-structure

# Check import patterns
npm run analyze-imports

# Run type checking
npm run type-check
```

#### During Development
```bash
# Start development server
npm run dev

# Run linting with auto-fix
npm run lint:fix

# Check types continuously
npm run type-check
```

#### Before Committing
```bash
# Run all quality checks
npm run check-all

# Validate architecture
npm run dev-tools:all
```

## 🚀 Performance Guidelines

### Component Optimization
- Use React.memo for expensive components
- Implement proper dependency arrays in hooks
- Avoid unnecessary re-renders
- Use lazy loading for route components

### Bundle Optimization
- Import only what you need
- Use dynamic imports for large dependencies
- Optimize asset loading
- Implement proper code splitting

### Error Handling Performance
- Use error boundaries to prevent cascading failures
- Implement proper error recovery mechanisms
- Log errors efficiently without blocking UI
- Use proper loading states

## 🧪 Testing Guidelines

### Architecture Testing
The project includes built-in architecture validation that runs automatically in development mode.

### Component Testing
```typescript
// Example component test structure
describe('MyComponent', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle errors gracefully', () => {
    // Test error scenarios
  });

  it('should follow accessibility guidelines', () => {
    // Test accessibility
  });
});
```

### Integration Testing
- Test route guards and authentication flows
- Test error boundary integration
- Test feature module interactions
- Test configuration management

## 📚 Best Practices

### Code Organization
1. Follow the established directory structure
2. Use consistent naming conventions
3. Keep components focused and single-purpose
4. Implement proper error boundaries

### Import Management
1. Use path aliases instead of relative imports
2. Follow consistent import ordering
3. Group related imports together
4. Use type-only imports when appropriate

### Error Handling
1. Implement error boundaries at appropriate levels
2. Provide user-friendly error messages
3. Log errors with sufficient context
4. Implement error recovery mechanisms

### Performance
1. Use React best practices for performance
2. Implement proper loading states
3. Optimize bundle sizes
4. Use lazy loading appropriately

### Security
1. Implement proper authentication and authorization
2. Use secure route guards
3. Log security events for audit
4. Follow security best practices

## 🤝 Contributing

### Code Review Checklist
- [ ] Follows established architecture patterns
- [ ] Includes proper error handling
- [ ] Uses consistent import patterns
- [ ] Includes TypeScript types
- [ ] Passes all quality checks
- [ ] Updates documentation if needed

### Pull Request Guidelines
1. Run all quality checks before submitting
2. Include clear description of changes
3. Update documentation for new features
4. Ensure all tests pass
5. Follow the established code patterns

This guide should help you understand and contribute to the Menantikan project effectively. For questions or clarifications, please refer to the project documentation or reach out to the development team.
#
# 🔧 Advanced Usage Examples

### Error Boundary Implementation Examples

#### Feature-Level Error Boundary
```typescript
import { FeatureErrorBoundary } from '@/components/error-boundaries';
import { logError } from '@/utils/error/errorLogger';

const UserProfileSection = ({ userId }: { userId: string }) => {
  return (
    <FeatureErrorBoundary
      featureName="UserProfile"
      showMinimal={true}
      onError={(error, errorInfo) => {
        logError(error, 'UserProfile', errorInfo, {
          userId,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        });
      }}
    >
      <UserProfile userId={userId} />
      <UserSettings userId={userId} />
    </FeatureErrorBoundary>
  );
};
```

#### Custom Error Fallback
```typescript
import { ErrorFallback } from '@/components/error-boundaries';

const CustomErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <div className="error-container">
      <h2>Something went wrong in the user profile</h2>
      <details>
        <summary>Error details</summary>
        <pre>{error.message}</pre>
      </details>
      <button onClick={resetError}>Try again</button>
      <button onClick={() => window.location.href = '/dashboard'}>
        Go to Dashboard
      </button>
    </div>
  );
};

// Usage
<FeatureErrorBoundary
  featureName="UserProfile"
  fallback={CustomErrorFallback}
>
  <UserProfile />
</FeatureErrorBoundary>
```

### Route Guard Implementation Examples

#### Enhanced Protected Route
```typescript
import { ProtectedRoute } from '@/router/guards/ProtectedRoute';
import { LoginPage } from '@/pages/auth/LoginPage';

const DashboardRoute = () => {
  return (
    <ProtectedRoute
      fallback={<LoginPage />}
      redirectTo="/login"
      onAuthRequired={(currentPath) => {
        // Custom logic when authentication is required
        toast.info('Please log in to access this page');
        logSecurityEvent('auth_required', { path: currentPath });
      }}
    >
      <DashboardPage />
    </ProtectedRoute>
  );
};
```

#### Role-Based Admin Route
```typescript
import { AdminRoute } from '@/router/guards/AdminRoute';
import { AccessDeniedPage } from '@/components/access/AccessDeniedPage';

const AdminPanelRoute = () => {
  return (
    <AdminRoute
      requiredRole={['admin', 'super-admin']}
      fallback={<AccessDeniedPage />}
      onAccessDenied={(user, requiredRoles) => {
        toast.error('Access denied: Insufficient permissions');
        logSecurityEvent('unauthorized_admin_access', {
          userId: user?.id,
          userRole: user?.role,
          requiredRoles,
          timestamp: new Date().toISOString(),
          path: window.location.pathname,
        });
      }}
    >
      <AdminPanel />
    </AdminRoute>
  );
};
```

### Configuration Management Examples

#### Environment-Specific Configuration
```typescript
import { configManager } from '@/config/configManager';
import { envValidator } from '@/config/envValidator';

// Validate environment on app startup
const initializeApp = async () => {
  try {
    // Validate all required environment variables
    const validation = envValidator.validate();
    
    if (!validation.isValid) {
      console.error('Environment validation failed:', validation.errors);
      throw new Error('Invalid environment configuration');
    }

    // Initialize configuration
    const config = configManager.getConfig();
    console.log('App initialized with config:', config);
    
  } catch (error) {
    logError(error as Error, 'App Initialization');
    throw error;
  }
};
```

#### Theme Management with User Preferences
```typescript
import { useTheme } from '@/hooks/useConfig';

const ThemeToggle = () => {
  const { theme, setTheme, systemTheme, isSystemTheme } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    
    // Log theme change for analytics
    logEvent('theme_changed', {
      from: theme.mode,
      to: newTheme,
      isSystemTheme: newTheme === 'system',
      systemPreference: systemTheme,
    });
  };

  return (
    <div className="theme-toggle">
      <button 
        onClick={() => handleThemeChange('light')}
        className={theme.mode === 'light' ? 'active' : ''}
      >
        Light
      </button>
      <button 
        onClick={() => handleThemeChange('dark')}
        className={theme.mode === 'dark' ? 'active' : ''}
      >
        Dark
      </button>
      <button 
        onClick={() => handleThemeChange('system')}
        className={isSystemTheme ? 'active' : ''}
      >
        System
      </button>
    </div>
  );
};
```

### Utility Function Examples

#### Error Logging with Context
```typescript
import { logError } from '@/utils/error/errorLogger';

const handleApiError = async (error: Error, context: string) => {
  // Log error with comprehensive context
  logError(error, context, undefined, {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    userId: getCurrentUser()?.id,
    sessionId: getSessionId(),
  });

  // Show user-friendly message
  toast.error('Something went wrong. Please try again.');
};
```

#### Form Validation with Error Boundaries
```typescript
import { formValidator } from '@/utils/data-transform/formValidator';
import { FeatureErrorBoundary } from '@/components/error-boundaries';

const ContactForm = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validation = formValidator.validate(formData, contactFormSchema);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // Submit form
      await submitContactForm(formData);
      toast.success('Message sent successfully!');
      
    } catch (error) {
      logError(error as Error, 'ContactForm.handleSubmit');
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <FeatureErrorBoundary featureName="ContactForm">
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </FeatureErrorBoundary>
  );
};
```

## 🚀 Performance Optimization Patterns

### Lazy Loading with Error Boundaries
```typescript
import { lazy, Suspense } from 'react';
import { FeatureErrorBoundary } from '@/components/error-boundaries';

// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

const LazyLoadedSection = () => {
  return (
    <FeatureErrorBoundary featureName="HeavyComponent">
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent />
      </Suspense>
    </FeatureErrorBoundary>
  );
};
```

### Route-Based Code Splitting
```typescript
import { lazy } from 'react';
import { RouteErrorBoundary } from '@/components/error-boundaries';

// Lazy load route components
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

export const protectedRoutes = [
  {
    path: '/dashboard',
    element: (
      <RouteErrorBoundary routeName="Dashboard">
        <Suspense fallback={<div>Loading Dashboard...</div>}>
          <DashboardPage />
        </Suspense>
      </RouteErrorBoundary>
    ),
  },
  {
    path: '/profile',
    element: (
      <RouteErrorBoundary routeName="Profile">
        <Suspense fallback={<div>Loading Profile...</div>}>
          <ProfilePage />
        </Suspense>
      </RouteErrorBoundary>
    ),
  },
];
```

This comprehensive guide should help developers understand and effectively use the refactored architecture patterns in the Menantikan project.