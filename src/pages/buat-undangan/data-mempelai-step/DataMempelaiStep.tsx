import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MempelaiFormCard } from "./MempelaiFormCard";
import { Label } from "@/components/ui/label";
import type { InvitationFormData } from "@/utils/caseTransform";

type Props = {
  form: InvitationFormData;
  updateForm: (path: string, value: unknown) => void;
  formatOrangTua: (
    bapak: string | null,
    ibu: string | null,
    almBapak: boolean,
    almIbu: boolean,
    anakKe: string | null,
    isPria: boolean
  ) => string | null;
};

// Definisikan tema warna
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
  const renderMempelaiCards = (order: 'pria-first' | 'wanita-first') => (
    // --- PERBAIKAN UTAMA DI SINI ---
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {order === 'pria-first' ? (
        <>
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
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs
        value={form.urutanMempelai}
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

        <TabsContent value="pria-wanita" className="m-0">
          {renderMempelaiCards('pria-first')}
        </TabsContent>
        <TabsContent value="wanita-pria" className="m-0">
          {renderMempelaiCards('wanita-first')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataMempelaiStep;