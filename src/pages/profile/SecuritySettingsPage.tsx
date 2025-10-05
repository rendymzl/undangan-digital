import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Key, 
  Smartphone, 
  Eye, 
  EyeOff, 
  History, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Monitor,
  Trash2,
  Download
} from 'lucide-react';
import { PasswordChangeModal } from './components/PasswordChangeModal';
import { TwoFactorSetupModal } from './components/TwoFactorSetupModal';
import { useSecurity } from './hooks/useSecurity';
import { toast } from '@/services/shared/toastService';

export const SecuritySettingsPage: React.FC = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  
  const { 
    securitySettings, 
    loginHistory, 
    isLoading, 
    updateSecuritySettings,
    changePassword,
    enableTwoFactor,
    disableTwoFactor,
    terminateSession,
    exportData,
    deleteAccount
  } = useSecurity();

  const handlePasswordChange = async (data: { currentPassword: string; newPassword: string }) => {
    try {
      await changePassword(data);
      setIsPasswordModalOpen(false);
      toast.success('Password berhasil diubah');
    } catch (error) {
      toast.error('Gagal mengubah password');
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    if (enabled) {
      setIsTwoFactorModalOpen(true);
    } else {
      try {
        await disableTwoFactor();
        toast.success('Two-factor authentication berhasil dinonaktifkan');
      } catch (error) {
        toast.error('Gagal menonaktifkan two-factor authentication');
      }
    }
  };

  const handleExportData = async () => {
    try {
      await exportData();
      toast.success('Data berhasil diekspor. Link download akan dikirim ke email Anda.');
    } catch (error) {
      toast.error('Gagal mengekspor data');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.'
    );
    
    if (confirmed) {
      const password = window.prompt('Masukkan password untuk konfirmasi:');
      if (password) {
        try {
          await deleteAccount(password);
          toast.success('Permintaan penghapusan akun berhasil dikirim');
        } catch (error) {
          toast.error('Gagal menghapus akun');
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Keamanan & Privasi"
        description="Kelola pengaturan keamanan dan privasi akun Anda"
      />

      <Tabs defaultValue="security" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="security">Keamanan</TabsTrigger>
          <TabsTrigger value="privacy">Privasi</TabsTrigger>
          <TabsTrigger value="sessions">Sesi Login</TabsTrigger>
          <TabsTrigger value="data">Data & Akun</TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-4">
          {/* Password Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Password & Autentikasi
              </CardTitle>
              <CardDescription>
                Kelola password dan metode autentikasi akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Terakhir diubah: {new Date(securitySettings?.lastPasswordChange || Date.now()).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <Button onClick={() => setIsPasswordModalOpen(true)}>
                  Ubah Password
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Tambahkan lapisan keamanan ekstra dengan 2FA
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={securitySettings?.twoFactorEnabled ? "default" : "secondary"}>
                    {securitySettings?.twoFactorEnabled ? "Aktif" : "Nonaktif"}
                  </Badge>
                  <Switch
                    checked={securitySettings?.twoFactorEnabled || false}
                    onCheckedChange={handleTwoFactorToggle}
                  />
                </div>
              </div>

              {securitySettings?.twoFactorEnabled && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Two-Factor Authentication Aktif</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Akun Anda dilindungi dengan autentikasi dua faktor
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Status Keamanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Email Terverifikasi</p>
                      <p className="text-sm text-green-700">Email Anda sudah terverifikasi</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-orange-800">Nomor Telepon Belum Terverifikasi</p>
                      <p className="text-sm text-orange-700">Verifikasi nomor telepon untuk keamanan tambahan</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Verifikasi
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          {/* Privacy Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Kontrol Privasi
              </CardTitle>
              <CardDescription>
                Atur siapa yang dapat melihat informasi Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Profil Publik</h4>
                  <p className="text-sm text-muted-foreground">
                    Izinkan orang lain melihat profil dasar Anda
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Tampilkan Status Online</h4>
                  <p className="text-sm text-muted-foreground">
                    Tampilkan kapan Anda terakhir online
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Izinkan Pencarian Email</h4>
                  <p className="text-sm text-muted-foreground">
                    Orang lain dapat menemukan Anda melalui email
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Analitik & Tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    Izinkan pengumpulan data untuk meningkatkan layanan
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Data Visibility */}
          <Card>
            <CardHeader>
              <CardTitle>Visibilitas Data</CardTitle>
              <CardDescription>
                Kontrol data mana yang dapat dilihat oleh orang lain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Nama Lengkap</span>
                  <Badge variant="default">Publik</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email</span>
                  <Badge variant="secondary">Privat</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Nomor Telepon</span>
                  <Badge variant="secondary">Privat</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tanggal Bergabung</span>
                  <Badge variant="outline">Terbatas</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Sesi Login Aktif
              </CardTitle>
              <CardDescription>
                Kelola perangkat yang sedang login ke akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Sesi Saat Ini</p>
                      <p className="text-sm text-muted-foreground">
                        Chrome di Windows • Jakarta, Indonesia
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Aktif sekarang
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Aktif</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Mobile App</p>
                      <p className="text-sm text-muted-foreground">
                        iPhone • Jakarta, Indonesia
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2 jam yang lalu
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Akhiri Sesi
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login History */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Login</CardTitle>
              <CardDescription>
                Aktivitas login terbaru pada akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loginHistory?.slice(0, 5).map((login, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${login.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="text-sm font-medium">
                          {login.success ? 'Login Berhasil' : 'Login Gagal'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {login.device} • {login.location || 'Lokasi tidak diketahui'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(login.timestamp).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Manajemen Data
              </CardTitle>
              <CardDescription>
                Kelola data pribadi dan pengaturan akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Ekspor Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Download semua data pribadi Anda dalam format JSON
                  </p>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Ekspor Data
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Hapus Cache</h4>
                  <p className="text-sm text-muted-foreground">
                    Bersihkan data cache dan temporary files
                  </p>
                </div>
                <Button variant="outline">
                  Bersihkan Cache
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Zona Berbahaya
              </CardTitle>
              <CardDescription>
                Tindakan yang tidak dapat dibatalkan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-800">Hapus Akun</h4>
                    <p className="text-sm text-red-700">
                      Hapus akun dan semua data secara permanen
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus Akun
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handlePasswordChange}
      />

      <TwoFactorSetupModal
        isOpen={isTwoFactorModalOpen}
        onClose={() => setIsTwoFactorModalOpen(false)}
        onComplete={() => {
          setIsTwoFactorModalOpen(false);
          toast.success('Two-factor authentication berhasil diaktifkan');
        }}
      />
    </div>
  );
};