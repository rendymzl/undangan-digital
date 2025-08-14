import type { InvitationFormData } from "./caseTransform";

// Fungsi untuk memvalidasi rentang waktu
const validateWaktu = (
    mulai: string | null,
    selesai: string | null,
    sampaiSelesai: boolean
): string | null => {
    if (!mulai || sampaiSelesai || !selesai) {
        return null;
    }

    const [hm, mm] = mulai.split(":").map(Number);
    const [hs, ms] = selesai.split(":").map(Number);
    const mulaiMenit = hm * 60 + mm;
    const selesaiMenit = hs * 60 + ms;

    if (selesaiMenit <= mulaiMenit) {
        return "Waktu selesai harus lebih besar dari waktu mulai";
    }

    return null;
};

/**
 * Memeriksa apakah data pada langkah saat ini sudah valid.
 * @param form Objek state form saat ini.
 * @param currentStep Nomor langkah yang sedang divalidasi.
 * @returns `true` jika valid, `false` jika tidak.
 */
export function isStepValid(form: InvitationFormData, currentStep: number): boolean {
    switch (currentStep) {
        case 1: {
            const { mempelaiPria, mempelaiWanita } = form;
            return !!(
                mempelaiPria.nama &&
                mempelaiPria.bapak &&
                mempelaiPria.ibu &&
                mempelaiWanita.nama &&
                mempelaiWanita.bapak &&
                mempelaiWanita.ibu
            );
        }
        case 2: {
            const { akad, resepsi, adaAkad, adaResepsi } = form;

            if (!adaAkad && !adaResepsi) return false;

            if (adaAkad) {
                if (!akad.tanggal || !akad.lokasi) return false;
                if (validateWaktu(akad.waktuMulai, akad.waktuSelesai, akad.waktuSampaiSelesai)) return false;
            }

            if (adaResepsi) {
                if (!resepsi.tanggal || !resepsi.lokasi) return false;
                if (validateWaktu(resepsi.waktuMulai, resepsi.waktuSelesai, resepsi.waktuSampaiSelesai)) return false;
            }

            return true;
        }
        default:
            return true;
    }
}

/**
 * Memberikan pesan error spesifik jika validasi gagal.
 * @param form Objek state form saat ini.
 * @param currentStep Nomor langkah yang sedang divalidasi.
 * @returns `string` berisi pesan error, atau string kosong jika valid.
 */
export function getValidationMessage(form: InvitationFormData, currentStep: number): string {
    switch (currentStep) {
        case 1: {
            const { mempelaiPria, mempelaiWanita } = form;
            if (!mempelaiPria.nama) return "Nama mempelai pria harus diisi";
            if (!mempelaiWanita.nama) return "Nama mempelai wanita harus diisi";
            if (!mempelaiPria.bapak) return "Nama bapak mempelai pria harus diisi";
            if (!mempelaiPria.ibu) return "Nama ibu mempelai pria harus diisi";
            if (!mempelaiWanita.bapak) return "Nama bapak mempelai wanita harus diisi";
            if (!mempelaiWanita.ibu) return "Nama ibu mempelai wanita harus diisi";
            return "";
        }
        case 2: {
            const { akad, resepsi, adaAkad, adaResepsi } = form;

            if (!adaAkad && !adaResepsi) return "Harap aktifkan dan isi detail minimal satu acara (Akad atau Resepsi).";

            if (adaAkad) {
                if (!akad.tanggal || !akad.lokasi) return "Tanggal dan Lokasi Akad harus diisi.";
                const akadError = validateWaktu(akad.waktuMulai, akad.waktuSelesai, akad.waktuSampaiSelesai);
                if (akadError) return `Akad: ${akadError}`;
            }

            if (adaResepsi) {
                if (!resepsi.tanggal || !resepsi.lokasi) return "Tanggal dan Lokasi Resepsi harus diisi.";
                const resepsiError = validateWaktu(resepsi.waktuMulai, resepsi.waktuSelesai, resepsi.waktuSampaiSelesai);
                if (resepsiError) return `Resepsi: ${resepsiError}`;
            }

            return "";
        }
        default:
            return "";
    }
}