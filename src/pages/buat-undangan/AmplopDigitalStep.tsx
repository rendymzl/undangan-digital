import React, { useState } from 'react';

export interface AmplopDigitalData {
  bank: string;
  accountName: string;
  accountNumber: string;
  note?: string;
  qrUrl?: string;
}

interface AmplopDigitalStepProps {
  value: AmplopDigitalData[];
  onChange: (data: AmplopDigitalData[]) => void;
}

const bankList = [
  'BCA', 'Mandiri', 'BRI', 'BNI', 'BSI', 'CIMB', 'Permata', 'Danamon', 'BTN', 'Bank Lainnya'
];

const AmplopDigitalStep: React.FC<AmplopDigitalStepProps> = ({ value, onChange }) => {
  const [localList, setLocalList] = useState<AmplopDigitalData[]>(value || []);

  const handleChange = (idx: number, field: keyof AmplopDigitalData, val: string) => {
    const newList = [...localList];
    newList[idx] = { ...newList[idx], [field]: val };
    setLocalList(newList);
    onChange(newList);
  };

  const handleAdd = () => {
    setLocalList([...localList, { bank: '', accountName: '', accountNumber: '' }]);
  };

  const handleRemove = (idx: number) => {
    const newList = localList.filter((_, i) => i !== idx);
    setLocalList(newList);
    onChange(newList);
  };

  const handleQRUpload = (idx: number, file: File) => {
    // Untuk demo, hanya simpan url lokal. Untuk produksi, upload ke storage dan simpan url.
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
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            onClick={() => handleRemove(idx)}
            aria-label="Hapus rekening"
          >
            &times;
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bank</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={item.bank}
                onChange={e => handleChange(idx, 'bank', e.target.value)}
              >
                <option value="">Pilih Bank</option>
                {bankList.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Atas Nama</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={item.accountName}
                onChange={e => handleChange(idx, 'accountName', e.target.value)}
                placeholder="Nama pemilik rekening"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nomor Rekening</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={item.accountNumber}
                onChange={e => handleChange(idx, 'accountNumber', e.target.value)}
                placeholder="Nomor rekening"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Catatan (opsional)</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={item.note || ''}
                onChange={e => handleChange(idx, 'note', e.target.value)}
                placeholder="Misal: Kado pernikahan"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">QR Code (opsional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => e.target.files && handleQRUpload(idx, e.target.files[0])}
              />
              {item.qrUrl && (
                <img src={item.qrUrl} alt="QR Code" className="mt-2 h-24" />
              )}
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="px-4 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700"
        onClick={handleAdd}
      >
        + Tambah Rekening
      </button>
    </div>
  );
};

export default AmplopDigitalStep; 