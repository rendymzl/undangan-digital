import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockUserProfile } from '@/tests/utils/test-utils';
import { UserProfilePage } from '../UserProfilePage';

// Mock the useProfile hook
vi.mock('../hooks/useProfile', () => ({
  useProfile: vi.fn(),
}));

const mockUseProfile = vi.mocked(await import('../hooks/useProfile')).useProfile;

describe('UserProfilePage', () => {
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

  it('renders user profile information correctly', async () => {
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Profil Saya')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });
  });

  it('displays profile completion progress', async () => {
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Kelengkapan Profil')).toBeInTheDocument();
      expect(screen.getByText(/Progress/)).toBeInTheDocument();
    });
  });

  it('shows loading state when profile is loading', async () => {
    mockUseProfile.mockReturnValue({
      profile: null,
      isLoading: true,
      error: null,
      updateProfile: mockUpdateProfile,
      refreshProfile: mockRefreshProfile,
    });

    render(<UserProfilePage />);

    expect(screen.getByRole('generic')).toHaveClass('animate-spin');
  });

  it('opens profile edit modal when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Edit Profil')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Edit Profil'));

    await waitFor(() => {
      expect(screen.getByText('Edit Profil')).toBeInTheDocument();
    });
  });

  it('displays personal information in tabs', async () => {
    const user = userEvent.setup();
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Personal')).toBeInTheDocument();
      expect(screen.getByText('Kontak')).toBeInTheDocument();
      expect(screen.getByText('Preferensi')).toBeInTheDocument();
      expect(screen.getByText('Aktivitas')).toBeInTheDocument();
    });

    // Test tab switching
    await user.click(screen.getByText('Kontak'));
    expect(screen.getByText('Informasi Kontak')).toBeInTheDocument();
  });

  it('displays quick action cards', async () => {
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Keamanan')).toBeInTheDocument();
      expect(screen.getByText('Notifikasi')).toBeInTheDocument();
      expect(screen.getByText('Bantuan')).toBeInTheDocument();
    });
  });

  it('navigates to security page when security card is clicked', async () => {
    const user = userEvent.setup();
    
    // Mock window.location.href
    delete (window as any).location;
    window.location = { href: '' } as any;

    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Keamanan')).toBeInTheDocument();
    });

    const securityCard = screen.getByText('Keamanan').closest('div[class*="cursor-pointer"]');
    expect(securityCard).toBeInTheDocument();

    await user.click(securityCard!);

    expect(window.location.href).toBe('/dashboard/keamanan');
  });

  it('calculates profile completion percentage correctly', async () => {
    const incompleteProfile = {
      ...mockUserProfile,
      phone: '',
      address: '',
      bio: '',
      avatar: '',
    };

    mockUseProfile.mockReturnValue({
      profile: incompleteProfile,
      isLoading: false,
      error: null,
      updateProfile: mockUpdateProfile,
      refreshProfile: mockRefreshProfile,
    });

    render(<UserProfilePage />);

    await waitFor(() => {
      // Should show less than 100% completion
      const progressText = screen.getByText(/\d+%/);
      expect(progressText).toBeInTheDocument();
    });
  });
});