export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'getting-started' | 'invitations' | 'guests' | 'payments' | 'technical' | 'general';
  tags: string[];
  helpful: number;
  notHelpful: number;
  lastUpdated: string;
  relatedLinks?: Array<{
    title: string;
    url: string;
  }>;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string; // e.g., "5:30"
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  views: number;
  rating: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string; // e.g., "10 menit"
  steps: Array<{
    title: string;
    content: string;
    image?: string;
  }>;
  tags: string[];
  views: number;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface PopularArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  views: number;
  rating: number;
  url: string;
  lastViewed: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'feature-request' | 'bug-report' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'waiting-response' | 'resolved' | 'closed';
  attachments?: Array<{
    filename: string;
    url: string;
    size: number;
  }>;
  messages: Array<{
    id: string;
    sender: 'user' | 'support';
    message: string;
    timestamp: string;
    attachments?: Array<{
      filename: string;
      url: string;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface SupportAgent {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  isOnline: boolean;
  responseTime: string; // e.g., "Usually responds in 5 minutes"
}

export interface ChatSession {
  id: string;
  status: 'waiting' | 'connected' | 'ended';
  agent?: SupportAgent;
  messages: Array<{
    id: string;
    sender: 'user' | 'agent' | 'system';
    message: string;
    timestamp: string;
    type: 'text' | 'image' | 'file' | 'system';
  }>;
  startedAt: string;
  endedAt?: string;
  rating?: number;
  feedback?: string;
}

export interface HelpSearchResult {
  type: 'faq' | 'tutorial' | 'guide' | 'article';
  id: string;
  title: string;
  snippet: string;
  url: string;
  relevance: number;
}

export interface FeedbackSubmission {
  articleId: string;
  helpful: boolean;
  comment?: string;
  category?: string;
  suggestions?: string;
}