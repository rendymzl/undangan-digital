import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye,
  MessageSquare,
  Calendar,
  Globe,
  Smartphone,
  Download,
  Filter,
  RefreshCw,
  Clock,
  MapPin,
  Share2
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { LineChart, PieChart, BarChart } from '@/components/shared/Charts';

interface AnalyticsData {
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
      averageTimeOnPage: 180, // 3 minutes
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
];

export default function StatisticsPage() {
  const [selectedInvitation, setSelectedInvitation] = useState<string>('1');
  const [dateRange, setDateRange] = useState<string>('7d');
  const [isLoading, setIsLoading] = useState(false);

  const dateRangeOptions = [
    { value: '7d', label: '7 Hari Terakhir' },
    { value: '30d', label: '30 Hari Terakhir' },
    { value: '90d', label: '90 Hari Terakhir' },
    { value: '1y', label: '1 Tahun Terakhir' },
  ];

  const currentData = mockAnalyticsData.find(d => d.invitationId === selectedInvitation) || mockAnalyticsData[0];

  // Aggregate statistics
  const aggregateStats = useMemo(() => {
    const totalViews = mockAnalyticsData.reduce((sum, d) => sum + d.views.total, 0);
    const totalUniqueViews = mockAnalyticsData.reduce((sum, d) => sum + d.views.unique, 0);
    const avgResponseRate = mockAnalyticsData.reduce((sum, d) => sum + d.rsvp.responseRate, 0) / mockAnalyticsData.length;
    const avgEngagementTime = mockAnalyticsData.reduce((sum, d) => sum + d.engagement.averageTimeOnPage, 0) / mockAnalyticsData.length;
    
    return {
      totalViews,
      totalUniqueViews,
      avgResponseRate,
      avgEngagementTime,
    };
  }, []);

  // Device data for pie chart
  const deviceData = [
    { name: 'Mobile', value: currentData.devices.mobile, color: '#3b82f6' },
    { name: 'Desktop', value: currentData.devices.desktop, color: '#10b981' },
    { name: 'Tablet', value: currentData.devices.tablet, color: '#f59e0b' },
  ];

  // Traffic source data
  const trafficData = [
    { name: 'Direct', value: currentData.traffic.direct, color: '#8b5cf6' },
    { name: 'Social Media', value: currentData.traffic.social, color: '#06b6d4' },
    { name: 'Referral', value: currentData.traffic.referral, color: '#84cc16' },
    { name: 'Search', value: currentData.traffic.search, color: '#f97316' },
  ];

  // RSVP category data for bar chart
  const rsvpCategoryData = Object.entries(currentData.rsvp.categoryBreakdown).map(([category, count]) => ({
    category,
    count,
  }));

  const handleRefresh = async () => {
    setIsLoading(true);
    // Mock refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExport = () => {
    // Mock export functionality
    const exportData = {
      invitation: currentData.invitationTitle,
      dateRange,
      views: currentData.views,
      engagement: currentData.engagement,
      rsvp: currentData.rsvp,
      geographic: currentData.geographic,
      devices: currentData.devices,
      traffic: currentData.traffic,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${currentData.invitationTitle}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Statistics"
        description="Analisis mendalam tentang performa undangan digital Anda"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Analytics' },
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            
            <select
              value={selectedInvitation}
              onChange={(e) => setSelectedInvitation(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              {mockAnalyticsData.map((data) => (
                <option key={data.invitationId} value={data.invitationId}>
                  {data.invitationTitle}
                </option>
              ))}
            </select>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{currentData.views.total.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Views</div>
                <div className="text-xs text-green-600">
                  {currentData.views.unique.toLocaleString()} unique
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{currentData.rsvp.responseRate}%</div>
                <div className="text-sm text-muted-foreground">Response Rate</div>
                <div className="text-xs text-muted-foreground">
                  Avg {currentData.rsvp.responseTime} days
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{formatTime(currentData.engagement.averageTimeOnPage)}</div>
                <div className="text-sm text-muted-foreground">Avg Time on Page</div>
                <div className="text-xs text-green-600">
                  {100 - currentData.engagement.bounceRate}% engagement
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{currentData.engagement.bounceRate}%</div>
                <div className="text-sm text-muted-foreground">Bounce Rate</div>
                <div className="text-xs text-muted-foreground">
                  Lower is better
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Views Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={currentData.views.daily}
              xKey="date"
              yKey="count"
              color="#3b82f6"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2" />
              Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={deviceData}
              height={300}
            />
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Share2 className="h-5 w-5 mr-2" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={trafficData}
              height={300}
            />
          </CardContent>
        </Card>

        {/* RSVP by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              RSVP by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={rsvpCategoryData}
              xKey="category"
              yKey="count"
              color="#10b981"
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Top Countries</h4>
                <div className="space-y-2">
                  {currentData.geographic.countries.map((country, index) => (
                    <div key={country.name} className="flex items-center justify-between">
                      <span className="text-sm">{country.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(country.count / currentData.views.unique) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">{country.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Top Cities</h4>
                <div className="space-y-2">
                  {currentData.geographic.cities.slice(0, 5).map((city) => (
                    <div key={city.name} className="flex items-center justify-between">
                      <span className="text-sm">{city.name}</span>
                      <span className="text-sm font-medium">{city.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Engagement Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Most Viewed Sections</h4>
                <div className="space-y-2">
                  {currentData.engagement.mostViewedSections.map((section, index) => (
                    <div key={section} className="flex items-center justify-between">
                      <span className="text-sm">{section}</span>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatTime(currentData.engagement.averageTimeOnPage)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Session</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {100 - currentData.engagement.bounceRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">Engagement</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">📱 Mobile Dominance</h4>
              <p className="text-sm text-blue-800">
                {currentData.devices.mobile}% of your visitors use mobile devices. 
                Ensure your invitation is mobile-optimized.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">✅ Great Response Rate</h4>
              <p className="text-sm text-green-800">
                Your {currentData.rsvp.responseRate}% response rate is above average. 
                Keep engaging with your guests!
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">⏱️ Good Engagement</h4>
              <p className="text-sm text-purple-800">
                Visitors spend an average of {formatTime(currentData.engagement.averageTimeOnPage)} 
                on your invitation, showing strong interest.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}