import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState } from 'react';
import { toast } from 'sonner';
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

type Props = {
  form: any;
  updateForm: (field: string, value: any) => void;
  validateWaktu: (mulai: string, selesai: string, sampaiSelesai: boolean) => string | null;
};

function LocationPicker({ lat, lng, onChange }: { lat?: number; lng?: number; onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return lat !== undefined && lng !== undefined ? <Marker position={[lat, lng]} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] })} /> : null;
}

const DetailAcaraStep: React.FC<Props> = ({ form, updateForm, validateWaktu }) => {
  const [errorWaktuAkad, setErrorWaktuAkad] = React.useState('');
  const [errorWaktuResepsi, setErrorWaktuResepsi] = React.useState('');
  const [resepsiTimeError, setResepsiTimeError] = useState<string>('');
  const [resepsiDateError, setResepsiDateError] = useState<string>('');
  const [akadLocationMode, setAkadLocationMode] = useState<'url' | 'pin'>(form.lokasi_akad_lat && form.lokasi_akad_lng ? 'pin' : 'url');
  const [resepsiLocationMode, setResepsiLocationMode] = useState<'url' | 'pin'>(form.lokasi_resepsi_lat && form.lokasi_resepsi_lng ? 'pin' : 'url');
  const [errorUrlAkad, setErrorUrlAkad] = useState<string>("");
  const [errorUrlResepsi, setErrorUrlResepsi] = useState<string>("");

  function handleWaktuSelesaiAkad(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    updateForm("waktu_akad_selesai", value);
    if (form.waktu_akad_mulai && value && value <= form.waktu_akad_mulai) {
      setErrorWaktuAkad('Jam selesai harus setelah dari jam mulai');
    } else {
      setErrorWaktuAkad('');
    }
  }
  function handleWaktuSelesaiResepsi(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    updateForm("waktu_resepsi_selesai", value);
    if (form.waktu_resepsi_mulai && value && value <= form.waktu_resepsi_mulai) {
      setErrorWaktuResepsi('Jam selesai harus setelah dari jam mulai');
    } else {
      setErrorWaktuResepsi('');
    }
  }

  function validateGoogleMapsUrl(url: string) {
    return /^https?:\/\/(www\.)?(google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)/.test(url);
  }

  const validateResepsiDate = (newDate: string) => {
    if (form.adaAkad && form.tanggal_akad && newDate) {
      const akadDate = new Date(form.tanggal_akad);
      const resepsiDate = new Date(newDate);

      // Reset waktu ke 00:00:00 untuk membandingkan tanggal saja
      akadDate.setHours(0, 0, 0, 0);
      resepsiDate.setHours(0, 0, 0, 0);

      if (resepsiDate < akadDate) {
        setResepsiDateError('Tanggal resepsi tidak boleh lebih awal dari tanggal akad');
        toast.error('Tanggal resepsi tidak boleh lebih awal dari tanggal akad');
        return false;
      }
    }
    setResepsiDateError('');
    return true;
  };

  const handleResepsiDateChange = (newDate: string) => {
    if (validateResepsiDate(newDate)) {
      updateForm('tanggal_resepsi', newDate);
      // Reset waktu resepsi jika tanggal berubah untuk memastikan validasi waktu ulang
      if (form.waktu_resepsi_mulai) {
        validateResepsiTime(form.waktu_resepsi_mulai);
      }
    }
  };

  const validateResepsiTime = (newTime: string) => {
    if (form.adaAkad && form.tanggal_akad && form.tanggal_resepsi && form.waktu_akad_mulai && newTime) {
      const akadDate = new Date(`${form.tanggal_akad}T${form.waktu_akad_mulai}`);
      const resepsiDate = new Date(`${form.tanggal_resepsi}T${newTime}`);

      if (resepsiDate < akadDate) {
        setResepsiTimeError('Waktu resepsi tidak boleh lebih awal dari waktu akad');
        toast.error('Waktu resepsi tidak boleh lebih awal dari waktu akad');
        return false;
      }
    }
    setResepsiTimeError('');
    return true;
  };

  const handleResepsiTimeChange = (newTime: string) => {
    if (validateResepsiTime(newTime)) {
      updateForm('waktu_resepsi_mulai', newTime);
    }
  };

  // Sinkronisasi lokasi resepsi jika sama dengan akad
  React.useEffect(() => {
    if (form.lokasiResepsiSamaDenganAkad) {
      updateForm('lokasi_resepsi', form.lokasi_akad);
      updateForm('lokasi_resepsi_lat', form.lokasi_akad_lat);
      updateForm('lokasi_resepsi_lng', form.lokasi_akad_lng);
      updateForm('lokasi_resepsi_url', form.lokasi_akad_url);
    }
    // eslint-disable-next-line
  }, [form.lokasi_akad, form.lokasi_akad_lat, form.lokasi_akad_lng, form.lokasi_akad_url, form.lokasiResepsiSamaDenganAkad]);

  return (
    <div className="space-y-6">
      <Card className="p-6 border-green-200 bg-green-50">
        <h3 className="text-lg font-semibold text-green-800">Detail Akad Nikah</h3>
        <div className="flex gap-4">
          <div className="flex flex-col gap-1 w-full">
            <Label htmlFor="tanggal-akad" className="px-1">Tanggal Akad</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="tanggal-akad"
                  className={"w-full justify-between font-normal bg-white" + (form.tanggal_akad ? "" : " text-muted-foreground")}
                >
                  {form.tanggal_akad ? format(new Date(form.tanggal_akad), "dd MMMM yyyy", { locale: localeId }) : "Pilih Tanggal Akad"}
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.tanggal_akad ? new Date(form.tanggal_akad) : undefined}
                  onSelect={date => updateForm("tanggal_akad", date ? format(date, "yyyy-MM-dd") : "")}
                  initialFocus
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Label htmlFor="waktu-akad-mulai" className="px-1">Waktu Akad Mulai</Label>
            <Input
              type="time"
              id="waktu-akad-mulai"
              value={form.waktu_akad_mulai}
              onChange={e => updateForm("waktu_akad_mulai", e.target.value)}
              defaultValue="08:00"
              className="bg-white appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
            <span className="text-xs text-gray-500">AM untuk pagi, PM untuk sore/malam</span>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4 rounded-lg group w-full">
          <div className="flex flex-col gap-1 w-full">
            <Label htmlFor="waktu-akad-selesai" className="px-1">Waktu Akad Selesai</Label>
            <div className="flex items-center gap-2 mt-1">
              <Checkbox
                checked={form.waktu_akad_sampai_selesai}
                onCheckedChange={checked => updateForm("waktu_akad_sampai_selesai", checked)}
                id="waktu-akad-sampai-selesai"
                className="bg-white border-green-400 group-hover:border-green-600"
              />
              <label
                htmlFor="waktu-akad-sampai-selesai"
                className="text-sm text-green-700 cursor-pointer select-none flex-1"
              >
                Sampai Selesai
              </label>
            </div>
            {!form.waktu_akad_sampai_selesai && (
              <>
                <Input type="time" id="waktu-akad-selesai" value={form.waktu_akad_selesai} onChange={handleWaktuSelesaiAkad} placeholder="Waktu Akad Selesai" className="bg-white appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none mt-1" defaultValue="17:00" />
                <span className="text-xs text-gray-500">AM untuk pagi, PM untuk sore/malam</span>
                {errorWaktuAkad && <span className="text-xs text-red-500 mt-1">{errorWaktuAkad}</span>}
              </>
            )}
          </div>
        </div>
        <Separator />
        <div>
          <Label className="block mb-1">Lokasi Akad</Label>
          {/* Input alamat lengkap selalu tampil */}
          <Textarea value={form.lokasi_akad} onChange={e => updateForm("lokasi_akad", e.target.value)} placeholder="Alamat lengkap atau nama lokasi" className="bg-white mb-2" />
          {/* Tabs untuk pilihan lokasi akad */}
          <Tabs value={akadLocationMode} onValueChange={val => { setAkadLocationMode(val as 'url' | 'pin'); if (val === 'url') { updateForm('lokasi_akad_lat', null); updateForm('lokasi_akad_lng', null); } }} className="mb-2">
            <TabsList>
              <TabsTrigger value="url">Input URL</TabsTrigger>
              <TabsTrigger value="pin">Pin di Peta</TabsTrigger>
            </TabsList>
            <TabsContent value="url">
              <Input
                value={form.lokasi_akad_url || ''}
                onChange={e => {
                  const val = e.target.value;
                  updateForm("lokasi_akad_url", val);
                  if (val && !validateGoogleMapsUrl(val)) {
                    setErrorUrlAkad("Masukkan link Google Maps yang valid");
                  } else {
                    setErrorUrlAkad("");
                  }
                }}
                placeholder="Link Google Maps"
                className="bg-white mb-2"
              />
              {errorUrlAkad && <span className="text-xs text-red-500">{errorUrlAkad}</span>}
            </TabsContent>
            <TabsContent value="pin">
              <div className="my-2">
                <MapContainer
                  center={[
                    typeof form.lokasi_akad_lat === 'number' ? form.lokasi_akad_lat : -6.2,
                    typeof form.lokasi_akad_lng === 'number' ? form.lokasi_akad_lng : 106.8
                  ]}
                  zoom={13}
                  style={{ height: 200, width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker
                    lat={typeof form.lokasi_akad_lat === 'number' ? form.lokasi_akad_lat : undefined}
                    lng={typeof form.lokasi_akad_lng === 'number' ? form.lokasi_akad_lng : undefined}
                    onChange={(lat, lng) => {
                      updateForm('lokasi_akad_lat', lat);
                      updateForm('lokasi_akad_lng', lng);
                    }}
                  />
                </MapContainer>
                <div className="text-xs text-gray-500 mt-1">Klik pada peta untuk memilih lokasi akad.</div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
      <Card className="p-6 border-purple-200 bg-purple-50">
        <h3 className="text-lg font-semibold text-purple-800">Detail Resepsi</h3>

        <div className="flex gap-4 mb-4">
          <div className="flex flex-col gap-1 w-full">
            <Label htmlFor="tanggal-resepsi" className="px-1">Tanggal Resepsi</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="tanggal-resepsi"
                  className={"w-full justify-between font-normal bg-white" + (form.tanggal_resepsi ? "" : " text-muted-foreground")}
                >
                  {form.tanggal_resepsi ? format(new Date(form.tanggal_resepsi), "dd MMMM yyyy", { locale: localeId }) : "Pilih Tanggal Resepsi"}
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.tanggal_resepsi ? new Date(form.tanggal_resepsi) : undefined}
                  onSelect={date => handleResepsiDateChange(date ? format(date, "yyyy-MM-dd") : "")}
                  initialFocus
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Label htmlFor="waktu-resepsi-mulai" className="px-1">Waktu Resepsi Mulai</Label>
            <Input
              type="time"
              id="waktu-resepsi-mulai"
              value={form.waktu_resepsi_mulai}
              onChange={e => handleResepsiTimeChange(e.target.value)}
              defaultValue="08:00"
              className="bg-white appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
            <span className="text-xs text-gray-500">AM untuk pagi, PM untuk sore/malam</span>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4 rounded-lg group w-full">
          <div className="flex flex-col gap-1 w-full">
            <Label htmlFor="waktu-resepsi-selesai" className="px-1">Waktu Resepsi Selesai</Label>
            <div className="flex items-center gap-2 mt-1">
              <Checkbox
                checked={form.waktu_resepsi_sampai_selesai}
                onCheckedChange={checked => updateForm("waktu_resepsi_sampai_selesai", checked)}
                id="waktu-resepsi-sampai-selesai"
                className="bg-white border-purple-400 group-hover:border-purple-600"
              />
              <label
                htmlFor="waktu-resepsi-sampai-selesai"
                className="text-sm text-purple-700 cursor-pointer select-none flex-1"
              >
                Sampai Selesai
              </label>
            </div>
            {!form.waktu_resepsi_sampai_selesai && (
              <>
                <Input type="time" id="waktu-resepsi-selesai" value={form.waktu_resepsi_selesai} onChange={handleWaktuSelesaiResepsi} placeholder="Waktu Resepsi Selesai" className="bg-white appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none mt-1" defaultValue="17:00" />
                <span className="text-xs text-gray-500">AM untuk pagi, PM untuk sore/malam</span>
                {errorWaktuResepsi && <span className="text-xs text-red-500 mt-1">{errorWaktuResepsi}</span>}
              </>
            )}
          </div>
        </div>
        <Separator />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 group">
            <Checkbox
              checked={!!form.lokasiResepsiSamaDenganAkad}
              onCheckedChange={checked => updateForm('lokasiResepsiSamaDenganAkad', checked)}
              id="lokasi-resepsi-sama"
              className="bg-white border-purple-400 group-hover:border-purple-600"
            />
            <label htmlFor="lokasi-resepsi-sama" className="text-sm text-purple-700 cursor-pointer select-none flex-1">
              Lokasi resepsi sama dengan akad
            </label>
          </div>
        </div>
        <div>
          <Label className="block mb-1">Lokasi Resepsi</Label>

          {/* Input alamat lengkap selalu tampil */}
          <Textarea value={form.lokasi_resepsi} onChange={e => updateForm("lokasi_resepsi", e.target.value)} placeholder="Alamat lengkap atau nama lokasi" className="bg-white mb-2" disabled={!!form.lokasiResepsiSamaDenganAkad} style={form.lokasiResepsiSamaDenganAkad ? { opacity: 0.6, pointerEvents: 'none' } : {}} />
          {/* Tabs untuk pilihan lokasi resepsi */}
          <Tabs value={resepsiLocationMode} onValueChange={val => { if (!form.lokasiResepsiSamaDenganAkad) { setResepsiLocationMode(val as 'url' | 'pin'); if (val === 'url') { updateForm('lokasi_resepsi_lat', null); updateForm('lokasi_resepsi_lng', null); } } }} className="mb-2">
            <TabsList>
              <TabsTrigger value="url" disabled={!!form.lokasiResepsiSamaDenganAkad}>Input URL</TabsTrigger>
              <TabsTrigger value="pin" disabled={!!form.lokasiResepsiSamaDenganAkad}>Pin di Peta</TabsTrigger>
            </TabsList>
            <TabsContent value="url">
              <Input
                value={form.lokasi_resepsi_url || ''}
                onChange={e => {
                  const val = e.target.value;
                  updateForm("lokasi_resepsi_url", val);
                  if (val && !validateGoogleMapsUrl(val)) {
                    setErrorUrlResepsi("Masukkan link Google Maps yang valid");
                  } else {
                    setErrorUrlResepsi("");
                  }
                }}
                placeholder="Link Google Maps"
                className="bg-white mb-2"
                disabled={!!form.lokasiResepsiSamaDenganAkad}
                style={form.lokasiResepsiSamaDenganAkad ? { opacity: 0.6, pointerEvents: 'none' } : {}}
              />
              {errorUrlResepsi && <span className="text-xs text-red-500">{errorUrlResepsi}</span>}
            </TabsContent>
            <TabsContent value="pin">
              <div className="my-2" style={form.lokasiResepsiSamaDenganAkad ? { opacity: 0.6, pointerEvents: 'none' } : {}}>
                <MapContainer
                  center={[
                    typeof form.lokasi_resepsi_lat === 'number' ? form.lokasi_resepsi_lat : -6.2,
                    typeof form.lokasi_resepsi_lng === 'number' ? form.lokasi_resepsi_lng : 106.8
                  ]}
                  zoom={13}
                  style={{ height: 200, width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker
                    lat={typeof form.lokasi_resepsi_lat === 'number' ? form.lokasi_resepsi_lat : undefined}
                    lng={typeof form.lokasi_resepsi_lng === 'number' ? form.lokasi_resepsi_lng : undefined}
                    onChange={(lat, lng) => {
                      if (!form.lokasiResepsiSamaDenganAkad) {
                        updateForm('lokasi_resepsi_lat', lat);
                        updateForm('lokasi_resepsi_lng', lng);
                      }
                    }}
                  />
                </MapContainer>
                <div className="text-xs text-gray-500 mt-1">Klik pada peta untuk memilih lokasi resepsi.</div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default DetailAcaraStep; 