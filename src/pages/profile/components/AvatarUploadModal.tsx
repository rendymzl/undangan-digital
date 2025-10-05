import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/services/shared/toastService';
import { Upload, Camera, Trash2, Loader2 } from 'lucide-react';
import { uploadService } from '@/services/shared/uploadService';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onSave: (avatarUrl: string) => Promise<void>;
}

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  onSave,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadService.uploadAvatar(selectedFile);
      await onSave(uploadedUrl);
      toast.success('Avatar berhasil diperbarui');
      handleClose();
    } catch (error) {
      toast.error('Gagal mengupload avatar');
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploading(true);
    try {
      await onSave('');
      toast.success('Avatar berhasil dihapus');
      handleClose();
    } catch (error) {
      toast.error('Gagal menghapus avatar');
      console.error('Error removing avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    onClose();
  };

  const displayAvatar = previewUrl || currentAvatar;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ubah Avatar</DialogTitle>
          <DialogDescription>
            Upload foto profil baru atau hapus avatar yang ada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={displayAvatar} alt="Avatar preview" />
                <AvatarFallback className="text-2xl">
                  <Camera className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              
              {displayAvatar && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl('');
                  }}
                  disabled={isUploading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Upload Options */}
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              Pilih Foto Baru
            </Button>

            {selectedFile && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Guidelines */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Format yang didukung: JPG, PNG, GIF</p>
              <p>• Ukuran maksimal: 5MB</p>
              <p>• Rekomendasi: Foto persegi dengan resolusi minimal 200x200px</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {currentAvatar && (
            <Button
              variant="destructive"
              onClick={handleRemoveAvatar}
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus Avatar
            </Button>
          )}
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1 sm:flex-none"
            >
              Batal
            </Button>
            
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 sm:flex-none"
            >
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};