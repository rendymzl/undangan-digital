import { useEffect, useRef, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { getGalleryPhotos, uploadPhoto, addPhotoMetadata } from "../features/gallery/galleryService";
import { getInvitationBySlug } from "../features/invitations/invitationService";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { themes } from "../types/theme";
import type { Invitation, InvitationPhoto } from '@/types';
import { photoFromApi, photoToApi } from '../utils/caseTransform';

type InvitationWithGaleri = import('@/types').Invitation & { galeri_aktif?: boolean };

export default function GaleriUndanganPage() {
  const { slug } = useParams<{ slug: string }>();
  const [invitation, setInvitation] = useState<InvitationWithGaleri | null>(null);
  const [photos, setPhotos] = useState<InvitationPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [theme, setTheme] = useState(themes[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (slug) {
      getInvitationBySlug(slug).then(({ data }) => {
        setInvitation(data);
        if (data) {
          const t = themes.find(t => t.id === data.tema) || themes[0];
          setTheme(t);
        }
        if (data && data.id && data.galeri_aktif) {
          getGalleryPhotos(data.id).then(({ data }) => {
            // Transformasi snake_case ke camelCase jika perlu
            const photosCamel: InvitationPhoto[] = (data || []).map(photoFromApi);
            setPhotos(photosCamel);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      });
    }
  }, [slug]);

  // const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!invitation) return;
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   setUploading(true);
  //   const { error: uploadError, filePath } = await uploadPhoto(file, invitation.id);
  //   if (uploadError) {
  //     toast.error(uploadError.message || "Gagal upload foto");
  //     setUploading(false);
  //     return;
  //   }
  //   const photoData: InvitationPhoto = {
  //     id: '',
  //     invitationId: invitation.id,
  //     url: filePath,
  //     createdAt: new Date().toISOString(),
  //   };
  //   await addPhotoMetadata(photoToApi(photoData));
  //   const { data } = await getGalleryPhotos(invitation.id);
  //   // Transformasi snake_case ke camelCase jika perlu
  //   const photosCamel: InvitationPhoto[] = (data || []).map(photoFromApi);
  //   setPhotos(photosCamel);
  //   setUploading(false);
  //   toast.success("Foto berhasil diupload!");
  //   if (fileInputRef.current) fileInputRef.current.value = "";
  // };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!invitation) return <div className="min-h-screen flex items-center justify-center">Undangan tidak ditemukan.</div>;
  if (!invitation.galeri_aktif) return <div className="min-h-screen flex items-center justify-center">Galeri tidak aktif untuk undangan ini.</div>;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: theme.backgroundColor }}
    >
      <Card className="max-w-xl w-full p-8 shadow-lg" style={{ background: theme.secondaryColor }}>
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: theme.primaryColor, fontFamily: theme.fontTitle }}
        >
          Galeri Foto Undangan
        </h2>
        <input type="file" accept="image/*" ref={fileInputRef} disabled={uploading} className="mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {photos.map((p, i) => (
            <img key={i} src={`https://YOUR_SUPABASE_URL/storage/v1/object/public/invitation_photos/${p.url}`} alt="foto" className="rounded shadow" />
          ))}
        </div>
      </Card>
    </div>
  );
} 