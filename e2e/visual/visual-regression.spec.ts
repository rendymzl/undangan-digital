import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Visual Regression Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('auth-token', 'mock-test-token');
      localStorage.setItem('user-id', 'test-user-123');
    });

    // Mock consistent data for visual tests
    await helpers.mockApiResponse('/api/profile', {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+62 812 3456 7890',
      avatar: '',
      bio: 'Test user bio for visual regression testing',
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-20T10:30:00Z'
    });

    await helpers.mockApiResponse('/api/support/faq', [
      {
        id: '1',
        question: 'How to create an invitation?',
        answer: 'To create an invitation, follow these steps...',
        category: 'getting-started',
        tags: ['invitation', 'tutorial']
      },
      {
        id: '2',
        question: 'How to manage guests?',
        answer: 'You can manage guests by...',
        category: 'guests',
        tags: ['guests', 'management']
      }
    ]);

    await helpers.mockApiResponse('/api/support/tickets', [
      {
        id: 'TKT-001',
        subject: 'Test ticket for visual regression',
        description: 'This is a test ticket description',
        status: 'open',
        category: 'technical',
        priority: 'medium',
        createdAt: '2024-01-16T10:00:00Z'
      }
    ]);
  });

  test.describe('Profile Pages Visual Tests', () => {
    test('should match profile page screenshot', async ({ page }) => {
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      
      // Wait for all content to load
      await page.waitForTimeout(1000);
      
      // Take screenshot
      await expect(page).toHaveScreenshot('profile-page.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match profile edit modal screenshot', async ({ page }) => {
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      
      // Open edit modal
      await helpers.clickButton('Edit Profil');
      await helpers.waitForModal('Edit Profil');
      
      // Wait for modal animation to complete
      await page.waitForTimeout(500);
      
      // Take screenshot of modal
      await expect(page.getByRole('dialog')).toHaveScreenshot('profile-edit-modal.png', {
        animations: 'disabled'
      });
    });

    test('should match profile tabs screenshots', async ({ page }) => {
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      
      // Personal tab (default)
      await expect(page.locator('[role="tabpanel"]')).toHaveScreenshot('profile-personal-tab.png', {
        animations: 'disabled'
      });
      
      // Contact tab
      await page.getByRole('tab', { name: 'Kontak' }).click();
      await page.waitForTimeout(300);
      await expect(page.locator('[role="tabpanel"]')).toHaveScreenshot('profile-contact-tab.png', {
        animations: 'disabled'
      });
      
      // Preferences tab
      await page.getByRole('tab', { name: 'Preferensi' }).click();
      await page.waitForTimeout(300);
      await expect(page.locator('[role="tabpanel"]')).toHaveScreenshot('profile-preferences-tab.png', {
        animations: 'disabled'
      });
    });
  });

  test.describe('Support System Visual Tests', () => {
    test('should match help center page screenshot', async ({ page }) => {
      await helpers.navigateTo('/bantuan');
      await helpers.waitForPageLoad();
      
      // Wait for all content to load
      await page.waitForTimeout(1000);
      
      // Take screenshot
      await expect(page).toHaveScreenshot('help-center-page.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match support tickets page screenshot', async ({ page }) => {
      await helpers.navigateTo('/support-tickets');
      await helpers.waitForPageLoad();
      
      // Wait for all content to load
      await page.waitForTimeout(1000);
      
      // Take screenshot
      await expect(page).toHaveScreenshot('support-tickets-page.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match create ticket modal screenshot', async ({ page }) => {
      await helpers.navigateTo('/support-tickets');
      await helpers.waitForPageLoad();
      
      // Open create ticket modal
      await helpers.clickButton('Buat Tiket Baru');
      await helpers.waitForModal('Buat Tiket Support Baru');
      
      // Wait for modal animation to complete
      await page.waitForTimeout(500);
      
      // Take screenshot of modal
      await expect(page.getByRole('dialog')).toHaveScreenshot('create-ticket-modal.png', {
        animations: 'disabled'
      });
    });

    test('should match FAQ expanded state screenshot', async ({ page }) => {
      await helpers.navigateTo('/bantuan');
      await helpers.waitForPageLoad();
      
      // Expand first FAQ item
      await page.getByText('How to create an invitation?').click();
      await page.waitForTimeout(300);
      
      // Take screenshot of expanded FAQ
      const faqSection = page.locator('[data-testid="faq-section"]').first();
      if (await faqSection.isVisible()) {
        await expect(faqSection).toHaveScreenshot('faq-expanded.png', {
          animations: 'disabled'
        });
      } else {
        // Fallback: screenshot the entire FAQ area
        await expect(page.locator('main')).toHaveScreenshot('faq-expanded-fallback.png', {
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('Responsive Visual Tests', () => {
    test('should match mobile profile page screenshot', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      await page.waitForTimeout(1000);
      
      // Take mobile screenshot
      await expect(page).toHaveScreenshot('profile-page-mobile.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match tablet profile page screenshot', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      await page.waitForTimeout(1000);
      
      // Take tablet screenshot
      await expect(page).toHaveScreenshot('profile-page-tablet.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match mobile help center screenshot', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await helpers.navigateTo('/bantuan');
      await helpers.waitForPageLoad();
      await page.waitForTimeout(1000);
      
      // Take mobile screenshot
      await expect(page).toHaveScreenshot('help-center-mobile.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match mobile modal screenshots', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      
      // Open edit modal
      await helpers.clickButton('Edit Profil');
      await helpers.waitForModal('Edit Profil');
      await page.waitForTimeout(500);
      
      // Take mobile modal screenshot
      await expect(page.getByRole('dialog')).toHaveScreenshot('profile-edit-modal-mobile.png', {
        animations: 'disabled'
      });
    });
  });

  test.describe('Theme and State Visual Tests', () => {
    test('should match loading states', async ({ page }) => {
      // Mock slow API response to capture loading state
      await page.route('**/api/profile', async route => {
        await page.waitForTimeout(2000);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
          })
        });
      });
      
      // Navigate and capture loading state
      const navigationPromise = helpers.navigateTo('/profil');
      
      // Wait a bit then take screenshot of loading state
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot('profile-loading-state.png', {
        animations: 'disabled'
      });
      
      // Wait for navigation to complete
      await navigationPromise;
    });

    test('should match error states', async ({ page }) => {
      // Mock API error
      await helpers.mockApiResponse('/api/profile', null, 500);
      
      await helpers.navigateTo('/profil');
      await page.waitForTimeout(1000);
      
      // Take screenshot of error state
      await expect(page).toHaveScreenshot('profile-error-state.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match empty states', async ({ page }) => {
      // Mock empty data
      await helpers.mockApiResponse('/api/support/tickets', []);
      await helpers.mockApiResponse('/api/support/faq', []);
      
      await helpers.navigateTo('/support-tickets');
      await helpers.waitForPageLoad();
      await page.waitForTimeout(1000);
      
      // Take screenshot of empty state
      await expect(page).toHaveScreenshot('support-tickets-empty-state.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });

  test.describe('Component Visual Tests', () => {
    test('should match form validation states', async ({ page }) => {
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      
      // Open edit modal
      await helpers.clickButton('Edit Profil');
      await helpers.waitForModal('Edit Profil');
      
      // Clear required fields to trigger validation
      await page.getByLabel('Nama Depan').fill('');
      await page.getByLabel('Email').fill('invalid-email');
      
      // Try to submit to trigger validation
      await helpers.clickButton('Simpan Perubahan');
      await page.waitForTimeout(300);
      
      // Take screenshot of validation errors
      await expect(page.getByRole('dialog')).toHaveScreenshot('form-validation-errors.png', {
        animations: 'disabled'
      });
    });

    test('should match button states', async ({ page }) => {
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      
      // Take screenshot of normal button state
      const editButton = page.getByRole('button', { name: 'Edit Profil' });
      await expect(editButton).toHaveScreenshot('button-normal-state.png');
      
      // Hover state
      await editButton.hover();
      await page.waitForTimeout(200);
      await expect(editButton).toHaveScreenshot('button-hover-state.png');
    });

    test('should match card components', async ({ page }) => {
      await helpers.navigateTo('/profil');
      await helpers.waitForPageLoad();
      
      // Take screenshot of profile completion card
      const completionCard = page.locator('text=Kelengkapan Profil').locator('..').locator('..');
      await expect(completionCard).toHaveScreenshot('profile-completion-card.png', {
        animations: 'disabled'
      });
      
      // Take screenshot of quick action cards
      const actionCards = page.locator('text=Keamanan').locator('..').locator('..');
      await expect(actionCards).toHaveScreenshot('quick-action-card.png', {
        animations: 'disabled'
      });
    });
  });
});