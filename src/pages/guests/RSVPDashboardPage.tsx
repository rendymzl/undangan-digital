import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock,
  TrendingUp,
  Calendar,
  MessageSquare,
  Download,
  Filter,
  BarChart3
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { LineChart, PieChart, BarChart } from '@/components/shared/Charts';
import type { Guest } from '@/types/guest';

// Mock RSVP data
const mockRSVPData: Guest[] = [
  {
    id: '1',
    name: 'Ahmad Rizki',
    email: 'ahmad@email.com',
    category: 'Keluarga',
    rsvpStatus: 'confirmed',
    rsvpDate: new Date('2024-01-15'),
    guestCount: 2,
    invitationSent: true,
    invitationSentDate: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    email: 'siti@email.com',
    category: 'Teman',
    rsvpStatus: 'pending',
    guestCount: 1,
    invitationSent: true,
    invitationSentDate: new Date('2024-01-12'),
  },
  {
    id: '3',
    name: 'Budi Santoso',
    email: 'budi@email.com',
    category: 'Kerja',
    rsvpStatus: 'declined',
    rsvpDate: new Date('2024-01-18'),
    guestCount: 0,
    invitationSent: true,
    invitationSentDate: new Date('2024-01-08'),
  },
  {
    id: '4',
    name: 'Maya Sari',
    email: 'maya@email.com',
    category: 'Teman',
    rsvpStatus: 'confirmed',
    rsvpDate: new Date('2024-01-20'),
    guestCount: 1,
    invitationSent: true,
    invitationSentDate: new Date('2024-01-14'),
  },
  {
    id: '5',
    name: 'Andi Wijaya',
    email: 'andi@email.com',
    category: 'Keluarga',
    rsvpStatus: 'maybe',
    rsvpDate: new Date('2024-01-22'),
    guestCount: 2,
    invitationSent: true,
    invitationSentDate: new Date('2024-01-16'),
  },
];

export default function RSVPDashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const stats = useMemo(() => {
    const total = mockRSVPData.length;
    const confirmed = mockRSVPData.filter(g => g.rsvpStatus === 'confirmed').length;
    const declined = mockRSVPData.filter(g => g.rsvpStatus === 'declined').length;
    const pending = mockRSVPData.filter(g => g.rsvpStatus === 'pending').length;
    const maybe = mockRSVPData.filter(g => g.rsvpStatus === 'maybe').length;
    const totalGuestCount = mockRSVPData.reduce((sum, g) => sum + g.guestCount, 0);
    const responseRate = total > 0 ? ((confirmed + declined + maybe) / total) * 100 : 0;

    return {
      total,
      confirmed,
      declined,
      pending,
      maybe,
      totalGuestCount,
      responseRate,
    };
  }, []);

  // Generate daily response data for chart
  const dailyResponseData = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const responsesOnDay = mockRSVPData.filter(guest => {
        if (!guest.rsvpDate) return false;
        return guest.rsvpDate.toDateString() === date.toDateString();
      }).length;
      
      days.push({
        date: date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
        responses: responsesOnDay,
      });
    }
    
    return days;
  }, []);

  // RSVP status distribution for pie chart
  const rsvpDistribution = [
    { name: 'Konfirmasi', value: stats.confirmed, color: '#10b981' },
    { name: 'Tidak Hadir', value: stats.declined, color: '#ef4444' },
    { name: 'Mungkin', value: stats.maybe, color: '#f59e0b' },
    { name: 'Belum Respon', value: stats.pending, color: '#6b7280' },
  ];

  // Category breakdown
  const categoryStats = useMemo(() => {
    const categories = ['Keluarga', 'Teman', 'Kerja'];
    return categories.map(category => {
      const categoryGuests = mockRSVPData.filter(g => g.category === category);
      const confirmed = categoryGuests.filter(g => g.rsvpStatus === 'confirmed').length;
      const total = categoryGuests.length;
      
      return {
        category,
        total,
        confirmed,
        rate: total > 0 ? (confirmed / total) * 100 : 0,
      };
    });
  }, []);

  const recentResponses = mockRSVPData
    .filter(guest => guest.rsvpDate)
    .sort((a, b) => (b.rsvpDate?.getTime() || 0) - (a.rsvpDate?.getTime() || 0))
    .slice(0, 5);

  const getRSVPStatusBadge = (status: Guest['rsvpStatus']) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Konfirmasi</Badge>;
      case 'declined':
        return <Badge variant="destructive">Tidak Hadir</Badge>;
      case 'maybe':
        return <Badge variant="secondary">Mungkin</Badge>;
      default:
        return <Badge variant="outline">Belum Respon</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard RSVP"
        description="Pantau respons dan konfirmasi kehadiran tamu"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Kelola Tamu', href: '/dashboard/guests' },
          { label: 'Dashboard RSVP' },
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Laporan
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Undangan</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{stats.confirmed}</div>
                <div className="text-sm text-muted-foreground">Konfirmasi</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserX className="h-4 w-4 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{stats.declined}</div>
                <div className="text-sm text-muted-foreground">Tidak Hadir</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Belum Respon</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{stats.responseRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Response Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Timeline Respons (30 Hari Terakhir)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={dailyResponseData}
              xKey="date"
              yKey="responses"
              color="#3b82f6"
              height={300}
            />
          </CardContent>
        </Card>

        {/* RSVP Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status RSVP</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={rsvpDistribution}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Category Analysis and Recent Responses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Analisis per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.category}</span>
                    <span className="text-sm text-muted-foreground">
                      {category.confirmed}/{category.total} ({category.rate.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${category.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Responses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Respons Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentResponses.map((guest) => (
                <div key={guest.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{guest.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {guest.category} • {guest.guestCount} orang
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {guest.rsvpDate?.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div>
                    {getRSVPStatusBadge(guest.rsvpStatus)}
                  </div>
                </div>
              ))}
              
              {recentResponses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Belum ada respons terbaru</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan RSVP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.totalGuestCount}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Tamu yang Akan Hadir
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.responseRate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Tingkat Respons
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.pending}
              </div>
              <div className="text-sm text-muted-foreground">
                Menunggu Respons
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}