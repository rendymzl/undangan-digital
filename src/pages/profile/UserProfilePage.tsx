import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Edit, Camera, Shield, Bell, Settings } from 'lucide-react';
import { ProfileEditModal } from './components/ProfileEditModal';
import { AvatarUploadModal } from './components/AvatarUploadModal';
import { useProfile } from './hooks/useProfile';

export const UserProfilePage: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const { profile, isLoading, updateProfile } = useProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const completionPercentage = calculateProfileCompletion(profile);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profil Saya"
        description="Kelola informasi pribadi dan preferensi akun Anda"
      />

      {/* Profile Completion Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Kelengkapan Profil
          </CardTitle>
          <CardDescription>
            Lengkapi profil Anda untuk pengalaman yang lebih baik
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="w-full" />
            {completionPercentage < 100 && (
              <div className="text-sm text-muted-foreground">
                Lengkapi informasi yang masih kosong untuk mendapatkan fitur lengkap
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto w-24 h-24 mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile?.avatar} alt={profile?.firstName} />
                  <AvatarFallback className="text-lg">
                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={() => setIsAvatarModalOpen(true)}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle>{profile?.firstName} {profile?.lastName}</CardTitle>
              <CardDescription>{profile?.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status Akun</span>
                <Badge variant="default">Aktif</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Member Sejak</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(profile?.createdAt || Date.now()).toLocaleDateString('id-ID')}
                </span>
              </div>
              <Button 
                className="w-full" 
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profil
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="contact">Kontak</TabsTrigger>
              <TabsTrigger value="preferences">Preferensi</TabsTrigger>
              <TabsTrigger value="activity">Aktivitas</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nama Depan</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile?.firstName || 'Belum diisi'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Nama Belakang</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile?.lastName || 'Belum diisi'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {profile?.bio || 'Belum ada bio'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Tanggal Lahir</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile?.birthDate ? new Date(profile.birthDate).toLocaleDateString('id-ID') : 'Belum diisi'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Jenis Kelamin</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile?.gender || 'Belum diisi'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Kontak</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground mt-1">{profile?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nomor Telepon</label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {profile?.phone || 'Belum diisi'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Alamat</label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {profile?.address || 'Belum diisi'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Kota</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile?.city || 'Belum diisi'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Kode Pos</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile?.postalCode || 'Belum diisi'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preferensi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Bahasa</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile?.language || 'Bahasa Indonesia'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Zona Waktu</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile?.timezone || 'Asia/Jakarta'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tema</label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {profile?.theme || 'Sistem'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Aktivitas Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Profil diperbarui</p>
                        <p className="text-xs text-muted-foreground">2 jam yang lalu</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Login dari perangkat baru</p>
                        <p className="text-xs text-muted-foreground">1 hari yang lalu</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Password diubah</p>
                        <p className="text-xs text-muted-foreground">3 hari yang lalu</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => window.location.href = '/dashboard/keamanan'}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Keamanan</h3>
              <p className="text-sm text-muted-foreground">Kelola password & 2FA</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => window.location.href = '/dashboard/notifikasi'}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Bell className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Notifikasi</h3>
              <p className="text-sm text-muted-foreground">Atur preferensi notifikasi</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => window.location.href = '/dashboard/bantuan'}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Bantuan</h3>
              <p className="text-sm text-muted-foreground">FAQ & Tutorial</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={updateProfile}
      />

      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={profile?.avatar}
        onSave={(avatarUrl) => updateProfile({ avatar: avatarUrl })}
      />
    </div>
  );
};

// Helper function to calculate profile completion
function calculateProfileCompletion(profile: any): number {
  if (!profile) return 0;
  
  const fields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'address',
    'city',
    'birthDate',
    'bio',
    'avatar'
  ];
  
  const filledFields = fields.filter(field => profile[field] && profile[field].trim() !== '');
  return Math.round((filledFields.length / fields.length) * 100);
}