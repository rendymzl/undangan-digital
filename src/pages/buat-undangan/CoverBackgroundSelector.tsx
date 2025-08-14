import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Import Switch
import { Button } from "@/components/ui/button";
import { Camera, Image as ImageIcon, X } from "lucide-react";
import type { InvitationFormData } from '@/utils/caseTransform';
import type { CoverTipe } from '@/types';

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
    // Menentukan apakah mode gambar (upload/pilih) sedang aktif
    const isImageMode = form.coverTipe === 'upload' || form.coverTipe === 'gambar';

    // Menentukan sub-mode (upload atau pilih) jika mode gambar aktif
    const imageModeTab = isImageMode ? form.coverTipe : 'upload';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            updateForm('coverTipe', 'upload');
            updateForm('coverFile', file);
            updateForm('coverUrl', URL.createObjectURL(file));
        }
    };

    const handlePredefinedSelect = (url: string) => {
        updateForm('coverTipe', 'gambar');
        updateForm('coverGambarPilihan', url);
        updateForm('coverFile', null);
        updateForm('coverUrl', null);
    };

    const handleRemoveUploadedCover = () => {
        updateForm('coverFile', null);
        updateForm('coverUrl', null);
        // Kembali ke tipe 'warna' jika gambar dihapus
        updateForm('coverTipe', 'warna');
    };

    const toggleImageMode = (isActive: boolean) => {
        if (isActive) {
            // Saat diaktifkan, default ke 'gambar' dan pilih yang pertama
            handlePredefinedSelect(predefinedCovers[0]);
        } else {
            // Saat dinonaktifkan, kembali ke 'warna'
            updateForm('coverTipe', 'warna');
            updateForm('coverFile', null);
            updateForm('coverUrl', null);
            updateForm('coverGambarPilihan', null);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Background Cover
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* --- 1. Pilihan Utama: Pakai Gambar atau Warna --- */}
                <div className="flex items-center space-x-2">
                    <Switch
                        id="use-cover-image"
                        checked={isImageMode}
                        onCheckedChange={toggleImageMode}
                    />
                    <Label htmlFor="use-cover-image">Gunakan Gambar Latar</Label>
                </div>

                {/* --- 2. Pilihan Sekunder: Pilih atau Upload (Hanya muncul jika isImageMode aktif) --- */}
                {isImageMode ? (
                    <Tabs
                        value={imageModeTab}
                        onValueChange={(value) => updateForm('coverTipe', value as CoverTipe)}
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="gambar"><ImageIcon size={16} className="mr-2" />Pilih Gambar</TabsTrigger>
                            <TabsTrigger value="upload"><Camera size={16} className="mr-2" />Upload Sendiri</TabsTrigger>
                        </TabsList>
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
                            <div className="w-48 relative">
                                <Label htmlFor="cover-upload" className="w-full aspect-[9/16] rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden">
                                    {form.coverUrl && form.coverTipe === 'upload' ? (
                                        <img src={form.coverUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            <Camera size={24} className="mx-auto" />
                                            <span className="text-xs mt-1">Pilih Gambar</span>
                                        </div>
                                    )}
                                </Label>
                                <Input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                {form.coverUrl && form.coverTipe === 'upload' && (
                                    <Button onClick={handleRemoveUploadedCover} variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full">
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="pt-4 text-sm text-center text-gray-500 italic">
                        Latar belakang akan menggunakan warna dari tema yang dipilih.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};