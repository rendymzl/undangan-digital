import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  QrCode, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  Shield
} from 'lucide-react';
import { toast } from '@/services/shared/toastService';
import { profileApi } from '../services/profileApi';

interface TwoFactorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const TwoFactorSetupModal: React.FC<TwoFactorSetupModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && step === 'setup') {
      initializeTwoFactor();
    }
  }, [isOpen, step]);

  const initializeTwoFactor = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await profileApi.enableTwoFactor();
      setQrCode(result.qrCode);
      setSecret(result.secret);
    } catch (err) {
      setError('Gagal menginisialisasi 2FA');
      console.error('Error initializing 2FA:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Kode verifikasi harus 6 digit');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await profileApi.verifyTwoFactor(verificationCode);
      setBackupCodes(result.backupCodes);
      setStep('backup');
      toast.success('Two-factor authentication berhasil diaktifkan');
    } catch (err) {
      setError('Kode verifikasi tidak valid');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Disalin ke clipboard');
    } catch (err) {
      toast.error('Gagal menyalin ke clipboard');
    }
  };

  const handleComplete = () => {
    setStep('setup');
    setQrCode('');
    setSecret('');
    setVerificationCode('');
    setBackupCodes([]);
    setError('');
    onComplete();
  };

  const handleClose = () => {
    setStep('setup');
    setQrCode('');
    setSecret('');
    setVerificationCode('');
    setBackupCodes([]);
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Setup Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            {step === 'setup' && 'Scan QR code dengan aplikasi authenticator'}
            {step === 'verify' && 'Masukkan kode dari aplikasi authenticator'}
            {step === 'backup' && 'Simpan backup codes dengan aman'}
          </DialogDescription>
        </DialogHeader>

        {step === 'setup' && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">Scan QR Code</CardTitle>
                    <CardDescription>
                      Gunakan aplikasi authenticator seperti Google Authenticator atau Authy
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    {qrCode ? (
                      <div className="flex justify-center">
                        <div className="p-4 bg-white rounded-lg border">
                          <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                            <div className="text-center">
                              <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">QR Code untuk 2FA</p>
                              <p className="text-xs text-gray-400 mt-1">
                                Scan dengan authenticator app
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-48 h-48 mx-auto bg-muted rounded-lg">
                        <QrCode className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}

                    {secret && (
                      <div className="space-y-2">
                        <Label>Atau masukkan kode manual:</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={secret}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(secret)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Smartphone className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Aplikasi yang Direkomendasikan:</p>
                      <ul className="mt-1 space-y-1">
                        <li>• Google Authenticator</li>
                        <li>• Microsoft Authenticator</li>
                        <li>• Authy</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Batal
              </Button>
              <Button 
                onClick={() => setStep('verify')}
                disabled={isLoading || !qrCode}
              >
                Lanjutkan
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                Masukkan 6-digit kode dari aplikasi authenticator Anda
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationCode">Kode Verifikasi</Label>
              <Input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setVerificationCode(value);
                  setError('');
                }}
                placeholder="123456"
                className="text-center text-lg font-mono tracking-widest"
                maxLength={6}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('setup')}>
                Kembali
              </Button>
              <Button 
                onClick={handleVerification}
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verifikasi
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 'backup' && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold">2FA Berhasil Diaktifkan!</h3>
              <p className="text-sm text-muted-foreground">
                Simpan backup codes ini dengan aman
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Backup Codes</CardTitle>
                <CardDescription>
                  Gunakan codes ini jika Anda kehilangan akses ke aplikasi authenticator
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        {code}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(code)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(backupCodes.join('\n'))}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Salin Semua
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Penting:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Simpan codes ini di tempat yang aman</li>
                    <li>• Setiap code hanya bisa digunakan sekali</li>
                    <li>• Jangan bagikan codes ini kepada siapapun</li>
                  </ul>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleComplete} className="w-full">
                Selesai
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};