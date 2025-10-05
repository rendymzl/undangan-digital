# Menantikan - Digital Wedding Invitation Platform

A modern, scalable React application for creating beautiful digital wedding invitations. Built with React 19, TypeScript, and Vite with a focus on maintainability, performance, and developer experience.

## 🏗️ Architecture Overview

This project follows a **feature-based architecture** with clear separation of concerns, comprehensive error handling, and robust routing system.

### Key Features
- 🎨 **Modern UI** - Built with Radix UI and Tailwind CSS
- 🛡️ **Error Boundaries** - Comprehensive error handling at all levels
- 🔐 **Authentication & Authorization** - Role-based access control
- 📱 **Responsive Design** - Mobile-first approach
- 🎯 **Type Safety** - Full TypeScript coverage
- 🚀 **Performance** - Optimized builds and lazy loading
- 🧪 **Testing** - Built-in architecture validation

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Radix UI)
│   ├── shared/         # Shared business components
│   ├── error-boundaries/ # Comprehensive error handling system
│   │   ├── AppErrorBoundary.tsx      # Root-level error boundary
│   │   ├── RouteErrorBoundary.tsx    # Route-specific error handling
│   │   ├── FeatureErrorBoundary.tsx  # Feature-specific error isolation
│   │   ├── ErrorBoundaryProvider.tsx # Error boundary context
│   │   └── ErrorFallback.tsx         # Error fallback UI components
│   ├── layout/         # Layout components
│   │   ├── Layout.tsx           # Main application layout
│   │   └── DashboardLayout.tsx  # Dashboard-specific layout
│   └── access/         # Access control components
│       └── AccessDeniedPage.tsx # Access denied feedback
├── features/           # Feature-based modules
│   ├── auth/          # Authentication & authorization
│   ├── invitations/   # Wedding invitation management
│   ├── gallery/       # Photo gallery functionality
│   ├── rsvp/          # RSVP management
│   └── amplop/        # Digital envelope (gifts)
├── router/            # Enhanced routing system
│   ├── index.tsx      # Main router configuration
│   ├── routes/        # Organized route definitions
│   │   ├── publicRoutes.tsx    # Public accessible routes
│   │   └── protectedRoutes.tsx # Authentication required routes
│   ├── guards/        # Route protection system
│   │   ├── ProtectedRoute.tsx  # Authentication guard
│   │   └── AdminRoute.tsx      # Role-based access guard
│   └── utils/         # Routing utilities
│       ├── routeUtils.ts       # Route helper functions
│       └── securityUtils.ts    # Security and audit utilities
├── utils/             # Organized utility functions
│   ├── data-transform/ # Data transformation utilities
│   │   ├── caseTransform.ts    # Text case transformations
│   │   └── formValidator.ts    # Form validation utilities
│   ├── color/         # Color manipulation utilities
│   │   └── paletteGenerator.ts # Color palette generation
│   ├── form/          # Form handling utilities
│   │   └── submissionHandler.ts # Form submission logic
│   ├── error/         # Error handling system
│   │   ├── globalErrorHandler.ts # Global error handler
│   │   └── errorLogger.ts        # Error logging utilities
│   ├── test/          # Testing and validation utilities
│   │   ├── testRunner.ts         # Architecture test runner
│   │   ├── errorBoundaryTest.ts  # Error boundary tests
│   │   └── routeGuardTest.ts     # Route guard validation
│   ├── test-data/     # Test data utilities
│   │   └── dummyData.ts         # Mock data for development
│   └── dev/           # Development utilities
│       ├── importValidator.ts   # Import pattern validation
│       └── importGuide.md       # Import guidelines
├── constants/         # Centralized application constants
│   ├── routes.ts      # Route path constants
│   ├── api.ts         # API endpoint constants
│   ├── ui.ts          # UI-related constants
│   ├── messages.ts    # User-facing messages
│   ├── navigation.ts  # Navigation configuration
│   └── contact.ts     # Contact information
├── config/            # Configuration management system
│   ├── configManager.ts # Centralized configuration
│   ├── envValidator.ts  # Environment validation
│   ├── env.ts          # Environment configuration
│   └── theme.ts        # Theme configuration
├── hooks/             # Custom React hooks
│   └── useConfig.ts   # Configuration management hook
├── pages/             # Page components
│   └── error/         # Error pages
│       ├── ErrorPage.tsx    # General error page
│       └── NotFoundPage.tsx # 404 error page
├── lib/               # External library configurations
├── types/             # TypeScript type definitions
└── assets/            # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd menantikan
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server
```bash
npm run dev
```

## 🛠️ Development Scripts

### Core Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Run TypeScript type checking
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
```

### Development Tools
```bash
npm run dev-tools           # Interactive development tools menu
npm run dev-tools:all       # Run all development checks and validations
npm run analyze-imports     # Analyze and validate import patterns
npm run validate-structure  # Validate project architecture and structure
npm run check-all          # Run comprehensive quality checks (lint, type-check, structure)
```

### Architecture Validation
The project includes built-in architecture testing and validation:

```bash
# In browser console (development mode)
runArchitectureTests()      # Run all architecture validation tests
validateArchitecture()      # Get detailed architecture health report
errorLogger.getErrorStats() # View error logging statistics
```

## 🏛️ Architecture Patterns

### Error Handling System
The application implements a comprehensive multi-layered error boundary system:

- **AppErrorBoundary** - Root-level error boundary that catches all unhandled errors
- **RouteErrorBoundary** - Route-specific error handling that isolates routing failures
- **FeatureErrorBoundary** - Feature-specific error boundaries that prevent component failures from crashing the entire app
- **ErrorBoundaryProvider** - Context provider for error boundary management
- **Global Error Handler** - Captures unhandled promise rejections and window errors
- **Error Logger** - Centralized error logging with context and user information

### Enhanced Routing System
The routing system has been completely refactored for better maintainability and security:

- **Organized Route Configuration** - Routes are separated into logical files (public, protected)
- **Enhanced Route Guards** - TypeScript-powered authentication and authorization guards
- **Security Utilities** - Audit logging and security validation for admin routes
- **Access Control** - Role-based access control with proper user feedback
- **Route Utils** - Helper functions for route management and navigation

### Configuration Management System
- **Configuration Manager** - Centralized app configuration with environment validation
- **Theme System** - Light/dark theme with system preference detection and persistence
- **Feature Flags** - Runtime feature toggling with type-safe interfaces
- **Environment Validator** - Comprehensive environment variable validation
- **User Preferences** - Persistent user settings and preferences

### Standardized Import Organization
All imports follow a consistent pattern enforced by ESLint rules:

```typescript
// 1. External libraries (React, third-party packages)
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { clsx } from 'clsx';

// 2. Internal modules using path aliases (organized by domain)
import { Button } from '@/components/ui/button';
import { FeatureErrorBoundary } from '@/components/error-boundaries';
import { useAuth } from '@/features/auth/useAuth';
import { ROUTES } from '@/constants/routes';
import { API_ENDPOINTS } from '@/constants/api';
import { configManager } from '@/config/configManager';
import { logError } from '@/utils/error/errorLogger';

// 3. Relative imports (local files, styles)
import './Component.css';
import { localHelper } from './helpers';

// 4. Type-only imports (always last)
import type { User } from '@/types/user';
import type { ComponentProps } from './types';
```

**Import Guidelines:**
- Path aliases are used consistently instead of relative imports
- Imports are automatically organized by ESLint rules
- Type-only imports are clearly separated
- Related imports are grouped together for better readability

## 🔧 Configuration

### Environment Variables
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
```

### Path Aliases
The project uses comprehensive path aliases for clean imports:
- `@/components/*` - UI and shared components
- `@/features/*` - Feature modules
- `@/utils/*` - Utility functions
- `@/types/*` - Type definitions
- `@/constants/*` - Application constants
- `@/config/*` - Configuration files
- `@/router/*` - Routing system
- `@/hooks/*` - Custom hooks
- `@/lib/*` - Library configurations
- `@/pages/*` - Page components
- `@/assets/*` - Static assets

## 🛡️ Routing & Error Handling Patterns

### Route Organization
Routes are organized by access level for better maintainability:

```typescript
// Public Routes (src/router/routes/publicRoutes.tsx)
export const publicRoutes = [
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> }
];

// Protected Routes (src/router/routes/protectedRoutes.tsx)
export const protectedRoutes = [
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/invitations', element: <InvitationsPage /> }
];
```

### Route Guards Implementation
```typescript
// Protected Route Guard
<ProtectedRoute fallback={<LoginPage />}>
  <DashboardPage />
</ProtectedRoute>

// Admin Route Guard with Role-Based Access
<AdminRoute 
  requiredRole={['admin', 'super-admin']}
  onAccessDenied={() => toast.error('Access denied')}
>
  <AdminPanel />
</AdminRoute>
```

### Error Boundary Usage
```typescript
// Feature-level error isolation
<FeatureErrorBoundary 
  featureName="UserProfile"
  showMinimal={true}
  onError={(error, errorInfo) => {
    logError(error, 'UserProfile', errorInfo);
  }}
>
  <UserProfile />
</FeatureErrorBoundary>

// Route-level error handling
<RouteErrorBoundary routeName="Dashboard">
  <Routes />
</RouteErrorBoundary>
```

## 🧪 Testing & Validation

### Architecture Testing
The project includes comprehensive built-in architecture validation:

```bash
# Development Scripts
npm run dev-tools:all       # Run all architecture tests
npm run validate-structure  # Validate project structure
npm run analyze-imports     # Analyze import patterns

# Browser Console (Development Mode)
runArchitectureTests()      # Run all architecture validation tests
validateArchitecture()      # Get detailed architecture health report
testErrorBoundaries()       # Test error boundary functionality
testRouteGuards()          # Validate route guard behavior
```

### Code Quality & Validation
- **TypeScript** - Strict mode with comprehensive type checking
- **ESLint** - Enhanced rules for import organization and code quality
- **Import Analysis** - Validates import patterns and path alias usage
- **Structure Validation** - Ensures architectural consistency and best practices
- **Error Boundary Testing** - Automated testing of error handling components
- **Route Guard Validation** - Security and access control testing

## 🚀 Deployment

### Build Process
```bash
npm run build
```

The build process:
1. Runs TypeScript compilation
2. Validates code with ESLint
3. Builds optimized production bundle
4. Generates static assets

### Environment-Specific Builds
- **Development** - Debug mode, detailed error messages
- **Staging** - Production-like with analytics enabled
- **Production** - Optimized, minimal logging

## 📚 Development Guidelines

### Component Creation
1. Use TypeScript for all components
2. Implement proper error boundaries
3. Follow consistent import patterns
4. Include proper type definitions

### Feature Development
1. Create feature modules in `src/features/`
2. Include components, hooks, services, and types
3. Use feature-specific error boundaries
4. Follow the established patterns

### Error Handling
1. Use appropriate error boundaries
2. Provide user-friendly error messages
3. Log errors for debugging
4. Implement recovery mechanisms

## 🤝 Contributing

1. Follow the established architecture patterns
2. Use the provided development tools
3. Ensure all tests pass before submitting
4. Update documentation for new features

## 📄 License

This project is licensed under the MIT License.
