import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Palette, Type } from "lucide-react";
import { palettes } from '@/types/palettes';
import { fontPairings, type FontPairing } from '@/types/fontPairings';
import type { InvitationFormData } from '@/utils/caseTransform';
import { themes, type NamedPalette } from '@/types';

type Props = {
    form: InvitationFormData;
    updateForm: (path: string, value: any) => void;
};

export const ThemeSelector: React.FC<Props> = ({ form, updateForm }) => {

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newThemeId = e.target.value;
        const selectedTheme = themes.find(t => t.id === newThemeId);
        if (!selectedTheme) return;

        // Update all related properties when the theme changes
        updateForm('themeId', selectedTheme.id);
        updateForm('fontTitle', selectedTheme.fontTitle);
        updateForm('fontText', selectedTheme.fontText);
        updateForm('customColors', selectedTheme.colors);
    };

    const handlePaletteSelect = (palette: NamedPalette) => {
        updateForm('customColors', palette.colors);
    };

    const handleFontPairingSelect = (pairing: FontPairing) => {
        updateForm('fontTitle', pairing.fontTitle);
        updateForm('fontText', pairing.fontText);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Palette size={20} /> Tema, Palet Warna & Font
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Pemilihan Tema */}
                <div>
                    <Label htmlFor="theme-select">Pilih Tema Desain</Label>
                    <select
                        id="theme-select"
                        value={form.themeId}
                        onChange={handleThemeChange}
                        className="w-full mt-1 border rounded p-2 bg-white"
                    >
                        {themes.map(theme => (
                            <option key={theme.id} value={theme.id}>{theme.name}</option>
                        ))}
                    </select>
                </div>

                {/* --- PERBAIKAN UTAMA: Grid Layout for Desktop --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t">
                    {/* Kolom Kiri: Pilihan Palet Warna */}
                    <div className="space-y-2">
                        <Label>Pilih Palet Warna</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {palettes.map((palette) => (
                                <div
                                    key={palette.name}
                                    onClick={() => handlePaletteSelect(palette)}
                                    className={`p-2 rounded-lg cursor-pointer border-2 ${JSON.stringify(form.customColors) === JSON.stringify(palette.colors) ? 'border-primary' : 'border-transparent'}`}
                                >
                                    <div className="flex h-12 rounded-md overflow-hidden">
                                        <div style={{ backgroundColor: palette.colors.primary }} className="w-1/2 h-full"></div>
                                        <div className="w-1/2 h-full flex flex-col">
                                            <div style={{ backgroundColor: palette.colors.secondary }} className="w-full h-1/2"></div>
                                            <div style={{ backgroundColor: palette.colors.background }} className="w-full h-1/2"></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-center mt-1">{palette.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Kolom Kanan: Pilihan Pasangan Font */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Type size={16} /> Pilih Pasangan Font</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {fontPairings.map((pairing) => (
                                <div
                                    key={pairing.name}
                                    onClick={() => handleFontPairingSelect(pairing)}
                                    className={`p-4 rounded-lg cursor-pointer border-2 text-center ${form.fontTitle === pairing.fontTitle && form.fontText === pairing.fontText ? 'border-primary' : 'border-gray-200'}`}
                                >
                                    <div className={`text-xl ${pairing.fontTitle}`}>Judul</div>
                                    <div className={`text-sm ${pairing.fontText}`}>Paragraf</div>
                                    <p className="text-xs text-muted-foreground mt-2">{pairing.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};