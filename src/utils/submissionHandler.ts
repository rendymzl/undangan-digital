import { supabase } from '@/lib/supabaseClient';
import { createInvitation, updateInvitation } from '@/features/invitations/invitationService';
import { invitationToApi, amplopToApi, type InvitationFormData } from '@/utils/caseTransform';
import type { AmplopDigital } from '@/types';
import type { User } from '@supabase/supabase-js';
import { deleteAmplopById } from '@/features/amplop/amplopService';

// Definisikan tipe untuk argumen fungsi
interface SubmissionParams {
    form: InvitationFormData;
    user: User | null;
    isEditMode: boolean;
    invitationId: string | undefined;
    initialAmplopList: AmplopDigital[];
}

/**
 * Menangani seluruh proses upload file dan penyimpanan data undangan.
 * @param params Objek yang berisi semua data yang dibutuhkan untuk proses submit.
 * @returns ID dari undangan yang disimpan.
 */
export async function handleInvitationSubmit({
    form,
    user,
    isEditMode,
    invitationId,
    initialAmplopList,
}: SubmissionParams): Promise<string> {
    if (!user) {
        throw new Error("Pengguna tidak terautentikasi.");
    }

    // --- 1. VALIDASI AKHIR ---
    const { mempelaiPria, mempelaiWanita } = form;
    if (!mempelaiPria.nama || !mempelaiWanita.nama || !mempelaiPria.bapak || !mempelaiPria.ibu || !mempelaiWanita.bapak || !mempelaiWanita.ibu) {
        throw new Error("Data wajib (nama mempelai & orang tua) tidak boleh kosong.");
    }

    // --- 2. UPLOAD SEMUA FILE BARU ---
    const uploadFile = async (file: File, bucket: 'photos' | 'backsound') => {
        const fileName = `${user.id}/${bucket}-${Date.now()}-${file.name}`;
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

    let finalCoverUrl = form.coverUrl;
    if (form.coverTipe === 'upload' && form.coverFile) {
        finalCoverUrl = await uploadFile(form.coverFile, 'photos');
    } else if (form.coverTipe === 'gambar') {
        finalCoverUrl = form.coverGambarPilihan;
    } else {
        finalCoverUrl = null;
    }

    const uploadedGaleri = await Promise.all(
        (form.galeri || []).map(async (foto) => {
            if (foto.file) {
                const uploadedUrl = await uploadFile(foto.file, 'photos');
                return { url: uploadedUrl, caption: foto.caption || "" };
            }
            return { url: foto.url, caption: foto.caption || "" }; // Pastikan object 'file' dihapus
        })
    );

    // --- 3. SIAPKAN DATA UNDANGAN UTAMA ---
    const { fotoFile: pFile, ...mempelaiPriaData } = form.mempelaiPria;
    const { fotoFile: wFile, ...mempelaiWanitaData } = form.mempelaiWanita;

    const invitationDataForApi = {
        ...form,
        userId: user.id,
        backsoundUrl: backsoundUrlResult,
        galeri: uploadedGaleri,
        coverUrl: finalCoverUrl,
        mempelaiPria: { ...mempelaiPriaData, foto: form.mempelaiPria.fotoTipe === 'tanpa_foto' ? null : fotoPriaUrl },
        mempelaiWanita: { ...mempelaiWanitaData, foto: form.mempelaiWanita.fotoTipe === 'tanpa_foto' ? null : fotoWanitaUrl },
    };

    const apiData = invitationToApi(invitationDataForApi);

    // --- 4. SIMPAN DATA UNDANGAN UTAMA ---
    let savedInvitationId = invitationId;
    if (isEditMode) {
        const { user_id, created_at, ...updateData } = apiData;
        const { error } = await updateInvitation(invitationId!, updateData);
        if (error) throw error;
    } else {
        const { data: newInvitation, error } = await createInvitation(apiData);
        if (error || !newInvitation) throw error || new Error("Gagal membuat undangan.");
        savedInvitationId = (newInvitation as { id: string }).id;
    }

    if (!savedInvitationId) {
        throw new Error("Gagal mendapatkan ID undangan setelah disimpan.");
    }

    // --- 5. SIMPAN/HAPUS DATA AMPLOP DIGITAL ---
    const itemsToDelete = initialAmplopList.filter(
        initialItem => !form.amplopDigital.some(currentItem => currentItem.id === initialItem.id)
    );

    const itemsToUpsert = form.amplopDigital.map(item => {
        const apiItem = amplopToApi(item);
        const finalItem: any = { ...apiItem, invitation_id: savedInvitationId };
        if (item.id) finalItem.id = item.id;
        return finalItem;
    });

    const deletePromises = itemsToDelete.map(item => deleteAmplopById(item.id!));
    const upsertPromise = itemsToUpsert.length > 0
        ? supabase.from('amplop_digital').upsert(itemsToUpsert)
        : Promise.resolve();

    await Promise.all([...deletePromises, upsertPromise]);

    return savedInvitationId;
}