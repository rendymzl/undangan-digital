import React, { useEffect } from "react";
import { Card } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Checkbox } from "../../../components/ui/checkbox";
import type { InvitationFormData } from "@/utils/caseTransform";
import { AcaraForm } from "./AcaraForm";


type Props = {
  form: InvitationFormData;
  updateForm: (path: string, value: any) => void;
};

const DetailAcaraStep: React.FC<Props> = ({ form, updateForm }) => {
  // Sinkronisasi lokasi jika checkbox "lokasi sama" dicentang
  useEffect(() => {
    if (form.lokasiResepsiSamaDenganAkad) {
      updateForm('resepsi.lokasi', form.akad.lokasi);
      updateForm('resepsi.lokasiLat', form.akad.lokasiLat);
      updateForm('resepsi.lokasiLng', form.akad.lokasiLng);
      updateForm('resepsi.lokasiUrl', form.akad.lokasiUrl);
    }
  }, [form.akad, form.lokasiResepsiSamaDenganAkad, updateForm]);

  return (
    <div className="space-y-6">
      {/* --- KARTU AKAD NIKAH --- */}
      <Card className="p-6 border-green-200 bg-green-50 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-800">Detail Akad Nikah</h3>
          <div className="flex items-center space-x-2">
            <Label htmlFor="ada-akad" className="text-sm">Aktifkan Sesi</Label>
            <Switch
              id="ada-akad"
              checked={form.adaAkad}
              onCheckedChange={(checked) => updateForm('adaAkad', checked)}
            />
          </div>
        </div>

        {/* Form detail akad hanya muncul jika switch aktif */}
        {form.adaAkad && (
          <AcaraForm
            acaraData={form.akad}
            path="akad"
            updateForm={updateForm}
            themeColor="green"
          />
        )}
      </Card>

      {/* --- KARTU RESEPSI --- */}
      <Card className="p-6 border-purple-200 bg-purple-50 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-800">Detail Resepsi</h3>
          <div className="flex items-center space-x-2">
            <Label htmlFor="ada-resepsi" className="text-sm">Aktifkan Sesi</Label>
            <Switch
              id="ada-resepsi"
              checked={form.adaResepsi}
              onCheckedChange={(checked) => updateForm('adaResepsi', checked)}
            />
          </div>
        </div>

        {/* Form detail resepsi hanya muncul jika switch aktif */}
        {form.adaResepsi && (
          <div className="space-y-4">
            <AcaraForm
              acaraData={form.resepsi}
              path="resepsi"
              updateForm={updateForm}
              themeColor="purple"
              disabled={form.lokasiResepsiSamaDenganAkad}
            />

            <div className="flex items-center gap-2 pt-4 border-t">
              <Checkbox
                id="lokasi-sama"
                checked={form.lokasiResepsiSamaDenganAkad}
                onCheckedChange={(checked) => updateForm('lokasiResepsiSamaDenganAkad', checked)}
                disabled={!form.adaAkad} // Checkbox tidak aktif jika sesi akad tidak ada
              />
              <label
                htmlFor="lokasi-sama"
                className="text-sm text-purple-700 cursor-pointer select-none"
              >
                Lokasi sama dengan Akad
              </label>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DetailAcaraStep;