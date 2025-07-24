import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";
import type { InvitationFormData } from '@/utils/caseTransform';
import type { GaleriFoto } from '@/types/galery';

type Props = {
  form: InvitationFormData;
  updateForm: (path: string, value: any) => void;
};

export const GaleriFotoStep: React.FC<Props> = ({ form, updateForm }) => {
  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPhotos: GaleriFoto[] = Array.from(files).map(file => ({
      url: URL.createObjectURL(file), // URL preview lokal
      file: file, // File mentah untuk diupload nanti
    }));

    // Tambahkan foto baru ke array yang sudah ada
    updateForm('galeri', [...(form.galeri || []), ...newPhotos]);
  };

  const handleRemoveFoto = (indexToRemove: number) => {
    const photoToRemove = form.galeri?.[indexToRemove];

    // Hapus URL blob dari memori jika ada
    if (photoToRemove?.url.startsWith('blob:')) {
      URL.revokeObjectURL(photoToRemove.url);
    }
    
    const updatedGaleri = form.galeri?.filter((_, index) => index !== indexToRemove);
    updateForm('galeri', updatedGaleri);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Galeri Foto</CardTitle>
        <CardDescription>Upload beberapa foto untuk ditampilkan di galeri undangan Anda. (Opsional)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label 
            htmlFor="galeri-upload" 
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Klik untuk upload</span> atau seret file
              </p>
              <p className="text-xs text-gray-500">PNG, JPG (Maks. 5MB per file)</p>
            </div>
            <Input 
              id="galeri-upload" 
              type="file" 
              multiple // Izinkan upload lebih dari satu file
              accept="image/png, image/jpeg"
              className="hidden" 
              onChange={handleFilesChange}
            />
          </label>
        </div>

        {form.galeri && form.galeri.length > 0 && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default GaleriFotoStep;