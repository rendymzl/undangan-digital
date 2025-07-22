import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert } from "../components/ui/alert";
import { themes } from "../types/theme";
import { createInvitation } from "../features/invitations/invitationService";
import { useAuth } from "../features/auth/useAuth";
import { toast } from "sonner";
import DataMempelaiStep from "./buat-undangan/DataMempelaiStep";
import DetailAcaraStep from "./buat-undangan/DetailAcaraStep";
import CeritaCintaStep from "./buat-undangan/CeritaCintaStep";
import PreviewUndanganStep from "./buat-undangan/PreviewUndanganStep";
import { supabase } from '../lib/supabaseClient';
import type { Invitation } from "@/types/invitation";

const steps = [
  { number: 1, title: "Data Mempelai", description: "Masukkan nama mempelai dan orang tua" },
  { number: 2, title: "Detail Acara", description: "Tanggal, waktu, dan lokasi acara" },
  { number: 3, title: "Cerita Cinta", description: "Tulis cerita cinta kalian" },
  { number: 4, title: "Preview & Simpan", description: "Lihat hasil dan simpan undangan" }
];

// Cek apakah slug sudah ada di database
async function checkSlugExists(slug: string) {
  const { data } = await supabase
    .from('invitations')
    .select('id')
    .eq('slug', slug)
    .single();
  return !!data;
}

// Generate slug unik jika sudah ada yang sama
async function generateUniqueSlug(baseSlug: string) {
  let slug = baseSlug;
  let counter = 1;
  while (await checkSlugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

export default function BuatUndanganPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    nama_pria: "",
    nama_panggilan_pria: "",
    nama_wanita: "",
    nama_panggilan_wanita: "",
    anak_ke_pria: "",
    anak_ke_wanita: "",
    bapak_pria: "",
    ibu_pria: "",
    bapak_wanita: "",
    ibu_wanita: "",
    alm_bapak_pria: false,
    alm_ibu_pria: false,
    alm_bapak_wanita: false,
    alm_ibu_wanita: false,
    tanggal_akad: "",
    waktu_akad_mulai: "",
    waktu_akad_selesai: "",
    waktu_akad_sampai_selesai: false,
    lokasi_akad: "",
    lokasi_akad_lat: null,
    lokasi_akad_lng: null,
    lokasi_akad_url: "",
    tanggal_resepsi: "",
    waktu_resepsi_mulai: "",
    waktu_resepsi_selesai: "",
    waktu_resepsi_sampai_selesai: false,
    lokasi_resepsi: "",
    lokasi_resepsi_lat: null,
    lokasi_resepsi_lng: null,
    lokasi_resepsi_url: "",
    cerita_cinta: "",
    cover_url: "",
    tema: themes[0].id,
    backsound_url: "",
    custom_colors: null,
  });

  // Helper & validation functions (adaptasi dari SolidJS)
  const updateForm = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setValidationError("");
    setSubmitError("");
  };

  const validateWaktu = (mulai: string, selesai: string, sampaiSelesai: boolean): string | null => {
    if (!mulai) return null;
    if (sampaiSelesai) return null;
    if (!selesai) return null;
    const [hm, mm] = mulai.split(":").map(Number);
    const [hs, ms] = selesai.split(":").map(Number);
    const mulaiMenit = hm * 60 + mm;
    const selesaiMenit = hs * 60 + ms;
    if (selesaiMenit <= mulaiMenit) return "Waktu selesai harus lebih besar dari waktu mulai";
    return null;
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return form.nama_pria && form.nama_wanita && form.bapak_pria && form.ibu_pria && form.bapak_wanita && form.ibu_wanita;
      case 2:
        const hasAkad = form.tanggal_akad && form.lokasi_akad;
        const hasResepsi = form.tanggal_resepsi && form.lokasi_resepsi;
        if (!hasAkad && !hasResepsi) return false;
        if (validateWaktu(form.waktu_akad_mulai, form.waktu_akad_selesai, form.waktu_akad_sampai_selesai)) return false;
        if (validateWaktu(form.waktu_resepsi_mulai, form.waktu_resepsi_selesai, form.waktu_resepsi_sampai_selesai)) return false;
        return true;
      default:
        return true;
    }
  };

  const getValidationMessage = () => {
    switch (currentStep) {
      case 1:
        if (!form.nama_pria) return "Nama mempelai pria harus diisi";
        if (!form.nama_wanita) return "Nama mempelai wanita harus diisi";
        if (!form.bapak_pria) return "Nama bapak mempelai pria harus diisi";
        if (!form.ibu_pria) return "Nama ibu mempelai pria harus diisi";
        if (!form.bapak_wanita) return "Nama bapak mempelai wanita harus diisi";
        if (!form.ibu_wanita) return "Nama ibu mempelai wanita harus diisi";
        return "";
      case 2:
        const hasAkad = form.tanggal_akad && form.lokasi_akad;
        const hasResepsi = form.tanggal_resepsi && form.lokasi_resepsi;
        if (!hasAkad && !hasResepsi) return "Minimal harus mengisi detail akad atau resepsi (tanggal dan lokasi)";
        if (validateWaktu(form.waktu_akad_mulai, form.waktu_akad_selesai, form.waktu_akad_sampai_selesai)) return `Akad: ${validateWaktu(form.waktu_akad_mulai, form.waktu_akad_selesai, form.waktu_akad_sampai_selesai)}`;
        if (validateWaktu(form.waktu_resepsi_mulai, form.waktu_resepsi_selesai, form.waktu_resepsi_sampai_selesai)) return `Resepsi: ${validateWaktu(form.waktu_resepsi_mulai, form.waktu_resepsi_selesai, form.waktu_resepsi_sampai_selesai)}`;
        return "";
      default:
        return "";
    }
  };

  const nextStep = () => {
    setValidationError("");
    setSubmitError("");
    if (currentStep < 4) {
      if (isStepValid()) {
        setCurrentStep(currentStep + 1);
      } else {
        setValidationError(getValidationMessage());
      }
    }
  };
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setValidationError("");
      setSubmitError("");
    }
  };

  // Helper preview orang tua
  const formatOrangTua = (
    bapak: string,
    ibu: string,
    almBapak: boolean,
    almIbu: boolean,
    anakKe: string,
    isPria: boolean
  ): string | null => {
    const bapakTrim = bapak.trim();
    const ibuTrim = ibu.trim();
    const anakKeTrim = anakKe.trim();
    const bapakPrefix = almBapak ? "Alm. Bapak" : "Bapak";
    const ibuPrefix = almIbu ? "Alm. Ibu" : "Ibu";
    const anakPrefix = isPria ? "Putra" : "Putri";
    let orangTuaText = "";
    if (bapakTrim && ibuTrim) {
      orangTuaText = `${bapakPrefix} ${bapakTrim} & ${ibuPrefix} ${ibuTrim}`;
    } else if (bapakTrim) {
      orangTuaText = `${bapakPrefix} ${bapakTrim}`;
    } else if (ibuTrim) {
      orangTuaText = `${ibuPrefix} ${ibuTrim}`;
    } else {
      return null;
    }
    if (anakKeTrim) {
      return `${anakPrefix} ke-${anakKeTrim} dari ${orangTuaText}`;
    } else {
      return `${anakPrefix} dari ${orangTuaText}`;
    }
  };

  // Helper slug
  const generateSlug = () => {
    const nama = `${form.nama_pria}-${form.nama_wanita}`.toLowerCase();
    return nama.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  // Submit
  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError("");
    try {
      const baseSlug = generateSlug();
      const slug = await generateUniqueSlug(baseSlug);

      // Mapping data ke format camelCase sesuai tipe Invitation
      const invitationData: Invitation = {
        // Properti yang tidak ada di form, diisi default atau placeholder
        id: '', // Biasanya di-generate oleh database setelah penyimpanan
        createdAt: new Date().toISOString(), // Bisa di-set saat ini atau oleh server
        galeriAktif: false, // Nilai default, bisa diubah sesuai kebutuhan

        // Data yang berasal dari form
        userId: user!.id,
        slug,
        namaPria: form.nama_pria,
        namaPanggilanPria: form.nama_panggilan_pria,
        namaWanita: form.nama_wanita,
        namaPanggilanWanita: form.nama_panggilan_wanita,
        ortuPria: formatOrangTua(form.bapak_pria, form.ibu_pria, form.alm_bapak_pria, form.alm_ibu_pria, form.anak_ke_pria, true) || '',
        ortuWanita: formatOrangTua(form.bapak_wanita, form.ibu_wanita, form.alm_bapak_wanita, form.alm_ibu_wanita, form.anak_ke_wanita, false) || '',
        tanggalAkad: form.tanggal_akad || null,
        waktuAkadMulai: form.waktu_akad_mulai || null,
        waktuAkadSelesai: form.waktu_akad_selesai || null,
        lokasiAkad: form.lokasi_akad,
        lokasiAkadLat: form.lokasi_akad_lat || null,
        lokasiAkadLng: form.lokasi_akad_lng || null,
        lokasiAkadUrl: form.lokasi_akad_url || null,
        tanggalResepsi: form.tanggal_resepsi || null,
        waktuResepsiMulai: form.waktu_resepsi_mulai || null,
        waktuResepsiSelesai: form.waktu_resepsi_selesai || null,
        lokasiResepsi: form.lokasi_resepsi,
        lokasiResepsiLat: form.lokasi_resepsi_lat || null,
        lokasiResepsiLng: form.lokasi_resepsi_lng || null,
        lokasiResepsiUrl: form.lokasi_resepsi_url || null,
        ceritaCinta: form.cerita_cinta,
        coverUrl: form.cover_url,
        backsoundUrl: form.backsound_url || null,
        customColors: form.custom_colors || null,

        // Perubahan utama dari data asli Anda
        themeId: form.tema,
      };
      console.log('Saving invitation:', invitationData);
      const { data: savedData, error } = await createInvitation(invitationData);
      if (error) throw error;

      toast.success("Undangan berhasil dibuat!");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error('Error saving invitation:', error);
      if (typeof error === 'object' && error && 'code' in error && (error as any).code === '23505') {
        setSubmitError("Slug undangan sudah digunakan, silakan ubah nama mempelai atau tambahkan pembeda.");
      } else {
        setSubmitError("Gagal menyimpan undangan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Render step content (adaptasi dari SolidJS)
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DataMempelaiStep form={form} updateForm={updateForm} formatOrangTua={formatOrangTua} />
        );
      case 2:
        return (
          <DetailAcaraStep form={form} updateForm={updateForm} validateWaktu={validateWaktu} />
        );
      case 3:
        return (
          <CeritaCintaStep form={form} updateForm={updateForm} />
        );
      case 4:
        return (
          <PreviewUndanganStep form={{
            ...form,
            updateForm,
            userId: user!.id,
          }} formatOrangTua={formatOrangTua} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Buat Undangan Baru</h1>
        <p className="text-muted-foreground">Ikuti langkah-langkah berikut untuk membuat undangan digital yang menarik</p>
      </div>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div className="flex items-center" key={step.number}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.number
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border'
                }`}>
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-0.5 mx-2 ${currentStep > step.number ? 'bg-primary' : 'bg-border'
                  }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <h3 className="font-semibold">{steps[currentStep - 1].title}</h3>
          <p className="text-sm text-muted-foreground">{steps[currentStep - 1].description}</p>
          <div className="mt-2 text-xs text-muted-foreground">
            {currentStep === 1 && (
              <span className={isStepValid() ? "text-green-600" : "text-orange-600"}>
                {isStepValid() ? "✓ Data lengkap" : "⚠ Harap lengkapi nama mempelai dan orang tua"}
              </span>
            )}
            {currentStep === 2 && (
              <span className={isStepValid() ? "text-green-600" : "text-orange-600"}>
                {isStepValid() ? "✓ Detail acara lengkap" : "⚠ Minimal isi akad atau resepsi"}
              </span>
            )}
            {currentStep === 3 && (
              <span className="text-green-600">✓ Cerita cinta opsional</span>
            )}
          </div>
        </div>
      </div>
      {/* Form Content */}
      <Card>
        <div className="pt-6 px-6 pb-2">
          {renderStepContent()}
          {/* Validation Error */}
          {validationError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <span className="text-sm font-medium">{validationError}</span>
              </div>
            </div>
          )}
          {/* Submit Error */}
          {submitError && (
            <Alert variant="destructive" className="mt-4">
              {submitError}
            </Alert>
          )}
        </div>
      </Card>
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          Sebelumnya
        </Button>
        {currentStep < 4 ? (
          <Button onClick={nextStep} disabled={!isStepValid()} className={!isStepValid() ? "opacity-50 cursor-not-allowed" : ""}>
            Selanjutnya
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Menyimpan...
              </span>
            ) : (
              'Simpan Undangan'
            )}
          </Button>
        )}
      </div>
    </div>
  );
} 