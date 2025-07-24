import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";
import React, { useEffect, useState } from "react";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, User, Camera } from "lucide-react";
import type { MempelaiFormData } from "@/utils/caseTransform";

// Definisikan tipe untuk props
type MempelaiFormProps = {
    data: MempelaiFormData; // Menerima objek data mempelai yang spesifik, bukan seluruh form
    updateForm: (path: string, value: any) => void;
    formatOrangTua: (bapak: string | null, ibu: string | null, almBapak: boolean, almIbu: boolean, anakKe: string | null, isPria: boolean) => string | null;
    gender: 'pria' | 'wanita';
    title: string;
    theme: {
        base: string;
        background: string;
        border: string;
    };
};

// Daftar avatar yang tersedia di folder public/avatar/
const avatars = {
    pria: ['/avatar/pria.png'],
    wanita: ['/avatar/wanita.png']
};

export const MempelaiFormCard: React.FC<MempelaiFormProps> = ({ data, updateForm, formatOrangTua, gender, title, theme }) => {
    // --- 2. Buat path dinamis untuk updateForm ---
    const formPath = `mempelai${gender === 'pria' ? 'Pria' : 'Wanita'}`;

    const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            updateForm(`${formPath}.fotoFile`, file);
            const previewUrl = URL.createObjectURL(file);
            updateForm(`${formPath}.foto`, previewUrl);
        }
    };

    const handleRemoveFoto = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        const fileInput = document.getElementById(data.nama) as HTMLInputElement; // Gunakan nama sebagai ID unik
        if (fileInput) fileInput.value = '';
        updateForm(`${formPath}.fotoFile`, null);
        updateForm(`${formPath}.foto`, "");
    };

    const handleAvatarSelect = (avatarUrl: string) => {
        updateForm(`${formPath}.foto`, avatarUrl);
        updateForm(`${formPath}.fotoFile`, null);
    };

    const handleFotoTipeChange = (tipe: 'upload' | 'avatar' | 'tanpa_foto') => {
        updateForm(`${formPath}.fotoTipe`, tipe);

        if (tipe === 'tanpa_foto') {
            handleRemoveFoto();
        } else if (tipe === 'avatar') {
            const isCurrentFotoAvatar = data.foto?.startsWith('/avatar/');
            if (!isCurrentFotoAvatar) {
                handleAvatarSelect(avatars[gender][0]);
            }
        }
    };

    useEffect(() => {
        const photoUrl = data.foto;
        return () => {
            if (photoUrl && photoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(photoUrl);
            }
        };
    }, [data.foto]);

    return (
        <Card className={`p-6 ${theme.border} ${theme.background}`}>
            <h3 className={`text-lg font-semibold ${theme.base} mb-6`}>{title}</h3>
            <div className="flex flex-col md:flex-row gap-8">
                {/* --- 3. Sesuaikan Akses Data dan Update di JSX --- */}
                {/* Kolom Kiri: Input Teks */}
                <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor={`${formPath}.nama`} className={theme.base}>Nama Lengkap *</Label>
                            <Input id={`${formPath}.nama`} className="bg-white" value={data.nama || ''} onChange={e => updateForm(`${formPath}.nama`, e.target.value)} placeholder="Nama Lengkap *" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor={`${formPath}.namaPanggilan`} className={theme.base}>Nama Panggilan</Label>
                            <Input id={`${formPath}.namaPanggilan`} className="bg-white" value={data.namaPanggilan || ''} onChange={e => updateForm(`${formPath}.namaPanggilan`, e.target.value)} placeholder="Nama Panggilan" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor={`${formPath}.anakKe`} className={theme.base}>Anak Ke</Label>
                        <Input id={`${formPath}.anakKe`} className="bg-white" value={data.anakKe || ''} onChange={e => { const numericValue = e.target.value.replace(/\D/g, ''); updateForm(`${formPath}.anakKe`, numericValue); }} placeholder="Contoh: 2" type="text" inputMode="numeric" />
                    </div>
                    <hr className="my-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor={`${formPath}.bapak`} className={theme.base}>Nama Bapak *</Label>
                            <Input id={`${formPath}.bapak`} className="bg-white" value={data.bapak || ''} onChange={e => updateForm(`${formPath}.bapak`, e.target.value)} placeholder="Nama Bapak *" />
                            <label htmlFor={`alm-bapak-${gender}`} className="flex items-center gap-2 mt-2 cursor-pointer select-none group">
                                <Checkbox id={`alm-bapak-${gender}`} checked={data.almBapak} onCheckedChange={checked => updateForm(`${formPath}.almBapak`, checked)} />
                                <span className={`text-sm ${theme.base}`}>Almarhum</span>
                            </label>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor={`${formPath}.ibu`} className={theme.base}>Nama Ibu *</Label>
                            <Input id={`${formPath}.ibu`} className="bg-white" value={data.ibu || ''} onChange={e => updateForm(`${formPath}.ibu`, e.target.value)} placeholder="Nama Ibu *" />
                            <label htmlFor={`alm-ibu-${gender}`} className="flex items-center gap-2 mt-2 cursor-pointer select-none group">
                                <Checkbox id={`alm-ibu-${gender}`} checked={data.almIbu} onCheckedChange={checked => updateForm(`${formPath}.almIbu`, checked)} />
                                <span className={`text-sm ${theme.base}`}>Almarhumah</span>
                            </label>
                        </div>
                    </div>
                    <hr className="my-4" />
                    <div className="flex flex-col gap-1">
                        <Label htmlFor={`${formPath}.instagram`} className={theme.base}>Link Instagram (Opsional)</Label>
                        <Input id={`${formPath}.instagram`} className="bg-white" value={data.instagram || ''} onChange={e => updateForm(`${formPath}.instagram`, e.target.value)} placeholder="https://instagram.com/username" />
                    </div>
                </div>

                {/* Kolom Kanan: Foto Profil */}
                <div className="w-full md:w-56 flex flex-col items-center">
                    <Label className={`${theme.base} mb-2`}>Foto Profil</Label>
                    <Tabs value={data.fotoTipe || 'upload'} onValueChange={(val) => handleFotoTipeChange(val as any)} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="upload">Upload</TabsTrigger>
                            <TabsTrigger value="avatar">Avatar</TabsTrigger>
                            <TabsTrigger value="tanpa_foto">Tanpa Foto</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="flex justify-center mt-4">
                            <div className="relative w-32 h-32">
                                <Input id={data.nama} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
                                <label htmlFor={data.nama} className="w-32 h-32 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed shadow-sm group bg-gray-50 hover:bg-gray-100">
                                    {data.foto && data.foto.startsWith('blob:') ? (
                                        <img src={data.foto} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <Camera className="w-8 h-8 text-gray-400 mx-auto" />
                                            <span className="text-xs text-gray-500 mt-1">Klik untuk upload</span>
                                        </div>
                                    )}
                                </label>
                                {data.foto && data.foto.startsWith('blob:') && (
                                    <Button onClick={handleRemoveFoto} variant="destructive" size="icon" className="absolute -top-1 -right-1 w-6 h-6 rounded-full z-10">
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="avatar" className="mt-4">
                            <div className="grid grid-cols-3 gap-2">
                                {avatars[gender].map(avatarUrl => (
                                    <div key={avatarUrl} onClick={() => handleAvatarSelect(avatarUrl)} className={`w-full pt-[100%] relative rounded-full cursor-pointer border-2 hover:border-blue-500 transition-colors ${data.foto === avatarUrl ? 'border-blue-500' : 'border-transparent'}`}>
                                        <img src={avatarUrl} alt="Avatar" className="absolute top-0 left-0 w-full h-full object-cover rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="tanpa_foto" className="flex items-center justify-center h-32 text-sm text-gray-500 italic mt-4">
                            Tidak ada gambar.
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div className={`${theme.background} border ${theme.border} p-3 rounded mt-6 ${theme.base} text-sm`}>
                Preview: {formatOrangTua(data.bapak, data.ibu, data.almBapak, data.almIbu, data.anakKe, gender === 'pria') || 'Isi nama bapak dan ibu untuk melihat preview'}
            </div>
        </Card>
    );
};