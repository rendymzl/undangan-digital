# Design Document

## Overview

This design document outlines the comprehensive implementation of all dashboard menu pages for the Menantikan wedding invitation application. The design focuses on creating a cohesive, user-friendly experience that leverages the existing design system while introducing new functionality across all dashboard sections.

## Architecture

### Current State Analysis
- Existing dashboard with basic invitation listing
- Sidebar navigation with menu structure in place
- Established design system with Tailwind CSS and Radix UI components
- Authentication and route protection already implemented
- Error boundary system and configuration management in place

### Target Architecture
- Comprehensive dashboard with 12 distinct page types
- Consistent layout and navigation patterns
- Integrated data management across all pages
- Responsive design for all screen sizes
- Progressive enhancement with advanced features

## Folder Structure Organization

### Recommended Project Structure
```
src/
├── pages/
│   ├── dashboard/
│   │   ├── DashboardPage.tsx                 # Main dashboard overview
│   │   ├── components/                       # Dashboard-specific components
│   │   │   ├── StatCard.tsx
│   │   │   ├── QuickActionButton.tsx
│   │   │   ├── RecentInvitations.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   └── index.ts
│   │   └── hooks/
│   │       ├── useDashboardStats.ts
│   │       └── useDashboardData.ts
│   ├── invitations/
│   │   ├── CreateInvitationPage.tsx          # Multi-step wizard
│   │   ├── InvitationListPage.tsx            # Enhanced invitation management
│   │   ├── EditInvitationPage.tsx            # Edit existing invitations
│   │   ├── components/
│   │   │   ├── InvitationWizard/
│   │   │   │   ├── TemplateSelectionStep.tsx
│   │   │   │   ├── BasicInfoStep.tsx
│   │   │   │   ├── CustomizationStep.tsx
│   │   │   │   ├── ContentStep.tsx
│   │   │   │   ├── ReviewStep.tsx
│   │   │   │   └── index.ts
│   │   │   ├── InvitationCard.tsx
│   │   │   ├── InvitationPreview.tsx
│   │   │   ├── BulkActions.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useInvitationWizard.ts
│   │   │   ├── useInvitationList.ts
│   │   │   └── useInvitationActions.ts
│   │   └── services/
│   │       ├── invitationApi.ts
│   │       └── invitationValidation.ts
│   ├── guests/
│   │   ├── GuestListPage.tsx                 # Guest management
│   │   ├── RSVPDashboardPage.tsx             # RSVP analytics
│   │   ├── SendInvitationPage.tsx            # Distribution system
│   │   ├── components/
│   │   │   ├── GuestTable/
│   │   │   │   ├── GuestTable.tsx
│   │   │   │   ├── GuestRow.tsx
│   │   │   │   ├── GuestFilters.tsx
│   │   │   │   └── index.ts
│   │   │   ├── GuestModals/
│   │   │   │   ├── AddGuestModal.tsx
│   │   │   │   ├── EditGuestModal.tsx
│   │   │   │   ├── BulkImportModal.tsx
│   │   │   │   └── index.ts
│   │   │   ├── RSVP/
│   │   │   │   ├── RSVPChart.tsx
│   │   │   │   ├── RSVPTimeline.tsx
│   │   │   │   ├── RSVPStats.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Distribution/
│   │   │   │   ├── SendingInterface.tsx
│   │   │   │   ├── DeliveryTracking.tsx
│   │   │   │   ├── ScheduledSends.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useGuestManagement.ts
│   │   │   ├── useRSVPAnalytics.ts
│   │   │   ├── useInvitationSending.ts
│   │   │   └── useBulkOperations.ts
│   │   └── services/
│   │       ├── guestApi.ts
│   │       ├── rsvpApi.ts
│   │       └── distributionApi.ts
│   ├── payments/
│   │   ├── PaymentDashboardPage.tsx          # Payment overview
│   │   ├── SubscriptionPage.tsx              # Plan management
│   │   ├── TransactionHistoryPage.tsx        # Transaction records
│   │   ├── components/
│   │   │   ├── PaymentStatus/
│   │   │   │   ├── PaymentStatusCard.tsx
│   │   │   │   ├── SubscriptionInfo.tsx
│   │   │   │   └── index.ts
│   │   │   ├── PlanManagement/
│   │   │   │   ├── PlanComparisonTable.tsx
│   │   │   │   ├── PlanUpgradeModal.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Transactions/
│   │   │   │   ├── TransactionTable.tsx
│   │   │   │   ├── TransactionDetail.tsx
│   │   │   │   ├── InvoiceGenerator.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── usePaymentStatus.ts
│   │   │   ├── useSubscription.ts
│   │   │   └── useTransactionHistory.ts
│   │   └── services/
│   │       ├── paymentApi.ts
│   │       └── subscriptionApi.ts
│   ├── analytics/
│   │   ├── StatisticsPage.tsx                # Analytics dashboard
│   │   ├── components/
│   │   │   ├── Charts/
│   │   │   │   ├── VisitorChart.tsx
│   │   │   │   ├── EngagementChart.tsx
│   │   │   │   ├── RSVPTrendChart.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Analytics/
│   │   │   │   ├── AnalyticsOverview.tsx
│   │   │   │   ├── DateRangeSelector.tsx
│   │   │   │   ├── ComparisonTools.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Reports/
│   │   │   │   ├── ReportBuilder.tsx
│   │   │   │   ├── ReportExporter.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useAnalytics.ts
│   │   │   ├── useChartData.ts
│   │   │   └── useReportGeneration.ts
│   │   └── services/
│   │       └── analyticsApi.ts
│   ├── profile/
│   │   ├── UserProfilePage.tsx               # Profile management
│   │   ├── SecuritySettingsPage.tsx          # Security settings
│   │   ├── NotificationSettingsPage.tsx      # Notification preferences
│   │   ├── components/
│   │   │   ├── Profile/
│   │   │   │   ├── ProfileForm.tsx
│   │   │   │   ├── AvatarUpload.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Security/
│   │   │   │   ├── PasswordChange.tsx
│   │   │   │   ├── TwoFactorAuth.tsx
│   │   │   │   ├── LoginHistory.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Notifications/
│   │   │   │   ├── NotificationPreferences.tsx
│   │   │   │   ├── NotificationHistory.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useProfile.ts
│   │   │   ├── useSecurity.ts
│   │   │   └── useNotifications.ts
│   │   └── services/
│   │       └── profileApi.ts
│   ├── settings/
│   │   ├── SettingsPage.tsx                  # General settings
│   │   ├── IntegrationSettingsPage.tsx       # Third-party integrations
│   │   ├── components/
│   │   │   ├── GeneralSettings/
│   │   │   │   ├── AppearanceSettings.tsx
│   │   │   │   ├── LanguageSettings.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Integrations/
│   │   │   │   ├── APIKeyManagement.tsx
│   │   │   │   ├── WebhookConfig.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useSettings.ts
│   │   │   └── useIntegrations.ts
│   │   └── services/
│   │       └── settingsApi.ts
│   ├── support/
│   │   ├── HelpCenterPage.tsx                # Help and FAQ
│   │   ├── SupportTicketPage.tsx             # Support tickets
│   │   ├── components/
│   │   │   ├── Help/
│   │   │   │   ├── FAQSection.tsx
│   │   │   │   ├── TutorialLibrary.tsx
│   │   │   │   ├── SearchableHelp.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Support/
│   │   │   │   ├── TicketForm.tsx
│   │   │   │   ├── TicketList.tsx
│   │   │   │   ├── ChatWidget.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useHelp.ts
│   │   │   └── useSupport.ts
│   │   └── services/
│   │       └── supportApi.ts
│   └── templates/
│       ├── TemplateGalleryPage.tsx           # Enhanced template browsing
│       ├── components/
│       │   ├── TemplateGrid.tsx
│       │   ├── TemplatePreview.tsx
│       │   ├── TemplateFilters.tsx
│       │   └── index.ts
│       ├── hooks/
│       │   └── useTemplates.ts
│       └── services/
│           └── templateApi.ts
├── components/
│   ├── shared/                               # Shared components across pages
│   │   ├── DataTable/                        # Reusable data table
│   │   │   ├── DataTable.tsx
│   │   │   ├── DataTablePagination.tsx
│   │   │   ├── DataTableFilters.tsx
│   │   │   └── index.ts
│   │   ├── Charts/                           # Reusable chart components
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   └── index.ts
│   │   ├── Modals/                           # Common modal components
│   │   │   ├── ConfirmationModal.tsx
│   │   │   ├── FormModal.tsx
│   │   │   └── index.ts
│   │   ├── Forms/                            # Reusable form components
│   │   │   ├── FormField.tsx
│   │   │   ├── FormSection.tsx
│   │   │   ├── FormWizard.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── layout/                               # Layout components
│   │   ├── DashboardLayout.tsx               # Main dashboard layout
│   │   ├── PageHeader.tsx                    # Consistent page headers
│   │   ├── PageContainer.tsx                 # Page wrapper with consistent spacing
│   │   └── index.ts
│   └── ui/                                   # Base UI components (existing)
├── hooks/                                    # Global hooks
│   ├── shared/
│   │   ├── useApi.ts                         # Generic API hook
│   │   ├── usePagination.ts                  # Pagination logic
│   │   ├── useFilters.ts                     # Filter management
│   │   ├── useExport.ts                      # Data export functionality
│   │   └── index.ts
│   └── index.ts
├── services/                                 # API services
│   ├── api/
│   │   ├── client.ts                         # API client configuration
│   │   ├── endpoints.ts                      # API endpoint definitions
│   │   └── types.ts                          # API response types
│   ├── shared/
│   │   ├── exportService.ts                  # Data export utilities
│   │   ├── uploadService.ts                  # File upload handling
│   │   └── validationService.ts              # Form validation utilities
│   └── index.ts
├── types/                                    # TypeScript type definitions
│   ├── dashboard.ts                          # Dashboard-specific types
│   ├── guest.ts                              # Guest management types
│   ├── payment.ts                            # Payment-related types
│   ├── analytics.ts                          # Analytics data types
│   ├── api.ts                                # API response types
│   └── index.ts
└── utils/                                    # Utility functions
    ├── dashboard/
    │   ├── statsCalculations.ts              # Dashboard statistics calculations
    │   └── chartHelpers.ts                   # Chart data transformation
    ├── export/
    │   ├── csvExporter.ts                     # CSV export utilities
    │   ├── pdfGenerator.ts                    # PDF generation
    │   └── excelExporter.ts                  # Excel export utilities
    ├── validation/
    │   ├── guestValidation.ts                 # Guest data validation
    │   ├── invitationValidation.ts            # Invitation validation
    │   └── paymentValidation.ts               # Payment form validation
    └── index.ts
```

### Folder Organization Principles

#### 1. **Feature-Based Organization**
- Each major feature has its own folder under `pages/`
- Related components, hooks, and services are co-located
- Shared functionality is extracted to common folders

#### 2. **Component Hierarchy**
- Page-level components in the root of each feature folder
- Feature-specific components in `components/` subfolder
- Shared components in `components/shared/`
- UI primitives in `components/ui/`

#### 3. **Separation of Concerns**
- **Pages**: Route-level components and page logic
- **Components**: Reusable UI components
- **Hooks**: Custom React hooks for state and logic
- **Services**: API calls and external service integration
- **Types**: TypeScript type definitions
- **Utils**: Pure utility functions

#### 4. **Index Files for Clean Imports**
- Each component folder has an `index.ts` for clean imports
- Barrel exports for better developer experience
- Consistent import patterns across the application

#### 5. **Scalability Considerations**
- Easy to add new features without restructuring
- Clear boundaries between different feature areas
- Shared code is easily identifiable and reusable
- Testing structure mirrors the component structure

## Components and Interfaces

### 1. Dashboard Overview Page

#### Layout Structure
```
Dashboard/
├── Header Section
│   ├── Welcome message with user info
│   ├── Quick stats cards (Total Invitations, Active, Guests, RSVPs)
│   └── Quick action buttons
├── Main Content
│   ├── Recent invitations grid
│   ├── Upcoming events timeline
│   └── Activity feed
└── Sidebar Navigation (consistent across all pages)
```

#### Key Components
```typescript
interface DashboardStats {
  totalInvitations: number;
  activeInvitations: number;
  totalGuests: number;
  confirmedRSVPs: number;
  pendingRSVPs: number;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType;
  href: string;
  color: string;
}
```

### 2. Create Invitation Wizard

#### Multi-Step Process
```
Create Invitation/
├── Step 1: Template Selection
│   ├── Template grid with previews
│   ├── Category filters
│   └── Search functionality
├── Step 2: Basic Information
│   ├── Couple names and details
│   ├── Event date and time
│   └── Venue information
├── Step 3: Customization
│   ├── Color scheme selector
│   ├── Font pairing options
│   └── Layout modifications
├── Step 4: Content & Details
│   ├── Event schedule
│   ├── Additional information
│   └── Contact details
└── Step 5: Review & Publish
    ├── Preview functionality
    ├── Final review
    └── Publication options
```

### 3. Invitation Management

#### Invitation List View
```typescript
interface InvitationListItem {
  id: string;
  title: string;
  coupleNames: string;
  eventDate: Date;
  status: 'draft' | 'active' | 'expired' | 'archived';
  guestCount: number;
  rsvpCount: number;
  viewCount: number;
  lastModified: Date;
  expiryDate?: Date;
  paymentStatus: 'pending' | 'paid' | 'expired';
}
```

#### Actions Available
- Edit invitation details
- Duplicate invitation
- Archive/Delete invitation
- View analytics
- Manage guests
- Send invitations

### 4. Guest Management System

#### Guest List Interface
```typescript
interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  category: string;
  rsvpStatus: 'pending' | 'confirmed' | 'declined' | 'maybe';
  rsvpDate?: Date;
  guestCount: number;
  dietaryRestrictions?: string;
  notes?: string;
  invitationSent: boolean;
  invitationSentDate?: Date;
}
```

#### Features
- Bulk import/export functionality
- Guest categorization and filtering
- RSVP tracking and management
- Communication history
- Guest preferences and notes

### 5. RSVP Management Dashboard

#### RSVP Analytics
```typescript
interface RSVPAnalytics {
  totalInvited: number;
  totalResponded: number;
  confirmedCount: number;
  declinedCount: number;
  maybeCount: number;
  responseRate: number;
  dailyResponses: Array<{
    date: Date;
    count: number;
  }>;
}
```

#### Visual Components
- Response rate charts
- Timeline of responses
- Guest category breakdown
- Dietary restrictions summary

### 6. Invitation Distribution System

#### Multi-Channel Sending
```typescript
interface SendingOptions {
  channels: Array<'whatsapp' | 'email' | 'sms'>;
  recipients: Array<Guest>;
  scheduleDate?: Date;
  personalMessage?: string;
  includeRSVPLink: boolean;
  trackDelivery: boolean;
}
```

#### Delivery Tracking
- Sent status tracking
- Delivery confirmations
- Read receipts (where available)
- Bounce/failure handling

### 7. Payment & Subscription Management

#### Payment Interface
```typescript
interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // in days
  features: string[];
  isPopular?: boolean;
}

interface UserSubscription {
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  autoRenew: boolean;
}
```

#### Payment Features
- Plan comparison table
- Secure payment processing
- Invoice generation
- Subscription management
- Payment history

### 8. Analytics & Statistics Dashboard

#### Analytics Data Structure
```typescript
interface InvitationAnalytics {
  invitationId: string;
  views: {
    total: number;
    unique: number;
    daily: Array<{ date: Date; count: number }>;
  };
  engagement: {
    averageTimeOnPage: number;
    bounceRate: number;
    mostViewedSections: string[];
  };
  rsvp: {
    responseRate: number;
    responseTime: number; // average days to respond
    categoryBreakdown: Record<string, number>;
  };
}
```

#### Visualization Components
- Interactive charts using Chart.js or similar
- Date range selectors
- Comparison tools
- Export functionality

### 9. User Profile Management

#### Profile Data Structure
```typescript
interface UserProfile {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: Date;
    loginHistory: Array<{
      date: Date;
      ip: string;
      device: string;
    }>;
  };
}
```

### 10. Application Settings

#### Settings Categories
- Account settings
- Notification preferences
- Privacy settings
- Data management
- Integration settings
- Appearance preferences

### 11. Help & Support System

#### Support Features
```typescript
interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  attachments?: File[];
  createdDate: Date;
  lastUpdated: Date;
}
```

#### Help Resources
- Searchable FAQ database
- Video tutorial library
- Step-by-step guides
- Live chat integration
- Support ticket system

## Data Models

### Core Data Relationships
```typescript
// User -> Invitations (1:many)
// Invitation -> Guests (1:many)
// Invitation -> Analytics (1:1)
// User -> Subscription (1:1)
// User -> SupportTickets (1:many)
```

### State Management
- Use React Context for global state
- Local state for component-specific data
- Persistent storage for user preferences
- Cache management for frequently accessed data

## Error Handling

### Page-Level Error Boundaries
Each page will be wrapped with appropriate error boundaries:
- FeatureErrorBoundary for individual page sections
- RouteErrorBoundary for entire page failures
- Graceful degradation for non-critical features

### Loading States
- Skeleton loaders for data-heavy pages
- Progressive loading for large datasets
- Optimistic updates for user actions

## Testing Strategy

### Component Testing
- Unit tests for all page components
- Integration tests for data flow
- Accessibility testing for all interfaces

### User Experience Testing
- Responsive design testing
- Performance testing for data-heavy pages
- User journey testing across all flows

## Performance Considerations

### Optimization Strategies
- Lazy loading for non-critical components
- Virtual scrolling for large lists
- Image optimization and lazy loading
- Efficient data fetching with caching
- Bundle splitting by page/feature

### Monitoring
- Performance metrics tracking
- User interaction analytics
- Error rate monitoring
- Page load time optimization

## Security Considerations

### Data Protection
- Input validation on all forms
- Secure file upload handling
- Data encryption for sensitive information
- GDPR compliance for user data

### Access Control
- Role-based access control
- Session management
- Audit logging for sensitive actions
- Rate limiting for API calls

## Mobile Responsiveness

### Responsive Design Patterns
- Mobile-first approach
- Touch-friendly interface elements
- Optimized navigation for small screens
- Progressive enhancement for desktop features

### Mobile-Specific Features
- Swipe gestures where appropriate
- Mobile-optimized forms
- Touch-friendly buttons and controls
- Optimized image sizes for mobile