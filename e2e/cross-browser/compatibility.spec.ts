import { test, expect, devices } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Cross-Browser Compatibility', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('auth-token', 'mock-test-token');
      localStorage.setItem('user-id', 'test-user-123');
    });
  });

  // Test core functionality across different browsers
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test.describe(`${browserName} Browser Tests`, () => {
      test(`should load dashboard correctly in ${browserName}`, async ({ page }) => {
        await helpers.navigateTo('');
        await helpers.waitForPageLoad();
        
        // Check if main dashboard elements are present
        await expect(page.getByText('Dashboard')).toBeVisible();
        await expect(page.locator('nav')).toBeVisible();
        await expect(page.locator('main')).toBeVisible();
      });

      test(`should handle form interactions in ${browserName}`, async ({ page }) => {
        await helpers.navigateTo('/profil');
        await helpers.waitForPageLoad();
        
        // Open profile edit modal
        await helpers.clickButton('Edit Profil');
        await helpers.waitForModal('Edit Profil');
        
        // Test form interactions
        await helpers.fillFieldByLabel('Nama Depan', 'Test Name');
        await expect(page.getByDisplayValue('Test Name')).toBeVisible();
        
        // Close modal
        await helpers.closeModal();
      });

      test(`should handle navigation in ${browserName}`, async ({ page }) => {
        await helpers.navigateTo('/profil');
        await helpers.waitForPageLoad();
        
        // Navigate to security page
        await page.getByText('Keamanan').click();
        await page.waitForURL('**/dashboard/keamanan');
        
        // Navigate to help center
        await helpers.navigateTo('/bantuan');
        await expect(page.getByText('Pusat Bantuan')).toBeVisible();
      });

      test(`should handle responsive design in ${browserName}`, async ({ page }) => {
        // Test desktop view
        await page.setViewportSize({ width: 1200, height: 800 });
        await helpers.navigateTo('/profil');
        await helpers.waitForPageLoad();
        
        await expect(page.getByText('Profil Saya')).toBeVisible();
        
        // Test tablet view
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.reload();
        await helpers.waitForPageLoad();
        
        await expect(page.getByText('Profil Saya')).toBeVisible();
        
        // Test mobile view
        await page.setViewportSize({ width: 375, height: 667 });
        await page.reload();
        await helpers.waitForPageLoad();
        
        await expect(page.getByText('Profil Saya')).toBeVisible();
      });
    });
  });

  // Test specific browser features
  test.describe('Browser-Specific Features', () => {
    test('should handle clipboard operations', async ({ page, browserName }) => {
      // Skip for webkit as it has different clipboard behavior
      test.skip(browserName === 'webkit', 'Webkit has different clipboard API behavior');
      
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      
      // Grant clipboard permissions
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
      
      // Test clipboard functionality (if implemented in components)
      // This would test copy-to-clipboard features in the app
    });

    test('should handle file uploads', async ({ page }) => {
      await helpers.navigateTo('/support-tickets');
      await helpers.waitForPageLoad();
      
      // Open create ticket modal
      await helpers.clickButton('Buat Tiket Baru');
      await helpers.waitForModal('Buat Tiket Support Baru');
      
      // Test file upload
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles({
        name: 'test-file.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('Test file content')
      });
      
      // Verify file is selected
      await expect(page.getByText('test-file.txt')).toBeVisible();
      
      await helpers.closeModal();
    });

    test('should handle keyboard navigation', async ({ page }) => {
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      // Should open edit modal
      await helpers.waitForModal('Edit Profil');
      
      // Test escape key
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('should handle focus management', async ({ page }) => {
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      
      // Open modal
      await helpers.clickButton('Edit Profil');
      await helpers.waitForModal('Edit Profil');
      
      // Focus should be trapped in modal
      const firstInput = page.getByLabel('Nama Depan');
      await expect(firstInput).toBeFocused();
      
      await helpers.closeModal();
    });
  });

  // Test mobile-specific functionality
  test.describe('Mobile Device Tests', () => {
    test('should work on iPhone', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone 12'],
      });
      const page = await context.newPage();
      helpers = new TestHelpers(page);
      
      await page.addInitScript(() => {
        localStorage.setItem('auth-token', 'mock-test-token');
      });
      
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      
      // Test mobile interactions
      await expect(page.getByText('Profil Saya')).toBeVisible();
      
      // Test touch interactions
      await page.getByText('Kontak').tap();
      await expect(page.getByText('Informasi Kontak')).toBeVisible();
      
      await context.close();
    });

    test('should work on Android', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['Pixel 5'],
      });
      const page = await context.newPage();
      helpers = new TestHelpers(page);
      
      await page.addInitScript(() => {
        localStorage.setItem('auth-token', 'mock-test-token');
      });
      
      await helpers.navigateTo('/bantuan');
      await helpers.waitForPageLoad();
      
      // Test mobile search
      const searchInput = page.getByPlaceholder(/Cari bantuan/);
      await searchInput.tap();
      await searchInput.fill('test search');
      
      await expect(searchInput).toHaveValue('test search');
      
      await context.close();
    });

    test('should handle orientation changes', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone 12'],
      });
      const page = await context.newPage();
      helpers = new TestHelpers(page);
      
      await page.addInitScript(() => {
        localStorage.setItem('auth-token', 'mock-test-token');
      });
      
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      
      // Portrait mode
      await expect(page.getByText('Profil Saya')).toBeVisible();
      
      // Landscape mode
      await page.setViewportSize({ width: 812, height: 375 });
      await expect(page.getByText('Profil Saya')).toBeVisible();
      
      await context.close();
    });
  });

  // Test performance across browsers
  test.describe('Performance Tests', () => {
    test('should load pages within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle large datasets efficiently', async ({ page }) => {
      // Mock large dataset
      const largeTicketList = Array.from({ length: 100 }, (_, i) => ({
        id: `TKT-${String(i + 1).padStart(3, '0')}`,
        subject: `Test ticket ${i + 1}`,
        status: 'open',
        category: 'technical',
        priority: 'medium'
      }));
      
      await helpers.mockApiResponse('/api/support/tickets', largeTicketList);
      
      const startTime = Date.now();
      
      await helpers.navigateTo('/support-tickets');
      await helpers.waitForPageLoad();
      
      const loadTime = Date.now() - startTime;
      
      // Should handle large datasets within 5 seconds
      expect(loadTime).toBeLessThan(5000);
      
      // Should display all tickets
      await expect(page.getByText('TKT-001')).toBeVisible();
      await expect(page.getByText('TKT-100')).toBeVisible();
    });
  });

  // Test accessibility across browsers
  test.describe('Accessibility Tests', () => {
    test('should maintain accessibility standards', async ({ page }) => {
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      
      // Check for proper heading structure
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThan(0);
      
      // Check for proper button roles
      const buttons = page.getByRole('button');
      const buttonCount = await buttons.count();
      expect(buttonCount).toBeGreaterThan(0);
      
      // Check for proper form labels
      await helpers.clickButton('Edit Profil');
      await helpers.waitForModal('Edit Profil');
      
      await expect(page.getByLabel('Nama Depan')).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      
      await helpers.closeModal();
    });

    test('should support keyboard navigation', async ({ page }) => {
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      
      // Should focus on first interactive element
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });
});