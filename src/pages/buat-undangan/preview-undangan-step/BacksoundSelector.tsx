// components/BacksoundSelector.tsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, UploadCloud } from "lucide-react";
import type { InvitationFormData } from '@/utils/caseTransform';

const BACKSOUND_LIST = [
    { value: 'perfect-ed-sheeran', label: 'Perfect (Ed Sheeran)', url: '/backsound/perfect-ed-sheeran.mp3' },
    { value: 'wedding-day', label: 'Wedding Day', url: '/backsound/wedding-day.mp3' },
    { value: 'kiss-the-rain', label: 'Kiss the Rain', url: '/backsound/kiss-the-rain.mp3' },
    { value: 'brian-crain-butterfly-waltz', label: 'Butterfly Waltz (Brian Crain)', url: '/backsound/brian-crain-butterfly-waltz.mp3' },
];

type Props = {
    form: InvitationFormData;
    updateForm: (path: string, value: any) => void;
};

export const BacksoundSelector: React.FC<Props> = ({ form, updateForm }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        updateForm('backsoundFile', file);
        const previewUrl = URL.createObjectURL(file);
        updateForm('backsoundUrl', previewUrl);
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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Music size={20} /> Backsound</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {form.backsoundUrl && <audio controls src={form.backsoundUrl} className="w-full" />}

                <div>
                    <Label htmlFor="backsound-select">Pilih dari Daftar</Label>
                    <select id="backsound-select" onChange={handleSelectChange} value={form.backsoundUrl?.startsWith('/') ? form.backsoundUrl : ''} className="w-full mt-1 border rounded p-2 bg-white">
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
                    <Input id="backsound-upload" type="file" accept="audio/mpeg, audio/wav" className="hidden" onChange={handleFileChange} />
                </div>
                {form.backsoundFile && <p className="text-xs text-green-600 text-center">File dipilih: {form.backsoundFile.name}</p>}
            </CardContent>
        </Card>
    );
};