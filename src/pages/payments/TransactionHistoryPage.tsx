import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  Download, 
  Search, 
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  X,
  AlertCircle,
  Receipt,
  RefreshCw,
  Eye
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/shared/DataTable';

interface Transaction {
  id: string;
  type: 'subscription' | 'upgrade' | 'renewal' | 'refund';
  planName: string;
  amount: number;
  status: 'success' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'bank_transfer' | 'credit_card' | 'e_wallet' | 'qris';
  transactionDate: Date;
  description: string;
  invoiceNumber: string;
  receiptUrl?: string;
}

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    type: 'subscription',
    planName: 'Premium Plan',
    amount: 49000,
    status: 'success',
    paymentMethod: 'bank_transfer',
    transactionDate: new Date('2024-01-15T10:30:00'),
    description: 'Subscription Premium Plan - 30 hari',
    invoiceNumber: 'INV-2024-001',
    receiptUrl: '/receipts/inv-2024-001.pdf',
  },
  {
    id: 'txn_002',
    type: 'renewal',
    planName: 'Premium Plan',
    amount: 49000,
    status: 'success',
    paymentMethod: 'e_wallet',
    transactionDate: new Date('2024-01-01T09:15:00'),
    description: 'Renewal Premium Plan - 30 hari',
    invoiceNumber: 'INV-2024-002',
    receiptUrl: '/receipts/inv-2024-002.pdf',
  },
  {
    id: 'txn_003',
    type: 'upgrade',
    planName: 'Ultimate Plan',
    amount: 89000,
    status: 'pending',
    paymentMethod: 'bank_transfer',
    transactionDate: new Date('2024-01-20T14:45:00'),
    description: 'Upgrade ke Ultimate Plan - 60 hari',
    invoiceNumber: 'INV-2024-003',
  },
  {
    id: 'txn_004',
    type: 'subscription',
    planName: 'Premium Plan',
    amount: 49000,
    status: 'failed',
    paymentMethod: 'credit_card',
    transactionDate: new Date('2023-12-15T16:20:00'),
    description: 'Subscription Premium Plan - 30 hari',
    invoiceNumber: 'INV-2023-045',
  },
  {
    id: 'txn_005',
    type: 'refund',
    planName: 'Ultimate Plan',
    amount: -89000,
    status: 'refunded',
    paymentMethod: 'bank_transfer',
    transactionDate: new Date('2023-12-01T11:10:00'),
    description: 'Refund Ultimate Plan',
    invoiceNumber: 'REF-2023-001',
  },
];

export default function TransactionHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'success', label: 'Berhasil' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Gagal' },
    { value: 'refunded', label: 'Refund' },
  ];

  const typeOptions = [
    { value: 'all', label: 'Semua Tipe' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'renewal', label: 'Renewal' },
    { value: 'upgrade', label: 'Upgrade' },
    { value: 'refund', label: 'Refund' },
  ];

  const dateOptions = [
    { value: 'all', label: 'Semua Waktu' },
    { value: '7d', label: '7 Hari Terakhir' },
    { value: '30d', label: '30 Hari Terakhir' },
    { value: '90d', label: '90 Hari Terakhir' },
    { value: '1y', label: '1 Tahun Terakhir' },
  ];

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(transaction => {
      const matchesSearch = transaction.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      
      let matchesDate = true;
      if (dateRange !== 'all') {
        const now = new Date();
        const transactionDate = transaction.transactionDate;
        
        switch (dateRange) {
          case '7d':
            matchesDate = (now.getTime() - transactionDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
            break;
          case '30d':
            matchesDate = (now.getTime() - transactionDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
            break;
          case '90d':
            matchesDate = (now.getTime() - transactionDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
            break;
          case '1y':
            matchesDate = (now.getTime() - transactionDate.getTime()) <= 365 * 24 * 60 * 60 * 1000;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [searchQuery, statusFilter, typeFilter, dateRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredTransactions.length;
    const totalAmount = filteredTransactions
      .filter(t => t.status === 'success')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const successCount = filteredTransactions.filter(t => t.status === 'success').length;
    const pendingCount = filteredTransactions.filter(t => t.status === 'pending').length;
    
    return { total, totalAmount, successCount, pendingCount };
  }, [filteredTransactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Berhasil</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Gagal</Badge>;
      case 'refunded':
        return <Badge className="bg-orange-100 text-orange-800">Refund</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'subscription':
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'renewal':
        return <RefreshCw className="h-4 w-4 text-green-600" />;
      case 'upgrade':
        return <CheckCircle className="h-4 w-4 text-purple-600" />;
      case 'refund':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPaymentMethodLabel = (method: Transaction['paymentMethod']) => {
    switch (method) {
      case 'bank_transfer':
        return 'Transfer Bank';
      case 'credit_card':
        return 'Kartu Kredit';
      case 'e_wallet':
        return 'E-Wallet';
      case 'qris':
        return 'QRIS';
      default:
        return method;
    }
  };

  const handleDownloadReceipt = (transaction: Transaction) => {
    if (transaction.receiptUrl) {
      // In a real app, this would download the actual receipt
      window.open(transaction.receiptUrl, '_blank');
    }
  };

  const handleExportData = () => {
    // Export filtered transactions to CSV
    const csvContent = [
      ['Tanggal', 'Invoice', 'Tipe', 'Plan', 'Jumlah', 'Status', 'Metode Pembayaran'].join(','),
      ...filteredTransactions.map(t => [
        t.transactionDate.toLocaleDateString('id-ID'),
        t.invoiceNumber,
        t.type,
        t.planName,
        t.amount,
        t.status,
        getPaymentMethodLabel(t.paymentMethod)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaction-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      key: 'transaction',
      title: 'Transaksi',
      render: (transaction: Transaction) => (
        <div className="flex items-start space-x-3">
          {getTypeIcon(transaction.type)}
          <div>
            <div className="font-medium">{transaction.planName}</div>
            <div className="text-sm text-muted-foreground">{transaction.description}</div>
            <div className="text-xs text-muted-foreground">{transaction.invoiceNumber}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      title: 'Jumlah',
      render: (transaction: Transaction) => (
        <div className="text-right">
          <div className={`font-medium ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {transaction.amount < 0 ? '-' : ''}{formatCurrency(transaction.amount)}
          </div>
          <div className="text-xs text-muted-foreground">
            {getPaymentMethodLabel(transaction.paymentMethod)}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (transaction: Transaction) => (
        <div className="space-y-1">
          {getStatusBadge(transaction.status)}
          <div className="text-xs text-muted-foreground">
            {transaction.transactionDate.toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Aksi',
      render: (transaction: Transaction) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDownloadReceipt(transaction)}
            disabled={!transaction.receiptUrl}
          >
            <Receipt className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Transaksi"
        description="Lihat semua transaksi dan pembayaran Anda"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Pembayaran', href: '/dashboard/payments' },
          { label: 'Riwayat Transaksi' },
        ]}
        actions={
          <Button onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Transaksi</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{stats.successCount}</div>
                <div className="text-sm text-muted-foreground">Berhasil</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{stats.pendingCount}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
                <div className="text-sm text-muted-foreground">Total Pembayaran</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari invoice, plan, atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex space-x-1">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  {dateOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <DataTable
            data={filteredTransactions}
            columns={columns}
            emptyMessage="Tidak ada transaksi ditemukan"
          />
        </CardContent>
      </Card>
    </div>
  );
}