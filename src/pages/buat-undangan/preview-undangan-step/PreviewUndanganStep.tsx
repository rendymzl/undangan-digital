import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SlugGenerator } from './SlugGenerator';
import { BacksoundSelector } from './BacksoundSelector';
import { InvitationPreviewCard } from './InvitationPreviewCard';
import { themes } from '@/types/theme';
import { ThemeSelector } from './ThemeSelector';
import type { InvitationFormData } from '@/utils/caseTransform';

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
  const activeTheme = themes.find(t => t.id === form.themeId) || themes[0];

  const finalTheme = {
    ...activeTheme,
    fontTitle: form.fontTitle || activeTheme.fontTitle,
    fontText: form.fontText || activeTheme.fontText,
    colors: form.customColors || activeTheme.colors,
  };

  return (
    // --- PERBAIKAN UTAMA DI SINI: Layout Grid ---
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

      {/* --- KOLOM KIRI: KONTROL PENGATURAN --- */}
      <div className="lg:col-span-3 space-y-6">

        <BacksoundSelector form={form} updateForm={updateForm} />

        <ThemeSelector form={form} updateForm={updateForm} />
      </div>

      {/* --- KOLOM KANAN: LIVE PREVIEW --- */}
      <div className="lg:col-span-2">
        <div className="sticky top-8">
          <SlugGenerator form={form} updateForm={updateForm} />
          {/* Membuat preview tetap terlihat saat scroll */}
          <Label className="text-base font-semibold text-gray-800 mb-2 mt-4 block text-center">
            Pratinjau Langsung
          </Label>
          <InvitationPreviewCard
            form={form}
            theme={finalTheme}
            formatOrangTua={formatOrangTua}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewUndanganStep;