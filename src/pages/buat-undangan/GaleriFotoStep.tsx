// Di dalam file GaleriFotoStep.tsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // Import Switch
import { Label } from "@/components/ui/label";   // Import Label
import type { InvitationFormData } from '@/utils/caseTransform';
import type { GaleriFoto } from '@/types';

type Props = {
  form: InvitationFormData;
  updateForm: (path: string, value: any) => void;
};

export const GaleriFotoStep: React.FC<Props> = ({ form, updateForm }) => {
  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: GaleriFoto[] = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      file: file,
    }));

    const updatedGaleri = [...(form.galeri || []), ...newPhotos];
    updateForm('galeri', updatedGaleri);

    // --- PERBAIKAN LOGIKA DI SINI ---
    // Jika galeri tidak kosong, otomatis aktifkan switch
    if (updatedGaleri.length > 0) {
      updateForm('galeriAktif', true);
    }
  };

  const handleRemoveFoto = (indexToRemove: number) => {
    const photoToRemove = form.galeri?.[indexToRemove];
    if (photoToRemove?.url.startsWith('blob:')) {
      URL.revokeObjectURL(photoToRemove.url);
    }

    const updatedGaleri = form.galeri?.filter((_, index) => index !== indexToRemove) || [];
    updateForm('galeri', updatedGaleri);

    // --- PERBAIKAN LOGIKA DI SINI ---
    // Jika setelah dihapus galeri menjadi kosong, otomatis matikan switch
    if (updatedGaleri.length === 0) {
      updateForm('galeriAktif', false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Galeri Foto (Opsional)</CardTitle>
        <CardDescription>Upload beberapa foto untuk ditampilkan di galeri undangan Anda.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* --- UI UNTUK UPLOAD --- */}
        <label
          htmlFor="galeri-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Klik untuk upload</span>
            </p>
            <p className="text-xs text-gray-500">PNG, JPG (Maks. 5MB per file)</p>
          </div>
          <Input
            id="galeri-upload"
            type="file"
            multiple
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={handleFilesChange}
          />
        </label>

        {/* --- TAMPILKAN PREVIEW DAN SWITCH HANYA JIKA ADA FOTO --- */}
        {form.galeri && form.galeri.length > 0 && (
          <div className="space-y-4">
            {/* Tombol Switch */}
            <div className="flex items-center space-x-2 pt-4 border-t">
              <Switch
                id="galeri-aktif"
                checked={form.galeriAktif}
                onCheckedChange={(checked) => updateForm('galeriAktif', checked)}
              />
              <Label htmlFor="galeri-aktif">Tampilkan galeri foto di undangan</Label>
            </div>

            {/* Preview Foto */}
            <div>
              <h4 className="font-semibold mb-2">Preview:</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {form.galeri.map((foto, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={foto.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="w-8 h-8 rounded-full"
                        onClick={() => handleRemoveFoto(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GaleriFotoStep;