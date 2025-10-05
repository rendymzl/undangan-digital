import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Send, 
  MessageSquare, 
  Users, 
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { FormField, FormSection } from '@/components/shared/Forms';
import { toast } from 'sonner';
import { useInvitationSending } from './hooks';
import type { Guest } from '@/types/guest';

// Mock data
const mockGuests: Guest[] = [
  {
    id: '1',
    name: 'Ahmad Rizki',
    phone: '+62812345678',
    category: 'Keluarga',
    rsvpStatus: 'pending',
    guestCount: 2,
    invitationSent: false,
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    phone: '+62823456789',
    category: 'Teman',
    rsvpStatus: 'pending',
    guestCount: 1,
    invitationSent: true,
    invitationSentDate: new Date('2024-01-12'),
  },
  {
    id: '3',
    name: 'Budi Santoso',
    phone: '+62834567890',
    category: 'Kerja',
    rsvpStatus: 'pending',
    guestCount: 1,
    invitationSent: false,
  },
];

const defaultMessage = `Assalamualaikum/Selamat pagi,

Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir dalam acara pernikahan kami:

👰🤵 [Nama Mempelai]
📅 [Tanggal Acara]
🕐 [Waktu Acara]
📍 [Lokasi Acara]

Kehadiran dan doa restu Anda sangat berarti bagi kami.

Untuk informasi lengkap dan konfirmasi kehadiran, silakan klik link berikut:
[Link Undangan]

Terima kasih 🙏

Salam hangat,
[Nama Pengirim]`;

export default function SendInvitationPage() {
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [message, setMessage] = useState(defaultMessage);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const {
    isSending,
    sendingProgress,
    lastResult: sentResults,
    sendBulkInvitations,
    sendToGuest,
  } = useInvitationSending();

  const categories = ['all', 'Keluarga', 'Teman', 'Kerja'];

  const filteredGuests = useMemo(() => {
    return mockGuests.filter(guest => {
      const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           guest.phone?.includes(searchQuery);
      const matchesCategory = selectedCategory === 'all' || guest.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const eligibleGuests = filteredGuests.filter(guest => guest.phone && !guest.invitationSent);
  const alreadySentGuests = filteredGuests.filter(guest => guest.invitationSent);

  const stats = {
    total: filteredGuests.length,
    eligible: eligibleGuests.length,
    selected: selectedGuests.length,
    alreadySent: alreadySentGuests.length,
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGuests(eligibleGuests.map(g => g.id));
    } else {
      setSelectedGuests([]);
    }
  };

  const handleGuestSelect = (guestId: string, checked: boolean) => {
    if (checked) {
      setSelectedGuests(prev => [...prev, guestId]);
    } else {
      setSelectedGuests(prev => prev.filter(id => id !== guestId));
    }
  };

  const handleSendInvitations = async () => {
    if (selectedGuests.length === 0) {
      toast.error('Pilih minimal satu tamu untuk mengirim undangan');
      return;
    }

    const selectedGuestData = eligibleGuests.filter(g => selectedGuests.includes(g.id));
    
    await sendBulkInvitations({
      message,
      recipients: selectedGuestData,
    });
  };

  const handleSendToGuest = async (guest: Guest) => {
    await sendToGuest(guest, message);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kirim Undangan WhatsApp"
        description="Kirim undangan digital kepada tamu melalui WhatsApp"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Kelola Tamu', href: '/dashboard/guests' },
          { label: 'Kirim Undangan' },
        ]}
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <MessageSquare className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{stats.eligible}</div>
                <div className="text-sm text-muted-foreground">Siap Dikirim</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{stats.selected}</div>
                <div className="text-sm text-muted-foreground">Terpilih</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{stats.alreadySent}</div>
                <div className="text-sm text-muted-foreground">Sudah Terkirim</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Composer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Pesan Undangan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              label="Template Pesan WhatsApp"
              description="Gunakan placeholder seperti [Nama Mempelai], [Tanggal Acara], dll."
            >
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={12}
                placeholder="Tulis pesan undangan..."
              />
            </FormField>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Pesan akan dipersonalisasi untuk setiap tamu. Placeholder akan diganti dengan data sebenarnya.
              </AlertDescription>
            </Alert>

            <div className="flex items-center space-x-2">
              <Button
                onClick={handleSendInvitations}
                disabled={selectedGuests.length === 0 || isSending}
                className="flex-1"
              >
                {isSending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Mengirim... ({Math.round(sendingProgress)}%)
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Kirim ke {selectedGuests.length} Tamu
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Guest Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Pilih Penerima</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari nama atau nomor telepon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
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

            {/* Select All */}
            {eligibleGuests.length > 0 && (
              <div className="flex items-center space-x-2 p-3 border rounded-lg bg-muted/50">
                <Checkbox
                  checked={selectedGuests.length === eligibleGuests.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  Pilih Semua ({eligibleGuests.length} tamu)
                </span>
              </div>
            )}

            {/* Guest List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredGuests.map((guest) => {
                const isEligible = guest.phone && !guest.invitationSent;
                const isSelected = selectedGuests.includes(guest.id);
                
                return (
                  <div
                    key={guest.id}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      !isEligible ? 'opacity-50 bg-muted/30' : 'hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {isEligible && (
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleGuestSelect(guest.id, checked)}
                        />
                      )}
                      <div>
                        <div className="font-medium">{guest.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center space-x-2">
                          <span>{guest.category}</span>
                          {guest.phone && (
                            <>
                              <span>•</span>
                              <span className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {guest.phone}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {guest.invitationSent ? (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Terkirim
                        </Badge>
                      ) : !guest.phone ? (
                        <Badge variant="destructive" className="text-xs">
                          No WhatsApp
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendToGuest(guest)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {filteredGuests.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Tidak ada tamu ditemukan</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sending Results */}
      {sentResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Hasil Pengiriman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg bg-green-50">
                <div className="text-2xl font-bold text-green-600">
                  {sentResults.success.length}
                </div>
                <div className="text-sm text-green-700">Berhasil Dikirim</div>
              </div>
              
              <div className="text-center p-4 border rounded-lg bg-red-50">
                <div className="text-2xl font-bold text-red-600">
                  {sentResults.failed.length}
                </div>
                <div className="text-sm text-red-700">Gagal Dikirim</div>
              </div>
            </div>
            
            {sentResults.failed.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2 text-red-600">Gagal Dikirim:</h4>
                <div className="space-y-1">
                  {sentResults.failed.map((failure) => {
                    const guest = mockGuests.find(g => g.id === failure.guestId);
                    return (
                      <div key={failure.guestId} className="text-sm text-red-600">
                        • {guest?.name}: {failure.error}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}