import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SlugGenerator } from './SlugGenerator';
import { BacksoundSelector } from './BacksoundSelector';
import { InvitationPreviewCard } from './InvitationPreviewCard';
import { themes } from '@/types/theme';
import type { InvitationFormData } from '@/utils/caseTransform';
import { ThemeSelector } from './ThemeSelector';

type Props = {
  form: InvitationFormData;
  updateForm: (path: string, value: any) => void;
  formatOrangTua: (
    bapak: string | null,
    ibu: string | null,
    almBapak: boolean,
    almIbu: boolean,
    anakKe: string | null,
    isPria: boolean
  ) => string | null;
};

const PreviewUndanganStep: React.FC<Props> = ({ form, updateForm, formatOrangTua }) => {
  // Logika untuk menggabungkan tema default dengan warna kustom untuk preview
  const activeTheme = themes.find(t => t.id === form.themeId) || themes[0];
  const finalTheme = {
    ...activeTheme,
    customColors: form.customColors,
  };

  return (
    <div className="space-y-6">
      {/* 1. Komponen Slug */}
      <SlugGenerator form={form} updateForm={updateForm} />

      {/* 2. Pengaturan Galeri (Sederhana, jadi tetap di sini) */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Galeri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="galeri-aktif"
              checked={form.galeriAktif}
              onCheckedChange={(checked) => updateForm('galeriAktif', checked)}
            />
            <Label htmlFor="galeri-aktif">Tampilkan galeri foto pada undangan</Label>
          </div>
        </CardContent>
      </Card>

      {/* 3. Komponen Backsound */}
      <BacksoundSelector form={form} updateForm={updateForm} />

      {/* 4. Komponen Tema & Warna */}
      <ThemeSelector form={form} updateForm={updateForm} />

      {/* 5. Komponen Kartu Preview */}
      <div className="pt-6">
        <Label className="text-base font-semibold text-gray-800 mb-2 block text-center">Live Preview</Label>
        <InvitationPreviewCard form={form} theme={finalTheme} formatOrangTua={formatOrangTua} />
      </div>
    </div>
  );
};

export default PreviewUndanganStep;