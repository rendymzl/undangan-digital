import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { getInvitationById, createInvitation, updateInvitation } from '@/features/invitations/invitationService';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { amplopToApi, invitationToApi, invitationToForm, type InvitationFormData } from '@/utils/caseTransform';
import { themes } from '@/types/theme';

// Mendefinisikan state awal di luar hook agar tidak dibuat ulang setiap render
const initialFormState: InvitationFormData = {
    // Properti level atas
    slug: "",
    urutanMempelai: "pria-wanita",
    lokasiResepsiSamaDenganAkad: false,
    ceritaCinta: "",
    coverUrl: null,
    coverTipe: 'warna', // Default adalah warna
    coverGambarPilihan: null,
    coverFile: null,
    themeId: themes[0].id,
    galeriAktif: false,
    backsoundUrl: "",
    customColors: null,
    adaAkad: true,
    adaResepsi: true,
    amplopDigital: [],
    galeri: [],
    backsoundFile: null,


    // Objek untuk Mempelai Pria
    mempelaiPria: {
        nama: "",
        namaPanggilan: "",
        anakKe: "",
        bapak: "",
        ibu: "",
        almBapak: false,
        almIbu: false,
        instagram: "",
        foto: "",
        fotoTipe: 'upload',
        fotoFile: null,
    },

    // Objek untuk Mempelai Wanita
    mempelaiWanita: {
        nama: "",
        namaPanggilan: "",
        anakKe: "",
        bapak: "",
        ibu: "",
        almBapak: false,
        almIbu: false,
        instagram: "",
        foto: "",
        fotoTipe: 'upload',
        fotoFile: null,
    },

    // Objek untuk Akad
    akad: {
        tanggal: "",
        waktuMulai: "",
        waktuSelesai: "",
        waktuSampaiSelesai: false,
        lokasi: "",
        lokasiLat: null,
        lokasiLng: null,
        lokasiUrl: "",
    },

    // Objek untuk Resepsi
    resepsi: {
        tanggal: "",
        waktuMulai: "",
        waktuSelesai: "",
        waktuSampaiSelesai: false,
        lokasi: "",
        lokasiLat: null,
        lokasiLng: null,
        lokasiUrl: "",
    },
};

export function useInvitationForm() {
    const { id: invitationId } = useParams();
    const isEditMode = !!invitationId;
    const navigate = useNavigate();
    const { user } = useAuth();

    const [form, setForm] = useState<InvitationFormData>(initialFormState);
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(isEditMode);
    const [validationError, setValidationError] = useState("");
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        const fetchInvitationData = async () => {
            if (!isEditMode || !user) return;

            setLoading(true);
            try {
                const { data, error } = await getInvitationById(invitationId!);

                if (error || !data) {
                    toast.error("Gagal memuat data undangan.");
                    navigate("/dashboard");
                    return;
                }

                // --- PERBAIKAN UTAMA DI SINI ---
                // Gunakan 'invitationToForm' untuk mengubah data dari API ke format form
                const formData = invitationToForm(data);
                setForm(formData);

            } catch (err) {
                console.error("Error saat memuat atau mengubah data:", err);
                toast.error("Terjadi kesalahan saat memproses data undangan.");
                navigate("/dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchInvitationData();
    }, [isEditMode, invitationId, navigate, user]);

    const updateForm = useCallback((path: string, value: any) => {
        setForm(prev => {
            const keys = path.split('.');
            if (keys.length === 1) {
                return { ...prev, [keys[0]]: value };
            } else {
                const [mainKey, subKey] = keys;
                return {
                    ...prev,
                    [mainKey]: {
                        ...(prev as any)[mainKey],
                        [subKey]: value,
                    },
                };
            }
        });
        if (validationError) setValidationError("");
        if (submitError) setSubmitError("");
    }, [validationError, submitError]);

    const handleSubmit = useCallback(async () => {
        console.log("Data form sesaat sebelum simpan:", form);
        const { mempelaiPria, mempelaiWanita } = form;
        if (!mempelaiPria.nama || !mempelaiWanita.nama || !mempelaiPria.bapak || !mempelaiPria.ibu || !mempelaiWanita.bapak || !mempelaiWanita.ibu) {
            setSubmitError("Data wajib (nama mempelai & orang tua) tidak boleh kosong.");
            toast.error("Gagal menyimpan: Harap lengkapi semua data wajib di Langkah 1.");
            setCurrentStep(1); // Arahkan pengguna kembali ke langkah yang bermasalah
            return; // Hentikan proses simpan
        }
        setLoading(true);
        setSubmitError("");

        try {
            // --- 1. PROSES UPLOAD SEMUA FILE BARU ---
            const uploadFile = async (file: File, bucket: 'photos' | 'backsound') => {
                const fileName = `${user!.id}/${bucket}-${Date.now()}-${file.name}`;
                const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
                if (error) throw error;
                return supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
            };

            let fotoPriaUrl = form.mempelaiPria.foto;
            if (form.mempelaiPria.fotoTipe === 'upload' && form.mempelaiPria.fotoFile) {
                fotoPriaUrl = await uploadFile(form.mempelaiPria.fotoFile, 'photos');
            }

            let fotoWanitaUrl = form.mempelaiWanita.foto;
            if (form.mempelaiWanita.fotoTipe === 'upload' && form.mempelaiWanita.fotoFile) {
                fotoWanitaUrl = await uploadFile(form.mempelaiWanita.fotoFile, 'photos');
            }

            let backsoundUrlResult = form.backsoundUrl;
            if (form.backsoundFile) {
                backsoundUrlResult = await uploadFile(form.backsoundFile, 'backsound');
            }

            const uploadedGaleri = await Promise.all(
                (form.galeri || []).map(async (foto) => {
                    if (foto.file) {
                        const uploadedUrl = await uploadFile(foto.file, 'photos');
                        return { url: uploadedUrl, caption: foto.caption || "" };
                    }
                    return foto;
                })
            );

            const finalData = { ...form };
            finalData.akad.tanggal = finalData.akad.tanggal || null;
            finalData.akad.waktuMulai = finalData.akad.waktuMulai || null;
            finalData.akad.waktuSelesai = finalData.akad.waktuSelesai || null;

            finalData.resepsi.tanggal = finalData.resepsi.tanggal || null;
            finalData.resepsi.waktuMulai = finalData.resepsi.waktuMulai || null;
            finalData.resepsi.waktuSelesai = finalData.resepsi.waktuSelesai || null;

            // --- 2. SIAPKAN DAN SIMPAN DATA UNDANGAN UTAMA ---
            const { fotoFile: pFile, ...mempelaiPriaData } = form.mempelaiPria;
            const { fotoFile: wFile, ...mempelaiWanitaData } = form.mempelaiWanita;

            let finalCoverUrl = form.coverUrl;
            if (form.coverTipe === 'upload' && form.coverFile) {
                finalCoverUrl = await uploadFile(form.coverFile, 'photos'); // Asumsi bucket 'photos'
            } else if (form.coverTipe === 'gambar') {
                finalCoverUrl = form.coverGambarPilihan;
            } else {
                finalCoverUrl = null;
            }

            const invitationDataForApi = {
                ...form,
                userId: user!.id,
                coverUrl: finalCoverUrl,
                backsoundUrl: backsoundUrlResult,
                galeri: uploadedGaleri,
                mempelaiPria: { ...mempelaiPriaData, foto: form.mempelaiPria.fotoTipe === 'tanpa_foto' ? null : fotoPriaUrl },
                mempelaiWanita: { ...mempelaiWanitaData, foto: form.mempelaiWanita.fotoTipe === 'tanpa_foto' ? null : fotoWanitaUrl },
            };

            const apiData = invitationToApi(invitationDataForApi);

            let savedInvitationId = invitationId;
            if (isEditMode) {
                await updateInvitation(invitationId!, apiData);
            } else {
                const { data: newInvitation, error } = await createInvitation(apiData);

                // --- TAMBAHKAN DEBUG ERROR DI SINI ---
                if (error) {
                    console.error("Supabase INSERT Error:", error);
                }

                if (error || !newInvitation) {
                    throw error || new Error("Gagal membuat undangan.");
                }
                savedInvitationId = newInvitation.id;
            }

            // --- 3. SIMPAN DATA AMPLOP DIGITAL SECARA TERPISAH ---
            if (form.amplopDigital && form.amplopDigital.length > 0) {
                const amplopPayload = form.amplopDigital.map(item => {
                    const apiItem = amplopToApi(item);
                    const finalItem: any = { ...apiItem, invitation_id: savedInvitationId };

                    // Hanya sertakan ID jika item tersebut sudah ada (untuk proses UPDATE)
                    // Jika item baru, ID tidak disertakan agar database bisa membuatnya.
                    if (item.id) {
                        finalItem.id = item.id;
                    }
                    return finalItem;
                });

                const { error: amplopError } = await supabase.from('amplop_digital').upsert(amplopPayload);
                if (amplopError) throw amplopError;
            }

            toast.success(isEditMode ? "Undangan berhasil diperbarui!" : "Undangan berhasil dibuat!");
            navigate("/dashboard");

        } catch (error: any) {
            console.error('Error saving invitation:', error);
            setSubmitError(error.message || "Gagal menyimpan undangan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    }, [form, user, isEditMode, invitationId, navigate]);

    const validateWaktu = useCallback((mulai: string | null, selesai: string | null, sampaiSelesai: boolean): string | null => {
        if (!mulai || sampaiSelesai || !selesai) return null;
        const [hm, mm] = mulai.split(":").map(Number);
        const [hs, ms] = selesai.split(":").map(Number);
        if ((hs * 60 + ms) <= (hm * 60 + mm)) {
            return "Waktu selesai harus setelah waktu mulai";
        }
        return null;
    }, []);

    const isStepValid = useCallback(() => {
        switch (currentStep) {
            case 1:
                const { mempelaiPria, mempelaiWanita } = form;
                return mempelaiPria.nama && mempelaiPria.bapak && mempelaiPria.ibu && mempelaiWanita.nama && mempelaiWanita.bapak && mempelaiWanita.ibu;
            case 2:
                const { akad, resepsi, adaAkad, adaResepsi } = form;

                // Jika tidak ada sesi yang aktif, maka tidak valid
                if (!adaAkad && !adaResepsi) return false;

                // Validasi akad HANYA jika sesi akad aktif
                if (adaAkad) {
                    if (!akad.tanggal || !akad.lokasi) return false;
                    if (validateWaktu(akad.waktuMulai, akad.waktuSelesai, akad.waktuSampaiSelesai)) return false;
                }

                // Validasi resepsi HANYA jika sesi resepsi aktif
                if (adaResepsi) {
                    if (!resepsi.tanggal || !resepsi.lokasi) return false;
                    if (validateWaktu(resepsi.waktuMulai, resepsi.waktuSelesai, resepsi.waktuSampaiSelesai)) return false;
                }

                return true;
            default:
                return true;
        }
    }, [form, currentStep, validateWaktu]);

    const getValidationMessage = useCallback(() => {
        switch (currentStep) {
            case 1:
                const { mempelaiPria, mempelaiWanita } = form;
                if (!mempelaiPria.nama) return "Nama mempelai pria harus diisi";
                if (!mempelaiWanita.nama) return "Nama mempelai wanita harus diisi";
                if (!mempelaiPria.bapak) return "Nama bapak mempelai pria harus diisi";
                if (!mempelaiPria.ibu) return "Nama ibu mempelai pria harus diisi";
                if (!mempelaiWanita.bapak) return "Nama bapak mempelai wanita harus diisi";
                if (!mempelaiWanita.ibu) return "Nama ibu mempelai wanita harus diisi";
                return "";
            case 2:
                const { akad, resepsi } = form;
                if (!(akad.tanggal && akad.lokasi) && !(resepsi.tanggal && resepsi.lokasi)) {
                    return "Minimal isi detail akad atau resepsi";
                }
                return "";
            default:
                return "";
        }
    }, [form, currentStep]);

    const nextStep = useCallback(() => {
        if (isStepValid()) {
            if (currentStep < 4) setCurrentStep(prev => prev + 1);
            setValidationError("");
        } else {
            setValidationError(getValidationMessage() || "Harap lengkapi semua data yang wajib diisi.");
        }
    }, [isStepValid, getValidationMessage, currentStep]);

    const prevStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            setValidationError("");
        }
    }, [currentStep]);

    return {
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
    };
}