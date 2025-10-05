# End-to-End Testing Documentation

This document outlines the end-to-end testing strategy and implementation for the Menantikan Dashboard application using Playwright.

## Overview

End-to-end tests verify that the complete application works correctly from the user's perspective, testing real user workflows across different browsers and devices.

## Test Structure

### 📁 Test Organization
```
e2e/
├── global-setup.ts              # Global test setup
├── global-teardown.ts           # Global test cleanup
├── utils/
│   └── test-helpers.ts          # E2E test utilities
├── profile/
│   └── profile-management.spec.ts # Profile feature tests
├── support/
│   └── support-system.spec.ts   # Support system tests
├── cross-browser/
│   └── compatibility.spec.ts    # Cross-browser tests
├── visual/
│   └── visual-regression.spec.ts # Visual regression tests
└── README.md                    # This documentation
```

## Test Categories

### 1. Feature Tests
- **Profile Management**: User profile CRUD operations
- **Support System**: Help center and ticket management
- **Navigation**: Route transitions and deep linking
- **Form Workflows**: Multi-step processes and validation

### 2. Cross-Browser Tests
- **Browser Compatibility**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: Mobile Chrome, Mobile Safari
- **Feature Parity**: Consistent behavior across browsers
- **Performance**: Load times and responsiveness

### 3. Visual Regression Tests
- **Component Screenshots**: Visual consistency verification
- **Responsive Design**: Layout across different screen sizes
- **State Screenshots**: Loading, error, and empty states
- **Theme Variations**: Light/dark mode consistency

### 4. Accessibility Tests
- **Keyboard Navigation**: Tab order and focus management
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Color Contrast**: Visual accessibility requirements
- **Focus Management**: Modal and form focus trapping

## Running E2E Tests

### Prerequisites
```bash
# Install Playwright browsers
npm run test:e2e:install
```

### Test Commands
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (visible browser)
npm run test:e2e:headed

# Debug mode (step through tests)
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

### Specific Test Suites
```bash
# Profile tests only
npx playwright test e2e/profile

# Support tests only
npx playwright test e2e/support

# Cross-browser tests only
npx playwright test e2e/cross-browser

# Visual regression tests only
npx playwright test e2e/visual
```

## Browser Configuration

### Supported Browsers
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: Mobile Chrome (Pixel 5), Mobile Safari (iPhone 12)
- **Tablet**: iPad, Android tablets

### Test Execution
- **Parallel Execution**: Tests run in parallel for speed
- **Retry Logic**: Failed tests retry 2x on CI
- **Screenshots**: Captured on failure for debugging
- **Videos**: Recorded on failure for analysis

## Test Helpers

### TestHelpers Class
```typescript
const helpers = new TestHelpers(page);

// Navigation
await helpers.navigateTo('/profil');
await helpers.waitForPageLoad();

// Form interactions
await helpers.fillFieldByLabel('Nama Depan', 'John');
await helpers.clickButton('Simpan');

// Modal handling
await helpers.waitForModal('Edit Profil');
await helpers.closeModal();

// Notifications
await helpers.waitForToast('Berhasil disimpan');

// Screenshots
await helpers.takeScreenshot('profile-page');
```

### Common Patterns
```typescript
// Wait for API responses
await helpers.waitForNetworkIdle();

// Mock API responses
await helpers.mockApiResponse('/api/profile', mockData);

// File uploads
await helpers.uploadFile('input[type="file"]', 'test-file.txt');

// Table interactions
const tableData = await helpers.getTableData('table');

// Accessibility checks
await helpers.checkAccessibility();
```

## Visual Regression Testing

### Screenshot Strategy
- **Full Page**: Complete page screenshots for layout verification
- **Component Level**: Individual component screenshots
- **State Variations**: Different states (loading, error, empty)
- **Responsive**: Multiple viewport sizes

### Screenshot Management
- **Baseline Images**: Stored in `e2e/visual/screenshots/`
- **Comparison**: Automatic diff generation on changes
- **Approval**: Manual review and approval process
- **CI Integration**: Automated visual regression detection

### Update Screenshots
```bash
# Update all screenshots
npx playwright test --update-snapshots

# Update specific test screenshots
npx playwright test e2e/visual --update-snapshots
```

## Performance Testing

### Metrics Tracked
- **Page Load Time**: Time to interactive
- **Network Requests**: API response times
- **Rendering Performance**: Component render times
- **Memory Usage**: Memory leak detection

### Performance Thresholds
- **Page Load**: < 3 seconds
- **API Responses**: < 1 second
- **Form Interactions**: < 500ms
- **Navigation**: < 1 second

## Accessibility Testing

### Automated Checks
- **axe-playwright**: Automated accessibility scanning
- **Keyboard Navigation**: Tab order and focus management
- **Screen Reader**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG 2.1 AA compliance

### Manual Verification
- **Focus Indicators**: Visible focus states
- **Error Messages**: Clear and descriptive
- **Form Labels**: Proper label associations
- **Heading Structure**: Logical heading hierarchy

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run E2E Tests
  run: |
    npm run test:e2e:install
    npm run test:e2e
```

### Test Reports
- **HTML Report**: Interactive test results
- **JSON Report**: Machine-readable results
- **JUnit Report**: CI integration format
- **Screenshots**: Failure evidence
- **Videos**: Test execution recordings

## Debugging E2E Tests

### Common Issues
1. **Timing Issues**: Use proper waits instead of fixed timeouts
2. **Element Selection**: Use semantic selectors (role, label)
3. **Network Mocking**: Ensure consistent mock data
4. **State Management**: Reset state between tests

### Debug Tools
```bash
# Run single test in debug mode
npx playwright test profile-management.spec.ts --debug

# Run with browser visible
npx playwright test --headed

# Generate trace files
npx playwright test --trace on
```

### Trace Viewer
```bash
# View trace for failed test
npx playwright show-trace trace.zip
```

## Best Practices

### 1. Test User Journeys
- Focus on complete user workflows
- Test happy paths and error scenarios
- Verify business logic end-to-end

### 2. Stable Selectors
- Use semantic selectors (role, label, text)
- Avoid CSS selectors that may change
- Add data-testid for complex components

### 3. Test Data Management
- Use consistent mock data
- Reset state between tests
- Isolate test environments

### 4. Performance Considerations
- Run tests in parallel when possible
- Use efficient waiting strategies
- Minimize test execution time

### 5. Maintenance
- Keep tests simple and focused
- Update tests when features change
- Regular test review and cleanup

## Monitoring and Reporting

### Test Metrics
- **Pass Rate**: Percentage of passing tests
- **Execution Time**: Total test suite duration
- **Flaky Tests**: Tests with inconsistent results
- **Coverage**: Feature coverage by E2E tests

### Alerts and Notifications
- **Failed Tests**: Immediate notification on failures
- **Performance Regression**: Alerts for slow tests
- **Visual Changes**: Notifications for screenshot diffs
- **Browser Issues**: Browser-specific failure alerts

## Future Enhancements

### Planned Features
1. **API Testing**: Direct API endpoint testing
2. **Database Testing**: Data persistence verification
3. **Security Testing**: Authentication and authorization
4. **Load Testing**: Performance under concurrent users
5. **Mobile App Testing**: Native mobile app E2E tests

### Tool Integrations
1. **Lighthouse**: Performance and accessibility audits
2. **Percy**: Advanced visual testing platform
3. **BrowserStack**: Extended browser coverage
4. **Datadog**: Performance monitoring integration