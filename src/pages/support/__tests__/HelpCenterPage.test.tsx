import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockFAQItem } from '@/tests/utils/test-utils';
import { HelpCenterPage } from '../HelpCenterPage';

// Mock useHelp hook
vi.mock('../hooks/useHelp', () => ({
  useHelp: vi.fn(),
}));

import { useHelp } from '../hooks/useHelp';
const mockUseHelp = vi.mocked(useHelp);

describe('HelpCenterPage', () => {
  const mockSearchFAQ = vi.fn();
  const mockTrackArticleView = vi.fn();
  const mockSubmitFeedback = vi.fn();
  const mockRefreshHelpData = vi.fn();
  const mockError = null;
  const mockSearchResults: any[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseHelp.mockReturnValue({
      faqItems: [mockFAQItem],
      tutorials: [
        {
          id: '1',
          title: 'How to create invitation',
          description: 'Step by step tutorial',
          videoUrl: '/video.mp4',
          thumbnailUrl: '/thumb.jpg',
          duration: '5:30',
          category: 'getting-started',
          difficulty: 'beginner',
          views: 100,
          rating: 4.5,
          tags: ['tutorial'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ],
      guides: [
        {
          id: '1',
          title: 'Complete guide',
          description: 'Detailed guide',
          category: 'getting-started',
          difficulty: 'easy',
          estimatedTime: '10 minutes',
          steps: [
            { title: 'Step 1', content: 'First step' },
            { title: 'Step 2', content: 'Second step' },
          ],
          tags: ['guide'],
          views: 50,
          helpful: 10,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ],
      popularArticles: [
        {
          id: '1',
          title: 'Popular article',
          summary: 'Article summary',
          category: 'general',
          views: 200,
          rating: 4.8,
          url: '/article/1',
          lastViewed: '2024-01-01T00:00:00Z',
        },
      ],
      searchResults: mockSearchResults,
      isLoading: false,
      error: mockError,
      searchFAQ: mockSearchFAQ,
      trackArticleView: mockTrackArticleView,
      submitFeedback: mockSubmitFeedback,
      refreshHelpData: mockRefreshHelpData,
    });
  });

  it('renders help center page correctly', async () => {
    render(<HelpCenterPage />);

    await waitFor(() => {
      expect(screen.getByText('Pusat Bantuan')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Cari bantuan/)).toBeInTheDocument();
    });
  });

  it('menampilkan fungsi pencarian', async () => {
    const user = userEvent.setup();
    render(<HelpCenterPage />);

    const searchInput = screen.getByPlaceholderText(/Cari bantuan/);
    await user.type(searchInput, 'test query');

    expect(searchInput).toHaveValue('test query');
  });

  it('menampilkan tombol pencarian cepat', async () => {
    const user = userEvent.setup();
    render(<HelpCenterPage />);

    await waitFor(() => {
      expect(screen.getByText('Cara Membuat Undangan')).toBeInTheDocument();
      expect(screen.getByText('Menambah Tamu')).toBeInTheDocument();
      expect(screen.getByText('Pembayaran')).toBeInTheDocument();
      expect(screen.getByText('RSVP')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Cara Membuat Undangan'));
    expect(mockSearchFAQ).toHaveBeenCalledWith('cara membuat undangan');
  });

  it('menampilkan item FAQ dengan benar', async () => {
    render(<HelpCenterPage />);

    await waitFor(() => {
      expect(screen.getByText('How to create an invitation?')).toBeInTheDocument();
      expect(screen.getByText('getting-started')).toBeInTheDocument();
    });
  });

  it('memperluas item FAQ saat diklik', async () => {
    const user = userEvent.setup();
    render(<HelpCenterPage />);

    await waitFor(() => {
      expect(screen.getByText('How to create an invitation?')).toBeInTheDocument();
    });

    await user.click(screen.getByText('How to create an invitation?'));

    await waitFor(() => {
      expect(screen.getByText('To create an invitation, follow these steps...')).toBeInTheDocument();
    });
  });

  it('memfilter FAQ berdasarkan kategori', async () => {
    const user = userEvent.setup();
    render(<HelpCenterPage />);

    await waitFor(() => {
      expect(screen.getByText('Memulai')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Memulai'));

    // FAQ harus tetap terlihat karena sesuai kategori
    expect(screen.getByText('How to create an invitation?')).toBeInTheDocument();
  });

  it('menampilkan konten tab tutorial', async () => {
    const user = userEvent.setup();
    render(<HelpCenterPage />);

    await user.click(screen.getByText('Tutorial'));

    await waitFor(() => {
      expect(screen.getByText('Tutorial Video')).toBeInTheDocument();
      expect(screen.getByText('How to create invitation')).toBeInTheDocument();
      expect(screen.getByText('5:30')).toBeInTheDocument();
    });
  });

  it('menampilkan konten tab panduan', async () => {
    const user = userEvent.setup();
    render(<HelpCenterPage />);

    await user.click(screen.getByText('Panduan'));

    await waitFor(() => {
      expect(screen.getByText('Panduan Langkah demi Langkah')).toBeInTheDocument();
      expect(screen.getByText('Complete guide')).toBeInTheDocument();
      expect(screen.getByText('10 minutes')).toBeInTheDocument();
    });
  });

  it('menampilkan konten tab artikel populer', async () => {
    const user = userEvent.setup();
    render(<HelpCenterPage />);

    await user.click(screen.getByText('Populer'));

    await waitFor(() => {
      expect(screen.getByText('Artikel Populer')).toBeInTheDocument();
      expect(screen.getByText('Popular article')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
    });
  });

  it('menampilkan opsi kontak dukungan', async () => {
    render(<HelpCenterPage />);

    await waitFor(() => {
      expect(screen.getByText('Masih Butuh Bantuan?')).toBeInTheDocument();
      expect(screen.getByText('Live Chat')).toBeInTheDocument();
      expect(screen.getByText('Kirim Tiket')).toBeInTheDocument();
      expect(screen.getByText('Dokumentasi')).toBeInTheDocument();
    });
  });

  it('menampilkan state loading', async () => {
    mockUseHelp.mockReturnValue({
      faqItems: [],
      tutorials: [],
      guides: [],
      popularArticles: [],
      searchResults: [],
      isLoading: true,
      error: null,
      searchFAQ: mockSearchFAQ,
      trackArticleView: mockTrackArticleView,
      submitFeedback: mockSubmitFeedback,
      refreshHelpData: mockRefreshHelpData,
    });

    render(<HelpCenterPage />);

    expect(screen.getByRole('generic')).toHaveClass('animate-spin');
  });

  it('menangani state FAQ kosong', async () => {
    mockUseHelp.mockReturnValue({
      faqItems: [],
      tutorials: [],
      guides: [],
      popularArticles: [],
      searchResults: [],
      isLoading: false,
      error: null,
      searchFAQ: mockSearchFAQ,
      trackArticleView: mockTrackArticleView,
      submitFeedback: mockSubmitFeedback,
      refreshHelpData: mockRefreshHelpData,
    });

    render(<HelpCenterPage />);

    await waitFor(() => {
      expect(screen.getByText('Tidak ada FAQ tersedia')).toBeInTheDocument();
    });
  });

  it('memberikan feedback membantu/tidak membantu', async () => {
    const user = userEvent.setup();
    render(<HelpCenterPage />);

    // Expand FAQ terlebih dahulu
    await user.click(screen.getByText('How to create an invitation?'));

    await waitFor(() => {
      expect(screen.getByText('👍 Ya')).toBeInTheDocument();
      expect(screen.getByText('👎 Tidak')).toBeInTheDocument();
    });

    await user.click(screen.getByText('👍 Ya'));
    // Harusnya memanggil submitFeedback (implementasi akan memanggil API)
    expect(mockSubmitFeedback).toHaveBeenCalled();
  });
});