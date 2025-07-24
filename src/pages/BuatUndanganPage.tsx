import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert } from "../components/ui/alert";
import DetailAcaraStep from "./buat-undangan/detail-acara-step/DetailAcaraStep";
import CeritaCintaStep from "./buat-undangan/CeritaCintaStep";
import PreviewUndanganStep from "./buat-undangan/preview-undangan-step/PreviewUndanganStep";
import { useInvitationForm } from "@/hooks/useInvitationForm";
import DataMempelaiStep from "./buat-undangan/data-mempelai-step/DataMempelaiStep";
import React from "react";
import AmplopDigitalStep from "./buat-undangan/AmplopDigitalStep";
import GaleriFotoStep from "./buat-undangan/GaleriFotoStep";
import { formatOrangTua } from "@/utils/formatOrangTua";
import { CoverBackgroundSelector } from "./buat-undangan/CoverBackgroundSelector";

const steps = [
  { number: 1, title: "Data Mempelai", description: "Masukkan nama mempelai dan orang tua" },
  { number: 2, title: "Detail Acara", description: "Tanggal, waktu, dan lokasi acara" },
  { number: 3, title: "Cerita & Lainnya", description: "Tulis cerita dan detail tambahan" },
  { number: 4, title: "Preview & Simpan", description: "Lihat hasil dan simpan undangan" }
];

// Fungsi helper ini bisa diletakkan di sini atau dipindah ke file utils
// const formatOrangTua = (
//   bapak: string | null,
//   ibu: string | null,
//   almBapak: boolean,
//   almIbu: boolean,
//   anakKe: string | null,
//   isPria: boolean
// ): string | null => {
//   if (!bapak && !ibu) return null;
//   const bapakTrim = bapak?.trim();
//   const ibuTrim = ibu?.trim();
//   const anakKeTrim = anakKe?.trim();
//   const bapakPrefix = almBapak ? "Alm. Bapak" : "Bapak";
//   const ibuPrefix = almIbu ? "Almh. Ibu" : "Ibu";
//   const anakPrefix = isPria ? "Putra" : "Putri";

//   let orangTuaText = "";
//   if (bapakTrim && ibuTrim) {
//     orangTuaText = `${bapakPrefix} ${bapakTrim} & ${ibuPrefix} ${ibuTrim}`;
//   } else if (bapakTrim) {
//     orangTuaText = `${bapakPrefix} ${bapakTrim}`;
//   } else if (ibuTrim) {
//     orangTuaText = `${ibuPrefix} ${ibuTrim}`;
//   } else {
//     return null;
//   }

//   if (anakKeTrim) {
//     return `${anakPrefix} ke-${anakKeTrim} dari ${orangTuaText}`;
//   }
//   return `${anakPrefix} dari ${orangTuaText}`;
// };


export default function BuatUndanganPage() {
  // Panggil hook untuk mendapatkan semua state dan fungsi logika
  const {
    form,
    updateForm,
    currentStep,
    isEditMode,
    loading,
    validationError,
    submitError,
    nextStep,
    prevStep,
    handleSubmit,
    isStepValid,
    validateWaktu,
  } = useInvitationForm();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <DataMempelaiStep form={form} updateForm={updateForm} formatOrangTua={formatOrangTua} />;
      case 2:
        return <DetailAcaraStep form={form} updateForm={updateForm} />;
      case 3:
        return (
          <div className="space-y-8">
            <CeritaCintaStep form={form} updateForm={updateForm} />
            <CoverBackgroundSelector form={form} updateForm={updateForm} />
            <GaleriFotoStep form={form} updateForm={updateForm} />
            <AmplopDigitalStep value={form.amplopDigital} onChange={(data) => updateForm('amplopDigital', data)} />
          </div>
        );
      case 4:
        return <PreviewUndanganStep form={form} updateForm={updateForm} formatOrangTua={formatOrangTua} />;
      default:
        return null;
    }
  };

  if (loading && isEditMode) {
    return <div className="min-h-screen flex items-center justify-center">Memuat data undangan...</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{isEditMode ? 'Edit Undangan' : 'Buat Undangan Baru'}</h1>
        <p className="text-muted-foreground">{isEditMode ? 'Ubah detail undangan Anda di bawah ini.' : 'Ikuti langkah-langkah berikut untuk membuat undangan digital.'}</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-start">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              {/* Wadah untuk setiap langkah (Nomor + Judul) */}
              <div className="flex flex-col items-center text-center w-24">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-colors duration-300 ${currentStep >= step.number
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border'
                    }`}
                >
                  {step.number}
                </div>
                <h3
                  className={`mt-2 text-sm font-semibold transition-colors duration-300 ${currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'
                    }`}
                >
                  {step.title}
                </h3>
              </div>

              {/* Garis penghubung antar langkah */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mt-5 transition-colors duration-300 ${currentStep > step.number ? 'bg-primary' : 'bg-border'
                    }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <div className="p-4 sm:p-6">
          {renderStepContent()}
          {validationError && <Alert variant="destructive" className="mt-4">{validationError}</Alert>}
          {submitError && <Alert variant="destructive" className="mt-4">{submitError}</Alert>}
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1 || loading}>
          Sebelumnya
        </Button>
        {currentStep < 4 ? (
          <Button onClick={nextStep} disabled={!isStepValid() || loading}>
            Selanjutnya
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Simpan Undangan')}
          </Button>
        )}
      </div>
    </div>
  );
}