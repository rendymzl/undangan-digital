import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Invitation } from '@/types';

// Import komponen-komponen pendukung
import { TamuInput } from './TamuInput';
import { TemplateEditor } from './TemplateEditor';
import { HasilPesan } from './HasilPesan';
import { toast } from 'sonner';

// Tipe untuk pesan yang digenerate
export interface PesanTerkirim {
  namaTamu: string;
  pesanLengkap: string;
  linkWhatsApp: string;
}

// Props yang diterima oleh komponen
interface Props {
  invitation: Invitation;
}

export const PesanGenerator: React.FC<Props> = ({ invitation }) => {
  const [daftarTamu, setDaftarTamu] = useState('');
  const [templatePesan, setTemplatePesan] = useState(
`Assalamu'alaikum Warahmatullahi Wabarakatuh

Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i:

[nama_tamu]

Untuk hadir di acara pernikahan kami. Informasi lengkap mengenai acara dapat diakses melalui tautan berikut:

[link_undangan]

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir untuk memberikan doa restu.

Terima kasih.
`
  );
  const [hasilPesan, setHasilPesan] = useState<PesanTerkirim[]>([]);

  const handleGenerate = () => {
    if (!invitation?.slug) {
      toast.error("Data undangan tidak valid atau slug tidak ditemukan.");
      return;
    }
    if (!daftarTamu.trim()) {
      toast.error("Daftar nama tamu tidak boleh kosong.");
      return;
    }

    // Ubah teks daftar tamu menjadi array, filter baris kosong
    const tamuArray = daftarTamu.split('\n').filter(nama => nama.trim() !== '');
    const originUrl = window.location.origin;

    const generatedMessages = tamuArray.map(nama => {
      const namaTamu = nama.trim();
      // Encode nama tamu untuk parameter URL agar aman
      const encodedNamaTamu = encodeURIComponent(namaTamu);
      const linkUndangan = `${originUrl}/${invitation.slug}?to=${encodedNamaTamu}`;
      
      // Ganti placeholder di template
      let pesanLengkap = templatePesan.replace(/\[nama_tamu\]/g, `*${namaTamu}*`);
      pesanLengkap = pesanLengkap.replace(/\[link_undangan\]/g, linkUndangan);
      
      // Encode seluruh pesan untuk link WhatsApp
      const encodedPesan = encodeURIComponent(pesanLengkap);
      const linkWhatsApp = `https://wa.me/?text=${encodedPesan}`;

      return { namaTamu, pesanLengkap, linkWhatsApp };
    });

    setHasilPesan(generatedMessages);
    toast.success(`${generatedMessages.length} pesan berhasil dibuat!`);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Kolom Kiri: Input & Editor */}
      <div className="space-y-8">
        <TamuInput value={daftarTamu} onChange={setDaftarTamu} />
        <TemplateEditor value={templatePesan} onChange={setTemplatePesan} />
      </div>

      {/* Kolom Kanan: Tombol Generate & Hasil */}
      <div className="space-y-4 lg:sticky lg:top-8">
        <Button onClick={handleGenerate} className="w-full text-lg py-6">
          Generate Pesan Undangan
        </Button>
        <HasilPesan hasilPesan={hasilPesan} />
      </div>
    </div>
  );
};