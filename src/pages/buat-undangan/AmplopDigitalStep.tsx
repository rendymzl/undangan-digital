import React, { useState } from 'react';
import type { AmplopDigital } from '@/types';
import { Input } from '@/components/ui/input'; // Pastikan Input di-import
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// <-- 1. HAPUS const bankList DARI SINI -->

interface AmplopDigitalStepProps {
  value: AmplopDigital[];
  onChange: (data: AmplopDigital[]) => void;
}

const AmplopDigitalStep: React.FC<AmplopDigitalStepProps> = ({ value, onChange }) => {
  const [localList, setLocalList] = useState<AmplopDigital[]>(value || []);

  const handleChange = (idx: number, field: keyof AmplopDigital, val: string) => {
    const newList = [...localList];

    if (!newList[idx]) {
      newList[idx] = { bank: '', atasNama: '', nomor: '' };
    }

    (newList[idx] as any)[field] = val;
    setLocalList(newList);
    onChange(newList);
  };

  const handleAdd = () => {
    const newList = [...localList, { bank: '', atasNama: '', nomor: '' }];
    setLocalList(newList);
    onChange(newList);
  };

  const handleRemove = (idx: number) => {
    const newList = localList.filter((_, i) => i !== idx);
    setLocalList(newList);
    onChange(newList);
  };

  const handleQRUpload = (idx: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      handleChange(idx, 'qrUrl', e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold mb-2">Amplop Digital (Opsional)</h3>
      {localList.map((item, idx) => (
        <div key={idx} className="border rounded-lg p-4 mb-2 relative bg-white/80">
          <button
            type="button"
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl"
            onClick={() => handleRemove(idx)}
            aria-label="Hapus rekening"
          >
            &times;
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {/* <-- 2. GANTI <select> MENJADI <Input> --> */}
              <Label htmlFor={`bank-${idx}`} className="block text-sm font-medium mb-1">Nama Bank / E-Wallet</Label>
              <Input
                id={`bank-${idx}`}
                className="w-full border rounded px-2 py-1"
                value={item.bank}
                onChange={e => handleChange(idx, 'bank', e.target.value)}
                placeholder="Contoh: BCA, GoPay, Dana"
              />
            </div>
            <div>
              <Label htmlFor={`atasNama-${idx}`} className="block text-sm font-medium mb-1">Atas Nama</Label>
              <Input
                id={`atasNama-${idx}`}
                className="w-full border rounded px-2 py-1"
                value={item.atasNama || ''}
                onChange={e => handleChange(idx, 'atasNama', e.target.value)}
                placeholder="Nama pemilik rekening"
              />
            </div>
            <div>
              <Label htmlFor={`nomor-${idx}`} className="block text-sm font-medium mb-1">Nomor Rekening/HP</Label>
              <Input
                id={`nomor-${idx}`}
                className="w-full border rounded px-2 py-1"
                value={item.nomor || ''}
                onChange={e => handleChange(idx, 'nomor', e.target.value)}
                placeholder="Nomor rekening atau e-wallet"
              />
            </div>
            <div>
              <Label htmlFor={`catatan-${idx}`} className="block text-sm font-medium mb-1">Catatan (opsional)</Label>
              <Input
                id={`catatan-${idx}`}
                className="w-full border rounded px-2 py-1"
                value={item.catatan || ''}
                onChange={e => handleChange(idx, 'catatan', e.target.value)}
                placeholder="Misal: Untuk e-wallet"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor={`qrUrl-${idx}`} className="block text-sm font-medium mb-1">QR Code (opsional)</Label>
              <Input
                id={`qrUrl-${idx}`}
                type="file"
                accept="image/*"
                onChange={e => e.target.files && handleQRUpload(idx, e.target.files[0])}
                className="text-sm"
              />
              {item.qrUrl && (
                <img src={item.qrUrl} alt="QR Code" className="mt-2 h-24 rounded border p-1" />
              )}
            </div>
          </div>
        </div>
      ))}
      <Button
        type="button"
        className="px-4 py-2"
        onClick={handleAdd}
      >
        + Tambah Rekening/E-wallet
      </Button>
    </div>
  );
};

export default AmplopDigitalStep;