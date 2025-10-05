import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Send,
  Phone
} from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import type { Guest } from '@/types/guest';

interface DeliveryStatus {
  id: string;
  guestId: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failureReason?: string;
  retryCount: number;
}

interface DeliveryTrackingProps {
  guests: Guest[];
  onRetry?: (guestId: string) => void;
  onRefresh?: () => void;
  className?: string;
}

// Mock delivery data
const mockDeliveryData: DeliveryStatus[] = [
  {
    id: '1',
    guestId: '1',
    status: 'read',
    sentAt: new Date('2024-01-15T10:00:00'),
    deliveredAt: new Date('2024-01-15T10:01:00'),
    readAt: new Date('2024-01-15T10:05:00'),
    retryCount: 0,
  },
  {
    id: '2',
    guestId: '2',
    status: 'delivered',
    sentAt: new Date('2024-01-15T10:02:00'),
    deliveredAt: new Date('2024-01-15T10:03:00'),
    retryCount: 0,
  },
  {
    id: '3',
    guestId: '3',
    status: 'failed',
    sentAt: new Date('2024-01-15T10:05:00'),
    failureReason: 'Nomor tidak valid',
    retryCount: 2,
  },
  {
    id: '4',
    guestId: '4',
    status: 'sent',
    sentAt: new Date('2024-01-15T10:10:00'),
    retryCount: 0,
  },
];

export default function DeliveryTrackingComponent({
  guests,
  onRetry,
  onRefresh,
  className,
}: DeliveryTrackingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'sent', label: 'Terkirim' },
    { value: 'delivered', label: 'Tersampaikan' },
    { value: 'read', label: 'Dibaca' },
    { value: 'failed', label: 'Gagal' },
  ];

  // Combine guest data with delivery status
  const deliveryData = useMemo(() => {
    return guests
      .filter(guest => guest.invitationSent)
      .map(guest => {
        const delivery = mockDeliveryData.find(d => d.guestId === guest.id);
        return {
          ...guest,
          delivery,
        };
      });
  }, [guests]);

  // Filter data
  const filteredData = useMemo(() => {
    return deliveryData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.phone?.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || item.delivery?.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [deliveryData, searchQuery, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = deliveryData.length;
    const sent = deliveryData.filter(d => d.delivery?.status === 'sent').length;
    const delivered = deliveryData.filter(d => d.delivery?.status === 'delivered').length;
    const read = deliveryData.filter(d => d.delivery?.status === 'read').length;
    const failed = deliveryData.filter(d => d.delivery?.status === 'failed').length;
    
    return { total, sent, delivered, read, failed };
  }, [deliveryData]);

  const getStatusBadge = (status?: DeliveryStatus['status']) => {
    switch (status) {
      case 'sent':
        return (
          <Badge variant="secondary" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Terkirim
          </Badge>
        );
      case 'delivered':
        return (
          <Badge className="bg-blue-100 text-blue-800 text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Tersampaikan
          </Badge>
        );
      case 'read':
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            <Eye className="h-3 w-3 mr-1" />
            Dibaca
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            Gagal
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Belum Dikirim
          </Badge>
        );
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '-';
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setIsRefreshing(false);
    }
  };

  const columns = [
    {
      key: 'guest',
      title: 'Tamu',
      render: (item: any) => (
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-sm text-muted-foreground flex items-center">
            <Phone className="h-3 w-3 mr-1" />
            {item.phone}
          </div>
          <div className="text-xs text-muted-foreground">{item.category}</div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (item: any) => (
        <div className="space-y-1">
          {getStatusBadge(item.delivery?.status)}
          {item.delivery?.retryCount > 0 && (
            <div className="text-xs text-muted-foreground">
              Retry: {item.delivery.retryCount}x
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'timeline',
      title: 'Timeline',
      render: (item: any) => {
        const delivery = item.delivery;
        if (!delivery) return <span className="text-muted-foreground">-</span>;
        
        return (
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <Send className="h-3 w-3 text-blue-600" />
              <span>Dikirim: {formatTime(delivery.sentAt)}</span>
            </div>
            {delivery.deliveredAt && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Tersampaikan: {formatTime(delivery.deliveredAt)}</span>
              </div>
            )}
            {delivery.readAt && (
              <div className="flex items-center space-x-2">
                <Eye className="h-3 w-3 text-purple-600" />
                <span>Dibaca: {formatTime(delivery.readAt)}</span>
              </div>
            )}
            {delivery.failureReason && (
              <div className="text-red-600">
                Error: {delivery.failureReason}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      title: 'Aksi',
      render: (item: any) => (
        <div className="flex items-center space-x-1">
          {item.delivery?.status === 'failed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRetry?.(item.id)}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Open WhatsApp chat
              const phoneNumber = item.phone?.replace(/[^\d]/g, '');
              window.open(`https://wa.me/${phoneNumber}`, '_blank');
            }}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={className}>
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
            <div className="text-sm text-muted-foreground">Terkirim</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-sm text-muted-foreground">Tersampaikan</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.read}</div>
            <div className="text-sm text-muted-foreground">Dibaca</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-sm text-muted-foreground">Gagal</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Status Pengiriman
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari nama atau nomor telepon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex space-x-1">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={statusFilter === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DataTable
            data={filteredData}
            columns={columns}
            emptyMessage="Tidak ada data pengiriman ditemukan"
          />
        </CardContent>
      </Card>
    </div>
  );
}