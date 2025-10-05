import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  MessageSquare, 
  Clock,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { LineChart, PieChart } from '@/components/shared/Charts';

interface AnalyticsOverviewProps {
  data: {
    totalViews: number;
    totalUniqueViews: number;
    avgResponseRate: number;
    avgEngagementTime: number;
    totalInvitations: number;
  };
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  viewsData: Array<{ date: string; count: number }>;
  className?: string;
}

export default function AnalyticsOverview({
  data,
  deviceBreakdown,
  viewsData,
  className,
}: AnalyticsOverviewProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const deviceData = [
    { name: 'Mobile', value: deviceBreakdown.mobile, color: '#3b82f6' },
    { name: 'Desktop', value: deviceBreakdown.desktop, color: '#10b981' },
    { name: 'Tablet', value: deviceBreakdown.tablet, color: '#f59e0b' },
  ];

  const getResponseRateTrend = () => {
    if (data.avgResponseRate >= 70) {
      return { icon: TrendingUp, color: 'text-green-600', label: 'Excellent' };
    } else if (data.avgResponseRate >= 50) {
      return { icon: TrendingUp, color: 'text-blue-600', label: 'Good' };
    } else {
      return { icon: TrendingDown, color: 'text-red-600', label: 'Needs Improvement' };
    }
  };

  const responseTrend = getResponseRateTrend();
  const ResponseIcon = responseTrend.icon;

  return (
    <div className={className}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{data.totalViews.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Views</div>
                <div className="text-xs text-green-600">
                  {data.totalUniqueViews.toLocaleString()} unique
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
                <div className="text-2xl font-bold">{data.avgResponseRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Avg Response Rate</div>
                <div className="flex items-center space-x-1">
                  <ResponseIcon className={`h-3 w-3 ${responseTrend.color}`} />
                  <span className={`text-xs ${responseTrend.color}`}>
                    {responseTrend.label}
                  </span>
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
                <div className="text-2xl font-bold">{formatTime(data.avgEngagementTime)}</div>
                <div className="text-sm text-muted-foreground">Avg Session Time</div>
                <div className="text-xs text-muted-foreground">
                  Per invitation
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{data.totalInvitations}</div>
                <div className="text-sm text-muted-foreground">Active Invitations</div>
                <div className="text-xs text-muted-foreground">
                  Being tracked
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Views Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={viewsData}
              xKey="date"
              yKey="count"
              color="#3b82f6"
              height={250}
            />
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <PieChart
                data={deviceData}
                height={200}
              />
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center space-y-1">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">{deviceBreakdown.mobile}%</span>
                  <span className="text-xs text-muted-foreground">Mobile</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <Monitor className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{deviceBreakdown.desktop}%</span>
                  <span className="text-xs text-muted-foreground">Desktop</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <Tablet className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">{deviceBreakdown.tablet}%</span>
                  <span className="text-xs text-muted-foreground">Tablet</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">📱 Mobile First</h4>
              <p className="text-sm text-blue-800">
                {deviceBreakdown.mobile}% of visitors use mobile. Your invitations are mobile-optimized.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">👥 Engagement</h4>
              <p className="text-sm text-green-800">
                Average session time of {formatTime(data.avgEngagementTime)} shows good user interest.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">📊 Performance</h4>
              <p className="text-sm text-purple-800">
                {data.avgResponseRate.toFixed(1)}% response rate across {data.totalInvitations} invitations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}