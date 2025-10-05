import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data generators
export const mockUserProfile = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+62 812 3456 7890',
  avatar: '',
  bio: 'Test user bio',
  birthDate: '1990-05-15',
  gender: 'male' as const,
  address: 'Jl. Test No. 123',
  city: 'Jakarta',
  postalCode: '12345',
  country: 'Indonesia',
  language: 'id',
  timezone: 'Asia/Jakarta',
  theme: 'system' as const,
  notifications: {
    email: true,
    sms: true,
    push: true,
    marketing: false,
  },
  emailVerified: true,
  phoneVerified: false,
  twoFactorEnabled: false,
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-01-20T10:30:00Z',
  lastLoginAt: '2024-01-20T09:15:00Z',
};

export const mockSupportTicket = {
  id: 'TKT-001',
  subject: 'Test ticket subject',
  description: 'Test ticket description',
  category: 'technical' as const,
  priority: 'medium' as const,
  status: 'open' as const,
  messages: [
    {
      id: '1',
      sender: 'user' as const,
      message: 'Test message from user',
      timestamp: '2024-01-16T10:00:00Z',
    },
  ],
  createdAt: '2024-01-16T10:00:00Z',
  updatedAt: '2024-01-16T10:00:00Z',
};

export const mockFAQItem = {
  id: '1',
  question: 'How to create an invitation?',
  answer: 'To create an invitation, follow these steps...',
  category: 'getting-started' as const,
  tags: ['invitation', 'tutorial'],
  helpful: 10,
  notHelpful: 2,
  lastUpdated: '2024-01-15T10:00:00Z',
};

export const mockNotificationSettings = {
  emailAddress: 'john.doe@example.com',
  security: {
    newDeviceLogin: true,
    passwordChange: true,
    suspiciousActivity: true,
  },
  invitations: {
    newRSVP: true,
    invitationViewed: false,
    rsvpReminder: true,
    weeklyReport: true,
  },
  billing: {
    paymentSuccess: true,
    paymentFailed: true,
    subscriptionExpiring: true,
    newInvoice: true,
  },
  marketing: {
    newFeatures: false,
    tips: false,
    newsletter: false,
  },
  general: {
    quietMode: false,
    dailyDigest: false,
    instantNotifications: true,
  },
  timing: {
    startTime: '08:00',
    endTime: '22:00',
    timezone: 'Asia/Jakarta',
  },
  frequency: {
    maxPerDay: 10,
    minInterval: 15,
  },
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };