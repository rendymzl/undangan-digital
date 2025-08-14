import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const TamuInput: React.FC<Props> = ({ value, onChange }) => (
  <Card>
    <CardHeader>
      <CardTitle>1. Masukkan Daftar Tamu</CardTitle>
      <CardDescription>
        Ketik atau salin-tempel semua nama tamu di sini. Pastikan satu nama per baris.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        placeholder="Bapak Andi dan Keluarga&#10;Siti Rahayu&#10;Dr. Budi Santoso, M.Kom."
      />
    </CardContent>
  </Card>
);