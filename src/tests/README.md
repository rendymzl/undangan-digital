# Testing Documentation

This document outlines the testing strategy and implementation for the Menantikan Dashboard application.

## Testing Strategy

### 1. Unit Tests
- **Location**: `src/pages/*/\__tests__/*.test.tsx`
- **Purpose**: Test individual components in isolation
- **Coverage**: All major components, hooks, and utilities
- **Tools**: Vitest, React Testing Library

### 2. Integration Tests
- **Location**: `src/tests/integration/*.test.tsx`
- **Purpose**: Test component interactions and user flows
- **Coverage**: Complete user journeys and feature workflows
- **Tools**: Vitest, React Testing Library, User Event

### 3. Accessibility Tests
- **Location**: `src/tests/accessibility/*.test.tsx`
- **Purpose**: Ensure WCAG 2.1 AA compliance
- **Coverage**: All user-facing components
- **Tools**: jest-axe, React Testing Library

### 4. Performance Tests
- **Location**: `src/tests/performance/*.test.tsx`
- **Purpose**: Verify component performance and memory usage
- **Coverage**: Data-heavy components and critical user paths
- **Tools**: Vitest, Performance API

## Test Structure

### Component Tests
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup mocks and initial state
  });

  it('renders correctly', () => {
    // Test basic rendering
  });

  it('handles user interactions', () => {
    // Test user events and state changes
  });

  it('handles error states', () => {
    // Test error handling and edge cases
  });
});
```

### Integration Tests
```typescript
describe('Feature Flow Integration', () => {
  it('completes full user journey', async () => {
    // Test complete user workflow
    // 1. Initial state
    // 2. User actions
    // 3. State changes
    // 4. Final verification
  });
});
```

## Running Tests

### All Tests
```bash
npm run test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Accessibility Tests Only
```bash
npm run test:accessibility
```

### Performance Tests Only
```bash
npm run test:performance
```

### Coverage Report
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```

### UI Mode
```bash
npm run test:ui
```

## Coverage Requirements

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Mock Strategy

### API Mocks
- All API calls are mocked using Vitest mocks
- Mock data is provided in `src/tests/utils/test-utils.tsx`
- Realistic data structures match production APIs

### Hook Mocks
- Custom hooks are mocked at the module level
- Mock implementations provide controllable return values
- State changes are simulated through mock functions

### External Dependencies
- Third-party libraries are mocked when necessary
- Browser APIs (clipboard, matchMedia) are mocked globally
- File operations and network requests are intercepted

## Test Utilities

### Custom Render
```typescript
import { render } from '@/tests/utils/test-utils';

// Provides React Router and Query Client context
const { getByText } = render(<Component />);
```

### Mock Data
```typescript
import { mockUserProfile, mockSupportTicket } from '@/tests/utils/test-utils';

// Use consistent mock data across tests
```

### Accessibility Testing
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

const results = await axe(container);
expect(results).toHaveNoViolations();
```

## Best Practices

### 1. Test Behavior, Not Implementation
- Focus on what the user sees and does
- Avoid testing internal component state
- Test the component's public interface

### 2. Use Realistic Data
- Mock data should match production data structures
- Include edge cases and error states
- Test with various data sizes and types

### 3. Test User Interactions
- Use `@testing-library/user-event` for realistic interactions
- Test keyboard navigation and accessibility
- Verify focus management and screen reader support

### 4. Async Testing
- Use `waitFor` for async operations
- Test loading states and error handling
- Verify cleanup and memory management

### 5. Error Boundaries
- Test error states and recovery
- Verify error messages are user-friendly
- Test fallback UI components

## Continuous Integration

Tests are run automatically on:
- Pull request creation
- Code push to main branch
- Scheduled nightly runs

### CI Configuration
- All test suites must pass
- Coverage thresholds must be met
- Accessibility violations block deployment
- Performance regressions are flagged

## Debugging Tests

### Common Issues
1. **Async operations**: Use `waitFor` and proper async/await
2. **Mock timing**: Ensure mocks are set up before component render
3. **Cleanup**: Use `beforeEach` and `afterEach` for test isolation
4. **DOM queries**: Use semantic queries (getByRole, getByLabelText)

### Debug Tools
- `screen.debug()` - Print current DOM state
- `--ui` flag - Visual test runner interface
- `--reporter=verbose` - Detailed test output
- Browser DevTools - Debug in browser environment

## Future Enhancements

### Planned Additions
1. **Visual Regression Tests** - Screenshot comparison testing
2. **E2E Tests** - Full browser automation with Playwright
3. **Load Testing** - Performance testing under load
4. **Cross-browser Testing** - Automated browser compatibility
5. **Mobile Testing** - Touch and responsive behavior testing

### Test Data Management
1. **Test Database** - Isolated test data environment
2. **Fixture Management** - Reusable test data sets
3. **Data Factories** - Dynamic test data generation
4. **Snapshot Testing** - Component output verification