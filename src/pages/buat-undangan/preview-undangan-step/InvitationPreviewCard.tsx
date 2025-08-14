import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Music, Instagram, Gift, Camera, BookOpen, Calendar, MapPin, Heart } from "lucide-react";
import type { Theme } from "@/types/theme";
import { toTitleCase } from '@/utils/toTitleCase';
import type { InvitationFormData } from '@/utils/caseTransform';

// Define the Props
type Props = {
    form: InvitationFormData;
    theme: Theme;
    formatOrangTua: (
        bapak: string | null,
        ibu: string | null,
        almBapak: boolean,
        almIbu: boolean,
        anakKe: string | null,
        isPria: boolean
    ) => string | null;
};

const BACKSOUND_LIST = [
    { value: 'wedding-day', label: 'Wedding Day', url: '/backsound/wedding-day.mp3' },
    { value: 'perfect-ed-sheeran', label: 'Perfect (Ed Sheeran)', url: '/backsound/perfect-ed-sheeran.mp3' },
];

// Helper component for individual preview sections
const PreviewSection: React.FC<{ title: string, icon: React.ElementType, children: React.ReactNode, theme: Theme }> = ({ title, icon: Icon, children, theme }) => (
    <div className="py-6 px-4 text-center border-t" style={{ borderColor: theme.colors.secondary }}>
        <div className="flex items-center justify-center gap-2 mb-4">
            <Icon className="w-4 h-4" style={{ color: theme.colors.primary }} />
            <h4 className={`text-sm font-semibold tracking-widest uppercase`} style={{ color: theme.colors.foreground }}>
                {title}
            </h4>
        </div>
        {children}
    </div>
);


export const InvitationPreviewCard: React.FC<Props> = ({ form, theme, formatOrangTua }) => {
    const { mempelaiPria, mempelaiWanita, akad, resepsi, urutanMempelai } = form;
    const { colors, fontTitle, fontText } = theme;

    const namaTampil = urutanMempelai === 'wanita-pria'
        ? `${toTitleCase(mempelaiWanita.namaPanggilan || mempelaiWanita.nama)} & ${toTitleCase(mempelaiPria.namaPanggilan || mempelaiPria.nama)}`
        : `${toTitleCase(mempelaiPria.namaPanggilan || mempelaiPria.nama)} & ${toTitleCase(mempelaiWanita.namaPanggilan || mempelaiWanita.nama)}`;

    const mempelaiTampil = urutanMempelai === 'wanita-pria'
        ? [{ data: mempelaiWanita, isPria: false }, { data: mempelaiPria, isPria: true }]
        : [{ data: mempelaiPria, isPria: true }, { data: mempelaiWanita, isPria: false }];

    const coverImageUrl = form.coverTipe === 'upload' ? form.coverUrl : form.coverTipe === 'gambar' ? form.coverGambarPilihan : null;

    const backsoundLabel = BACKSOUND_LIST.find(b => b.url === form.backsoundUrl)?.label || 'Custom';

    return (
        <Card
            className={`border-2 shadow-lg overflow-hidden w-full ${fontText}`}
            style={{ background: colors.background, color: colors.foreground, borderColor: colors.secondary }}
        >
            {/* Header / Cover Section Preview */}
            <div
                className={`w-full p-8 text-center ${fontTitle} bg-cover bg-center`}
                style={{
                    background: coverImageUrl ? `linear-gradient(${colors.background}99, ${colors.background}99), url(${coverImageUrl})` : colors.primary,
                    color: coverImageUrl ? colors.primary : colors.primaryForeground,
                }}
            >
                <p className={`text-sm opacity-80 mb-2 ${fontText}`}>The Wedding Of</p>
                <h3 className="text-3xl">{namaTampil}</h3>
            </div>

            <CardContent className="p-0">
                {/* Profile Section Preview */}
                <PreviewSection title="Mempelai" icon={Heart} theme={theme}>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
                        {mempelaiTampil.map((mempelai, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center md:items-center md:flex-1 gap-2 md:gap-3"
                            >
                                {mempelai.data.foto ? (
                                    <img
                                        src={mempelai.data.foto}
                                        alt={`Foto ${mempelai.data.nama}`}
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 mb-2"
                                        style={{ borderColor: colors.secondary }}
                                    />
                                ) : (
                                    <div
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-2"
                                        style={{ background: colors.secondary, color: colors.secondaryForeground }}
                                    >
                                        {mempelai.data.nama?.[0] || '?'}
                                    </div>
                                )}
                                <div className="text-center">
                                    <div
                                        className={`text-lg md:text-xl ${fontTitle}`}
                                        style={{ color: colors.primary }}
                                    >
                                        {toTitleCase(mempelai.data.nama)}
                                    </div>
                                    <div className="text-xs opacity-80 mt-1">
                                        {formatOrangTua(
                                            mempelai.data.bapak,
                                            mempelai.data.ibu,
                                            mempelai.data.almBapak,
                                            mempelai.data.almIbu,
                                            mempelai.data.anakKe,
                                            mempelai.isPria
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </PreviewSection>

                {/* Acara Section Preview */}
                <PreviewSection title="Acara" icon={Calendar} theme={theme}>
                    <div className="text-sm space-y-3">
                        {form.adaAkad && akad.tanggal && (
                            <div>
                                <p className="font-semibold" style={{ color: colors.primary }}>Akad Nikah</p>
                                <p className="text-xs opacity-80">{akad.tanggal} &bull; {akad.lokasi}</p>
                            </div>
                        )}
                        {form.adaResepsi && resepsi.tanggal && (
                            <div>
                                <p className="font-semibold" style={{ color: colors.primary }}>Resepsi</p>
                                <p className="text-xs opacity-80">{resepsi.tanggal} &bull; {resepsi.lokasi}</p>
                            </div>
                        )}
                    </div>
                </PreviewSection>

                {/* Cerita & Galeri Section Preview */}
                {form.ceritaCinta && (
                    <PreviewSection title="Cerita Kami" icon={BookOpen} theme={theme}>
                        <p className="text-xs italic opacity-80 text-center max-w-xs mx-auto">
                            "{form.ceritaCinta.slice(0, 100)}{form.ceritaCinta.length > 100 ? '...' : ''}"
                        </p>
                    </PreviewSection>
                )}

                {form.galeriAktif && (
                    <PreviewSection title="Galeri" icon={Camera} theme={theme}>
                        {form.galeri && form.galeri.length > 0 ? (
                            <div className="grid grid-cols-4 gap-1 max-w-xs mx-auto">
                                {/* Tampilkan maksimal 4 gambar galeri */}
                                {Array.from({ length: Math.min(form.galeri.length, 4) }).map((_, idx) => (
                                    <div key={idx} className="aspect-square rounded" style={{ backgroundColor: colors.secondary }}>
                                        {form.galeri[idx] && <img src={form.galeri[idx].url} className="w-full h-full object-cover rounded" />}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-xs text-center text-gray-500 py-4">
                                Galeri tidak ada foto.
                            </div>
                        )}
                    </PreviewSection>
                )}

                {/* Amplop & Backsound Section Preview */}
                {form.amplopDigital && form.amplopDigital.length > 0 && (
                    <PreviewSection title="Hadiah Pernikahan" icon={Gift} theme={theme}>
                        <div className="grid grid-cols-2 gap-2">
                            {form.amplopDigital.map((amplop, idx) => (
                                <div
                                    key={idx}
                                    className="rounded p-2 text-xs w-full"
                                    style={{
                                        backgroundColor: colors.background,
                                        border: `1px solid ${colors.primary}20` // transparansi 12%
                                    }}
                                >
                                    <div className="font-semibold" style={{ color: colors.primary }}>
                                        {amplop.bank || 'Bank/E-Wallet'}
                                    </div>
                                    {amplop.nomor && (
                                        <div>
                                            <span className="font-mono" >{amplop.nomor}</span>
                                            {amplop.atasNama && (
                                                <span className="ml-2">
                                                    a.n. {amplop.atasNama}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {amplop.catatan && (
                                        <div className="italic" style={{ color: colors.secondary }}>
                                            {amplop.catatan}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </PreviewSection>
                )}

                {form.backsoundUrl && (
                    <div className="flex items-center justify-center gap-2 pt-2 border-t" style={{ borderColor: theme.colors.secondary }}>
                        <Music className="w-4 h-4" style={{ color: theme.colors.primary }} />
                        <span className="text-xs font-medium">Backsound: {backsoundLabel}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};