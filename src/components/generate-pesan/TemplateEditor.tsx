import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const TemplateEditor: React.FC<Props> = ({ value, onChange }) => (
  <Card>
    <CardHeader>
      <CardTitle>2. Sesuaikan Template Pesan</CardTitle>
      <CardDescription>
        Silakan ubah isi pesan sesuai kebutuhan Anda. 
        Untuk menampilkan nama tamu secara otomatis, gunakan <code className="bg-gray-200 text-gray-800 px-1 py-1 rounded-sm mx-1">[nama_tamu]</code>. 
        Untuk menampilkan link undangan, gunakan <code className="bg-gray-200 text-gray-800 px-1 py-1 rounded-sm mx-1">[link_undangan]</code>.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
      />
    </CardContent>
  </Card>
);