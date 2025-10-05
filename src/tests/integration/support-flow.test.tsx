import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockSupportTicket, mockFAQItem } from '@/tests/utils/test-utils';
import { HelpCenterPage } from '@/pages/support/HelpCenterPage';
import { SupportTicketPage } from '@/pages/support/SupportTicketPage';

// Mock the hooks
vi.mock('@/pages/support/hooks/useHelp', () => ({
  useHelp: vi.fn(),
}));

vi.mock('@/pages/support/hooks/useSupport', () => ({
  useSupport: vi.fn(),
}));

const mockUseHelp = vi.mocked(await import('@/pages/support/hooks/useHelp')).useHelp;
const mockUseSupport = vi.mocked(await import('@/pages/support/hooks/useSupport')).useSupport;

describe('Support Flow Integration', () => {
  const mockSearchFAQ = vi.fn();
  const mockTrackArticleView = vi.fn();
  const mockCreateTicket = vi.fn();
  const mockUpdateTicket = vi.fn();
  const mockAddTicketMessage = vi.fn();
  const mockRefreshTickets = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseHelp.mockReturnValue({
      faqItems: [mockFAQItem],
      tutorials: [],
      guides: [],
      popularArticles: [],
      isLoading: false,
      searchFAQ: mockSearchFAQ,
      trackArticleView: mockTrackArticleView,
    });

    mockUseSupport.mockReturnValue({
      tickets: [mockSupportTicket],
      isLoading: false,
      createTicket: mockCreateTicket,
      updateTicket: mockUpdateTicket,
      addTicketMessage: mockAddTicketMessage,
      refreshTickets: mockRefreshTickets,
    });
  });

  it('completes help center search flow', async () => {
    const user = userEvent.setup();
    mockSearchFAQ.mockResolvedValue([mockFAQItem]);

    render(<HelpCenterPage />);

    // 1. Verify help center loads
    await waitFor(() => {
      expect(screen.getByText('Pusat Bantuan')).toBeInTheDocument();
    });

    // 2. Perform search
    const searchInput = screen.getByPlaceholderText(/Cari bantuan/);
    await user.type(searchInput, 'invitation');

    // 3. Verify search is triggered
    await waitFor(() => {
      expect(mockSearchFAQ).toHaveBeenCalledWith('invitation');
    });

    // 4. Use quick search
    await user.click(screen.getByText('Cara Membuat Undangan'));
    expect(mockSearchFAQ).toHaveBeenCalledWith('cara membuat undangan');
  });

  it('completes FAQ interaction flow', async () => {
    const user = userEvent.setup();
    render(<HelpCenterPage />);

    // 1. Verify FAQ is displayed
    await waitFor(() => {
      expect(screen.getByText('How to create an invitation?')).toBeInTheDocument();
    });

    // 2. Expand FAQ
    await user.click(screen.getByText('How to create an invitation?'));

    await waitFor(() => {
      expect(screen.getByText('To create an invitation, follow these steps...')).toBeInTheDocument();
    });

    // 3. Provide feedback
    await user.click(screen.getByText('👍 Ya'));
    // Feedback handling would be implemented in the component
  });

  it('navigates from help center to ticket creation', async () => {
    const user = userEvent.setup();
    
    // Mock window.location.href
    delete (window as any).location;
    window.location = { href: '' } as any;

    render(<HelpCenterPage />);

    // 1. Find and click ticket creation option
    await waitFor(() => {
      expect(screen.getByText('Kirim Tiket')).toBeInTheDocument();
    });

    const ticketCard = screen.getByText('Buat Tiket').closest('div[class*="cursor-pointer"]');
    await user.click(ticketCard!);

    // 2. Verify navigation
    expect(window.location.href).toBe('/dashboard/support-tickets');
  });

  it('completes ticket creation flow', async () => {
    const user = userEvent.setup();
    mockCreateTicket.mockResolvedValue(mockSupportTicket);

    render(<SupportTicketPage />);

    // 1. Verify ticket page loads
    await waitFor(() => {
      expect(screen.getByText('Support Tickets')).toBeInTheDocument();
    });

    // 2. Open create ticket modal
    await user.click(screen.getByText('Buat Tiket Baru'));

    await waitFor(() => {
      expect(screen.getByText('Buat Tiket Support Baru')).toBeInTheDocument();
    });

    // 3. Fill ticket form
    const subjectInput = screen.getByPlaceholderText('Ringkasan singkat masalah Anda');
    await user.type(subjectInput, 'Test ticket subject');

    const descriptionInput = screen.getByPlaceholderText(/Jelaskan masalah Anda dengan detail/);
    await user.type(descriptionInput, 'This is a detailed description of the issue');

    // 4. Select category
    await user.click(screen.getByText('Pilih kategori'));
    await user.click(screen.getByText('Masalah Teknis'));

    // 5. Submit ticket
    await user.click(screen.getByText('Buat Tiket'));

    // 6. Verify ticket creation
    await waitFor(() => {
      expect(mockCreateTicket).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Test ticket subject',
          description: 'This is a detailed description of the issue',
          category: 'technical',
        })
      );
    });
  });

  it('completes ticket interaction flow', async () => {
    const user = userEvent.setup();
    render(<SupportTicketPage />);

    // 1. Verify ticket is displayed
    await waitFor(() => {
      expect(screen.getByText('#TKT-001 - Test ticket subject')).toBeInTheDocument();
    });

    // 2. Click on ticket to open detail
    await user.click(screen.getByText('#TKT-001 - Test ticket subject'));

    await waitFor(() => {
      expect(screen.getByText('Test ticket description')).toBeInTheDocument();
    });

    // 3. Add message (would be in the detail modal)
    // This would be tested more thoroughly in the TicketDetailModal tests
  });

  it('handles ticket filtering and search', async () => {
    const user = userEvent.setup();
    render(<SupportTicketPage />);

    // 1. Verify initial state
    await waitFor(() => {
      expect(screen.getByText('#TKT-001 - Test ticket subject')).toBeInTheDocument();
    });

    // 2. Filter by status
    const statusFilter = screen.getByDisplayValue('Semua Status');
    await user.selectOptions(statusFilter, 'resolved');

    await waitFor(() => {
      // Ticket should be hidden as it's 'open', not 'resolved'
      expect(screen.queryByText('#TKT-001 - Test ticket subject')).not.toBeInTheDocument();
    });

    // 3. Reset filter
    await user.selectOptions(statusFilter, 'all');

    await waitFor(() => {
      expect(screen.getByText('#TKT-001 - Test ticket subject')).toBeInTheDocument();
    });

    // 4. Search tickets
    const searchInput = screen.getByPlaceholderText(/Cari tiket/);
    await user.type(searchInput, 'nonexistent');

    await waitFor(() => {
      expect(screen.queryByText('#TKT-001 - Test ticket subject')).not.toBeInTheDocument();
    });
  });

  it('handles error states in support flow', async () => {
    const user = userEvent.setup();
    mockCreateTicket.mockRejectedValue(new Error('Network error'));

    render(<SupportTicketPage />);

    // 1. Open create ticket modal
    await user.click(screen.getByText('Buat Tiket Baru'));

    // 2. Fill and submit form
    const subjectInput = screen.getByPlaceholderText('Ringkasan singkat masalah Anda');
    await user.type(subjectInput, 'Test subject');

    const descriptionInput = screen.getByPlaceholderText(/Jelaskan masalah Anda dengan detail/);
    await user.type(descriptionInput, 'Test description');

    await user.click(screen.getByText('Pilih kategori'));
    await user.click(screen.getByText('Masalah Teknis'));

    await user.click(screen.getByText('Buat Tiket'));

    // 3. Verify error handling
    await waitFor(() => {
      expect(mockCreateTicket).toHaveBeenCalled();
    });

    // Modal should still be open after error
    expect(screen.getByText('Buat Tiket Support Baru')).toBeInTheDocument();
  });
});