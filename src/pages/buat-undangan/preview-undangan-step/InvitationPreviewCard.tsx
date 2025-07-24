import React from 'react';
import { Card } from "@/components/ui/card";
import { Music } from "lucide-react";
import type { Theme } from "@/types/theme";
import type { InvitationFormData } from '@/utils/caseTransform';

// Definisikan tipe untuk Props
type Props = {
    form: InvitationFormData;
    theme: Theme & { customColors?: any }; // Terima theme yang sudah digabung dengan warna kustom
    formatOrangTua: (
        bapak: string | null,
        ibu: string | null,
        almBapak: boolean,
        almIbu: boolean,
        anakKe: string | null,
        isPria: boolean
    ) => string | null;
};

// Daftar backsound untuk mencari label
const BACKSOUND_LIST = [
    { value: 'wedding-day', label: 'Wedding Day', url: '/backsound/wedding-day.mp3' },
    { value: 'perfect-ed-sheeran', label: 'Perfect (Ed Sheeran)', url: '/backsound/perfect-ed-sheeran.mp3' },
];

export const InvitationPreviewCard: React.FC<Props> = ({ form, theme, formatOrangTua }) => {
    const { mempelaiPria, mempelaiWanita, akad, resepsi, urutanMempelai } = form;

    // Tentukan warna dari custom colors jika ada, jika tidak gunakan warna default tema
    const finalTheme = {
        ...theme,
        primaryColor: theme.customColors?.primary || theme.primaryColor,
        secondaryColor: theme.customColors?.secondary || theme.secondaryColor,
        backgroundColor: theme.customColors?.background || theme.backgroundColor,
        foregroundColor: theme.customColors?.foreground || theme.foregroundColor,
    };

    const namaTampil = urutanMempelai === 'wanita-pria'
        ? `${mempelaiWanita.nama} & ${mempelaiPria.nama}`
        : `${mempelaiPria.nama} & ${mempelaiWanita.nama}`;

    const backsoundLabel = BACKSOUND_LIST.find(b => b.url === form.backsoundUrl)?.label || 'Custom';

    return (
        <Card
            className={`p-0 border-2 shadow-lg overflow-hidden max-w-md mx-auto ${finalTheme.fontText}`}
            style={{ background: finalTheme.backgroundColor, color: finalTheme.foregroundColor }}
        >
            {/* Header Preview */}
            <div
                className={`w-full p-8 text-center ${finalTheme.fontTitle}`}
                style={{ background: finalTheme.primaryColor, color: finalTheme.backgroundColor }}
            >
                <p className="text-sm opacity-80 mb-2">The Wedding Of</p>
                <h3 className="text-3xl">{namaTampil}</h3>
            </div>

            {/* Konten Preview */}
            <div className="p-6 text-center text-sm space-y-3">
                {/* Detail Acara */}
                {form.adaAkad && akad.tanggal && (
                    <div>
                        <p className="font-semibold">Akad Nikah</p>
                        <p className="text-xs opacity-80">{akad.tanggal} &bull; {akad.lokasi}</p>
                    </div>
                )}
                {form.adaResepsi && resepsi.tanggal && (
                    <div>
                        <p className="font-semibold">Resepsi</p>
                        <p className="text-xs opacity-80">{resepsi.tanggal} &bull; {resepsi.lokasi}</p>
                    </div>
                )}

                {/* Info Backsound */}
                {form.backsoundUrl && (
                    <div className="flex items-center justify-center gap-2 pt-2 border-t">
                        <Music className="w-4 h-4" />
                        <span className="text-xs font-medium">Backsound: {backsoundLabel}</span>
                    </div>
                )}
            </div>
        </Card>
    );
};