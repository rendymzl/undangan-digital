import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  X,
  Users,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'sonner';
import type { Guest } from '@/types/guest';

export interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (guests: Omit<Guest, 'id'>[]) => Promise<void>;
}

interface ImportResult {
  success: number;
  errors: Array<{
    row: number;
    error: string;
    data: any;
  }>;
}

const CSV_TEMPLATE = `nama,email,telepon,alamat,kategori,jumlah_tamu,pantangan_makanan,catatan
Ahmad Rizki,ahmad@email.com,+62812345678,Jakarta Selatan,Keluarga,2,Vegetarian,Datang dengan istri
Siti Nurhaliza,siti@email.com,+62823456789,Bandung,Teman,1,,Teman kuliah
Budi Santoso,budi@email.com,+62834567890,Surabaya,Kerja,1,,Rekan kerja`;

export default function BulkImportModal({
  isOpen,
  onClose,
  onImport,
}: BulkImportModalProps) {
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'result'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error('Hanya file CSV yang diperbolehkan');
        return;
      }
      
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('File CSV harus memiliki header dan minimal 1 data');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const expectedHeaders = ['nama', 'email', 'telepon', 'alamat', 'kategori', 'jumlah_tamu', 'pantangan_makanan', 'catatan'];
      
      // Validate headers
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        toast.error(`Header yang hilang: ${missingHeaders.join(', ')}`);
        return;
      }

      const data = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        const row: any = {};
        
        headers.forEach((header, i) => {
          row[header] = values[i] || '';
        });
        
        row.rowNumber = index + 2; // +2 because we skip header and start from 1
        return row;
      });

      setPreviewData(data);
      setStep('preview');
    };
    
    reader.readAsText(file);
  };

  const validateData = (data: any[]): { valid: any[], errors: ImportResult['errors'] } => {
    const valid: any[] = [];
    const errors: ImportResult['errors'] = [];

    data.forEach((row) => {
      const rowErrors: string[] = [];

      if (!row.nama?.trim()) {
        rowErrors.push('Nama wajib diisi');
      }

      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        rowErrors.push('Format email tidak valid');
      }

      if (row.telepon && !/^[\+]?[0-9\-\s\(\)]+$/.test(row.telepon)) {
        rowErrors.push('Format nomor telepon tidak valid');
      }

      if (!row.kategori?.trim()) {
        rowErrors.push('Kategori wajib diisi');
      }

      const guestCount = parseInt(row.jumlah_tamu) || 1;
      if (guestCount < 1) {
        rowErrors.push('Jumlah tamu minimal 1');
      }

      if (rowErrors.length > 0) {
        errors.push({
          row: row.rowNumber,
          error: rowErrors.join(', '),
          data: row,
        });
      } else {
        valid.push({
          name: row.nama,
          email: row.email || undefined,
          phone: row.telepon || undefined,
          address: row.alamat || undefined,
          category: row.kategori,
          guestCount: guestCount,
          dietaryRestrictions: row.pantangan_makanan || undefined,
          notes: row.catatan || undefined,
          rsvpStatus: 'pending' as const,
          invitationSent: false,
        });
      }
    });

    return { valid, errors };
  };

  const handleImport = async () => {
    setStep('importing');
    setProgress(0);

    const { valid, errors } = validateData(previewData);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      await onImport(valid);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setImportResult({
        success: valid.length,
        errors,
      });
      
      setStep('result');
      
      if (errors.length === 0) {
        toast.success(`${valid.length} tamu berhasil diimpor`);
      } else {
        toast.warning(`${valid.length} tamu berhasil diimpor, ${errors.length} gagal`);
      }
    } catch (error) {
      toast.error('Gagal mengimpor data tamu');
      console.error('Import error:', error);
      setStep('preview');
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_tamu.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetModal = () => {
    setStep('upload');
    setFile(null);
    setPreviewData([]);
    setImportResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Tamu dari CSV</DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Upload file CSV dengan format yang sesuai. Anda dapat mengunduh template untuk memudahkan proses import.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    Download Template
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Unduh template CSV untuk memastikan format data yang benar.
                  </p>
                  <Button variant="outline" onClick={downloadTemplate} className="w-full">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Download Template CSV
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload File CSV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pilih file CSV yang berisi data tamu untuk diimpor.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Pilih File CSV
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Preview Data</h3>
                <p className="text-sm text-muted-foreground">
                  {previewData.length} tamu akan diimpor dari {file?.name}
                </p>
              </div>
              <Badge variant="outline">
                <Users className="h-3 w-3 mr-1" />
                {previewData.length} tamu
              </Badge>
            </div>

            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Nama</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Telepon</th>
                    <th className="p-2 text-left">Kategori</th>
                    <th className="p-2 text-left">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(0, 10).map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{row.nama}</td>
                      <td className="p-2">{row.email}</td>
                      <td className="p-2">{row.telepon}</td>
                      <td className="p-2">{row.kategori}</td>
                      <td className="p-2">{row.jumlah_tamu || 1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length > 10 && (
                <div className="p-2 text-center text-sm text-muted-foreground bg-muted">
                  ... dan {previewData.length - 10} tamu lainnya
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'importing' && (
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center">
              <Upload className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Mengimpor Data Tamu</h3>
              <p className="text-muted-foreground mb-4">
                Mohon tunggu, sedang memproses {previewData.length} tamu...
              </p>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                {progress}% selesai
              </p>
            </div>
          </div>
        )}

        {step === 'result' && importResult && (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Import Selesai</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {importResult.success}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Berhasil diimpor
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {importResult.errors.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Gagal diimpor
                  </div>
                </CardContent>
              </Card>
            </div>

            {importResult.errors.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                  Error Details
                </h4>
                <div className="max-h-48 overflow-y-auto border rounded-lg">
                  {importResult.errors.map((error, index) => (
                    <div key={index} className="p-3 border-b last:border-b-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Baris {error.row}: {error.data.nama}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                          Error
                        </Badge>
                      </div>
                      <p className="text-sm text-red-600 mt-1">
                        {error.error}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {step === 'upload' && (
            <Button variant="outline" onClick={handleClose}>
              Tutup
            </Button>
          )}
          
          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setStep('upload')}>
                Kembali
              </Button>
              <Button onClick={handleImport}>
                Import {previewData.length} Tamu
              </Button>
            </>
          )}
          
          {step === 'result' && (
            <Button onClick={handleClose}>
              Selesai
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}