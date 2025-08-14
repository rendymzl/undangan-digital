import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { X, Camera } from "lucide-react";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { MempelaiFormData } from "@/utils/caseTransform";

// Define the type for props
type MempelaiFormProps = {
    data: MempelaiFormData;
    updateForm: (path: string, value: any) => void;
    formatOrangTua: (bapak: string | null, ibu: string | null, almBapak: boolean, almIbu: boolean, anakKe: string | null, isPria: boolean) => string | null;
    gender: 'pria' | 'wanita';
    title: string;
    theme: {
        base: string;
        background: string;
        border: string;
    };
};

const AVATAR_BUCKET_URL = "https://eylhalmtaelrpjnncoho.supabase.co/storage/v1/object/public/photos/avatars";

// Available avatars
const avatars = {
    pria: [`${AVATAR_BUCKET_URL}/pria/pria1.png`, `${AVATAR_BUCKET_URL}/pria/pria2.png`, `${AVATAR_BUCKET_URL}/pria/pria3.png`],
    wanita: [`${AVATAR_BUCKET_URL}/wanita/wanita1.png`, `${AVATAR_BUCKET_URL}/wanita/wanita2.png`, `${AVATAR_BUCKET_URL}/wanita/wanita3.png`, `${AVATAR_BUCKET_URL}/wanita/wanita4.png`, `${AVATAR_BUCKET_URL}/wanita/wanita5.png`]
};

export const MempelaiFormCard: React.FC<MempelaiFormProps> = ({ data, updateForm, formatOrangTua, gender, title, theme }) => {
    const formPath = `mempelai${gender === 'pria' ? 'Pria' : 'Wanita'}`;
    const isFotoActive = data.fotoTipe !== 'tanpa_foto';

    const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('handleFotoChange');
        const file = event.target.files?.[0];
        if (file) {
            updateForm(`${formPath}.fotoFile`, file);
            const previewUrl = URL.createObjectURL(file);
            updateForm(`${formPath}.foto`, previewUrl);
            updateForm(`${formPath}.fotoTipe`, 'upload'); // Ensure type is set to upload
        }
    };

    const handleRemoveFoto = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        const fileInput = document.getElementById(data.nama) as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        updateForm(`${formPath}.fotoFile`, null);
        updateForm(`${formPath}.foto`, "");
    };

    const handleAvatarSelect = (avatarUrl: string) => {
        updateForm(`${formPath}.foto`, avatarUrl);
        updateForm(`${formPath}.fotoFile`, null);
        updateForm(`${formPath}.fotoTipe`, 'avatar'); // Ensure type is set to avatar
    };

    const toggleFotoActive = (isActive: boolean) => {
        if (isActive) {
            // When re-enabling, default to 'upload' but don't select a file yet
            updateForm(`${formPath}.fotoTipe`, 'upload');
        } else {
            handleRemoveFoto();
            updateForm(`${formPath}.fotoTipe`, 'tanpa_foto');
        }
    };

    useEffect(() => {
        const photoUrl = data.foto;
        return () => {
            if (photoUrl && photoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(photoUrl);
            }
        };
    }, [data.foto]);

    return (
        <Card className={`p-6 ${theme.border} ${theme.background}`}>
            <h3 className={`text-lg font-semibold ${theme.base} mb-6`}>{title}</h3>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column: Text Inputs */}
                <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor={`${formPath}.nama`} className={theme.base}>Nama Lengkap *</Label>
                            <Input id={`${formPath}.nama`} className="bg-white" value={data.nama || ''} onChange={e => updateForm(`${formPath}.nama`, e.target.value)} placeholder="Nama Lengkap *" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor={`${formPath}.namaPanggilan`} className={theme.base}>Nama Panggilan</Label>
                            <Input id={`${formPath}.namaPanggilan`} className="bg-white" value={data.namaPanggilan || ''} onChange={e => updateForm(`${formPath}.namaPanggilan`, e.target.value)} placeholder="Nama Panggilan" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor={`${formPath}.anakKe`} className={theme.base}>Anak Ke</Label>
                        <Input id={`${formPath}.anakKe`} className="bg-white" value={data.anakKe || ''} onChange={e => updateForm(`${formPath}.anakKe`, e.target.value)} placeholder="Contoh: 2 atau Bungsu" type="text" />
                    </div>
                    <hr className="my-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor={`${formPath}.bapak`} className={theme.base}>Nama Bapak *</Label>
                            <Input id={`${formPath}.bapak`} className="bg-white" value={data.bapak || ''} onChange={e => updateForm(`${formPath}.bapak`, e.target.value)} placeholder="Nama Bapak *" />
                            <label htmlFor={`alm-bapak-${gender}`} className="flex items-center gap-2 mt-2 cursor-pointer select-none group">
                                <Checkbox id={`alm-bapak-${gender}`} checked={data.almBapak} onCheckedChange={checked => updateForm(`${formPath}.almBapak`, checked)} />
                                <span className={`text-sm ${theme.base}`}>Almarhum</span>
                            </label>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor={`${formPath}.ibu`} className={theme.base}>Nama Ibu *</Label>
                            <Input id={`${formPath}.ibu`} className="bg-white" value={data.ibu || ''} onChange={e => updateForm(`${formPath}.ibu`, e.target.value)} placeholder="Nama Ibu *" />
                            <label htmlFor={`alm-ibu-${gender}`} className="flex items-center gap-2 mt-2 cursor-pointer select-none group">
                                <Checkbox id={`alm-ibu-${gender}`} checked={data.almIbu} onCheckedChange={checked => updateForm(`${formPath}.almIbu`, checked)} />
                                <span className={`text-sm ${theme.base}`}>Almarhumah</span>
                            </label>
                        </div>
                    </div>
                    <hr className="my-4" />
                    <div className="flex flex-col gap-1">
                        <Label htmlFor={`${formPath}.instagram`} className={theme.base}>Link Instagram (Opsional)</Label>
                        <Input id={`${formPath}.instagram`} className="bg-white" value={data.instagram || ''} onChange={e => updateForm(`${formPath}.instagram`, e.target.value)} placeholder="https://instagram.com/username" />
                    </div>
                </div>

                {/* Right Column: Profile Photo */}
                <div className="w-full md:w-56 flex flex-col items-center">
                    <Label className={`${theme.base} mb-4`}>Foto Profil</Label>

                    <div className="flex items-center space-x-2 mb-4">
                        <Switch
                            id={`use-photo-${gender}`}
                            checked={isFotoActive}
                            onCheckedChange={toggleFotoActive}
                        />
                        <Label htmlFor={`use-photo-${gender}`}>Gunakan Foto Profil</Label>
                    </div>

                    {isFotoActive && (
                        <Tabs
                            value={data.fotoTipe}
                            onValueChange={(value) => {
                                if (value === 'avatar' && !data.foto?.startsWith('/avatar/')) {
                                    handleAvatarSelect(avatars[gender][0]);
                                }
                                updateForm(`${formPath}.fotoTipe`, value);
                            }}
                            className="w-full"
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="upload">Upload</TabsTrigger>
                                <TabsTrigger value="avatar">Pilih Avatar</TabsTrigger>
                            </TabsList>
                            <TabsContent value="upload" className="flex justify-center mt-4">
                                <div className="relative w-32 h-32">
                                    {/* Input file tersembunyi */}
                                    <Input
                                        id={`foto-upload-${gender}`}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFotoChange}
                                    />

                                    {/* Label upload foto */}
                                    <label
                                        htmlFor={`foto-upload-${gender}`}
                                        className="w-32 h-32 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed shadow-sm group bg-gray-50 hover:bg-gray-100"
                                    >
                                        {(data.foto && data.fotoTipe === 'upload') ? (
                                            <img src={data.foto} alt="Preview Foto" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center text-gray-500 flex flex-col items-center">
                                                <Camera className="w-8 h-8 mx-auto" />
                                                <span className="text-xs text-gray-500 mt-1">Klik untuk upload</span>
                                            </div>
                                        )}
                                    </label>

                                    {/* Tombol hapus foto */}
                                    {(data.foto && data.fotoTipe === 'upload') && (
                                        <Button
                                            type="button"
                                            onClick={handleRemoveFoto}
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -top-1 -right-1 w-6 h-6 rounded-full z-10"
                                            aria-label="Hapus foto"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="avatar" className="mt-4">
                                <div className="grid grid-cols-3 gap-2">
                                    {avatars[gender].map(avatarUrl => (
                                        <div key={avatarUrl} onClick={() => handleAvatarSelect(avatarUrl)} className={`w-full pt-[100%] relative rounded-full cursor-pointer border-2 hover:border-blue-500 transition-colors ${data.foto === avatarUrl ? 'border-blue-500' : 'border-transparent'}`}>
                                            <img src={avatarUrl} alt="Avatar" className="absolute top-0 left-0 w-full h-full object-cover rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </div>

            <div className={`${theme.background} border ${theme.border} p-3 rounded mt-6 ${theme.base} text-sm`}>
                Preview: {formatOrangTua(data.bapak, data.ibu, data.almBapak, data.almIbu, data.anakKe, gender === 'pria') || 'Isi nama bapak dan ibu untuk melihat preview'}
            </div>
        </Card>
    );
};