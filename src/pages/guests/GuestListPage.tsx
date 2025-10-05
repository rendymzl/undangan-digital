import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Users,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  Edit,
  Trash2,
  MessageSquare,
  Send
} from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/layout/PageHeader';
import { AddGuestModal, BulkImportModal } from './components';
import { useGuestManagement } from './hooks';
import type { Guest } from '@/types/guest';

// Mock data for demonstration
const mockGuests: Guest[] = [
  {
    id: '1',
    name: 'Ahmad Rizki',
    email: 'ahmad.rizki@email.com',
    phone: '+62812345678',
    address: 'Jakarta Selatan',
    category: 'Keluarga',
    rsvpStatus: 'confirmed',
    rsvpDate: new Date('2024-01-15'),
    guestCount: 2,
    dietaryRestrictions: 'Vegetarian',
    notes: 'Datang dengan istri',
    invitationSent: true,
    invitationSentDate: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    email: 'siti.nur@email.com',
    phone: '+62823456789',
    address: 'Bandung',
    category: 'Teman',
    rsvpStatus: 'pending',
    guestCount: 1,
    notes: 'Teman kuliah',
    invitationSent: true,
    invitationSentDate: new Date('2024-01-12'),
  },
  {
    id: '3',
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    phone: '+62834567890',
    address: 'Surabaya',
    category: 'Kerja',
    rsvpStatus: 'declined',
    rsvpDate: new Date('2024-01-18'),
    guestCount: 0,
    notes: 'Rekan kerja',
    invitationSent: true,
    invitationSentDate: new Date('2024-01-08'),
  },
];

export default function GuestListPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const {
    guests,
    selectedGuests,
    searchQuery,
    selectedCategory,
    isLoading,
    stats,
    categories,
    addGuest,
    updateGuest,
    deleteGuest,
    bulkDeleteGuests,
    bulkImportGuests,
    sendInvitations,
    exportGuests,
    setSelectedGuests,
    setSearchQuery,
    setSelectedCategory,
  } = useGuestManagement({
    initialGuests: mockGuests,
  });

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

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setIsAddModalOpen(true);
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (window.confirm('Yakin ingin menghapus tamu ini?')) {
      await deleteGuest(guestId);
    }
  };

  const handleSaveGuest = async (guestData: Omit<Guest, 'id'>) => {
    if (editingGuest) {
      await updateGuest(editingGuest.id, guestData);
      setEditingGuest(null);
    } else {
      await addGuest(guestData);
    }
    setIsAddModalOpen(false);
  };

  const handleBulkAction = async (action: 'send' | 'delete') => {
    if (selectedGuests.length === 0) return;

    if (action === 'send') {
      await sendInvitations(selectedGuests);
    } else if (action === 'delete') {
      if (window.confirm(`Yakin ingin menghapus ${selectedGuests.length} tamu?`)) {
        await bulkDeleteGuests(selectedGuests);
      }
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Nama',
      render: (guest: Guest) => (
        <div>
          <div className="font-medium">{guest.name}</div>
          <div className="text-sm text-muted-foreground">{guest.category}</div>
        </div>
      ),
    },
    {
      key: 'contact',
      title: 'Kontak',
      render: (guest: Guest) => (
        <div className="space-y-1">
          {guest.email && (
            <div className="flex items-center text-sm">
              <Mail className="h-3 w-3 mr-1" />
              {guest.email}
            </div>
          )}
          {guest.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-3 w-3 mr-1" />
              {guest.phone}
            </div>
          )}
          {guest.address && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {guest.address}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'rsvp',
      title: 'RSVP',
      render: (guest: Guest) => (
        <div className="space-y-1">
          {getRSVPStatusBadge(guest.rsvpStatus)}
          <div className="text-sm text-muted-foreground">
            {guest.guestCount} orang
          </div>
          {guest.rsvpDate && (
            <div className="text-xs text-muted-foreground">
              {guest.rsvpDate.toLocaleDateString('id-ID')}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'invitation',
      title: 'Undangan',
      render: (guest: Guest) => (
        <div className="space-y-1">
          {guest.invitationSent ? (
            <Badge variant="outline" className="text-xs">
              Terkirim
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              Belum Terkirim
            </Badge>
          )}
          {guest.invitationSentDate && (
            <div className="text-xs text-muted-foreground">
              {guest.invitationSentDate.toLocaleDateString('id-ID')}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Aksi',
      render: (guest: Guest) => (
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleEditGuest(guest)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => sendInvitations([guest.id])}
            disabled={guest.invitationSent}
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-destructive"
            onClick={() => handleDeleteGuest(guest.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Tamu"
        description="Kelola daftar tamu undangan Anda"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Kelola Tamu' },
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportGuests('csv')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsImportModalOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button 
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Tamu
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
                <div className="text-sm text-muted-foreground">Total Tamu</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4 text-green-600" />
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
              <Users className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-red-600" />
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
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{stats.totalGuestCount}</div>
                <div className="text-sm text-muted-foreground">Total Orang</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar Tamu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari nama, email, atau nomor telepon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex space-x-1">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'Semua' : category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Menampilkan {guests.length} tamu
            </div>
            
            {selectedGuests.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {selectedGuests.length} terpilih
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('send')}
                  disabled={isLoading}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Kirim Undangan
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive"
                  onClick={() => handleBulkAction('delete')}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Hapus
                </Button>
              </div>
            )}
          </div>

          {/* Guest Table */}
          <DataTable
            data={guests}
            columns={columns}
            selectedRows={selectedGuests}
            onSelectionChange={setSelectedGuests}
            emptyMessage="Tidak ada tamu ditemukan"
            loading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <AddGuestModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingGuest(null);
        }}
        onSave={handleSaveGuest}
        initialData={editingGuest || undefined}
        title={editingGuest ? 'Edit Tamu' : 'Tambah Tamu Baru'}
      />

      <BulkImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={bulkImportGuests}
      />
    </div>
  );
}