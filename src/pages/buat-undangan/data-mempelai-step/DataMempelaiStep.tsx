import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MempelaiFormCard } from "./MempelaiFormCard";
import { Label } from "@/components/ui/label";
import type { InvitationFormData } from "@/utils/caseTransform";

// --- 2. Perbaiki definisi Props ---
type Props = {
  form: InvitationFormData; // Gunakan tipe yang spesifik, bukan 'any'
  updateForm: (path: string, value: unknown) => void; // 'unknown' lebih aman dari 'any'
  formatOrangTua: (
    bapak: string | null,
    ibu: string | null,
    almBapak: boolean,
    almIbu: boolean,
    anakKe: string | null,
    isPria: boolean
  ) => string | null;
};

// Definisikan tema warna untuk masing-masing gender
const priaTheme = {
  base: "text-blue-800",
  background: "bg-blue-50",
  border: "border-blue-200",
};

const wanitaTheme = {
  base: "text-pink-800",
  background: "bg-pink-50",
  border: "border-pink-200",
};

const DataMempelaiStep: React.FC<Props> = ({ form, updateForm, formatOrangTua }) => {
  return (
    <div className="space-y-6">
      <Tabs
        value={form.urutanMempelai} // <-- 3. Gunakan camelCase
        onValueChange={(value) => updateForm("urutanMempelai", value)}
        className="w-full"
      >
        <div className="flex flex-col items-center mb-6">
          <Label className="text-base font-semibold text-gray-800 mb-2">Urutan Mempelai</Label>
          <TabsList>
            <TabsTrigger value="pria-wanita">Pria - Wanita</TabsTrigger>
            <TabsTrigger value="wanita-pria">Wanita - Pria</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pria-wanita" className="space-y-6 m-0">
          {/* --- 4. Oper data yang lebih spesifik ke komponen anak --- */}
          <MempelaiFormCard
            gender="pria"
            title="Mempelai Pria"
            theme={priaTheme}
            data={form.mempelaiPria}
            updateForm={updateForm}
            formatOrangTua={formatOrangTua}
          />
          <MempelaiFormCard
            gender="wanita"
            title="Mempelai Wanita"
            theme={wanitaTheme}
            data={form.mempelaiWanita}
            updateForm={updateForm}
            formatOrangTua={formatOrangTua}
          />
        </TabsContent>
        <TabsContent value="wanita-pria" className="space-y-6 m-0">
          <MempelaiFormCard
            gender="wanita"
            title="Mempelai Wanita"
            theme={wanitaTheme}
            data={form.mempelaiWanita}
            updateForm={updateForm}
            formatOrangTua={formatOrangTua}
          />
          <MempelaiFormCard
            gender="pria"
            title="Mempelai Pria"
            theme={priaTheme}
            data={form.mempelaiPria}
            updateForm={updateForm}
            formatOrangTua={formatOrangTua}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataMempelaiStep;