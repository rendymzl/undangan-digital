import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockUserProfile } from '@/tests/utils/test-utils';
import { UserProfilePage } from '@/pages/profile/UserProfilePage';

// Mock all the hooks
vi.mock('@/pages/profile/hooks/useProfile', () => ({
  useProfile: vi.fn(),
}));

const mockUseProfile = vi.mocked(await import('@/pages/profile/hooks/useProfile')).useProfile;

describe('Profile Flow Integration', () => {
  const mockUpdateProfile = vi.fn();
  const mockRefreshProfile = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseProfile.mockReturnValue({
      profile: mockUserProfile,
      isLoading: false,
      error: null,
      updateProfile: mockUpdateProfile,
      refreshProfile: mockRefreshProfile,
    });
  });

  it('completes full profile edit flow', async () => {
    const user = userEvent.setup();
    mockUpdateProfile.mockResolvedValue(mockUserProfile);

    render(<UserProfilePage />);

    // 1. Verify profile page loads
    await waitFor(() => {
      expect(screen.getByText('Profil Saya')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // 2. Open edit modal
    await user.click(screen.getByText('Edit Profil'));

    await waitFor(() => {
      expect(screen.getByText('Edit Profil')).toBeInTheDocument();
    });

    // 3. Modify profile data
    const bioInput = screen.getByPlaceholderText('Ceritakan sedikit tentang diri Anda...');
    await user.clear(bioInput);
    await user.type(bioInput, 'Updated bio from integration test');

    // 4. Submit changes
    await user.click(screen.getByText('Simpan Perubahan'));

    // 5. Verify API call
    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          bio: 'Updated bio from integration test',
        })
      );
    });
  });

  it('handles profile navigation flow', async () => {
    const user = userEvent.setup();
    
    // Mock window.location.href
    delete (window as any).location;
    window.location = { href: '' } as any;

    render(<UserProfilePage />);

    // 1. Verify profile page loads
    await waitFor(() => {
      expect(screen.getByText('Profil Saya')).toBeInTheDocument();
    });

    // 2. Navigate to security settings
    const securityCard = screen.getByText('Keamanan').closest('div[class*="cursor-pointer"]');
    await user.click(securityCard!);

    expect(window.location.href).toBe('/dashboard/keamanan');

    // Reset for next navigation
    window.location.href = '';

    // 3. Navigate to notifications
    const notificationCard = screen.getByText('Notifikasi').closest('div[class*="cursor-pointer"]');
    await user.click(notificationCard!);

    expect(window.location.href).toBe('/dashboard/notifikasi');
  });

  it('handles tab switching and data display', async () => {
    const user = userEvent.setup();
    render(<UserProfilePage />);

    // 1. Verify default tab content
    await waitFor(() => {
      expect(screen.getByText('Informasi Personal')).toBeInTheDocument();
    });

    // 2. Switch to contact tab
    await user.click(screen.getByText('Kontak'));
    
    await waitFor(() => {
      expect(screen.getByText('Informasi Kontak')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });

    // 3. Switch to preferences tab
    await user.click(screen.getByText('Preferensi'));
    
    await waitFor(() => {
      expect(screen.getByText('Bahasa Indonesia')).toBeInTheDocument();
      expect(screen.getByText('Asia/Jakarta')).toBeInTheDocument();
    });

    // 4. Switch to activity tab
    await user.click(screen.getByText('Aktivitas'));
    
    await waitFor(() => {
      expect(screen.getByText('Aktivitas Terbaru')).toBeInTheDocument();
    });
  });

  it('handles error states gracefully', async () => {
    const user = userEvent.setup();
    mockUpdateProfile.mockRejectedValue(new Error('Network error'));

    render(<UserProfilePage />);

    // 1. Open edit modal
    await user.click(screen.getByText('Edit Profil'));

    // 2. Try to submit with error
    await user.click(screen.getByText('Simpan Perubahan'));

    // 3. Verify error handling
    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
    });

    // Modal should still be open after error
    expect(screen.getByText('Edit Profil')).toBeInTheDocument();
  });

  it('validates form data across multiple fields', async () => {
    const user = userEvent.setup();
    render(<UserProfilePage />);

    // 1. Open edit modal
    await user.click(screen.getByText('Edit Profil'));

    // 2. Clear multiple required fields
    const firstNameInput = screen.getByDisplayValue('John');
    await user.clear(firstNameInput);

    const emailInput = screen.getByDisplayValue('john.doe@example.com');
    await user.clear(emailInput);
    await user.type(emailInput, 'invalid-email');

    const phoneInput = screen.getByDisplayValue('+62 812 3456 7890');
    await user.clear(phoneInput);
    await user.type(phoneInput, 'invalid-phone');

    // 3. Try to submit
    await user.click(screen.getByText('Simpan Perubahan'));

    // 4. Verify multiple validation errors
    await waitFor(() => {
      expect(screen.getByText('Nama depan wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Format email tidak valid')).toBeInTheDocument();
      expect(screen.getByText('Format nomor telepon tidak valid')).toBeInTheDocument();
    });

    expect(mockUpdateProfile).not.toHaveBeenCalled();
  });
});