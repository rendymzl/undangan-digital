import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

export interface Transaction {
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

export interface TransactionFilters {
  search: string;
  status: string;
  type: string;
  dateRange: string;
  paymentMethod: string;
}

export interface UseTransactionHistoryOptions {
  userId?: string;
  initialFilters?: Partial<TransactionFilters>;
}

export default function useTransactionHistory({
  userId,
  initialFilters = {},
}: UseTransactionHistoryOptions = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({
    search: '',
    status: 'all',
    type: 'all',
    dateRange: 'all',
    paymentMethod: 'all',
    ...initialFilters,
  });

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

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTransactions(mockTransactions);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(errorMessage);
      toast.error('Gagal memuat riwayat transaksi');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Search filter
      const matchesSearch = filters.search === '' || 
        transaction.planName.toLowerCase().includes(filters.search.toLowerCase()) ||
        transaction.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        transaction.description.toLowerCase().includes(filters.search.toLowerCase());
      
      // Status filter
      const matchesStatus = filters.status === 'all' || transaction.status === filters.status;
      
      // Type filter
      const matchesType = filters.type === 'all' || transaction.type === filters.type;
      
      // Payment method filter
      const matchesPaymentMethod = filters.paymentMethod === 'all' || 
        transaction.paymentMethod === filters.paymentMethod;
      
      // Date range filter
      let matchesDate = true;
      if (filters.dateRange !== 'all') {
        const now = new Date();
        const transactionDate = transaction.transactionDate;
        
        switch (filters.dateRange) {
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
      
      return matchesSearch && matchesStatus && matchesType && matchesPaymentMethod && matchesDate;
    });
  }, [transactions, filters]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = filteredTransactions.length;
    const totalAmount = filteredTransactions
      .filter(t => t.status === 'success')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const successCount = filteredTransactions.filter(t => t.status === 'success').length;
    const pendingCount = filteredTransactions.filter(t => t.status === 'pending').length;
    const failedCount = filteredTransactions.filter(t => t.status === 'failed').length;
    
    return {
      total,
      totalAmount,
      successCount,
      pendingCount,
      failedCount,
      successRate: total > 0 ? (successCount / total) * 100 : 0,
    };
  }, [filteredTransactions]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<TransactionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'all',
      type: 'all',
      dateRange: 'all',
      paymentMethod: 'all',
    });
  }, []);

  // Download receipt
  const downloadReceipt = useCallback(async (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction || !transaction.receiptUrl) {
      toast.error('Receipt tidak tersedia');
      return;
    }

    try {
      // In a real app, this would download the actual receipt
      window.open(transaction.receiptUrl, '_blank');
      toast.success('Receipt berhasil diunduh');
    } catch (error) {
      toast.error('Gagal mengunduh receipt');
    }
  }, [transactions]);

  // Export transactions
  const exportTransactions = useCallback((format: 'csv' | 'pdf' = 'csv') => {
    try {
      if (format === 'csv') {
        const csvContent = [
          ['Tanggal', 'Invoice', 'Tipe', 'Plan', 'Jumlah', 'Status', 'Metode Pembayaran'].join(','),
          ...filteredTransactions.map(t => [
            t.transactionDate.toLocaleDateString('id-ID'),
            t.invoiceNumber,
            t.type,
            t.planName,
            t.amount,
            t.status,
            t.paymentMethod
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
      }
      
      toast.success('Data berhasil diekspor');
    } catch (error) {
      toast.error('Gagal mengekspor data');
    }
  }, [filteredTransactions]);

  // Retry failed transaction
  const retryTransaction = useCallback(async (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction || transaction.status !== 'failed') {
      toast.error('Transaksi tidak dapat diulang');
      return;
    }

    try {
      setIsLoading(true);
      
      // Mock retry API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update transaction status
      setTransactions(prev => prev.map(t => 
        t.id === transactionId 
          ? { ...t, status: 'pending' as const }
          : t
      ));
      
      toast.success('Transaksi berhasil diulang');
      
    } catch (error) {
      toast.error('Gagal mengulang transaksi');
    } finally {
      setIsLoading(false);
    }
  }, [transactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    // State
    transactions: filteredTransactions,
    allTransactions: transactions,
    isLoading,
    error,
    filters,
    statistics,
    
    // Actions
    fetchTransactions,
    updateFilters,
    clearFilters,
    downloadReceipt,
    exportTransactions,
    retryTransaction,
  };
}