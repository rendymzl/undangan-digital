import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import React, { useEffect, useState } from "react";
import { Label } from "../../components/ui/label";
import { supabase } from "../../lib/supabaseClient";

type Props = {
  form: any;
  updateForm: (field: string, value: any) => void;
  formatOrangTua: (
    bapak: string,
    ibu: string,
    almBapak: boolean,
    almIbu: boolean,
    anakKe: string,
    isPria: boolean
  ) => string | null;
};

const generateBaseSlug = (
  namaPria: string, 
  namaWanita: string, 
  namaPanggilanPria: string, 
  namaPanggilanWanita: string
): string => {
  // Bersihkan nama dari karakter khusus dan ubah ke lowercase
  const cleanName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Hapus karakter khusus
      .replace(/\s+/g, '-'); // Ganti spasi dengan dash
  };

  // Gunakan nama panggilan jika ada, jika tidak gunakan nama lengkap
  const pria = cleanName(namaPanggilanPria || namaPria || '');
  const wanita = cleanName(namaPanggilanWanita || namaWanita || '');
  
  // Gabungkan nama dengan dash
  if (pria && wanita) {
    return `${pria}-${wanita}`;
  }
  
  // Jika hanya salah satu nama, gunakan yang ada
  return pria || wanita || '';
};

const checkSlugAvailability = async (slug: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('undangan')
    .select('slug')
    .eq('slug', slug)
    .single();

  if (error && error.code === 'PGRST116') {
    // PGRST116 berarti tidak ada data ditemukan, artinya slug tersedia
    return true;
  }

  return !data; // false jika data ditemukan (slug sudah ada)
};

const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
  // Coba baseSlug dulu
  if (await checkSlugAvailability(baseSlug)) {
    return baseSlug;
  }

  // Jika baseSlug sudah ada, tambahkan angka di belakang
  let counter = 1;
  let newSlug = '';
  
  do {
    newSlug = `${baseSlug}-${counter}`;
    counter++;
  } while (!(await checkSlugAvailability(newSlug)));

  return newSlug;
};

const DataMempelaiStep: React.FC<Props> = ({ form, updateForm, formatOrangTua }) => {
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);

  // Update slug saat nama berubah
  useEffect(() => {
    const updateSlug = async () => {
      if (isGeneratingSlug) return; // Hindari multiple calls
      if (!form.nama_pria && !form.nama_wanita) return; // Skip jika kedua nama kosong

      setIsGeneratingSlug(true);
      try {
        const baseSlug = generateBaseSlug(
          form.nama_pria || '', 
          form.nama_wanita || '',
          form.nama_panggilan_pria || '',
          form.nama_panggilan_wanita || ''
        );
        if (baseSlug) {
          const uniqueSlug = await generateUniqueSlug(baseSlug);
          if (uniqueSlug !== form.slug) {
            updateForm('slug', uniqueSlug);
          }
        }
      } catch (error) {
        console.error('Error generating slug:', error);
      } finally {
        setIsGeneratingSlug(false);
      }
    };

    const timeoutId = setTimeout(updateSlug, 500); // Debounce 500ms
    return () => clearTimeout(timeoutId);
  }, [
    form.nama_pria, 
    form.nama_wanita, 
    form.nama_panggilan_pria, 
    form.nama_panggilan_wanita
  ]);

  return (
    <div className="space-y-6">
      {/* Mempelai Pria */}
      <Card className="p-6 border-blue-200 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Mempelai Pria</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="nama_pria" className="text-blue-800">Nama Lengkap *</Label>
            <Input
              id="nama_pria"
              className="bg-white"
              value={form.nama_pria}
              onChange={e => updateForm("nama_pria", e.target.value)}
              placeholder="Nama Lengkap *"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="nama_panggilan_pria" className="text-blue-800">Nama Panggilan</Label>
            <Input
              id="nama_panggilan_pria"
              className="bg-white"
              value={form.nama_panggilan_pria}
              onChange={e => updateForm("nama_panggilan_pria", e.target.value)}
              placeholder="Nama Panggilan"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="anak_ke_pria" className="text-blue-800">Anak Ke</Label>
            <Input
              id="anak_ke_pria"
              className="bg-white"
              value={form.anak_ke_pria}
              onChange={e => updateForm("anak_ke_pria", e.target.value)}
              placeholder="Anak Ke"
              type="number"
              min="1"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="bapak_pria" className="text-blue-800">Nama Bapak *</Label>
            <Input
              id="bapak_pria"
              className="bg-white"
              value={form.bapak_pria}
              onChange={e => updateForm("bapak_pria", e.target.value)}
              placeholder="Nama Bapak *"
            />
            <label
              htmlFor="alm-bapak-pria"
              className="flex items-center gap-2 mt-2 cursor-pointer select-none group"
              style={{ userSelect: "none" }}
            >
              <Checkbox
                checked={form.alm_bapak_pria}
                onCheckedChange={checked => updateForm("alm_bapak_pria", checked)}
                id="alm-bapak-pria"
                className="bg-white border-blue-400 group-hover:border-blue-600"
              />
              <span className="text-sm text-blue-700">Almarhum</span>
            </label>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="ibu_pria" className="text-blue-800">Nama Ibu *</Label>
            <Input
              id="ibu_pria"
              className="bg-white"
              value={form.ibu_pria}
              onChange={e => updateForm("ibu_pria", e.target.value)}
              placeholder="Nama Ibu *"
            />
            <label
              htmlFor="alm-ibu-pria"
              className="flex items-center gap-2 mt-2 cursor-pointer select-none group"
              style={{ userSelect: "none" }}
            >
              <Checkbox
                checked={form.alm_ibu_pria}
                onCheckedChange={checked => updateForm("alm_ibu_pria", checked)}
                id="alm-ibu-pria"
                className="bg-white border-blue-400 group-hover:border-blue-600"
              />
              <span className="text-sm text-blue-700">Almarhumah</span>
            </label>
          </div>
        </div>
        <div className="bg-blue-100 border border-blue-200 p-3 rounded mt-4 text-blue-700 text-sm">
          Preview: {formatOrangTua(form.bapak_pria, form.ibu_pria, form.alm_bapak_pria, form.alm_ibu_pria, form.anak_ke_pria, true) || 'Isi nama bapak dan ibu untuk melihat preview'}
        </div>
      </Card>
      {/* Mempelai Wanita */}
      <Card className="p-6 border-pink-200 bg-pink-50">
        <h3 className="text-lg font-semibold text-pink-800 mb-4">Mempelai Wanita</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="nama_wanita" className="text-pink-800">Nama Lengkap *</Label>
            <Input
              id="nama_wanita"
              className="bg-white"
              value={form.nama_wanita}
              onChange={e => updateForm("nama_wanita", e.target.value)}
              placeholder="Nama Lengkap *"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="nama_panggilan_wanita" className="text-pink-800">Nama Panggilan</Label>
            <Input
              id="nama_panggilan_wanita"
              className="bg-white"
              value={form.nama_panggilan_wanita}
              onChange={e => updateForm("nama_panggilan_wanita", e.target.value)}
              placeholder="Nama Panggilan"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="anak_ke_wanita" className="text-pink-800">Anak Ke</Label>
            <Input
              id="anak_ke_wanita"
              className="bg-white"
              value={form.anak_ke_wanita}
              onChange={e => updateForm("anak_ke_wanita", e.target.value)}
              placeholder="Anak Ke"
              type="number"
              min="1"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="bapak_wanita" className="text-pink-800">Nama Bapak *</Label>
            <Input
              id="bapak_wanita"
              className="bg-white"
              value={form.bapak_wanita}
              onChange={e => updateForm("bapak_wanita", e.target.value)}
              placeholder="Nama Bapak *"
            />
            <label
              htmlFor="alm-bapak-wanita"
              className="flex items-center gap-2 mt-2 cursor-pointer select-none group"
              style={{ userSelect: "none" }}
            >
              <Checkbox
                checked={form.alm_bapak_wanita}
                onCheckedChange={checked => updateForm("alm_bapak_wanita", checked)}
                id="alm-bapak-wanita"
                className="bg-white border-pink-400 group-hover:border-pink-600"
              />
              <span className="text-sm text-pink-700">Almarhum</span>
            </label>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="ibu_wanita" className="text-pink-800">Nama Ibu *</Label>
            <Input
              id="ibu_wanita"
              className="bg-white"
              value={form.ibu_wanita}
              onChange={e => updateForm("ibu_wanita", e.target.value)}
              placeholder="Nama Ibu *"
            />
            <label
              htmlFor="alm-ibu-wanita"
              className="flex items-center gap-2 mt-2 cursor-pointer select-none group"
              style={{ userSelect: "none" }}
            >
              <Checkbox
                checked={form.alm_ibu_wanita}
                onCheckedChange={checked => updateForm("alm_ibu_wanita", checked)}
                id="alm-ibu-wanita"
                className="bg-white border-pink-400 group-hover:border-pink-600"
              />
              <span className="text-sm text-pink-700">Almarhumah</span>
            </label>
          </div>
        </div>
        <div className="bg-pink-100 border border-pink-200 p-3 rounded mt-4 text-pink-700 text-sm">
          Preview: {formatOrangTua(form.bapak_wanita, form.ibu_wanita, form.alm_bapak_wanita, form.alm_ibu_wanita, form.anak_ke_wanita, false) || 'Isi nama bapak dan ibu untuk melihat preview'}
        </div>
      </Card>
    </div>
  );
};

export default DataMempelaiStep; 