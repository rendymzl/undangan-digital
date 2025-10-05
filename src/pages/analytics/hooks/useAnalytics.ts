import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

export interface AnalyticsData {
  invitationId: string;
  invitationTitle: string;
  views: {
    total: number;
    unique: number;
    daily: Array<{ date: string; count: number }>;
  };
  engagement: {
    averageTimeOnPage: number; // in seconds
    bounceRate: number; // percentage
    mostViewedSections: string[];
  };
  rsvp: {
    responseRate: number;
    responseTime: number; // average days to respond
    categoryBreakdown: Record<string, number>;
  };
  geographic: {
    countries: Array<{ name: string; count: number }>;
    cities: Array<{ name: string; count: number }>;
  };
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  traffic: {
    direct: number;
    social: number;
    referral: number;
    search: number;
  };
}

export interface AnalyticsFilters {
  invitationId?: string;
  dateRange: '7d' | '30d' | '90d' | '1y' | 'all';
  metric?: 'views' | 'engagement' | 'rsvp' | 'geographic';
}

export interface UseAnalyticsOptions {
  userId?: string;
  initialFilters?: Partial<AnalyticsFilters>;
  onDataUpdate?: (data: AnalyticsData[]) => void;
}

export default function useAnalytics({
  userId,
  initialFilters = {},
  onDataUpdate,
}: UseAnalyticsOptions = {}) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: '30d',
    ...initialFilters,
  });

  // Mock analytics data
  const mockAnalyticsData: AnalyticsData[] = [
    {
      invitationId: '1',
      invitationTitle: 'Ahmad & Siti',
      views: {
        total: 1250,
        unique: 890,
        daily: [
          { date: '1 Jan', count: 45 },
          { date: '2 Jan', count: 52 },
          { date: '3 Jan', count: 38 },
          { date: '4 Jan', count: 65 },
          { date: '5 Jan', count: 78 },
          { date: '6 Jan', count: 92 },
          { date: '7 Jan', count: 105 },
        ],
      },
      engagement: {
        averageTimeOnPage: 180,
        bounceRate: 25,
        mostViewedSections: ['Acara', 'Galeri', 'RSVP', 'Lokasi'],
      },
      rsvp: {
        responseRate: 75,
        responseTime: 3.5,
        categoryBreakdown: {
          'Keluarga': 45,
          'Teman': 32,
          'Kerja': 18,
          'Lainnya': 5,
        },
      },
      geographic: {
        countries: [
          { name: 'Indonesia', count: 850 },
          { name: 'Malaysia', count: 25 },
          { name: 'Singapore', count: 15 },
        ],
        cities: [
          { name: 'Jakarta', count: 320 },
          { name: 'Bandung', count: 180 },
          { name: 'Surabaya', count: 150 },
          { name: 'Yogyakarta', count: 120 },
          { name: 'Medan', count: 80 },
        ],
      },
      devices: {
        desktop: 35,
        mobile: 60,
        tablet: 5,
      },
      traffic: {
        direct: 45,
        social: 30,
        referral: 15,
        search: 10,
      },
    },
    {
      invitationId: '2',
      invitationTitle: 'Budi & Maya',
      views: {
        total: 890,
        unique: 650,
        daily: [
          { date: '1 Jan', count: 32 },
          { date: '2 Jan', count: 28 },
          { date: '3 Jan', count: 45 },
          { date: '4 Jan', count: 38 },
          { date: '5 Jan', count: 52 },
          { date: '6 Jan', count: 48 },
          { date: '7 Jan', count: 67 },
        ],
      },
      engagement: {
        averageTimeOnPage: 145,
        bounceRate: 32,
        mostViewedSections: ['Galeri', 'Acara', 'Lokasi', 'RSVP'],
      },
      rsvp: {
        responseRate: 68,
        responseTime: 4.2,
        categoryBreakdown: {
          'Keluarga': 38,
          'Teman': 28,
          'Kerja': 22,
          'Lainnya': 12,
        },
      },
      geographic: {
        countries: [
          { name: 'Indonesia', count: 620 },
          { name: 'Malaysia', count: 20 },
          { name: 'Singapore', count: 10 },
        ],
        cities: [
          { name: 'Surabaya', count: 180 },
          { name: 'Jakarta', count: 150 },
          { name: 'Malang', count: 120 },
          { name: 'Bandung', count: 100 },
          { name: 'Yogyakarta', count: 70 },
        ],
      },
      devices: {
        desktop: 28,
        mobile: 65,
        tablet: 7,
      },
      traffic: {
        direct: 40,
        social: 35,
        referral: 18,
        search: 7,
      },
    },
  ];

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalyticsData(mockAnalyticsData);
      onDataUpdate?.(mockAnalyticsData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics';
      setError(errorMessage);
      toast.error('Gagal memuat data analytics');
    } finally {
      setIsLoading(false);
    }
  }, [userId, onDataUpdate]);

  // Filter analytics data based on current filters
  const filteredData = useMemo(() => {
    let filtered = analyticsData;

    // Filter by invitation ID
    if (filters.invitationId) {
      filtered = filtered.filter(d => d.invitationId === filters.invitationId);
    }

    // Apply date range filter (mock implementation)
    // In a real app, this would filter the daily data based on the date range
    
    return filtered;
  }, [analyticsData, filters]);

  // Calculate aggregate statistics
  const aggregateStats = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        totalViews: 0,
        totalUniqueViews: 0,
        avgResponseRate: 0,
        avgEngagementTime: 0,
        totalInvitations: 0,
      };
    }

    const totalViews = filteredData.reduce((sum, d) => sum + d.views.total, 0);
    const totalUniqueViews = filteredData.reduce((sum, d) => sum + d.views.unique, 0);
    const avgResponseRate = filteredData.reduce((sum, d) => sum + d.rsvp.responseRate, 0) / filteredData.length;
    const avgEngagementTime = filteredData.reduce((sum, d) => sum + d.engagement.averageTimeOnPage, 0) / filteredData.length;
    
    return {
      totalViews,
      totalUniqueViews,
      avgResponseRate,
      avgEngagementTime,
      totalInvitations: filteredData.length,
    };
  }, [filteredData]);

  // Get top performing invitations
  const topPerformingInvitations = useMemo(() => {
    return [...filteredData]
      .sort((a, b) => b.views.total - a.views.total)
      .slice(0, 5);
  }, [filteredData]);

  // Get device breakdown across all invitations
  const deviceBreakdown = useMemo(() => {
    if (filteredData.length === 0) return { desktop: 0, mobile: 0, tablet: 0 };

    const totalDevices = filteredData.reduce((acc, d) => ({
      desktop: acc.desktop + d.devices.desktop,
      mobile: acc.mobile + d.devices.mobile,
      tablet: acc.tablet + d.devices.tablet,
    }), { desktop: 0, mobile: 0, tablet: 0 });

    const total = totalDevices.desktop + totalDevices.mobile + totalDevices.tablet;
    
    return {
      desktop: Math.round((totalDevices.desktop / total) * 100),
      mobile: Math.round((totalDevices.mobile / total) * 100),
      tablet: Math.round((totalDevices.tablet / total) * 100),
    };
  }, [filteredData]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<AnalyticsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Export analytics data
  const exportData = useCallback((format: 'json' | 'csv' = 'json') => {
    try {
      if (format === 'json') {
        const exportData = {
          filters,
          aggregateStats,
          invitations: filteredData,
          exportDate: new Date().toISOString(),
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        const csvContent = [
          ['Invitation', 'Total Views', 'Unique Views', 'Response Rate', 'Avg Time on Page', 'Bounce Rate'].join(','),
          ...filteredData.map(d => [
            d.invitationTitle,
            d.views.total,
            d.views.unique,
            d.rsvp.responseRate,
            d.engagement.averageTimeOnPage,
            d.engagement.bounceRate
          ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      toast.success('Data analytics berhasil diekspor');
    } catch (error) {
      toast.error('Gagal mengekspor data analytics');
    }
  }, [filteredData, filters, aggregateStats]);

  // Get insights based on data
  const getInsights = useCallback(() => {
    if (filteredData.length === 0) return [];

    const insights = [];
    
    // Mobile usage insight
    if (deviceBreakdown.mobile > 60) {
      insights.push({
        type: 'mobile',
        title: 'Mobile Dominance',
        description: `${deviceBreakdown.mobile}% of your visitors use mobile devices. Ensure your invitation is mobile-optimized.`,
        severity: 'info',
      });
    }

    // Response rate insight
    if (aggregateStats.avgResponseRate > 70) {
      insights.push({
        type: 'rsvp',
        title: 'Great Response Rate',
        description: `Your ${aggregateStats.avgResponseRate.toFixed(1)}% response rate is above average. Keep engaging with your guests!`,
        severity: 'success',
      });
    } else if (aggregateStats.avgResponseRate < 50) {
      insights.push({
        type: 'rsvp',
        title: 'Low Response Rate',
        description: `Your ${aggregateStats.avgResponseRate.toFixed(1)}% response rate could be improved. Consider sending reminders or making RSVP easier.`,
        severity: 'warning',
      });
    }

    // Engagement insight
    if (aggregateStats.avgEngagementTime > 120) {
      insights.push({
        type: 'engagement',
        title: 'Good Engagement',
        description: `Visitors spend an average of ${Math.round(aggregateStats.avgEngagementTime / 60)} minutes on your invitation, showing strong interest.`,
        severity: 'success',
      });
    }

    return insights;
  }, [filteredData, deviceBreakdown, aggregateStats]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    // State
    analyticsData: filteredData,
    allAnalyticsData: analyticsData,
    isLoading,
    error,
    filters,
    
    // Computed data
    aggregateStats,
    topPerformingInvitations,
    deviceBreakdown,
    
    // Actions
    fetchAnalytics,
    updateFilters,
    exportData,
    
    // Utilities
    getInsights,
  };
}