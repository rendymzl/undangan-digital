import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockSupportTicket } from '@/tests/utils/test-utils';
import { SupportTicketPage } from '../SupportTicketPage';

// Mock the useSupport hook
vi.mock('../hooks/useSupport', () => ({
  useSupport: vi.fn(),
}));

const mockUseSupport = vi.mocked(await import('../hooks/useSupport')).useSupport;

describe('SupportTicketPage', () => {
  const mockCreateTicket = vi.fn();
  const mockUpdateTicket = vi.fn();
  const mockAddTicketMessage = vi.fn();
  const mockRefreshTickets = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSupport.mockReturnValue({
      tickets: [mockSupportTicket],
      isLoading: false,
      createTicket: mockCreateTicket,
      updateTicket: mockUpdateTicket,
      addTicketMessage: mockAddTicketMessage,
      refreshTickets: mockRefreshTickets,
    });
  });

  it('renders support ticket page correctly', async () => {
    render(<SupportTicketPage />);

    await waitFor(() => {
      expect(screen.getByText('Support Tickets')).toBeInTheDocument();
      expect(screen.getByText('Buat Tiket Baru')).toBeInTheDocument();
    });
  });

  it('displays ticket statistics', async () => {
    render(<SupportTicketPage />);

    await waitFor(() => {
      expect(screen.getByText('Total Tiket')).toBeInTheDocument();
      expect(screen.getByText('Terbuka')).toBeInTheDocument();
      expect(screen.getByText('Dalam Proses')).toBeInTheDocument();
      expect(screen.getByText('Selesai')).toBeInTheDocument();
    });
  });

  it('shows ticket list with correct information', async () => {
    render(<SupportTicketPage />);

    await waitFor(() => {
      expect(screen.getByText('#TKT-001 - Test ticket subject')).toBeInTheDocument();
      expect(screen.getByText('Test ticket description')).toBeInTheDocument();
      expect(screen.getByText('technical')).toBeInTheDocument();
      expect(screen.getByText('medium')).toBeInTheDocument();
      expect(screen.getByText('open')).toBeInTheDocument();
    });
  });

  it('opens create ticket modal when button is clicked', async () => {
    const user = userEvent.setup();
    render(<SupportTicketPage />);

    await user.click(screen.getByText('Buat Tiket Baru'));

    await waitFor(() => {
      expect(screen.getByText('Buat Tiket Support Baru')).toBeInTheDocument();
    });
  });

  it('filters tickets by search query', async () => {
    const user = userEvent.setup();
    render(<SupportTicketPage />);

    const searchInput = screen.getByPlaceholderText(/Cari tiket/);
    await user.type(searchInput, 'nonexistent');

    await waitFor(() => {
      expect(screen.queryByText('#TKT-001 - Test ticket subject')).not.toBeInTheDocument();
    });
  });

  it('filters tickets by status', async () => {
    const user = userEvent.setup();
    render(<SupportTicketPage />);

    const statusFilter = screen.getByDisplayValue('Semua Status');
    await user.selectOptions(statusFilter, 'resolved');

    await waitFor(() => {
      // Since our mock ticket is 'open', it should not be visible when filtering for 'resolved'
      expect(screen.queryByText('#TKT-001 - Test ticket subject')).not.toBeInTheDocument();
    });
  });

  it('opens ticket detail modal when ticket is clicked', async () => {
    const user = userEvent.setup();
    render(<SupportTicketPage />);

    await waitFor(() => {
      expect(screen.getByText('#TKT-001 - Test ticket subject')).toBeInTheDocument();
    });

    await user.click(screen.getByText('#TKT-001 - Test ticket subject'));

    await waitFor(() => {
      expect(screen.getByText('#TKT-001 - Test ticket subject')).toBeInTheDocument();
      expect(screen.getByText('Test ticket description')).toBeInTheDocument();
    });
  });

  it('shows loading state', async () => {
    mockUseSupport.mockReturnValue({
      tickets: [],
      isLoading: true,
      createTicket: mockCreateTicket,
      updateTicket: mockUpdateTicket,
      addTicketMessage: mockAddTicketMessage,
      refreshTickets: mockRefreshTickets,
    });

    render(<SupportTicketPage />);

    expect(screen.getByRole('generic')).toHaveClass('animate-spin');
  });

  it('shows empty state when no tickets exist', async () => {
    mockUseSupport.mockReturnValue({
      tickets: [],
      isLoading: false,
      createTicket: mockCreateTicket,
      updateTicket: mockUpdateTicket,
      addTicketMessage: mockAddTicketMessage,
      refreshTickets: mockRefreshTickets,
    });

    render(<SupportTicketPage />);

    await waitFor(() => {
      expect(screen.getByText('Belum ada tiket support')).toBeInTheDocument();
      expect(screen.getByText('Buat Tiket Pertama')).toBeInTheDocument();
    });
  });

  it('displays correct status colors and icons', async () => {
    render(<SupportTicketPage />);

    await waitFor(() => {
      const statusBadge = screen.getByText('open');
      expect(statusBadge).toHaveClass('text-blue-800');
    });
  });

  it('shows tab content correctly', async () => {
    const user = userEvent.setup();
    render(<SupportTicketPage />);

    // Test different tabs
    await user.click(screen.getByText('Terbuka'));
    await waitFor(() => {
      expect(screen.getByText('Tiket Terbuka')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Dalam Proses'));
    await waitFor(() => {
      expect(screen.getByText('Tiket Dalam Proses')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Selesai'));
    await waitFor(() => {
      expect(screen.getByText('Tiket Selesai')).toBeInTheDocument();
    });
  });

  it('handles ticket creation', async () => {
    const user = userEvent.setup();
    mockCreateTicket.mockResolvedValue(mockSupportTicket);

    render(<SupportTicketPage />);

    await user.click(screen.getByText('Buat Tiket Baru'));

    // Modal should open
    await waitFor(() => {
      expect(screen.getByText('Buat Tiket Support Baru')).toBeInTheDocument();
    });

    // Fill form and submit would be tested in CreateTicketModal.test.tsx
  });
});