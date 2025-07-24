import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw, Palette } from "lucide-react";
import { themes } from "@/types/theme";
import type { InvitationFormData } from '@/utils/caseTransform';
import type { CustomColors } from '@/types';

type Props = {
    form: InvitationFormData;
    updateForm: (path: string, value: any) => void;
};

export const ThemeSelector: React.FC<Props> = ({ form, updateForm }) => {
    // State lokal untuk mengelola input warna secara langsung
    const [localColors, setLocalColors] = useState<CustomColors | null>(form.customColors);

    // Efek untuk sinkronisasi state lokal dengan form utama
    useEffect(() => {
        // Jika form.customColors null, gunakan warna default dari tema yang dipilih
        if (!form.customColors) {
            const selectedTheme = themes.find(t => t.id === form.themeId) || themes[0];
            setLocalColors({
                primary: selectedTheme.primaryColor,
                secondary: selectedTheme.secondaryColor,
                background: selectedTheme.backgroundColor,
                foreground: selectedTheme.foregroundColor,
            });
        } else {
            // Jika ada, gunakan warna kustom dari form
            setLocalColors(form.customColors);
        }
    }, [form.themeId, form.customColors]);

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newThemeId = e.target.value;
        updateForm('themeId', newThemeId);
        // Hapus warna kustom agar kembali ke default tema baru
        updateForm('customColors', null);
    };

    const handleColorChange = (colorType: keyof CustomColors, value: string) => {
        if (localColors) {
            const updatedColors = { ...localColors, [colorType]: value };
            setLocalColors(updatedColors);
            updateForm('customColors', updatedColors);
        }
    };

    const handleResetColors = () => {
        // Cukup hapus customColors dari form, useEffect akan menanganinya
        updateForm('customColors', null);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Palette size={20} /> Pengaturan Tema & Warna
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

                {/* Kustomisasi Warna */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Label>Kustomisasi Warna</Label>
                        {form.customColors && (
                            <Button variant="ghost" size="sm" onClick={handleResetColors} className="flex items-center gap-1">
                                <RefreshCw size={14} /> Reset
                            </Button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {localColors && Object.entries({
                            primary: 'Warna Utama',
                            secondary: 'Warna Sekunder',
                            background: 'Warna Latar',
                            foreground: 'Warna Teks'
                        }).map(([key, label]) => (
                            <div key={key}>
                                <Label className="text-sm font-medium">{label}</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <input
                                        type="color"
                                        value={localColors[key as keyof CustomColors]}
                                        onChange={(e) => handleColorChange(key as keyof CustomColors, e.target.value)}
                                        className="w-8 h-8 p-0 border-none rounded cursor-pointer"
                                    />
                                    <Input
                                        type="text"
                                        value={localColors[key as keyof CustomColors]}
                                        onChange={(e) => handleColorChange(key as keyof CustomColors, e.target.value)}
                                        className="flex-1 px-2 py-1 text-sm border rounded bg-white"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};