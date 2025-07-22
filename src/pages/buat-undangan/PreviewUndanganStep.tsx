import { Card } from "../../components/ui/card";
import React, { useRef, useEffect, useState } from "react";
import { Checkbox } from "../../components/ui/checkbox";
import { supabase } from '../../lib/supabaseClient';
import { Switch } from "../../components/ui/switch";
import { Image, Music, UploadCloud, RefreshCw, ExternalLink } from "lucide-react";
import { themes } from "../../types/theme";
import { useNavigate } from 'react-router-dom';
import { formatOrangTua } from '../../utils/formatOrangTua';
import { Button } from "../../components/ui/button";

type Props = {
  form: any;
  formatOrangTua: (
    bapak: string,
    ibu: string,
    almBapak: boolean,
    almIbu: boolean,
    anakKe: string,
    isPria: boolean
  ) => string | null;
};

const BACKSOUND_LIST = [
  {
    value: 'wedding-day',
    label: 'Wedding Day',
    url: '/backsound/wedding-day.mp3',
  },
  {
    value: 'perfect-ed-sheeran',
    label: 'Perfect (Ed Sheeran)',
    url: '/backsound/perfect-ed-sheeran.mp3',
  },
  {
    value: 'brian-crain-butterfly-waltz',
    label: 'Butterfly Waltz (Brian Crain)',
    url: '/backsound/brian-crain-butterfly-waltz.mp3',
  },
  {
    value: 'kiss-the-rain',
    label: 'Kiss The Rain',
    url: '/backsound/kiss-the-rain.mp3',
  },
];

const PreviewUndanganStep: React.FC<Props> = ({ form, formatOrangTua }) => {
  console.log('PreviewUndanganStep rendered', form);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  /* Comment sementara fitur upload audio user
  const [userAudios, setUserAudios] = useState<{ name: string; url: string }[]>([]);
  const [loadingAudios, setLoadingAudios] = useState(false);

  // Ambil daftar audio upload user
  const fetchUserAudios = async () => {
    if (!form.userId) return;
    setLoadingAudios(true);
    const { data: files, error } = await supabase.storage.from('backsound').list(`${form.userId}/`);
    if (!error && files) {
      const audios = files.filter(f => f.name.endsWith('.mp3') || f.name.endsWith('.wav') || f.name.endsWith('.ogg'))
        .map(f => ({
          name: f.name,
          url: supabase.storage.from('backsound').getPublicUrl(`${form.userId}/${f.name}`).data.publicUrl
        }));
      setUserAudios(audios);
    }
    setLoadingAudios(false);
  };

  useEffect(() => {
    fetchUserAudios();
    // eslint-disable-next-line
  }, [form.userId]);

  // Handler upload audio user
  const handleUserAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    setUploadProgress(0);
    const file = e.target.files?.[0];
    if (!file || !form.userId) return;
    if (userAudios.length >= 3) {
      setUploadError('Maksimal upload 3 audio!');
      return;
    }
    try {
      const filePath = `${form.userId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('backsound').upload(filePath, file, { upsert: false });
      if (uploadError) throw uploadError;
      await fetchUserAudios();
    } catch (err: any) {
      setUploadError(err.message || 'Gagal upload audio.');
    }
  };

  // Handler hapus audio user
  const handleDeleteUserAudio = async (fileName: string) => {
    if (!form.userId) return;
    await supabase.storage.from('backsound').remove([`${form.userId}/${fileName}`]);
    await fetchUserAudios();
    // Jika audio yang dihapus sedang dipilih, reset pilihan
    if (form.backsoundPilihan === `user-${fileName}`) {
      form.updateForm('backsoundPilihan', undefined);
      form.updateForm('backsoundUrl', undefined);
    }
  };
  */

  // Handler pilih backsound bawaan
  const handleBacksoundRadio = (value: string, url?: string) => {
    if (form.updateForm) {
      form.updateForm('backsoundPilihan', value);
      if (value !== 'custom') {
        form.updateForm('backsoundUrl', url);
        form.updateForm('backsound_url', url); // sinkron ke snake_case
        form.updateForm('backsoundFile', undefined);
      } else {
        form.updateForm('backsoundUrl', undefined);
        form.updateForm('backsound_url', undefined); // sinkron ke snake_case
      }
    }
  };

  // State untuk custom colors
  const [customColors, setCustomColors] = useState({
    primary: '',
    secondary: '',
    background: '',
    foreground: ''
  });

  // Dapatkan warna default dari tema yang dipilih
  const getDefaultColors = () => {
    const selectedTheme = themes.find(t => t.id === form.tema);
    if (!selectedTheme) return null;
    return {
      primary: selectedTheme.primaryColor,
      secondary: selectedTheme.secondaryColor,
      background: selectedTheme.backgroundColor,
      foreground: selectedTheme.foregroundColor
    };
  };

  // Set warna default saat tema berubah
  useEffect(() => {
    const defaultColors = getDefaultColors();
    if (defaultColors) {
      setCustomColors(defaultColors);
    }
  }, [form.tema]);

  // Handler reset warna ke default
  const handleResetColors = () => {
    const defaultColors = getDefaultColors();
    if (defaultColors) {
      setCustomColors(defaultColors);
    }
  };

  // Handler update warna
  const handleColorChange = (colorType: 'primary' | 'secondary' | 'background' | 'foreground', value: string) => {
    setCustomColors(prev => {
      const updated = { ...prev, [colorType]: value };
      if (form.updateForm) {
        form.updateForm('customColors', updated);
        form.updateForm('custom_colors', updated); // sinkron ke snake_case
      }
      return updated;
    });
  };

  // Cek apakah warna sudah dimodifikasi
  const isColorsModified = () => {
    const defaultColors = getDefaultColors();
    if (!defaultColors) return false;
    return Object.keys(defaultColors).some(key =>
      defaultColors[key as keyof typeof defaultColors] !== customColors[key as keyof typeof customColors]
    );
  };

  const navigate = useNavigate();

  const handlePreview = () => {
    // Generate preview ortu seperti di DataMempelaiStep
    const ortuPria = formatOrangTua(
      form.bapak_pria,
      form.ibu_pria,
      form.alm_bapak_pria,
      form.alm_ibu_pria,
      form.anak_ke_pria,
      true
    );
    const ortuWanita = formatOrangTua(
      form.bapak_wanita,
      form.ibu_wanita,
      form.alm_bapak_wanita,
      form.alm_ibu_wanita,
      form.anak_ke_wanita,
      false
    );
    const previewData = {
      ...form,
      customColors,
      galeri: form.galeri, // jika ada galeri di form
      backsound_url: form.backsoundUrl,
      backsoundPilihan: form.backsoundPilihan,
      galeriAktif: form.galeriAktif,
      ortuPria,
      ortuWanita,
    };
    const url = new URL(window.location.origin + '/preview/draft');
    sessionStorage.setItem('previewData', JSON.stringify(previewData));
    window.open(url, '_blank');
  };

  console.log('PreviewUndanganStep return', form);
  return (
    <div className="space-y-6">
      {/* Card setting galeri & backsound */}
      <Card className="p-6 border-rose-200 bg-gradient-to-br from-pink-50 to-rose-100 shadow">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-rose-700">
          <Image className="w-5 h-5" /> Galeri Foto
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <Switch
            checked={!!form.galeriAktif}
            onCheckedChange={checked => form.updateForm ? form.updateForm('galeriAktif', checked) : undefined}
            id="galeri-aktif"
          />
          <label htmlFor="galeri-aktif" className="text-sm select-none">Tampilkan galeri foto pada undangan</label>
        </div>
        {form.galeriAktif && (
          <div className="mb-4 p-3 bg-white border rounded text-sm text-gray-700">
            Upload galeri foto di sini (fitur upload bisa ditambahkan).
          </div>
        )}
      </Card>
      <Card className="p-6 border bg-gradient-to-br from-indigo-50 to-purple-100 shadow">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-purple-700">
          <Music className="w-5 h-5" /> Backsound
        </h3>
        {/* Audio preview utama */}
        <div className="mb-4">
          {form.backsoundUrl && (
            <audio controls src={form.backsoundUrl} className="w-full mb-2" />
          )}
        </div>
        <div className="font-semibold mb-2">Pilih Backsound:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BACKSOUND_LIST.map((item) => (
            <label key={item.value} className={`flex items-center gap-3 p-3 rounded-lg border transition cursor-pointer ${form.backsoundPilihan === item.value ? 'border-purple-500 bg-white/80 shadow' : 'border-transparent hover:border-purple-200 bg-white/60'}`}>
              <input
                type="radio"
                name="backsound"
                value={item.value}
                checked={form.backsoundPilihan === item.value}
                onChange={() => handleBacksoundRadio(item.value, item.url)}
                className="accent-purple-600"
              />
              <span className="font-medium text-sm flex-1">{item.label}</span>
            </label>
          ))}
        </div>

        {/* Comment sementara bagian upload audio user
        <div className="mt-6">
          <div className="font-semibold mb-2 flex items-center gap-2">
            <Music className="w-5 h-5" /> Audio Upload Kamu
            {loadingAudios && <span className="text-xs text-gray-500">Memuat...</span>}
          </div>
          <div className="flex flex-col gap-2">
            {userAudios.length === 0 && <div className="text-xs text-gray-500">Belum ada audio upload.</div>}
            {userAudios.map(audio => (
              <label key={audio.name} className={`flex items-center gap-3 p-3 rounded-lg border transition cursor-pointer ${form.backsoundPilihan === `user-${audio.name}` ? 'border-purple-500 bg-white/80 shadow' : 'border-transparent hover:border-purple-200 bg-white/60'}`}>
                <input
                  type="radio"
                  name="backsound"
                  value={`user-${audio.name}`}
                  checked={form.backsoundPilihan === `user-${audio.name}`}
                  onChange={() => {
                    form.updateForm('backsoundPilihan', `user-${audio.name}`);
                    form.updateForm('backsoundUrl', audio.url);
                    form.updateForm('backsoundFile', undefined);
                  }}
                  className="accent-purple-600"
                />
                <span className="font-medium text-sm flex-1">{audio.name}</span>
                <audio controls src={audio.url} className="w-32" />
                <button type="button" className="ml-2 text-xs text-red-500 hover:underline" onClick={e => { e.stopPropagation(); handleDeleteUserAudio(audio.name); }}>Hapus</button>
              </label>
            ))}
          </div>
          <div className="mt-3">
            <label htmlFor="user-audio-upload" className="flex items-center gap-2 cursor-pointer text-purple-700 font-medium border-2 border-dashed border-purple-300 rounded-lg p-3 bg-white/80 hover:border-purple-500 transition">
              <UploadCloud className="w-5 h-5" />
              <span>{userAudios.length < 3 ? 'Upload audio baru (maks 3)' : 'Maksimal 3 audio'}</span>
            </label>
            <input
              id="user-audio-upload"
              type="file"
              accept="audio/*"
              onChange={handleUserAudioUpload}
              className="hidden"
              disabled={userAudios.length >= 3}
            />
            {uploadError && <div className="text-red-500 text-xs mt-2">{uploadError}</div>}
          </div>
        </div>
        */}
      </Card>

      {/* Card pengaturan tema */}
      <Card className="p-6 border bg-gradient-to-br from-gray-50 to-slate-100 shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-700">Pengaturan Tema</h3>
          {isColorsModified() && (
            <button
              onClick={handleResetColors}
              className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
            >
              <RefreshCw className="w-4 h-4" />
              Reset ke Default
            </button>
          )}
        </div>
        <div className="mb-4">
          {/* Dropdown tema */}
          <div className="mb-4 flex flex-row items-center gap-2 justify-between">
            <div>
              <label className="text-sm font-medium mr-2">Tema:</label>
              <select
                value={form.tema}
                onChange={e => form.updateForm && form.updateForm('tema', e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                {themes.map(theme => (
                  <option key={theme.id} value={theme.id}>{theme.name}</option>
                ))}
              </select>
            </div>
            <Button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded font-semibold transition"
              style={{ background: customColors.primary, color: customColors.background }}
              onClick={handlePreview}
            >
              <ExternalLink className="w-5 h-5" />
              Preview di Tab Baru
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries({
            primary: 'Warna Utama',
            secondary: 'Warna Sekunder',
            background: 'Warna Latar',
            foreground: 'Warna Teks'
          }).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium">
                {label}
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={customColors[key as keyof typeof customColors]}
                    onChange={(e) => handleColorChange(key as keyof typeof customColors, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColors[key as keyof typeof customColors]}
                    onChange={(e) => handleColorChange(key as keyof typeof customColors, e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border rounded"
                    placeholder="#000000"
                  />
                </div>
              </label>
            </div>
          ))}
        </div>
        {/* Preview warna visual */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg p-4 shadow border" style={{ background: customColors.background }}>
            <div className="mb-2 text-xs text-gray-500">Contoh Background</div>
            <div className="rounded-lg p-3 mb-2" style={{ background: customColors.primary, color: customColors.background, fontWeight: 600 }}>
              Warna Utama (Primary)
            </div>
            <div className="rounded-lg p-3 mb-2" style={{ background: customColors.secondary, color: customColors.primary, fontWeight: 600 }}>
              Warna Sekunder (Secondary)
            </div>
            <div className="p-2" style={{ color: customColors.foreground }}>
              Teks dengan warna foreground
            </div>
            <button
              className="mt-3 px-4 py-2 rounded font-semibold shadow"
              style={{ background: customColors.primary, color: customColors.background }}
              type="button"
            >
              Contoh Tombol
            </button>
          </div>
          <div className="rounded-lg p-4 shadow border flex flex-col gap-2 items-center justify-center" style={{ background: customColors.secondary }}>
            {/* <div className="text-xs text-gray-500 mb-2">Contoh Card</div> */}
            {/* <div className="rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold" style={{ background: customColors.primary, color: customColors.background }}>
              AA
            </div> */}
            <div className={`${themes.find(t => t.id === form.tema)?.fontTitle || ''} text-4xl`} style={{ color: customColors.primary }}>Text Judul</div>
            <div className={`${themes.find(t => t.id === form.tema)?.fontText || ''} text-sm`} style={{ color: customColors.foreground }}>Text Kalimat</div>
          </div>
        </div>
      </Card>

      {/* Card preview undangan digital */}
      <Card
        className={`p-0 border-2 shadow-lg overflow-hidden max-w-md mx-auto ${themes.find(t => t.id === form.tema)?.fontText || ''}`}
        style={{ background: customColors.background }}
      >
        <div
          className={`w-full max-w-[400px] mx-auto rounded-b-2xl overflow-hidden ${themes.find(t => t.id === form.tema)?.fontTitle || ''}`}
          style={{ background: customColors.primary, color: customColors.background }}
        >
          <div className="flex flex-col items-center py-8 px-4">
            {/* <div className={`rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold mb-2 shadow-lg ${themes.find(t => t.id === form.tema)?.fontTitle || ''}`} style={{ background: customColors.secondary, color: customColors.primary }}>
              {form.nama_pria?.[0] || 'A'}&{form.nama_wanita?.[0] || 'A'}
            </div> */}
            <div className={`text-2xl mb-1 ${themes.find(t => t.id === form.tema)?.fontTitle || ''}`}>{form.nama_pria} &amp; {form.nama_wanita}</div>
            <div className="text-sm mb-2" style={{ color: customColors.background, opacity: 0.8 }}>{form.cerita_cinta?.slice(0, 60) || ''}</div>
            <div className={`flex flex-col items-center gap-1 mt-2 ${themes.find(t => t.id === form.tema)?.fontText || ''}`}>
              <div className="text-xs" style={{ color: customColors.background }}>
                {form.tanggal_akad} &bull; {form.lokasi_akad}
              </div>
              <div className="text-xs" style={{ color: customColors.background }}>
                {form.tanggal_resepsi} &bull; {form.lokasi_resepsi}
              </div>
            </div>
            {form.backsoundUrl && (
              <div className="mt-4 flex items-center gap-2 bg-white/30 px-3 py-1 rounded-full shadow-inner" style={{ color: customColors.background, border: `1px solid ${customColors.background}` }}>
                <Music className="w-4 h-4" />
                <span className={`text-xs font-medium ${themes.find(t => t.id === form.tema)?.fontText || ''}`}>Backsound: {BACKSOUND_LIST.find(b => b.url === form.backsoundUrl)?.label || 'Custom'}</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-6 flex flex-col gap-2">
          <div className={`mb-2 text-center ${themes.find(t => t.id === form.tema)?.fontText || ''}`}>Orang Tua Pria: {formatOrangTua(form.bapak_pria, form.ibu_pria, form.alm_bapak_pria, form.alm_ibu_pria, form.anak_ke_pria, true)}</div>
          <div className={`mb-2 text-center ${themes.find(t => t.id === form.tema)?.fontText || ''}`}>Orang Tua Wanita: {formatOrangTua(form.bapak_wanita, form.ibu_wanita, form.alm_bapak_wanita, form.alm_ibu_wanita, form.anak_ke_wanita, false)}</div>
          <div className="mb-2 text-center">Tanggal Akad: {form.tanggal_akad} {form.waktu_akad_mulai} {form.waktu_akad_sampai_selesai ? "- Selesai" : form.waktu_akad_selesai ? `- ${form.waktu_akad_selesai}` : ""}</div>
          <div className="mb-2 text-center">Lokasi Akad: {form.lokasi_akad}</div>
          <div className="mb-2 text-center">Tanggal Resepsi: {form.tanggal_resepsi} {form.waktu_resepsi_mulai} {form.waktu_resepsi_sampai_selesai ? "- Selesai" : form.waktu_resepsi_selesai ? `- ${form.waktu_resepsi_selesai}` : ""}</div>
          <div className="mb-2 text-center">Lokasi Resepsi: {form.lokasi_resepsi}</div>
        </div>
      </Card>
    </div>
  );
};

export default PreviewUndanganStep; 