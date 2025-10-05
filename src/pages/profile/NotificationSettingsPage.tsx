import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Mail, 
  Settings, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Volume2,
  VolumeX,
  Trash2,
  Filter
} from 'lucide-react';
import { useNotifications } from './hooks/useNotifications';
import { toast } from '@/services/shared/toastService';

export const NotificationSettingsPage: React.FC = () => {
  const { 
    notificationSettings, 
    notificationHistory, 
    isLoading, 
    updateNotificationSettings,
    clearNotificationHistory,
    markAllAsRead
  } = useNotifications();

  const [testEmailSent, setTestEmailSent] = useState(false);

  const handleSettingChange = async (setting: string, value: boolean) => {
    try {
      await updateNotificationSettings({ [setting]: value });
      toast.success('Pengaturan notifikasi berhasil diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui pengaturan notifikasi');
    }
  };

  const handleSendTestEmail = async () => {
    try {
      setTestEmailSent(true);
      // Simulate sending test email
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Email test berhasil dikirim. Periksa inbox Anda.');
    } catch (error) {
      toast.error('Gagal mengirim email test');
    } finally {
      setTestEmailSent(false);
    }
  };

  const handleClearHistory = async () => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus semua riwayat notifikasi?');
    if (confirmed) {
      try {
        await clearNotificationHistory();
        toast.success('Riwayat notifikasi berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus riwayat notifikasi');
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('Semua notifikasi ditandai sebagai dibaca');
    } catch (error) {
      toast.error('Gagal menandai notifikasi sebagai dibaca');
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
        title="Notifikasi & Preferensi"
        description="Kelola pengaturan notifikasi dan preferensi komunikasi"
      />

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="preferences">Preferensi</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Notifikasi Email
              </CardTitle>
              <CardDescription>
                Atur jenis notifikasi yang ingin Anda terima melalui email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Account & Security */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Akun & Keamanan
                </h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Login dari Perangkat Baru</h4>
                    <p className="text-sm text-muted-foreground">
                      Notifikasi saat ada login dari perangkat yang tidak dikenal
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings?.security?.newDeviceLogin || true}
                    onCheckedChange={(value) => handleSettingChange('security.newDeviceLogin', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Perubahan Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Konfirmasi saat password berhasil diubah
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings?.security?.passwordChange || true}
                    onCheckedChange={(value) => handleSettingChange('security.passwordChange', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Aktivitas Mencurigakan</h4>
                    <p className="text-sm text-muted-foreground">
                      Peringatan untuk aktivitas yang tidak biasa
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings?.security?.suspiciousActivity || true}
                    onCheckedChange={(value) => handleSettingChange('security.suspiciousActivity', value)}
                  />
                </div>
              </div>

              {/* Invitation Activities */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Aktivitas Undangan
                </h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">RSVP Baru</h4>
                    <p className="text-sm text-muted-foreground">
                      Notifikasi saat ada tamu yang memberikan RSVP
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings?.invitations?.newRSVP || true}
                    onCheckedChange={(value) => handleSettingChange('invitations.newRSVP', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Undangan Dilihat</h4>
                    <p className="text-sm text-muted-foreground">
                      Notifikasi saat undangan dibuka oleh tamu
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings?.invitations?.invitationViewed || false}
                    onCheckedChange={(value) => handleSettingChange('invitations.invitationViewed', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Reminder RSVP</h4>
                    <p className="text-sm text-muted-foreground">
                      Pengingat untuk tamu yang belum memberikan RSVP
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings?.invitations?.rsvpReminder || true}
                    onCheckedChange={(value) => handleSettingChange('invitations.rsvpReminder', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Laporan Mingguan</h4>
                    <p className="text-sm text-muted-foreground">
                      Ringkasan aktivitas undangan setiap minggu
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings?.invitations?.weeklyReport || true}
                    onCheckedChange={(value) => handleSettingChange('invitations.weeklyReport', value)}
                  />
                </div>
              </div>

              {/* Payment & Billing */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Pembayaran & Tagihan
                </h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Pembayaran Berhasil</h4>
                    <p className="text-sm text-muted-foreground">
                      Konfirmasi saat pembayaran berhasil diproses
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings?.billing?.paymentSuccess || true}
                    onCheckedChange={(value) => handleSettingChange('billing.paymentSuccess', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Pembayaran Gagal</h4>
                    <p className="text-sm text-muted-foreground">
                      Notifikasi saat pembayaran gagal atau ditolak
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings?.billing?.paymentFailed || true}
                    onCheckedChange={(value) => handleSettingChange('billing.paymentFailed', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Langganan Akan Berakhir</h4>
                    <p className="text-sm text-muted-foreground">
                      Pengingat 7 hari sebelum langganan berakhir
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings?.billing?.subscriptionExpiring || true}
                    onCheckedChange={(value) => handleSettingChange('billing.subscriptionExpiring', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Invoice Baru</h4>
                    <p className="text-sm text-muted-foreground">
                      Notifikasi saat invoice baru tersedia
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings?.billing?.newInvoice || true}
                    onCheckedChange={(value) => handleSettingChange('billing.newInvoice', value)}
                  />
                </div>
              </div>

              {/* Marketing & Updates */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Marketing & Update
                </h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Fitur Baru</h4>
                    <p className="text-sm text-muted-foreground">
                      Informasi tentang fitur dan update terbaru
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings?.marketing?.newFeatures || false}
                    onCheckedChange={(value) => handleSettingChange('marketing.newFeatures', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Tips & Tutorial</h4>
                    <p className="text-sm text-muted-foreground">
                      Tips penggunaan dan tutorial aplikasi
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings?.marketing?.tips || false}
                    onCheckedChange={(value) => handleSettingChange('marketing.tips', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Newsletter</h4>
                    <p className="text-sm text-muted-foreground">
                      Newsletter bulanan dengan konten menarik
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings?.marketing?.newsletter || false}
                    onCheckedChange={(value) => handleSettingChange('marketing.newsletter', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Test */}
          <Card>
            <CardHeader>
              <CardTitle>Test Email</CardTitle>
              <CardDescription>
                Kirim email test untuk memastikan notifikasi berfungsi dengan baik
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Kirim Email Test</p>
                  <p className="text-sm text-muted-foreground">
                    Email akan dikirim ke: {notificationSettings?.emailAddress || 'john.doe@example.com'}
                  </p>
                </div>
                <Button 
                  onClick={handleSendTestEmail}
                  disabled={testEmailSent}
                  variant="outline"
                >
                  {testEmailSent ? 'Mengirim...' : 'Kirim Test'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          {/* General Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Preferensi Umum
              </CardTitle>
              <CardDescription>
                Atur preferensi umum untuk notifikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Mode Senyap</h4>
                  <p className="text-sm text-muted-foreground">
                    Nonaktifkan semua notifikasi sementara
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {notificationSettings?.general?.quietMode ? (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Switch
                    checked={notificationSettings?.general?.quietMode || false}
                    onCheckedChange={(value) => handleSettingChange('general.quietMode', value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Digest Harian</h4>
                  <p className="text-sm text-muted-foreground">
                    Kumpulkan notifikasi dalam satu email harian
                  </p>
                </div>
                <Switch
                  checked={notificationSettings?.general?.dailyDigest || false}
                  onCheckedChange={(value) => handleSettingChange('general.dailyDigest', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifikasi Instan</h4>
                  <p className="text-sm text-muted-foreground">
                    Kirim notifikasi segera saat ada aktivitas
                  </p>
                </div>
                <Switch
                  checked={notificationSettings?.general?.instantNotifications || true}
                  onCheckedChange={(value) => handleSettingChange('general.instantNotifications', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Timing Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Waktu Pengiriman
              </CardTitle>
              <CardDescription>
                Atur waktu kapan notifikasi boleh dikirim
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Jam Mulai</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notificationSettings?.timing?.startTime || '08:00'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Jam Selesai</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notificationSettings?.timing?.endTime || '22:00'}
                  </p>
                </div>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Notifikasi hanya akan dikirim antara jam {notificationSettings?.timing?.startTime || '08:00'} - {notificationSettings?.timing?.endTime || '22:00'} 
                  (zona waktu: {notificationSettings?.timing?.timezone || 'Asia/Jakarta'})
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Frequency Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Frekuensi Notifikasi</CardTitle>
              <CardDescription>
                Batasi frekuensi notifikasi untuk menghindari spam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Maksimal per Hari</h4>
                  <p className="text-sm text-muted-foreground">
                    Batasi jumlah email notifikasi per hari
                  </p>
                </div>
                <Badge variant="outline">
                  {notificationSettings?.frequency?.maxPerDay || 10} email/hari
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Interval Minimum</h4>
                  <p className="text-sm text-muted-foreground">
                    Jeda minimum antar notifikasi sejenis
                  </p>
                </div>
                <Badge variant="outline">
                  {notificationSettings?.frequency?.minInterval || 15} menit
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* Notification History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Riwayat Notifikasi
                </CardTitle>
                <CardDescription>
                  Daftar notifikasi yang telah dikirim
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Tandai Dibaca
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearHistory}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus Semua
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notificationHistory?.length > 0 ? (
                  notificationHistory.map((notification, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className={`h-2 w-2 rounded-full mt-2 ${
                        notification.read ? 'bg-gray-300' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{notification.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant={notification.status === 'delivered' ? 'default' : 'destructive'}>
                              {notification.status === 'delivered' ? 'Terkirim' : 'Gagal'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.timestamp).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Tipe: {notification.type}</span>
                          <span>Email: {notification.email}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Belum ada riwayat notifikasi</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};