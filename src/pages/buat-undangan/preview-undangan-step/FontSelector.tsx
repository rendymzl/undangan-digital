import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Type } from "lucide-react";
import { fontPairings } from '@/types/fontPairings'; // <-- Import daftar pasangan font
import type { InvitationFormData } from '@/utils/data-transform';

type Props = {
    form: InvitationFormData;
    updateForm: (path: string, value: any) => void;
};

export const FontSelector: React.FC<Props> = ({ form, updateForm }) => {

    const handleFontChange = (pairing: { fontTitle: string, fontText: string }) => {
        updateForm('fontTitle', pairing.fontTitle);
        updateForm('fontText', pairing.fontText);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Type size={20} /> Pasangan Font
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Label>Pilih gaya tulisan untuk undangan Anda</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                    {fontPairings.map((pairing) => (
                        <div
                            key={pairing.name}
                            onClick={() => handleFontChange(pairing)}
                            className={`p-4 rounded-lg cursor-pointer border-2 text-center ${form.fontTitle === pairing.fontTitle ? 'border-primary' : 'border-gray-200'}`}
                        >
                            <div className={`text-xl ${pairing.fontTitle}`}>Judul</div>
                            <div className={`text-sm ${pairing.fontText}`}>Teks Paragraf</div>
                            <p className="text-xs text-muted-foreground mt-2">{pairing.name}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};