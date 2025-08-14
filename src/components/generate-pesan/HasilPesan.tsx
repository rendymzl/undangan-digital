import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Send } from 'lucide-react';
import type { PesanTerkirim } from '@/components/generate-pesan/PesanGenerator';
import { toast } from 'sonner';

interface Props {
  hasilPesan: PesanTerkirim[];
}

export const HasilPesan: React.FC<Props> = ({ hasilPesan }) => {
  const handleCopy = (pesan: string) => {
    navigator.clipboard.writeText(pesan)
      .then(() => toast.success("Pesan berhasil disalin!"))
      .catch(() => toast.error("Gagal menyalin pesan."));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>3. Hasil Pesan</CardTitle>
        <CardDescription>
          Berikut adalah pesan yang sudah dibuat untuk setiap tamu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasilPesan.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Hasil akan muncul di sini setelah Anda menekan tombol "Generate".
          </p>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {hasilPesan.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <p className="font-semibold mb-2">{item.namaTamu}</p>
                <p className="whitespace-pre-wrap text-sm text-gray-700 mb-4">{item.pesanLengkap}</p>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleCopy(item.pesanLengkap)}>
                    <Copy className="w-4 h-4 mr-2" /> Salin
                  </Button>
                  <Button asChild size="sm" style={{backgroundColor: '#25D366'}}>
                    <a href={item.linkWhatsApp} target="_blank" rel="noopener noreferrer">
                      <Send className="w-4 h-4 mr-2" /> Kirim
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};