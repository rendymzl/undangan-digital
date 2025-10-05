import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Support System E2E', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('auth-token', 'mock-test-token');
      localStorage.setItem('user-id', 'test-user-123');
    });
  });

  test.describe('Help Center', () => {
    test.beforeEach(async ({ page }) => {
      await helpers.navigateTo('/bantuan');
      await helpers.waitForPageLoad();
    });

    test('should display help center with search functionality', async ({ page }) => {
      // Check if help center loads correctly
      await expect(page.getByText('Pusat Bantuan')).toBeVisible();
      await expect(page.getByPlaceholder(/Cari bantuan/)).toBeVisible();
      
      // Check if tabs are present
      await expect(page.getByRole('tab', { name: 'FAQ' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Tutorial' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Panduan' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Populer' })).toBeVisible();
    });

    test('should search FAQ items', async ({ page }) => {
      // Mock FAQ search response
      await helpers.mockApiResponse('/api/support/faq/search*', [
        {
          id: '1',
          question: 'How to create an invitation?',
          answer: 'To create an invitation, follow these steps...',
          category: 'getting-started',
          tags: ['invitation', 'tutorial']
        }
      ]);

      // Perform search
      const searchInput = page.getByPlaceholder(/Cari bantuan/);
      await searchInput.fill('invitation');
      
      // Wait for search results
      await helpers.waitForNetworkIdle();
      
      // Check if FAQ item is displayed
      await expect(page.getByText('How to create an invitation?')).toBeVisible();
    });

    test('should expand and collapse FAQ items', async ({ page }) => {
      // Mock FAQ data
      await helpers.mockApiResponse('/api/support/faq', [
        {
          id: '1',
          question: 'How to create an invitation?',
          answer: 'To create an invitation, follow these steps...',
          category: 'getting-started',
          tags: ['invitation', 'tutorial']
        }
      ]);

      await page.reload();
      await helpers.waitForPageLoad();

      // Click on FAQ item to expand
      await page.getByText('How to create an invitation?').click();
      
      // Check if answer is visible
      await expect(page.getByText('To create an invitation, follow these steps...')).toBeVisible();
      
      // Check if feedback buttons are visible
      await expect(page.getByText('👍 Ya')).toBeVisible();
      await expect(page.getByText('👎 Tidak')).toBeVisible();
    });

    test('should navigate between help center tabs', async ({ page }) => {
      // Test Tutorial tab
      await page.getByRole('tab', { name: 'Tutorial' }).click();
      await expect(page.getByText('Tutorial Video')).toBeVisible();
      
      // Test Panduan tab
      await page.getByRole('tab', { name: 'Panduan' }).click();
      await expect(page.getByText('Panduan Langkah demi Langkah')).toBeVisible();
      
      // Test Populer tab
      await page.getByRole('tab', { name: 'Populer' }).click();
      await expect(page.getByText('Artikel Populer')).toBeVisible();
      
      // Return to FAQ tab
      await page.getByRole('tab', { name: 'FAQ' }).click();
      await expect(page.getByText('Frequently Asked Questions')).toBeVisible();
    });

    test('should navigate to support tickets from help center', async ({ page }) => {
      // Click on create ticket option
      await page.getByText('Buat Tiket').click();
      
      // Should navigate to support tickets page
      await page.waitForURL('**/dashboard/support-tickets');
      await expect(page.getByText('Support Tickets')).toBeVisible();
    });

    test('should use quick search buttons', async ({ page }) => {
      // Mock search response
      await helpers.mockApiResponse('/api/support/faq/search*', []);

      // Click quick search button
      await page.getByText('Cara Membuat Undangan').click();
      
      // Search input should be filled
      const searchInput = page.getByPlaceholder(/Cari bantuan/);
      await expect(searchInput).toHaveValue('cara membuat undangan');
    });
  });

  test.describe('Support Tickets', () => {
    test.beforeEach(async ({ page }) => {
      await helpers.navigateTo('/support-tickets');
      await helpers.waitForPageLoad();
    });

    test('should display support tickets dashboard', async ({ page }) => {
      // Check if tickets page loads correctly
      await expect(page.getByText('Support Tickets')).toBeVisible();
      await expect(page.getByText('Buat Tiket Baru')).toBeVisible();
      
      // Check if statistics cards are present
      await expect(page.getByText('Total Tiket')).toBeVisible();
      await expect(page.getByText('Terbuka')).toBeVisible();
      await expect(page.getByText('Dalam Proses')).toBeVisible();
      await expect(page.getByText('Selesai')).toBeVisible();
    });

    test('should create a new support ticket', async ({ page }) => {
      // Mock ticket creation response
      await helpers.mockApiResponse('/api/support/tickets', {
        id: 'TKT-001',
        subject: 'E2E Test Ticket',
        description: 'This is a test ticket created by E2E test',
        category: 'technical',
        priority: 'medium',
        status: 'open',
        createdAt: new Date().toISOString()
      });

      // Click create ticket button
      await helpers.clickButton('Buat Tiket Baru');
      
      // Wait for modal to open
      await helpers.waitForModal('Buat Tiket Support Baru');
      
      // Fill ticket form
      await helpers.fillFieldByLabel('Subjek', 'E2E Test Ticket');
      await helpers.fillFieldByLabel('Deskripsi Detail', 'This is a test ticket created by E2E test. It includes detailed information about the issue.');
      
      // Select category
      await page.getByText('Pilih kategori').click();
      await page.getByText('Masalah Teknis').click();
      
      // Select priority
      await page.locator('select').last().selectOption('high');
      
      // Submit ticket
      await helpers.clickButton('Buat Tiket');
      
      // Wait for success notification
      await helpers.waitForToast('Tiket berhasil dibuat');
      
      // Modal should close
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('should validate ticket creation form', async ({ page }) => {
      // Open create ticket modal
      await helpers.clickButton('Buat Tiket Baru');
      await helpers.waitForModal('Buat Tiket Support Baru');
      
      // Try to submit empty form
      await helpers.clickButton('Buat Tiket');
      
      // Check for validation errors
      await expect(page.getByText('Subjek wajib diisi')).toBeVisible();
      await expect(page.getByText('Deskripsi wajib diisi')).toBeVisible();
      await expect(page.getByText('Kategori wajib dipilih')).toBeVisible();
      
      // Modal should still be open
      await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('should filter tickets by status', async ({ page }) => {
      // Mock tickets data
      await helpers.mockApiResponse('/api/support/tickets', [
        {
          id: 'TKT-001',
          subject: 'Open Ticket',
          status: 'open',
          category: 'technical',
          priority: 'medium'
        },
        {
          id: 'TKT-002',
          subject: 'Resolved Ticket',
          status: 'resolved',
          category: 'billing',
          priority: 'low'
        }
      ]);

      await page.reload();
      await helpers.waitForPageLoad();

      // Initially both tickets should be visible
      await expect(page.getByText('Open Ticket')).toBeVisible();
      await expect(page.getByText('Resolved Ticket')).toBeVisible();
      
      // Filter by open status
      await page.getByDisplayValue('Semua Status').selectOption('open');
      
      // Only open ticket should be visible
      await expect(page.getByText('Open Ticket')).toBeVisible();
      await expect(page.getByText('Resolved Ticket')).not.toBeVisible();
    });

    test('should search tickets', async ({ page }) => {
      // Mock tickets data
      await helpers.mockApiResponse('/api/support/tickets', [
        {
          id: 'TKT-001',
          subject: 'Login Issue',
          description: 'Cannot login to account',
          status: 'open'
        },
        {
          id: 'TKT-002',
          subject: 'Payment Problem',
          description: 'Payment not processed',
          status: 'open'
        }
      ]);

      await page.reload();
      await helpers.waitForPageLoad();

      // Search for specific ticket
      const searchInput = page.getByPlaceholder(/Cari tiket/);
      await searchInput.fill('login');
      
      // Only matching ticket should be visible
      await expect(page.getByText('Login Issue')).toBeVisible();
      await expect(page.getByText('Payment Problem')).not.toBeVisible();
    });

    test('should open ticket detail modal', async ({ page }) => {
      // Mock tickets data
      await helpers.mockApiResponse('/api/support/tickets', [
        {
          id: 'TKT-001',
          subject: 'Test Ticket',
          description: 'Test ticket description',
          status: 'open',
          category: 'technical',
          priority: 'medium',
          messages: [
            {
              id: '1',
              sender: 'user',
              message: 'Initial ticket message',
              timestamp: new Date().toISOString()
            }
          ],
          createdAt: new Date().toISOString()
        }
      ]);

      await page.reload();
      await helpers.waitForPageLoad();

      // Click on ticket to open detail
      await page.getByText('#TKT-001 - Test Ticket').click();
      
      // Wait for detail modal to open
      await helpers.waitForModal();
      
      // Check if ticket details are displayed
      await expect(page.getByText('Test ticket description')).toBeVisible();
      await expect(page.getByText('Initial ticket message')).toBeVisible();
    });

    test('should handle file upload in ticket creation', async ({ page }) => {
      // Create a test file
      const testFile = 'test-attachment.txt';
      
      // Open create ticket modal
      await helpers.clickButton('Buat Tiket Baru');
      await helpers.waitForModal('Buat Tiket Support Baru');
      
      // Fill required fields
      await helpers.fillFieldByLabel('Subjek', 'Ticket with attachment');
      await helpers.fillFieldByLabel('Deskripsi Detail', 'This ticket includes a file attachment.');
      
      // Select category
      await page.getByText('Pilih kategori').click();
      await page.getByText('Masalah Teknis').click();
      
      // Upload file (mock file input)
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles({
        name: testFile,
        mimeType: 'text/plain',
        buffer: Buffer.from('Test file content')
      });
      
      // Check if file is displayed
      await expect(page.getByText(testFile)).toBeVisible();
      
      // Close modal without submitting
      await helpers.closeModal();
    });

    test('should be responsive on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Reload page
      await page.reload();
      await helpers.waitForPageLoad();
      
      // Check if mobile layout is applied
      await expect(page.getByText('Support Tickets')).toBeVisible();
      
      // Test mobile modal
      await helpers.clickButton('Buat Tiket Baru');
      await helpers.waitForModal('Buat Tiket Support Baru');
      
      // Modal should be responsive
      await expect(page.getByRole('dialog')).toBeVisible();
      
      // Close modal
      await helpers.closeModal();
    });
  });

  test.describe('Cross-feature Integration', () => {
    test('should navigate from help center to ticket creation', async ({ page }) => {
      // Start at help center
      await helpers.navigateTo('/bantuan');
      await helpers.waitForPageLoad();
      
      // Click on create ticket option
      await page.getByText('Buat Tiket').click();
      
      // Should navigate to support tickets
      await page.waitForURL('**/dashboard/support-tickets');
      await expect(page.getByText('Support Tickets')).toBeVisible();
      
      // Should be able to create ticket
      await helpers.clickButton('Buat Tiket Baru');
      await helpers.waitForModal('Buat Tiket Support Baru');
      
      // Close modal
      await helpers.closeModal();
    });

    test('should maintain state across navigation', async ({ page }) => {
      // Start at help center and perform search
      await helpers.navigateTo('/bantuan');
      await helpers.waitForPageLoad();
      
      const searchInput = page.getByPlaceholder(/Cari bantuan/);
      await searchInput.fill('test search');
      
      // Navigate to tickets
      await helpers.navigateTo('/support-tickets');
      await helpers.waitForPageLoad();
      
      // Navigate back to help center
      await helpers.navigateTo('/bantuan');
      await helpers.waitForPageLoad();
      
      // Search should be cleared (fresh page load)
      await expect(searchInput).toHaveValue('');
    });
  });
});