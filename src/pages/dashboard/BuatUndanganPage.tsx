import { useInvitationForm } from "@/hooks/useInvitationForm";
import DataMempelaiStep from "../buat-undangan/data-mempelai-step/DataMempelaiStep";
import { formatOrangTua } from "@/utils/text-formatting";
import DetailAcaraStep from "../buat-undangan/detail-acara-step/DetailAcaraStep";
import CeritaCintaStep from "../buat-undangan/CeritaCintaStep";
import { CoverBackgroundSelector } from "../buat-undangan/CoverBackgroundSelector";
import GaleriFotoStep from "../buat-undangan/GaleriFotoStep";
import AmplopDigitalStep from "../buat-undangan/AmplopDigitalStep";
import PreviewUndanganStep from "../buat-undangan/preview-undangan-step/PreviewUndanganStep";
import { Fragment } from "react";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { dummyInvitationData } from "@/utils/test-data";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";


const steps = [
  { number: 1, title: "Data Mempelai", description: "Masukkan nama mempelai dan orang tua" },
  { number: 2, title: "Detail Acara", description: "Tanggal, waktu, dan lokasi acara" },
  { number: 3, title: "Cerita & Lainnya", description: "Tulis cerita dan detail tambahan" },
  { number: 4, title: "Preview & Simpan", description: "Lihat hasil dan simpan undangan" }
];


export default function BuatUndanganPage() {
  // Panggil hook untuk mendapatkan semua state dan fungsi logika
  const {
    form, setForm,
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
  } = useInvitationForm();

  const fillWithDummyData = () => {
    // Gunakan setForm untuk menimpa seluruh state dengan data dummy
    setForm(dummyInvitationData);
    toast.success("Semua data telah diisi secara otomatis!");
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <DataMempelaiStep form={form} updateForm={updateForm} formatOrangTua={formatOrangTua} />;
      case 2:
        return <DetailAcaraStep form={form} updateForm={updateForm} />;
      case 3:
        return (
          // --- PERBAIKAN UTAMA DI SINI ---
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Kolom Kiri */}
            <div className="space-y-8">
              <CeritaCintaStep form={form} updateForm={updateForm} />
              {/* <CoverBackgroundSelector form={form} updateForm={updateForm} /> */}
            </div>
            {/* Kolom Kanan */}
            <div className="space-y-8">
              <GaleriFotoStep form={form} updateForm={updateForm} />
              <AmplopDigitalStep value={form.amplopDigital} onChange={(data) => updateForm('amplopDigital', data)} />
            </div>
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
    <div className="w-full max-w-6xl mx-auto py-8 px-4 pb-24 lg:pb-8">
      <div className="mb-8 border-b pb-8 w-full flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {/* Kiri: Judul & Deskripsi */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          <h1 className="text-2xl font-bold mb-2">
            {isEditMode ? 'Edit Undangan' : 'Buat Undangan Baru'}
          </h1>
          <p className="text-muted-foreground mb-4">
            {isEditMode
              ? 'Ubah detail undangan Anda di bawah ini.'
              : 'Ikuti langkah-langkah berikut untuk membuat undangan digital.'}
          </p>
          {!isEditMode && process.env.NODE_ENV === 'development' && (
            <Button variant="outline" onClick={fillWithDummyData}>
              <Wand2 className="mr-2 h-4 w-4" />
              Isi Data Otomatis
            </Button>
          )}
        </div>

        {/* Progress Steps */}
        <div className="w-full md:w-2/3">
          <div className="flex items-start overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <Fragment key={step.number}>
                {/* Wadah untuk setiap langkah (Nomor + Judul) */}
                <div className="flex flex-col items-center text-center min-w-[90px]">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-colors duration-300 ${currentStep >= step.number
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border'
                      }`}
                  >
                    {step.number}
                  </div>
                  <h3
                    className={`mt-2 text-xs md:text-sm font-semibold transition-colors duration-300 ${currentStep >= step.number
                      ? 'text-primary'
                      : 'text-muted-foreground'
                      }`}
                  >
                    {step.title}
                  </h3>
                </div>

                {/* Garis penghubung antar langkah */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mt-5 mx-1 md:mx-2 transition-colors duration-300 ${currentStep > step.number ? 'bg-primary' : 'bg-border'
                      }`}
                  ></div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      {/* <Card> */}
      <div>
        {renderStepContent()}
        {validationError && <Alert variant="destructive" className="mt-4">{validationError}</Alert>}
        {submitError && <Alert variant="destructive" className="mt-4">{submitError}</Alert>}
      </div>
      {/* </Card> */}

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 lg:relative bg-white lg:bg-transparent border-t lg:border-none p-4 lg:p-0 lg:mt-6 z-10">
        <div className="flex justify-between max-w-3xl mx-auto">
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
    </div>
  );
}