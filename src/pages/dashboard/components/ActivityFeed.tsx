import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  CreditCard, 
  Plus,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActivityItem } from '@/types/dashboard';

export interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
  showViewAll?: boolean;
  className?: string;
}

const activityIcons = {
  invitation_created: Calendar,
  guest_added: Users,
  rsvp_received: MessageSquare,
  payment_made: CreditCard,
};

const activityColors = {
  invitation_created: 'text-blue-600 bg-blue-50',
  guest_added: 'text-green-600 bg-green-50',
  rsvp_received: 'text-purple-600 bg-purple-50',
  payment_made: 'text-orange-600 bg-orange-50',
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Baru saja';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`;
  }
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function ActivityFeed({
  activities,
  maxItems = 5,
  showViewAll = true,
  className,
}: ActivityFeedProps) {
  const recentActivities = activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, maxItems);

  if (activities.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Clock className="h-12 w-12 mx-auto mb-2" />
              <p>Belum ada aktivitas</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/dashboard/pilih-template">
                <Plus className="h-4 w-4 mr-2" />
                Mulai Buat Undangan
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold">Aktivitas Terbaru</CardTitle>
        {showViewAll && activities.length > maxItems && (
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard/activities">
              Lihat Semua
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const colorClasses = activityColors[activity.type];

            return (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0',
                    colorClasses
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-gray-900">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}