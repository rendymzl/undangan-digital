import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { Guest } from '@/types/guest';

export interface UseGuestManagementOptions {
  initialGuests?: Guest[];
  onGuestAdd?: (guest: Guest) => void;
  onGuestUpdate?: (guest: Guest) => void;
  onGuestDelete?: (guestId: string) => void;
  onBulkImport?: (guests: Guest[]) => void;
}

export default function useGuestManagement({
  initialGuests = [],
  onGuestAdd,
  onGuestUpdate,
  onGuestDelete,
  onBulkImport,
}: UseGuestManagementOptions = {}) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Filter guests based on search and category
  const filteredGuests = useMemo(() => {
    return guests.filter(guest => {
      const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           guest.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           guest.phone?.includes(searchQuery);
      const matchesCategory = selectedCategory === 'all' || guest.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [guests, searchQuery, selectedCategory]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: guests.length,
      confirmed: guests.filter(g => g.rsvpStatus === 'confirmed').length,
      pending: guests.filter(g => g.rsvpStatus === 'pending').length,
      declined: guests.filter(g => g.rsvpStatus === 'declined').length,
      maybe: guests.filter(g => g.rsvpStatus === 'maybe').length,
      totalGuestCount: guests.reduce((sum, g) => sum + g.guestCount, 0),
      invitationsSent: guests.filter(g => g.invitationSent).length,
    };
  }, [guests]);

  // Add new guest
  const addGuest = useCallback(async (guestData: Omit<Guest, 'id'>) => {
    setIsLoading(true);
    try {
      const newGuest: Guest = {
        ...guestData,
        id: Date.now().toString(), // In real app, this would come from API
      };

      setGuests(prev => [...prev, newGuest]);
      onGuestAdd?.(newGuest);
      
      toast.success('Tamu berhasil ditambahkan');
    } catch (error) {
      toast.error('Gagal menambahkan tamu');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [onGuestAdd]);

  // Update guest
  const updateGuest = useCallback(async (guestId: string, updates: Partial<Guest>) => {
    setIsLoading(true);
    try {
      setGuests(prev => prev.map(guest => 
        guest.id === guestId ? { ...guest, ...updates } : guest
      ));

      const updatedGuest = guests.find(g => g.id === guestId);
      if (updatedGuest) {
        onGuestUpdate?.({ ...updatedGuest, ...updates });
      }
      
      toast.success('Data tamu berhasil diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui data tamu');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [guests, onGuestUpdate]);

  // Delete guest
  const deleteGuest = useCallback(async (guestId: string) => {
    setIsLoading(true);
    try {
      setGuests(prev => prev.filter(guest => guest.id !== guestId));
      setSelectedGuests(prev => prev.filter(id => id !== guestId));
      
      onGuestDelete?.(guestId);
      toast.success('Tamu berhasil dihapus');
    } catch (error) {
      toast.error('Gagal menghapus tamu');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [onGuestDelete]);

  // Bulk delete guests
  const bulkDeleteGuests = useCallback(async (guestIds: string[]) => {
    setIsLoading(true);
    try {
      setGuests(prev => prev.filter(guest => !guestIds.includes(guest.id)));
      setSelectedGuests([]);
      
      toast.success(`${guestIds.length} tamu berhasil dihapus`);
    } catch (error) {
      toast.error('Gagal menghapus tamu');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Bulk import guests
  const bulkImportGuests = useCallback(async (guestDataList: Omit<Guest, 'id'>[]) => {
    setIsLoading(true);
    try {
      const newGuests: Guest[] = guestDataList.map((guestData, index) => ({
        ...guestData,
        id: (Date.now() + index).toString(), // In real app, this would come from API
      }));

      setGuests(prev => [...prev, ...newGuests]);
      onBulkImport?.(newGuests);
      
      toast.success(`${newGuests.length} tamu berhasil diimpor`);
    } catch (error) {
      toast.error('Gagal mengimpor tamu');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [onBulkImport]);

  // Send invitations to selected guests
  const sendInvitations = useCallback(async (guestIds: string[]) => {
    setIsLoading(true);
    try {
      const currentDate = new Date();
      
      setGuests(prev => prev.map(guest => 
        guestIds.includes(guest.id) 
          ? { 
              ...guest, 
              invitationSent: true, 
              invitationSentDate: currentDate 
            }
          : guest
      ));
      
      toast.success(`Undangan berhasil dikirim ke ${guestIds.length} tamu`);
    } catch (error) {
      toast.error('Gagal mengirim undangan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Export guests data
  const exportGuests = useCallback((format: 'csv' | 'excel' = 'csv') => {
    try {
      const headers = [
        'Nama',
        'Email', 
        'Telepon',
        'Alamat',
        'Kategori',
        'Status RSVP',
        'Jumlah Tamu',
        'Pantangan Makanan',
        'Catatan',
        'Undangan Terkirim',
        'Tanggal RSVP'
      ];

      const csvContent = [
        headers.join(','),
        ...filteredGuests.map(guest => [
          guest.name,
          guest.email || '',
          guest.phone || '',
          guest.address || '',
          guest.category,
          guest.rsvpStatus,
          guest.guestCount,
          guest.dietaryRestrictions || '',
          guest.notes || '',
          guest.invitationSent ? 'Ya' : 'Tidak',
          guest.rsvpDate ? guest.rsvpDate.toLocaleDateString('id-ID') : ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `daftar-tamu-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Data tamu berhasil diekspor');
    } catch (error) {
      toast.error('Gagal mengekspor data tamu');
      console.error('Export error:', error);
    }
  }, [filteredGuests]);

  // Get categories from guests
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(guests.map(g => g.category)));
    return ['all', ...uniqueCategories];
  }, [guests]);

  return {
    // State
    guests: filteredGuests,
    allGuests: guests,
    selectedGuests,
    searchQuery,
    selectedCategory,
    isLoading,
    stats,
    categories,

    // Actions
    addGuest,
    updateGuest,
    deleteGuest,
    bulkDeleteGuests,
    bulkImportGuests,
    sendInvitations,
    exportGuests,

    // Setters
    setSelectedGuests,
    setSearchQuery,
    setSelectedCategory,
  };
}