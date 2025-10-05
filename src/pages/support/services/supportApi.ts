import { apiClient } from '@/services/api/client';
import type { FAQItem, Tutorial, Guide, PopularArticle, SupportTicket, ChatSession, HelpSearchResult } from '../types/support';

// Mock data for development
const mockFAQItems: FAQItem[] = [
  {
    id: '1',
    question: 'Bagaimana cara membuat undangan pertama saya?',
    answer: 'Untuk membuat undangan pertama, ikuti langkah berikut: 1) Klik "Buat Undangan" di dashboard, 2) Pilih template yang Anda sukai, 3) Isi informasi acara Anda, 4) Kustomisasi desain sesuai keinginan, 5) Preview dan publish undangan Anda.',
    category: 'getting-started',
    tags: ['undangan', 'pemula', 'tutorial'],
    helpful: 45,
    notHelpful: 3,
    lastUpdated: '2024-01-15T10:00:00Z',
    relatedLinks: [
      { title: 'Tutorial Video: Membuat Undangan', url: '/tutorials/create-invitation' },
      { title: 'Panduan Template', url: '/guides/templates' }
    ]
  },
  {
    id: '2',
    question: 'Bagaimana cara menambahkan tamu ke undangan?',
    answer: 'Anda dapat menambahkan tamu dengan beberapa cara: 1) Manual - klik "Tambah Tamu" dan isi data satu per satu, 2) Import CSV - upload file Excel/CSV dengan data tamu, 3) Copy-paste dari aplikasi lain. Pastikan format data sesuai dengan template yang disediakan.',
    category: 'guests',
    tags: ['tamu', 'import', 'csv'],
    helpful: 38,
    notHelpful: 2,
    lastUpdated: '2024-01-14T15:30:00Z',
    relatedLinks: [
      { title: 'Template CSV untuk Import Tamu', url: '/downloads/guest-template.csv' },
      { title: 'Panduan Import Tamu', url: '/guides/import-guests' }
    ]
  },
  {
    id: '3',
    question: 'Apa perbedaan antara paket Free, Premium, dan Ultimate?',
    answer: 'Paket Free: 50 tamu, template terbatas, watermark. Paket Premium (Rp 99k): 200 tamu, semua template, tanpa watermark, analytics dasar. Paket Ultimate (Rp 199k): unlimited tamu, fitur advanced, custom domain, priority support.',
    category: 'payments',
    tags: ['paket', 'harga', 'fitur'],
    helpful: 52,
    notHelpful: 1,
    lastUpdated: '2024-01-16T09:15:00Z'
  },
  {
    id: '4',
    question: 'Bagaimana cara mengubah template setelah undangan dibuat?',
    answer: 'Anda dapat mengubah template kapan saja dengan masuk ke editor undangan, klik "Ganti Template" di sidebar kiri, pilih template baru, dan sistem akan otomatis menyesuaikan konten Anda ke template yang baru.',
    category: 'invitations',
    tags: ['template', 'edit', 'ganti'],
    helpful: 29,
    notHelpful: 5,
    lastUpdated: '2024-01-13T14:20:00Z'
  },
  {
    id: '5',
    question: 'Mengapa undangan saya tidak bisa dibuka?',
    answer: 'Beberapa kemungkinan penyebab: 1) Undangan belum dipublish - pastikan status "Published", 2) Link salah atau expired, 3) Masalah koneksi internet, 4) Browser tidak support. Coba buka di browser lain atau clear cache browser.',
    category: 'technical',
    tags: ['error', 'akses', 'troubleshooting'],
    helpful: 33,
    notHelpful: 8,
    lastUpdated: '2024-01-12T11:45:00Z'
  }
];

const mockTutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Cara Membuat Undangan Pernikahan Digital',
    description: 'Tutorial lengkap membuat undangan pernikahan digital dari awal hingga selesai',
    videoUrl: '/videos/create-wedding-invitation.mp4',
    thumbnailUrl: '/thumbnails/wedding-tutorial.jpg',
    duration: '8:45',
    category: 'getting-started',
    difficulty: 'beginner',
    views: 1250,
    rating: 4.8,
    tags: ['pernikahan', 'undangan', 'tutorial'],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    title: 'Mengelola Daftar Tamu dan RSVP',
    description: 'Pelajari cara menambah tamu, mengirim undangan, dan mengelola RSVP',
    videoUrl: '/videos/manage-guests-rsvp.mp4',
    thumbnailUrl: '/thumbnails/guests-tutorial.jpg',
    duration: '6:20',
    category: 'guests',
    difficulty: 'beginner',
    views: 890,
    rating: 4.6,
    tags: ['tamu', 'rsvp', 'manajemen'],
    createdAt: '2024-01-08T15:00:00Z',
    updatedAt: '2024-01-12T09:15:00Z'
  },
  {
    id: '3',
    title: 'Kustomisasi Template dan Desain',
    description: 'Tips dan trik untuk mengkustomisasi template agar sesuai dengan tema acara Anda',
    videoUrl: '/videos/customize-template.mp4',
    thumbnailUrl: '/thumbnails/customize-tutorial.jpg',
    duration: '12:15',
    category: 'design',
    difficulty: 'intermediate',
    views: 654,
    rating: 4.9,
    tags: ['template', 'desain', 'kustomisasi'],
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-01-10T16:45:00Z'
  }
];

const mockGuides: Guide[] = [
  {
    id: '1',
    title: 'Panduan Lengkap Membuat Undangan Digital',
    description: 'Panduan step-by-step untuk membuat undangan digital yang menarik',
    category: 'getting-started',
    difficulty: 'easy',
    estimatedTime: '15 menit',
    steps: [
      {
        title: 'Daftar dan Login',
        content: 'Buat akun baru atau login ke akun yang sudah ada'
      },
      {
        title: 'Pilih Template',
        content: 'Browse dan pilih template yang sesuai dengan tema acara Anda'
      },
      {
        title: 'Isi Informasi Acara',
        content: 'Masukkan detail acara seperti nama, tanggal, waktu, dan lokasi'
      },
      {
        title: 'Kustomisasi Desain',
        content: 'Sesuaikan warna, font, dan elemen desain lainnya'
      },
      {
        title: 'Preview dan Publish',
        content: 'Preview undangan Anda dan publish untuk dibagikan'
      }
    ],
    tags: ['undangan', 'tutorial', 'pemula'],
    views: 2340,
    helpful: 89,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z'
  },
  {
    id: '2',
    title: 'Cara Import Daftar Tamu dari Excel',
    description: 'Panduan mengimport daftar tamu dalam jumlah besar menggunakan file Excel/CSV',
    category: 'guests',
    difficulty: 'medium',
    estimatedTime: '10 menit',
    steps: [
      {
        title: 'Download Template',
        content: 'Download template Excel yang sudah disediakan'
      },
      {
        title: 'Isi Data Tamu',
        content: 'Isi data tamu sesuai format yang ditentukan'
      },
      {
        title: 'Upload File',
        content: 'Upload file Excel ke sistem'
      },
      {
        title: 'Verifikasi Data',
        content: 'Periksa dan verifikasi data yang telah diimport'
      }
    ],
    tags: ['tamu', 'import', 'excel', 'csv'],
    views: 1560,
    helpful: 67,
    createdAt: '2024-01-03T14:00:00Z',
    updatedAt: '2024-01-12T10:30:00Z'
  }
];

const mockPopularArticles: PopularArticle[] = [
  {
    id: '1',
    title: 'Tips Membuat Undangan yang Menarik',
    summary: 'Panduan lengkap untuk membuat undangan digital yang eye-catching dan memorable',
    category: 'design',
    views: 3450,
    rating: 4.8,
    url: '/articles/attractive-invitation-tips',
    lastViewed: '2024-01-16T10:30:00Z'
  },
  {
    id: '2',
    title: 'Cara Mengelola RSVP dengan Efektif',
    summary: 'Strategi dan tips untuk mengelola konfirmasi kehadiran tamu dengan mudah',
    category: 'guests',
    views: 2890,
    rating: 4.7,
    url: '/articles/effective-rsvp-management',
    lastViewed: '2024-01-16T09:15:00Z'
  },
  {
    id: '3',
    title: 'Memilih Paket yang Tepat untuk Acara Anda',
    summary: 'Panduan memilih paket berlangganan yang sesuai dengan kebutuhan acara',
    category: 'billing',
    views: 2340,
    rating: 4.6,
    url: '/articles/choosing-right-plan',
    lastViewed: '2024-01-15T16:45:00Z'
  },
  {
    id: '4',
    title: 'Troubleshooting Masalah Umum',
    summary: 'Solusi untuk masalah-masalah yang sering dihadapi pengguna',
    category: 'technical',
    views: 1980,
    rating: 4.5,
    url: '/articles/common-troubleshooting',
    lastViewed: '2024-01-15T14:20:00Z'
  },
  {
    id: '5',
    title: 'Integrasi dengan Media Sosial',
    summary: 'Cara mengintegrasikan undangan dengan platform media sosial',
    category: 'features',
    views: 1670,
    rating: 4.4,
    url: '/articles/social-media-integration',
    lastViewed: '2024-01-14T11:30:00Z'
  }
];

export const supportApi = {
  // Get FAQ items
  getFAQItems: async (): Promise<FAQItem[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // TODO: Replace with actual API call
    // const response = await apiClient.get('/support/faq');
    // return response.data;
    
    return mockFAQItems;
  },

  // Search FAQ
  searchFAQ: async (query: string): Promise<FAQItem[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // TODO: Replace with actual API call
    // const response = await apiClient.get(`/support/faq/search?q=${encodeURIComponent(query)}`);
    // return response.data;
    
    // Mock search implementation
    const lowercaseQuery = query.toLowerCase();
    return mockFAQItems.filter(item => 
      item.question.toLowerCase().includes(lowercaseQuery) ||
      item.answer.toLowerCase().includes(lowercaseQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  },

  // Get tutorials
  getTutorials: async (): Promise<Tutorial[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Replace with actual API call
    // const response = await apiClient.get('/support/tutorials');
    // return response.data;
    
    return mockTutorials;
  },

  // Get guides
  getGuides: async (): Promise<Guide[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 900));
    
    // TODO: Replace with actual API call
    // const response = await apiClient.get('/support/guides');
    // return response.data;
    
    return mockGuides;
  },

  // Get popular articles
  getPopularArticles: async (): Promise<PopularArticle[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // TODO: Replace with actual API call
    // const response = await apiClient.get('/support/popular');
    // return response.data;
    
    return mockPopularArticles;
  },

  // Track article view
  trackArticleView: async (articleId: string, title: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // TODO: Replace with actual API call
    // await apiClient.post('/support/track-view', { articleId, title });
    
    console.log(`Tracked view for article: ${title} (${articleId})`);
  },

  // Submit feedback
  submitFeedback: async (articleId: string, helpful: boolean, comment?: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // TODO: Replace with actual API call
    // await apiClient.post('/support/feedback', { articleId, helpful, comment });
    
    console.log(`Feedback submitted for article ${articleId}: ${helpful ? 'helpful' : 'not helpful'}`);
  },

  // Get support tickets
  getSupportTickets: async (): Promise<SupportTicket[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // TODO: Replace with actual API call
    // const response = await apiClient.get('/support/tickets');
    // return response.data;
    
    // Mock tickets data
    const mockTickets: SupportTicket[] = [
      {
        id: 'TKT-001',
        subject: 'Undangan tidak bisa dibuka oleh tamu',
        description: 'Beberapa tamu melaporkan bahwa mereka tidak bisa membuka undangan yang saya kirim. Link mengarah ke halaman error 404.',
        category: 'technical',
        priority: 'high',
        status: 'in-progress',
        messages: [
          {
            id: '1',
            sender: 'user',
            message: 'Beberapa tamu melaporkan bahwa mereka tidak bisa membuka undangan yang saya kirim. Link mengarah ke halaman error 404.',
            timestamp: '2024-01-16T10:00:00Z',
          },
          {
            id: '2',
            sender: 'support',
            message: 'Terima kasih telah melaporkan masalah ini. Kami sedang menginvestigasi masalah dengan link undangan. Bisakah Anda memberikan contoh link yang bermasalah?',
            timestamp: '2024-01-16T10:30:00Z',
          },
          {
            id: '3',
            sender: 'user',
            message: 'Ini contoh linknya: https://menantikan.com/invitation/abc123. Sudah saya coba buka dari beberapa browser yang berbeda.',
            timestamp: '2024-01-16T11:00:00Z',
          }
        ],
        createdAt: '2024-01-16T10:00:00Z',
        updatedAt: '2024-01-16T11:00:00Z',
      },
      {
        id: 'TKT-002',
        subject: 'Pembayaran sudah berhasil tapi status masih pending',
        description: 'Saya sudah melakukan pembayaran untuk upgrade ke paket Premium 3 hari yang lalu, tapi status akun masih menunjukkan paket Free.',
        category: 'billing',
        priority: 'medium',
        status: 'resolved',
        messages: [
          {
            id: '1',
            sender: 'user',
            message: 'Saya sudah melakukan pembayaran untuk upgrade ke paket Premium 3 hari yang lalu, tapi status akun masih menunjukkan paket Free.',
            timestamp: '2024-01-13T14:00:00Z',
          },
          {
            id: '2',
            sender: 'support',
            message: 'Kami telah mengecek pembayaran Anda dan berhasil memproses upgrade ke paket Premium. Status akun Anda sekarang sudah aktif. Silakan logout dan login kembali untuk melihat perubahan.',
            timestamp: '2024-01-13T15:30:00Z',
          },
          {
            id: '3',
            sender: 'user',
            message: 'Terima kasih! Sekarang sudah bisa akses fitur Premium.',
            timestamp: '2024-01-13T16:00:00Z',
          }
        ],
        createdAt: '2024-01-13T14:00:00Z',
        updatedAt: '2024-01-13T16:00:00Z',
        resolvedAt: '2024-01-13T15:30:00Z',
      },
      {
        id: 'TKT-003',
        subject: 'Request fitur: Integrasi dengan Google Calendar',
        description: 'Apakah bisa ditambahkan fitur untuk mengintegrasikan event undangan dengan Google Calendar? Ini akan sangat membantu tamu untuk mengingat acara.',
        category: 'feature-request',
        priority: 'low',
        status: 'open',
        messages: [
          {
            id: '1',
            sender: 'user',
            message: 'Apakah bisa ditambahkan fitur untuk mengintegrasikan event undangan dengan Google Calendar? Ini akan sangat membantu tamu untuk mengingat acara.',
            timestamp: '2024-01-15T09:00:00Z',
          }
        ],
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T09:00:00Z',
      }
    ];
    
    return mockTickets;
  },

  // Create support ticket
  createSupportTicket: async (ticketData: Partial<SupportTicket>): Promise<SupportTicket> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Replace with actual API call
    // const response = await apiClient.post('/support/tickets', ticketData);
    // return response.data;
    
    // Mock ticket creation
    const mockTicket: SupportTicket = {
      id: Date.now().toString(),
      subject: ticketData.subject || '',
      description: ticketData.description || '',
      category: ticketData.category || 'general',
      priority: ticketData.priority || 'medium',
      status: 'open',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return mockTicket;
  },

  // Start chat session
  startChatSession: async (): Promise<ChatSession> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // TODO: Replace with actual API call
    // const response = await apiClient.post('/support/chat/start');
    // return response.data;
    
    // Mock chat session
    const mockSession: ChatSession = {
      id: Date.now().toString(),
      status: 'waiting',
      messages: [
        {
          id: '1',
          sender: 'system',
          message: 'Anda sedang dalam antrian. Estimasi waktu tunggu: 2-3 menit.',
          timestamp: new Date().toISOString(),
          type: 'system'
        }
      ],
      startedAt: new Date().toISOString(),
    };
    
    return mockSession;
  },

  // Update support ticket
  updateSupportTicket: async (ticketId: string, updates: Partial<SupportTicket>): Promise<SupportTicket> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // TODO: Replace with actual API call
    // const response = await apiClient.put(`/support/tickets/${ticketId}`, updates);
    // return response.data;
    
    // Mock update - in real implementation, this would return the updated ticket from server
    const mockUpdatedTicket: SupportTicket = {
      id: ticketId,
      subject: 'Updated Ticket',
      description: 'Updated description',
      category: 'general',
      priority: 'medium',
      status: updates.status || 'open',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...updates,
    };
    
    return mockUpdatedTicket;
  },

  // Add message to ticket
  addTicketMessage: async (ticketId: string, message: string, attachments?: File[]): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // TODO: Replace with actual API call
    // await apiClient.post(`/support/tickets/${ticketId}/messages`, { message, attachments });
    
    console.log(`Added message to ticket ${ticketId}: ${message}`);
    if (attachments && attachments.length > 0) {
      console.log(`With ${attachments.length} attachments`);
    }
  },
};