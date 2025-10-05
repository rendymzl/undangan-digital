import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField, FormSection } from '@/components/shared/Forms';
import { toast } from 'sonner';
import type { Guest } from '@/types/guest';

export interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (guest: Omit<Guest, 'id'>) => void;
  initialData?: Partial<Guest>;
  title?: string;
}

const categories = [
  'Keluarga',
  'Teman',
  'Kerja',
  'Tetangga',
  'Lainnya',
];

export default function AddGuestModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = 'Tambah Tamu Baru',
}: AddGuestModalProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    category: initialData?.category || '',
    guestCount: initialData?.guestCount || 1,
    dietaryRestrictions: initialData?.dietaryRestrictions || '',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (formData.phone && !/^[\+]?[0-9\-\s\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori wajib dipilih';
    }

    if (formData.guestCount < 1) {
      newErrors.guestCount = 'Jumlah tamu minimal 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Mohon perbaiki kesalahan pada form');
      return;
    }

    setIsLoading(true);
    
    try {
      const guestData: Omit<Guest, 'id'> = {
        ...formData,
        rsvpStatus: 'pending',
        invitationSent: false,
      };

      await onSave(guestData);
      toast.success('Tamu berhasil ditambahkan');
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        category: '',
        guestCount: 1,
        dietaryRestrictions: '',
        notes: '',
      });
    } catch (error) {
      toast.error('Gagal menyimpan data tamu');
      console.error('Error saving guest:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <FormSection title="Informasi Dasar" description="Data utama tamu undangan">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nama Lengkap"
                required
                error={errors.name}
              >
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Masukkan nama lengkap"
                />
              </FormField>

              <FormField
                label="Kategori"
                required
                error={errors.category}
              >
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </FormSection>

          {/* Contact Information */}
          <FormSection title="Informasi Kontak" description="Data kontak untuk mengirim undangan">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Email"
                error={errors.email}
              >
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="nama@email.com"
                />
              </FormField>

              <FormField
                label="Nomor Telepon"
                error={errors.phone}
              >
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+62812345678"
                />
              </FormField>
            </div>

            <FormField
              label="Alamat"
            >
              <Input
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Alamat lengkap"
              />
            </FormField>
          </FormSection>

          {/* Additional Information */}
          <FormSection title="Informasi Tambahan" description="Detail tambahan tentang tamu">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Jumlah Tamu"
                required
                error={errors.guestCount}
              >
                <Input
                  type="number"
                  min="1"
                  value={formData.guestCount}
                  onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value) || 1)}
                />
              </FormField>

              <FormField
                label="Pantangan Makanan"
              >
                <Input
                  value={formData.dietaryRestrictions}
                  onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                  placeholder="Vegetarian, Halal, dll"
                />
              </FormField>
            </div>

            <FormField
              label="Catatan"
            >
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Catatan tambahan tentang tamu"
                rows={3}
              />
            </FormField>
          </FormSection>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}