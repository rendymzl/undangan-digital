import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getInvitationBySlug } from '@/features/invitations/invitationService';
import { Loader2 } from 'lucide-react';

export const UrlInputForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Ambil domain saat ini untuk placeholder
  const currentDomain = typeof window !== "undefined" ? window.location.origin : "https://domain-anda.com";
  const placeholderUrl = `${currentDomain}/budi-sri`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Harap masukkan URL undangan.");
      return;
    }
    setLoading(true);
    try {
      // Ekstrak slug dari URL
      const slug = new URL(url).pathname.replace('/', '');
      if (!slug) {
        throw new Error("URL tidak valid.");
      }

      // Cari undangan berdasarkan slug
      const { data: invitation, error } = await getInvitationBySlug(slug);
      if (error || !invitation) {
        throw new Error("Undangan dengan URL tersebut tidak ditemukan.");
      }

      // Arahkan ke halaman generator dengan ID yang benar
      navigate(`/dashboard/undang-tamu/${invitation.id}`);

    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Undang Tamu</CardTitle>
          <CardDescription>
            Masukkan URL undangan Anda untuk mulai membuat pesan personal untuk tamu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="invitation-url">URL Undangan</label>
              <Input
                id="invitation-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={placeholderUrl}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lanjutkan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};