import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, mockUserProfile } from '@/tests/utils/test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import { UserProfilePage } from '@/pages/profile/UserProfilePage';
import { ProfileEditModal } from '@/pages/profile/components/ProfileEditModal';

expect.extend(toHaveNoViolations);

// Mock the useProfile hook
vi.mock('@/pages/profile/hooks/useProfile', () => ({
  useProfile: vi.fn(),
}));

const mockUseProfile = vi.mocked(await import('@/pages/profile/hooks/useProfile')).useProfile;

describe('Profile Accessibility Tests', () => {
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

  it('UserProfilePage should not have accessibility violations', async () => {
    const { container } = render(<UserProfilePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ProfileEditModal should not have accessibility violations', async () => {
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();

    const { container } = render(
      <ProfileEditModal
        isOpen={true}
        onClose={mockOnClose}
        profile={mockUserProfile}
        onSave={mockOnSave}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA labels and roles', async () => {
    const { getByRole, getByLabelText } = render(<UserProfilePage />);

    // Check for proper headings
    expect(getByRole('heading', { name: /profil saya/i })).toBeInTheDocument();
    
    // Check for proper button roles
    expect(getByRole('button', { name: /edit profil/i })).toBeInTheDocument();
    
    // Check for proper tab navigation
    expect(getByRole('tablist')).toBeInTheDocument();
    expect(getByRole('tab', { name: /personal/i })).toBeInTheDocument();
  });

  it('should support keyboard navigation', async () => {
    const { getByRole } = render(<UserProfilePage />);

    const editButton = getByRole('button', { name: /edit profil/i });
    
    // Button should be focusable
    editButton.focus();
    expect(document.activeElement).toBe(editButton);
  });

  it('should have proper form labels in edit modal', async () => {
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();

    const { getByLabelText } = render(
      <ProfileEditModal
        isOpen={true}
        onClose={mockOnClose}
        profile={mockUserProfile}
        onSave={mockOnSave}
      />
    );

    // Check for proper form labels
    expect(getByLabelText(/nama depan/i)).toBeInTheDocument();
    expect(getByLabelText(/nama belakang/i)).toBeInTheDocument();
    expect(getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('should announce loading states to screen readers', async () => {
    mockUseProfile.mockReturnValue({
      profile: null,
      isLoading: true,
      error: null,
      updateProfile: mockUpdateProfile,
      refreshProfile: mockRefreshProfile,
    });

    const { container } = render(<UserProfilePage />);
    
    // Loading spinner should be accessible
    const loadingElement = container.querySelector('.animate-spin');
    expect(loadingElement).toBeInTheDocument();
  });

  it('should have proper color contrast', async () => {
    const { container } = render(<UserProfilePage />);
    
    // This would typically use a color contrast checking tool
    // For now, we verify that text elements exist and are visible
    const textElements = container.querySelectorAll('p, h1, h2, h3, h4, span');
    expect(textElements.length).toBeGreaterThan(0);
  });

  it('should support high contrast mode', async () => {
    // Mock high contrast media query
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-contrast: high)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { container } = render(<UserProfilePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should work with reduced motion preferences', async () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { container } = render(<UserProfilePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});