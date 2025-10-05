# 🧪 Panduan Lengkap Testing - Menantikan Dashboard

## 📋 Daftar Isi
1. [Setup Testing](#setup-testing)
2. [Jenis-jenis Test](#jenis-jenis-test)
3. [Cara Menjalankan Tests](#cara-menjalankan-tests)
4. [Menulis Tests](#menulis-tests)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

## 🚀 Setup Testing

### Prerequisites
Pastikan dependencies testing sudah terinstall:
```bash
npm install
```

### Struktur Testing
```
src/
├── tests/                          # Global test utilities
│   ├── accessibility/              # Accessibility tests
│   ├── integration/                # Integration tests
│   ├── performance/                # Performance tests
│   ├── utils/                      # Test utilities
│   ├── setup.ts                    # Test setup
│   └── README.md                   # Testing docs
├── pages/                          
│   └── */
│       └── __tests__/              # Unit tests per page
├── components/
│   └── */
│       └── __tests__/              # Unit tests per component
└── e2e/                            # End-to-end tests
```

## 🎯 Jenis-jenis Test

### 1. Unit Tests
**Tujuan**: Test komponen individual secara terisolasi
**Lokasi**: `src/pages/*/\__tests__/*.test.tsx`

```typescript
// Contoh: src/components/shared/Charts/__tests__/PieChart.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PieChart from '../PieChart';

describe('PieChart', () => {
  const mockData = {
    labels: ['A', 'B', 'C'],
    datasets: [{ data: [30, 40, 30] }]
  };

  it('renders chart with title', () => {
    render(<PieChart data={mockData} title="Test Chart" />);
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('displays legend when enabled', () => {
    render(<PieChart data={mockData} showLegend={true} />);
    expect(screen.getByText('A: 30 (30.0%)')).toBeInTheDocument();
  });
});
```

### 2. Integration Tests
**Tujuan**: Test interaksi antar komponen dan user flows
**Lokasi**: `src/tests/integration/*.test.tsx`

```typescript
// Contoh: src/tests/integration/profile-flow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import ProfileFlow from '@/pages/profile/UserProfilePage';

describe('Profile Management Flow', () => {
  it('allows user to edit and save profile', async () => {
    const user = userEvent.setup();
    render(<ProfileFlow />);

    // Click edit button
    await user.click(screen.getByText('Edit Profile'));
    
    // Fill form
    await user.type(screen.getByLabelText('First Name'), 'John');
    await user.type(screen.getByLabelText('Last Name'), 'Doe');
    
    // Save changes
    await user.click(screen.getByText('Save Changes'));
    
    // Verify success
    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
    });
  });
});
```

### 3. Accessibility Tests
**Tujuan**: Memastikan komponen accessible (WCAG 2.1 AA)
**Lokasi**: `src/tests/accessibility/*.test.tsx`

```typescript
// Contoh: src/tests/accessibility/profile-accessibility.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import UserProfilePage from '@/pages/profile/UserProfilePage';

expect.extend(toHaveNoViolations);

describe('Profile Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<UserProfilePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', async () => {
    render(<UserProfilePage />);
    // Test keyboard navigation
    // Tab through interactive elements
    // Verify focus management
  });
});
```

### 4. Performance Tests
**Tujuan**: Test performa komponen dan memory usage
**Lokasi**: `src/tests/performance/*.test.tsx`

```typescript
// Contoh: src/tests/performance/component-performance.test.tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PieChart } from '@/components/shared/Charts';

describe('Component Performance', () => {
  it('renders large dataset efficiently', () => {
    const largeData = {
      labels: Array.from({ length: 1000 }, (_, i) => \`Item \${i}\`),
      datasets: [{ data: Array.from({ length: 1000 }, () => Math.random() * 100) }]
    };

    const startTime = performance.now();
    render(<PieChart data={largeData} />);
    const endTime = performance.now();

    // Should render within 100ms
    expect(endTime - startTime).toBeLessThan(100);
  });
});
```

### 5. End-to-End Tests
**Tujuan**: Test aplikasi secara keseluruhan di browser
**Lokasi**: `e2e/*.spec.ts`

```typescript
// Contoh: e2e/profile/profile-management.spec.ts
import { test, expect } from '@playwright/test';

test('profile management workflow', async ({ page }) => {
  await page.goto('/profile');
  
  // Click edit profile
  await page.click('text=Edit Profile');
  
  // Fill form
  await page.fill('[data-testid="firstName"]', 'John');
  await page.fill('[data-testid="lastName"]', 'Doe');
  
  // Save
  await page.click('text=Save Changes');
  
  // Verify success message
  await expect(page.locator('text=Profile updated successfully')).toBeVisible();
});
```

## ⚡ Cara Menjalankan Tests

### Basic Commands

```bash
# Menjalankan semua tests
npm run test

# Menjalankan tests dalam watch mode (otomatis re-run saat file berubah)
npm run test:watch

# Menjalankan tests dengan UI interface
npm run test:ui

# Menjalankan tests sekali saja (untuk CI/CD)
npm run test:run
```

### Specific Test Types

```bash
# Unit tests saja
npm run test:unit

# Integration tests saja
npm run test:integration

# Accessibility tests saja
npm run test:accessibility

# Performance tests saja
npm run test:performance

# End-to-end tests
npm run test:e2e

# E2E dengan UI interface
npm run test:e2e:ui

# E2E dengan browser visible
npm run test:e2e:headed
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Coverage akan tersimpan di coverage/ folder
# Buka coverage/index.html di browser untuk melihat report
```

### Advanced Commands

```bash
# Run specific test file
npm run test -- PieChart.test.tsx

# Run tests matching pattern
npm run test -- --grep "profile"

# Run tests in specific directory
npm run test src/components/shared/Charts

# Run with verbose output
npm run test -- --reporter=verbose

# Run with specific timeout
npm run test -- --testTimeout=10000
```

## ✍️ Menulis Tests

### 1. Test Structure Template

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestWrapper } from '@/tests/utils/test-utils';
import ComponentToTest from '../ComponentToTest';

describe('ComponentToTest', () => {
  // Setup before each test
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
  });

  // Basic rendering test
  it('renders correctly', () => {
    render(
      <TestWrapper>
        <ComponentToTest />
      </TestWrapper>
    );
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  // User interaction test
  it('handles user interactions', async () => {
    const user = userEvent.setup();
    const mockCallback = vi.fn();
    
    render(
      <TestWrapper>
        <ComponentToTest onAction={mockCallback} />
      </TestWrapper>
    );
    
    await user.click(screen.getByRole('button', { name: 'Action Button' }));
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  // Async operation test
  it('handles async operations', async () => {
    render(
      <TestWrapper>
        <ComponentToTest />
      </TestWrapper>
    );
    
    // Wait for async operation
    await waitFor(() => {
      expect(screen.getByText('Loaded Data')).toBeInTheDocument();
    });
  });

  // Error state test
  it('handles error states', () => {
    render(
      <TestWrapper>
        <ComponentToTest hasError={true} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
```

### 2. Mock Strategies

#### API Mocks
```typescript
import { vi } from 'vitest';

// Mock API service
vi.mock('@/services/api/profileApi', () => ({
  getUserProfile: vi.fn().mockResolvedValue({
    id: '1',
    firstName: 'John',
    lastName: 'Doe'
  }),
  updateProfile: vi.fn().mockResolvedValue({ success: true })
}));
```

#### Hook Mocks
```typescript
import { vi } from 'vitest';

// Mock custom hook
vi.mock('@/hooks/useProfile', () => ({
  useProfile: vi.fn().mockReturnValue({
    profile: { firstName: 'John', lastName: 'Doe' },
    loading: false,
    error: null,
    updateProfile: vi.fn()
  })
}));
```

#### Component Mocks
```typescript
import { vi } from 'vitest';

// Mock heavy component
vi.mock('@/components/shared/Charts/PieChart', () => ({
  default: vi.fn(({ title }) => <div data-testid="pie-chart">{title}</div>)
}));
```

### 3. Test Utilities

```typescript
// src/tests/utils/test-utils.tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create test wrapper with providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </BrowserRouter>
  );
};

// Custom render function
const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: TestWrapper, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## 🎯 Best Practices

### 1. Test Behavior, Not Implementation
```typescript
// ❌ Bad - testing implementation details
expect(component.state.isLoading).toBe(true);

// ✅ Good - testing user-visible behavior
expect(screen.getByText('Loading...')).toBeInTheDocument();
```

### 2. Use Semantic Queries
```typescript
// ❌ Bad - fragile selectors
screen.getByTestId('submit-btn');

// ✅ Good - semantic queries
screen.getByRole('button', { name: 'Submit' });
screen.getByLabelText('Email Address');
```

### 3. Test User Interactions Realistically
```typescript
// ❌ Bad - direct event firing
fireEvent.click(button);

// ✅ Good - realistic user interaction
const user = userEvent.setup();
await user.click(button);
```

### 4. Handle Async Operations Properly
```typescript
// ❌ Bad - not waiting for async operations
render(<AsyncComponent />);
expect(screen.getByText('Data')).toBeInTheDocument();

// ✅ Good - waiting for async operations
render(<AsyncComponent />);
await waitFor(() => {
  expect(screen.getByText('Data')).toBeInTheDocument();
});
```

### 5. Test Error States
```typescript
it('displays error message when API fails', async () => {
  // Mock API failure
  vi.mocked(apiCall).mockRejectedValue(new Error('API Error'));
  
  render(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. "Cannot find module" errors
```bash
# Install missing dependencies
npm install --save-dev @testing-library/jest-dom
npm install --save-dev jsdom
```

#### 2. Async test timeouts
```typescript
// Increase timeout for slow operations
it('handles slow operation', async () => {
  // ... test code
}, 10000); // 10 second timeout
```

#### 3. Mock not working
```typescript
// Ensure mock is set up before import
vi.mock('@/services/api', () => ({
  apiCall: vi.fn()
}));

// Import after mock
import { apiCall } from '@/services/api';
```

#### 4. DOM cleanup issues
```typescript
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Ensure cleanup after each test
afterEach(() => {
  cleanup();
});
```

#### 5. Environment variables in tests
```typescript
// Set up test environment variables
import { vi } from 'vitest';

vi.stubEnv('VITE_API_URL', 'http://localhost:3000');
```

### Debug Tools

```typescript
// Debug current DOM state
import { screen } from '@testing-library/react';
screen.debug(); // Prints current DOM

// Debug specific element
screen.debug(screen.getByRole('button'));

// Use browser DevTools (with --ui flag)
npm run test:ui
```

## 📊 Coverage Requirements

### Target Coverage
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Check Coverage
```bash
npm run test:coverage

# View detailed report
open coverage/index.html
```

### Coverage Configuration
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    }
  }
});
```

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
      - run: npm run test:e2e
```

## 📚 Resources

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Jest-axe for Accessibility](https://github.com/nickcolley/jest-axe)

### Examples
- Unit Tests: `src/components/shared/Charts/__tests__/`
- Integration Tests: `src/tests/integration/`
- E2E Tests: `e2e/`

**Happy Testing! 🧪✨**