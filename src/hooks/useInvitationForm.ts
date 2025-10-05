import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { getInvitationById } from '@/features/invitations/invitationService';
import { toast } from 'sonner';
import { invitationToForm, type InvitationFormData } from '@/utils/data-transform';
import { themes } from '@/types/theme';
import type { AmplopDigital } from '@/types';
import { handleInvitationSubmit } from '@/utils/form';
import { getValidationMessage, isStepValid } from '@/utils/data-transform';
import { fontPairings } from '@/types/fontPairings';


// State awal untuk form, didefinisikan di satu tempat
const initialFormState: InvitationFormData = {
    slug: "",
    urutanMempelai: "pria-wanita",
    lokasiResepsiSamaDenganAkad: false,
    ceritaCinta: "",
    coverUrl: null,
    coverTipe: 'warna',
    coverGambarPilihan: null,
    coverFile: null,
    themeId: themes[0].id,
    galeriAktif: false,
    backsoundUrl: "",
    customColors: null,
    fontTitle: fontPairings[0].fontTitle, // Ambil dari default
    fontText: fontPairings[0].fontText,
    adaAkad: true,
    adaResepsi: true,
    amplopDigital: [],
    galeri: [],
    backsoundFile: null,
    mempelaiPria: {
        nama: "", namaPanggilan: "", anakKe: "", bapak: "", ibu: "",
        almBapak: false, almIbu: false, instagram: "", foto: "",
        fotoTipe: 'upload', fotoFile: null,
    },
    mempelaiWanita: {
        nama: "", namaPanggilan: "", anakKe: "", bapak: "", ibu: "",
        almBapak: false, almIbu: false, instagram: "", foto: "",
        fotoTipe: 'upload', fotoFile: null,
    },
    akad: {
        tanggal: "", waktuMulai: "", waktuSelesai: "", waktuSampaiSelesai: false,
        lokasi: "", lokasiLat: null, lokasiLng: null, lokasiUrl: "",
    },
    resepsi: {
        tanggal: "", waktuMulai: "", waktuSelesai: "", waktuSampaiSelesai: false,
        lokasi: "", lokasiLat: null, lokasiLng: null, lokasiUrl: "",
    },
};

export function useInvitationForm() {
    const { id: invitationId } = useParams();
    const isEditMode = !!invitationId;
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const [form, setForm] = useState<InvitationFormData>(initialFormState);
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(isEditMode);
    const [validationError, setValidationError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [initialAmplopList, setInitialAmplopList] = useState<AmplopDigital[]>([]);

    // Efek untuk mengatur tema awal dari URL (hanya saat 'buat baru')
    useEffect(() => {
        if (!isEditMode) {
            const searchParams = new URLSearchParams(location.search);
            const themeIdFromUrl = searchParams.get('themeId');
            if (themeIdFromUrl) {
                setForm(prev => ({ ...prev, themeId: themeIdFromUrl }));
            }
        }
    }, [isEditMode, location.search]);

    // Efek untuk memuat data saat mode edit
    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            getInvitationById(invitationId!).then(({ data }) => {
                if (data) {
                    const formData = invitationToForm(data);
                    setForm(formData);
                    setInitialAmplopList(formData.amplopDigital || []);
                } else {
                    toast.error("Gagal memuat data undangan.");
                    navigate("/dashboard");
                }
                setLoading(false);
            });
        }
    }, [isEditMode, invitationId, navigate]);

    // Fungsi untuk memperbarui state form (nested & non-nested)
    const updateForm = useCallback((path: string, value: any) => {
        setForm((prev: InvitationFormData) => {
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

    // handleSubmit sekarang menjadi wrapper yang bersih
    const handleSubmit = useCallback(async () => {
        setLoading(true);
        setSubmitError("");
        try {
            await handleInvitationSubmit({ form, user, isEditMode, invitationId, initialAmplopList });
            toast.success(isEditMode ? "Undangan berhasil diperbarui!" : "Undangan berhasil dibuat!");
            navigate("/dashboard");
        } catch (error: any) {
            console.error('Error saving invitation:', error);
            setSubmitError(error.message || "Gagal menyimpan undangan.");
            // Jika error validasi, arahkan ke step yang benar
            if (error.message.includes("Data wajib")) {
                setCurrentStep(1);
            }
        } finally {
            setLoading(false);
        }
    }, [form, user, isEditMode, invitationId, navigate, initialAmplopList]);

    // Navigasi antar langkah
    const nextStep = useCallback(() => {
        if (isStepValid(form, currentStep)) {
            if (currentStep < 4) setCurrentStep((prev: number) => prev + 1);
            setValidationError("");
        } else {
            setValidationError(getValidationMessage(form, currentStep) || "Harap lengkapi data wajib.");
        }
    }, [form, currentStep]);

    const prevStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep((prev: number) => prev - 1);
            setValidationError("");
        }
    }, [currentStep]);

    return {
        form,
        setForm,
        updateForm,
        currentStep,
        isEditMode,
        loading,
        validationError,
        submitError,
        nextStep,
        prevStep,
        handleSubmit,
        isStepValid: () => isStepValid(form, currentStep),
    };
}