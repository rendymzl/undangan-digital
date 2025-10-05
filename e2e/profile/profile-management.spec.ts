import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Profile Management E2E', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('auth-token', 'mock-test-token');
      localStorage.setItem('user-id', 'test-user-123');
    });

    // Navigate to profile page
    await helpers.navigateTo('/profil');
    await helpers.waitForPageLoad();
  });

  test('should display user profile information', async ({ page }) => {
    // Check if profile page loads correctly
    await expect(page.getByText('Profil Saya')).toBeVisible();
    await expect(page.getByText('Kelengkapan Profil')).toBeVisible();
    
    // Check if user information is displayed
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('john.doe@example.com')).toBeVisible();
    
    // Check if progress bar is visible
    await expect(page.locator('[role="progressbar"]')).toBeVisible();
    
    // Check if tabs are present
    await expect(page.getByRole('tab', { name: 'Personal' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Kontak' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Preferensi' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Aktivitas' })).toBeVisible();
  });

  test('should navigate between profile tabs', async ({ page }) => {
    // Test tab navigation
    await page.getByRole('tab', { name: 'Kontak' }).click();
    await expect(page.getByText('Informasi Kontak')).toBeVisible();
    
    await page.getByRole('tab', { name: 'Preferensi' }).click();
    await expect(page.getByText('Bahasa Indonesia')).toBeVisible();
    
    await page.getByRole('tab', { name: 'Aktivitas' }).click();
    await expect(page.getByText('Aktivitas Terbaru')).toBeVisible();
    
    // Return to personal tab
    await page.getByRole('tab', { name: 'Personal' }).click();
    await expect(page.getByText('Informasi Personal')).toBeVisible();
  });

  test('should open and close profile edit modal', async ({ page }) => {
    // Click edit profile button
    await helpers.clickButton('Edit Profil');
    
    // Wait for modal to open
    await helpers.waitForModal('Edit Profil');
    await expect(page.getByText('Perbarui informasi profil Anda di bawah ini')).toBeVisible();
    
    // Check if form fields are populated
    await expect(page.getByDisplayValue('John')).toBeVisible();
    await expect(page.getByDisplayValue('Doe')).toBeVisible();
    await expect(page.getByDisplayValue('john.doe@example.com')).toBeVisible();
    
    // Close modal
    await helpers.closeModal();
    
    // Verify modal is closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should edit profile information successfully', async ({ page }) => {
    // Mock API response for profile update
    await helpers.mockApiResponse('/api/profile', {
      id: '1',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      bio: 'Updated bio from E2E test',
      updatedAt: new Date().toISOString()
    });

    // Open edit modal
    await helpers.clickButton('Edit Profil');
    await helpers.waitForModal('Edit Profil');
    
    // Edit profile information
    await helpers.fillFieldByLabel('Nama Depan', 'Jane');
    await helpers.fillFieldByLabel('Nama Belakang', 'Smith');
    await helpers.fillFieldByLabel('Bio', 'Updated bio from E2E test');
    
    // Submit form
    await helpers.clickButton('Simpan Perubahan');
    
    // Wait for success notification
    await helpers.waitForToast('Profil berhasil diperbarui');
    
    // Verify modal closes
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should validate required fields in edit form', async ({ page }) => {
    // Open edit modal
    await helpers.clickButton('Edit Profil');
    await helpers.waitForModal('Edit Profil');
    
    // Clear required fields
    await page.getByLabel('Nama Depan').fill('');
    await page.getByLabel('Nama Belakang').fill('');
    
    // Try to submit
    await helpers.clickButton('Simpan Perubahan');
    
    // Check for validation errors
    await expect(page.getByText('Nama depan wajib diisi')).toBeVisible();
    await expect(page.getByText('Nama belakang wajib diisi')).toBeVisible();
    
    // Modal should still be open
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    // Open edit modal
    await helpers.clickButton('Edit Profil');
    await helpers.waitForModal('Edit Profil');
    
    // Enter invalid email
    await helpers.fillFieldByLabel('Email', 'invalid-email');
    
    // Try to submit
    await helpers.clickButton('Simpan Perubahan');
    
    // Check for validation error
    await expect(page.getByText('Format email tidak valid')).toBeVisible();
    
    // Modal should still be open
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('should navigate to security settings', async ({ page }) => {
    // Click on security card
    await page.getByText('Keamanan').click();
    
    // Should navigate to security page
    await page.waitForURL('**/dashboard/keamanan');
    await expect(page.getByText('Keamanan & Privasi')).toBeVisible();
  });

  test('should navigate to notification settings', async ({ page }) => {
    // Click on notification card
    await page.getByText('Notifikasi').click();
    
    // Should navigate to notification page
    await page.waitForURL('**/dashboard/notifikasi');
    await expect(page.getByText('Notifikasi & Preferensi')).toBeVisible();
  });

  test('should navigate to help center', async ({ page }) => {
    // Click on help card
    await page.getByText('Bantuan').click();
    
    // Should navigate to help page
    await page.waitForURL('**/dashboard/bantuan');
    await expect(page.getByText('Pusat Bantuan')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Reload page
    await page.reload();
    await helpers.waitForPageLoad();
    
    // Check if mobile layout is applied
    await expect(page.getByText('Profil Saya')).toBeVisible();
    
    // Test mobile navigation
    await page.getByRole('tab', { name: 'Kontak' }).click();
    await expect(page.getByText('Informasi Kontak')).toBeVisible();
    
    // Test mobile modal
    await helpers.clickButton('Edit Profil');
    await helpers.waitForModal('Edit Profil');
    
    // Modal should be responsive
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Close modal
    await helpers.closeModal();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/api/profile', route => {
      route.abort('failed');
    });

    // Try to edit profile
    await helpers.clickButton('Edit Profil');
    await helpers.waitForModal('Edit Profil');
    
    await helpers.fillFieldByLabel('Nama Depan', 'Updated Name');
    await helpers.clickButton('Simpan Perubahan');
    
    // Should show error message
    await helpers.waitForToast('Gagal memperbarui profil');
    
    // Modal should still be open
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('should maintain accessibility standards', async ({ page }) => {
    // Check for proper heading structure
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Check for proper button roles
    await expect(page.getByRole('button', { name: 'Edit Profil' })).toBeVisible();
    
    // Check for proper tab navigation
    const tabs = page.getByRole('tablist');
    await expect(tabs).toBeVisible();
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Check for proper form labels in modal
    await helpers.clickButton('Edit Profil');
    await helpers.waitForModal('Edit Profil');
    
    await expect(page.getByLabel('Nama Depan')).toBeVisible();
    await expect(page.getByLabel('Nama Belakang')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    
    await helpers.closeModal();
  });
});