import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Image as ImageIcon, Palette } from "lucide-react";
import type { InvitationFormData } from '@/utils/caseTransform';

// Daftar gambar yang disediakan (pastikan file ini ada di folder public/covers/)
const predefinedCovers = [
    '/covers/cover1.jpg',
    '/covers/cover2.jpg',
    '/covers/cover3.jpg',
    '/covers/cover4.jpg',
];

type Props = {
    form: InvitationFormData;
    updateForm: (path: string, value: any) => void;
};

export const CoverBackgroundSelector: React.FC<Props> = ({ form, updateForm }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // --- TAMBAHKAN LOGIKA INI ---
            updateForm('coverTipe', 'upload'); // Otomatis pindah ke mode upload
            // ----------------------------
            updateForm('coverFile', file);
            updateForm('coverUrl', URL.createObjectURL(file)); // Untuk preview
        }
    };

    const handlePredefinedSelect = (url: string) => {
        updateForm('coverGambarPilihan', url);
        updateForm('coverFile', null);
        updateForm('coverUrl', null);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ImageIcon size={20} /> Latar Belakang Sampul
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs
                    value={form.coverTipe}
                    onValueChange={(value) => updateForm('coverTipe', value)}
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="warna"><Palette size={16} className="mr-2" />Warna</TabsTrigger>
                        <TabsTrigger value="gambar"><ImageIcon size={16} className="mr-2" />Pilih</TabsTrigger>
                        <TabsTrigger value="upload"><Camera size={16} className="mr-2" />Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value="warna" className="pt-4 text-sm text-center text-gray-500 italic">
                        Latar belakang akan menggunakan warna dari tema yang dipilih.
                    </TabsContent>
                    <TabsContent value="gambar" className="pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {predefinedCovers.map(url => (
                                <div
                                    key={url}
                                    onClick={() => handlePredefinedSelect(url)}
                                    className={`relative aspect-[9/16] rounded-md overflow-hidden cursor-pointer border-4 ${form.coverGambarPilihan === url ? 'border-primary' : 'border-transparent'}`}
                                >
                                    <img src={url} alt={url} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="upload" className="pt-4 flex justify-center">
                        <div className="w-48">
                            <Label htmlFor="cover-upload" className="w-full aspect-[9/16] rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden">
                                {form.coverFile ? (
                                    <img src={form.coverUrl!} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <Camera size={24} className="mx-auto" />
                                        <span className="text-xs mt-1">Pilih Gambar</span>
                                    </div>
                                )}
                            </Label>
                            <Input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};