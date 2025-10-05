import { supabase } from '@/services/api/client';
import { toast } from './toastService';

export interface UploadOptions {
  bucket: string;
  folder?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  generateUniqueName?: boolean;
}

export interface UploadResult {
  url: string;
  path: string;
  filename: string;
  size: number;
  mimeType: string;
}

class UploadService {
  private readonly DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly DEFAULT_ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  private validateFile(file: File, options: UploadOptions): void {
    const maxSize = options.maxSize || this.DEFAULT_MAX_SIZE;
    const allowedTypes = options.allowedTypes || this.DEFAULT_ALLOWED_TYPES;

    if (file.size > maxSize) {
      throw new Error(`File terlalu besar. Maksimal ${this.formatFileSize(maxSize)}`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipe file tidak didukung. Hanya mendukung: ${allowedTypes.join(', ')}`);
    }
  }

  private generateFileName(originalName: string, generateUnique: boolean = true): string {
    if (!generateUnique) {
      return originalName;
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    
    return `${nameWithoutExt}_${timestamp}_${random}.${extension}`;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async uploadFile(file: File, options: UploadOptions): Promise<UploadResult> {
    try {
      // Validate file
      this.validateFile(file, options);

      // Generate file path
      const fileName = this.generateFileName(file.name, options.generateUniqueName);
      const filePath = options.folder ? `${options.folder}/${fileName}` : fileName;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(data.path);

      const result: UploadResult = {
        url: urlData.publicUrl,
        path: data.path,
        filename: fileName,
        size: file.size,
        mimeType: file.type,
      };

      toast.success(`File ${fileName} berhasil diupload`);
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengupload file';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async uploadMultipleFiles(
    files: File[],
    options: UploadOptions
  ): Promise<{
    successful: UploadResult[];
    failed: Array<{ filename: string; error: string }>;
  }> {
    const successful: UploadResult[] = [];
    const failed: Array<{ filename: string; error: string }> = [];

    for (const file of files) {
      try {
        const result = await this.uploadFile(file, options);
        successful.push(result);
      } catch (error) {
        failed.push({
          filename: file.name,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    if (successful.length > 0) {
      toast.success(`${successful.length} file berhasil diupload`);
    }

    if (failed.length > 0) {
      toast.error(`${failed.length} file gagal diupload`);
    }

    return { successful, failed };
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw new Error(error.message);
      }

      toast.success('File berhasil dihapus');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus file';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async getFileUrl(bucket: string, path: string): Promise<string> {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  // Helper method to create file input element
  createFileInput(
    options: {
      accept?: string;
      multiple?: boolean;
      onSelect: (files: FileList) => void;
    }
  ): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = options.accept || '';
    input.multiple = options.multiple || false;
    input.style.display = 'none';

    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        options.onSelect(target.files);
      }
    });

    return input;
  }

  // Helper method to trigger file selection
  selectFiles(options: {
    accept?: string;
    multiple?: boolean;
  }): Promise<FileList> {
    return new Promise((resolve, reject) => {
      const input = this.createFileInput({
        ...options,
        onSelect: (files) => {
          resolve(files);
          document.body.removeChild(input);
        },
      });

      document.body.appendChild(input);
      input.click();

      // Cleanup if user cancels
      setTimeout(() => {
        if (document.body.contains(input)) {
          document.body.removeChild(input);
          reject(new Error('File selection cancelled'));
        }
      }, 60000); // 1 minute timeout
    });
  }

  // Specialized method for avatar upload
  async uploadAvatar(file: File): Promise<string> {
    // Validate file first
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File terlalu besar. Maksimal 5MB');
    }
    
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      throw new Error('Tipe file tidak didukung. Hanya mendukung: JPEG, PNG, GIF, WebP');
    }

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For now, create a mock URL using FileReader
    // TODO: Replace with actual Supabase upload
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // In real implementation, this would be the uploaded file URL
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Gagal membaca file'));
      };
      reader.readAsDataURL(file);
    });

    // Original implementation (commented out for now):
    // const options: UploadOptions = {
    //   bucket: 'avatars',
    //   folder: 'user-avatars',
    //   maxSize: 5 * 1024 * 1024, // 5MB
    //   allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    //   generateUniqueName: true,
    // };
    // const result = await this.uploadFile(file, options);
    // return result.url;
  }

  // Specialized method for guest import files
  async uploadGuestImport(file: File): Promise<string> {
    const options: UploadOptions = {
      bucket: 'imports',
      folder: 'guest-imports',
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      generateUniqueName: true,
    };

    const result = await this.uploadFile(file, options);
    return result.url;
  }

  // Specialized method for invitation assets
  async uploadInvitationAsset(file: File): Promise<string> {
    const options: UploadOptions = {
      bucket: 'invitations',
      folder: 'assets',
      maxSize: 20 * 1024 * 1024, // 20MB
      allowedTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'audio/mpeg',
        'audio/wav',
      ],
      generateUniqueName: true,
    };

    const result = await this.uploadFile(file, options);
    return result.url;
  }
}

export const uploadService = new UploadService();