// components/BacksoundSelector.tsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, UploadCloud } from "lucide-react";
import type { InvitationFormData } from '@/utils/data-transform';

const BACKSOUND_BUCKET_URL = "https://eylhalmtaelrpjnncoho.supabase.co/storage/v1/object/public/backsound";

const BACKSOUND_LIST = [
    { value: 'perfect-ed-sheeran', label: 'Perfect (Ed Sheeran)', url: `${BACKSOUND_BUCKET_URL}/perfect-ed-sheeran.mp3` },
    { value: 'Keep-the-Door-Open-Victor-Lundberg', label: 'Keep the Door Open (Victor Lundberg)', url: `${BACKSOUND_BUCKET_URL}/Keep-the-Door-Open-Victor-Lundberg.mp3` },
    { value: 'kiss-the-rain', label: 'Kiss the Rain', url: `${BACKSOUND_BUCKET_URL}/kiss-the-rain.mp3` },
    { value: 'brian-crain-butterfly-waltz', label: 'Butterfly Waltz (Brian Crain)', url: `${BACKSOUND_BUCKET_URL}/brian-crain-butterfly-waltz.mp3` },
    { value: 'Far-Away', label: 'Far Away', url: `${BACKSOUND_BUCKET_URL}/Far-Away.mp3` },
    { value: 'We-Ran-to-Meet-Magnus-Ludvigsson', label: 'We Ran to Meet Magnus Ludvigsson', url: `${BACKSOUND_BUCKET_URL}/We-Ran-to-Meet-Magnus-Ludvigsson.mp3` },
    { value: 'Bridal-March-From-Delsbo-Traditional', label: 'Bridal March From Delsbo Traditional', url: `${BACKSOUND_BUCKET_URL}/Bridal-March-From-Delsbo-Traditional.mp3` },
];

type Props = {
    form: InvitationFormData;
    updateForm: (path: string, value: any) => void;
};

export const BacksoundSelector: React.FC<Props> = ({ form, updateForm }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi ukuran file maksimal 5MB
        if (file.size > 5 * 1024 * 1024) {
            alert("Ukuran file maksimal 5MB.");
            e.target.value = '';
            return;
        }

        // Validasi tipe file
        if (!['audio/mpeg', 'audio/wav'].includes(file.type)) {
            alert("Format file tidak didukung. Hanya MP3 atau WAV.");
            e.target.value = '';
            return;
        }

        updateForm('backsoundFile', file);
        const previewUrl = URL.createObjectURL(file);
        updateForm('backsoundUrl', previewUrl);

        // Reset select jika upload file
        const selectInput = document.getElementById('backsound-select') as HTMLSelectElement;
        if (selectInput) {
            selectInput.value = '';
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUrl = e.target.value;
        updateForm('backsoundUrl', selectedUrl);
        updateForm('backsoundFile', null); // Hapus file jika memilih dari daftar

        const fileInput = document.getElementById('backsound-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    // Menentukan value select berdasarkan url backsound yang dipilih
    const getSelectedValue = () => {
        if (!form.backsoundUrl) return '';
        const found = BACKSOUND_LIST.find(item => item.url === form.backsoundUrl);
        return found ? found.url : '';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Music size={20} /> Backsound</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {form.backsoundUrl && (
                    <audio controls src={form.backsoundUrl} className="w-full">
                        Browser Anda tidak mendukung pemutar audio.
                    </audio>
                )}

                <div>
                    <Label htmlFor="backsound-select">Pilih dari Daftar</Label>
                    <select
                        id="backsound-select"
                        onChange={handleSelectChange}
                        value={getSelectedValue()}
                        className="w-full mt-1 border rounded p-2 bg-white"
                    >
                        <option value="">-- Pilih Lagu --</option>
                        {BACKSOUND_LIST.map(item => (
                            <option key={item.value} value={item.url}>{item.label}</option>
                        ))}
                    </select>
                </div>

                <div className="text-center text-sm text-gray-500">atau</div>

                <div>
                    <Label htmlFor="backsound-upload" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <UploadCloud className="w-6 h-6 mb-1 text-gray-500" />
                        <span className="text-sm text-gray-500">Upload Audio Anda</span>
                        <span className="text-xs text-gray-500">MP3, WAV (Maks 5MB)</span>
                    </Label>
                    <Input
                        id="backsound-upload"
                        type="file"
                        accept="audio/mpeg, audio/wav"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
                {form.backsoundFile && <p className="text-xs text-green-600 text-center">File dipilih: {form.backsoundFile.name}</p>}
            </CardContent>
        </Card>
    );
};