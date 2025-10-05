// Common API response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
}

// Request types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  filters?: Record<string, any>;
}

export interface ListParams extends PaginationParams, FilterParams {}

// File upload types
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface BulkUploadResponse {
  successful: UploadResponse[];
  failed: Array<{
    filename: string;
    error: string;
  }>;
}

// Analytics types
export interface AnalyticsData {
  period: string;
  metrics: Record<string, number>;
  trends: Array<{
    date: string;
    value: number;
  }>;
}

// Export types
export interface ExportRequest {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  filters?: Record<string, any>;
  columns?: string[];
}

export interface ExportResponse {
  downloadUrl: string;
  filename: string;
  expiresAt: string;
}