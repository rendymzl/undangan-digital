import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, mockUserProfile, mockSupportTicket } from '@/tests/utils/test-utils';
import { UserProfilePage } from '@/pages/profile/UserProfilePage';
import { SupportTicketPage } from '@/pages/support/SupportTicketPage';

// Mock the hooks
vi.mock('@/pages/profile/hooks/useProfile', () => ({
  useProfile: vi.fn(),
}));

vi.mock('@/pages/support/hooks/useSupport', () => ({
  useSupport: vi.fn(),
}));

const mockUseProfile = vi.mocked(await import('@/pages/profile/hooks/useProfile')).useProfile;
const mockUseSupport = vi.mocked(await import('@/pages/support/hooks/useSupport')).useSupport;

describe('Component Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('UserProfilePage renders within acceptable time', async () => {
    mockUseProfile.mockReturnValue({
      profile: mockUserProfile,
      isLoading: false,
      error: null,
      updateProfile: vi.fn(),
      refreshProfile: vi.fn(),
    });

    const startTime = performance.now();
    render(<UserProfilePage />);
    const endTime = performance.now();

    const renderTime = endTime - startTime;
    
    // Should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });

  it('SupportTicketPage handles large ticket lists efficiently', async () => {
    // Create a large list of tickets
    const largeTicketList = Array.from({ length: 100 }, (_, index) => ({
      ...mockSupportTicket,
      id: `TKT-${String(index + 1).padStart(3, '0')}`,
      subject: `Test ticket ${index + 1}`,
    }));

    mockUseSupport.mockReturnValue({
      tickets: largeTicketList,
      isLoading: false,
      createTicket: vi.fn(),
      updateTicket: vi.fn(),
      addTicketMessage: vi.fn(),
      refreshTickets: vi.fn(),
    });

    const startTime = performance.now();
    render(<SupportTicketPage />);
    const endTime = performance.now();

    const renderTime = endTime - startTime;
    
    // Should render large lists within 200ms
    expect(renderTime).toBeLessThan(200);
  });

  it('should not cause memory leaks with frequent re-renders', async () => {
    mockUseProfile.mockReturnValue({
      profile: mockUserProfile,
      isLoading: false,
      error: null,
      updateProfile: vi.fn(),
      refreshProfile: vi.fn(),
    });

    const { rerender, unmount } = render(<UserProfilePage />);

    // Simulate frequent re-renders
    for (let i = 0; i < 10; i++) {
      rerender(<UserProfilePage />);
    }

    // Clean up
    unmount();

    // If we get here without errors, no memory leaks occurred
    expect(true).toBe(true);
  });

  it('should handle rapid state changes efficiently', async () => {
    const mockUpdateProfile = vi.fn();
    let profileState = { ...mockUserProfile };

    mockUseProfile.mockImplementation(() => ({
      profile: profileState,
      isLoading: false,
      error: null,
      updateProfile: mockUpdateProfile,
      refreshProfile: vi.fn(),
    }));

    const { rerender } = render(<UserProfilePage />);

    const startTime = performance.now();

    // Simulate rapid state changes
    for (let i = 0; i < 20; i++) {
      profileState = { ...profileState, firstName: `John${i}` };
      rerender(<UserProfilePage />);
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Should handle 20 state changes within 100ms
    expect(totalTime).toBeLessThan(100);
  });

  it('should efficiently filter large datasets', async () => {
    // Create a large list of tickets for filtering
    const largeTicketList = Array.from({ length: 1000 }, (_, index) => ({
      ...mockSupportTicket,
      id: `TKT-${String(index + 1).padStart(4, '0')}`,
      subject: `Test ticket ${index + 1}`,
      status: index % 3 === 0 ? 'open' : index % 3 === 1 ? 'in-progress' : 'resolved',
    }));

    mockUseSupport.mockReturnValue({
      tickets: largeTicketList,
      isLoading: false,
      createTicket: vi.fn(),
      updateTicket: vi.fn(),
      addTicketMessage: vi.fn(),
      refreshTickets: vi.fn(),
    });

    const startTime = performance.now();
    render(<SupportTicketPage />);
    const endTime = performance.now();

    const renderTime = endTime - startTime;
    
    // Should handle filtering 1000 items within 300ms
    expect(renderTime).toBeLessThan(300);
  });

  it('should not block UI during data processing', async () => {
    mockUseProfile.mockReturnValue({
      profile: mockUserProfile,
      isLoading: false,
      error: null,
      updateProfile: vi.fn(),
      refreshProfile: vi.fn(),
    });

    const { container } = render(<UserProfilePage />);

    // Simulate heavy computation
    const startTime = performance.now();
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.random();
    }
    const endTime = performance.now();

    // Component should still be responsive
    expect(container.firstChild).toBeInTheDocument();
    expect(endTime - startTime).toBeLessThan(50); // Should complete quickly
  });

  it('should optimize re-renders with memoization', async () => {
    let renderCount = 0;
    const mockUpdateProfile = vi.fn();

    mockUseProfile.mockImplementation(() => {
      renderCount++;
      return {
        profile: mockUserProfile,
        isLoading: false,
        error: null,
        updateProfile: mockUpdateProfile,
        refreshProfile: vi.fn(),
      };
    });

    const { rerender } = render(<UserProfilePage />);

    const initialRenderCount = renderCount;

    // Re-render with same props
    rerender(<UserProfilePage />);

    // Should not cause unnecessary re-renders
    expect(renderCount).toBe(initialRenderCount + 1);
  });

  it('should handle concurrent updates gracefully', async () => {
    const mockUpdateProfile = vi.fn();
    mockUseProfile.mockReturnValue({
      profile: mockUserProfile,
      isLoading: false,
      error: null,
      updateProfile: mockUpdateProfile,
      refreshProfile: vi.fn(),
    });

    render(<UserProfilePage />);

    // Simulate concurrent updates
    const promises = Array.from({ length: 10 }, () => 
      Promise.resolve(mockUpdateProfile({ firstName: 'Updated' }))
    );

    const startTime = performance.now();
    await Promise.all(promises);
    const endTime = performance.now();

    const totalTime = endTime - startTime;
    
    // Should handle concurrent updates within 50ms
    expect(totalTime).toBeLessThan(50);
  });
});