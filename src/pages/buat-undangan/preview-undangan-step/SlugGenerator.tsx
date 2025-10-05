// components/SlugGenerator.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Link2, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import { invitationToApi, type InvitationFormData } from '@/utils/data-transform';
import { themes } from '@/types';
import { Button } from '@/components/ui/button';

// --- Logika Pembuatan Slug ---
const generateBaseSlug = (form: InvitationFormData): string => {
    const clean = (name: string) => name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    const priaName = form.mempelaiPria.namaPanggilan || (form.mempelaiPria.nama?.split(' ')[0] ?? '');
    const wanitaName = form.mempelaiWanita.namaPanggilan || (form.mempelaiWanita.nama?.split(' ')[0] ?? '');
    if (form.urutanMempelai === 'wanita-pria') return `${clean(wanitaName)}-${clean(priaName)}`;
    return `${clean(priaName)}-${clean(wanitaName)}`;
};

const checkSlugAvailability = async (slug: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase.rpc('slug_exists', { slug_to_check: slug });

        if (error) {
            console.error('Error checking slug dengan RPC:', error);
            return false; // Anggap tidak tersedia jika error
        }

        // RPC mengembalikan true jika ADA, false jika TIDAK ADA.
        // Fungsi ini harus mengembalikan true jika TERSEDIA, jadi dibalik.
        return !data;

    } catch (error) {
        console.error('RPC call gagal:', error);
        return false;
    }
};

const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
    if (await checkSlugAvailability(baseSlug)) return baseSlug;
    let counter = 1;
    let newSlug = '';
    while (true) {
        newSlug = `${baseSlug}-${counter}`;
        if (await checkSlugAvailability(newSlug)) break;
        counter++;
    }
    return newSlug;
};
// --- Akhir Logika Slug ---

type Props = {
    form: InvitationFormData;
    updateForm: (path: string, value: any) => void;
};

export const SlugGenerator: React.FC<Props> = ({ form, updateForm }) => {
    const [isChecking, setIsChecking] = useState(false);
    const [customInput, setCustomInput] = useState('');
    const [status, setStatus] = useState<{ msg: string; type: 'success' | 'error' | '' }>({ msg: '', type: '' });
    const [useCustom, setUseCustom] = useState(false);
    const [originUrl, setOriginUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') setOriginUrl(window.location.origin);
    }, []);

    // Sinkronisasi customInput dengan form.slug jika user kembali ke mode otomatis
    // useEffect(() => {
    //     if (!useCustom) {
    //         setCustomInput('');
    //     }
    //     // Jika useCustom true, biarkan customInput tetap
    // }, [useCustom]);

    const runAutoSlug = useCallback(async () => {
        if (!form.mempelaiPria.nama || !form.mempelaiWanita.nama) return;
        setIsChecking(true);
        setStatus({ msg: '', type: '' });
        const baseSlug = generateBaseSlug(form);
        if (baseSlug && baseSlug !== '-') {
            const uniqueSlug = await generateUniqueSlug(baseSlug);
            updateForm('slug', uniqueSlug);
        }
        setIsChecking(false);
    }, [
        form.mempelaiPria.nama,
        form.mempelaiWanita.nama,
        form.mempelaiPria.namaPanggilan,
        form.mempelaiWanita.namaPanggilan,
        form.urutanMempelai,
        updateForm
    ]);

    useEffect(() => {
        if (useCustom) return; // Jangan generate otomatis jika mode custom
        const timeoutId = setTimeout(runAutoSlug, 1000);
        return () => clearTimeout(timeoutId);
    }, [runAutoSlug]);

    // Debounced effect untuk pengecekan slug custom
    useEffect(() => {
        if (!customInput) {
            setStatus({ msg: '', type: '' });
            setIsChecking(false);
            return;
        }

        // Jangan jalankan jika slug kustom sudah dikonfirmasi
        if (useCustom) return;

        setIsChecking(true);
        setStatus({ msg: 'Mengecek ketersediaan...', type: '' });

        const handler = setTimeout(() => {
            handleCheckCustom(customInput);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customInput, useCustom]);

    const handleCheckCustom = async (slugToCheck: string) => {
        // Normalisasi slug custom agar tidak ada double dash, spasi, dsb
        let cleanSlug = slugToCheck
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');

        if (!cleanSlug) {
            setStatus({ msg: 'Slug tidak boleh kosong.', type: 'error' });
            setIsChecking(false);
            return;
        }

        const isAvailable = await checkSlugAvailability(cleanSlug);

        if (isAvailable) {
            setStatus({ msg: 'URL tersedia!', type: 'success' });
            updateForm('slug', cleanSlug);
            setUseCustom(true); // "Lock in" slug custom
            // Jangan reset customInput di sini, biarkan tetap
        } else {
            setStatus({ msg: 'URL sudah digunakan.', type: 'error' });
        }
        setIsChecking(false);
    };

    const handleResetToAuto = () => {
        setUseCustom(false);
        setCustomInput('');
        setStatus({ msg: '', type: '' });
        runAutoSlug();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        // Jika input dikosongkan, langsung kembali ke slug otomatis
        if (newValue === '') {
            handleResetToAuto()
            return;
        }
        setUseCustom(false);
        setCustomInput(newValue);
    };

    const handlePreview = () => {
        // Gabungkan data form dengan properti yang sudah di-render (seperti warna)
        const activeTheme = themes.find(t => t.id === form.themeId) || themes[0];
        const finalTheme = {
            ...activeTheme,
            colors: form.customColors || activeTheme.colors,
            fontTitle: form.fontTitle || activeTheme.fontTitle,
            fontText: form.fontText || activeTheme.fontText,
        };

        const previewData = {
            ...form,
            // Buat objek invitation yang bisa digunakan langsung oleh UndanganDetailPage
            // Ini meniru hasil dari 'invitationFromApi'
            invitation: {
                ...invitationToApi(form), // Konversi ke snake_case dulu
                // Lalu transform kembali dengan beberapa data dari form
                // Ini agak rumit, cara lebih baik adalah membuat transformer khusus preview
                // Untuk sekarang kita oper form langsung
            }
        };

        // Cara sederhana: Kirim seluruh state form
        // UndanganDetailPage dalam mode preview akan menggunakan data ini
        sessionStorage.setItem('previewData', JSON.stringify(form));
        window.open('/preview/draft', '_blank');
    };

    return (
        <div className="p-4 bg-white border rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Link2 className="w-4 h-4" /> URL
                </label>

                {/* --- 2. TAMBAHKAN TOMBOL PREVIEW DI SINI --- */}
                <Button size="sm" onClick={handlePreview}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Preview
                </Button>
            </div>
            <div className="p-2 bg-gray-100 rounded text-sm text-purple-700 break-all font-semibold">
                {isChecking ? <span className="italic font-normal text-gray-500">Mengecek...</span> : `${originUrl}/${form.slug}`}
            </div>
            <div className="text-xs text-gray-500 mt-2">
                {useCustom ? (
                    <span>
                        Menggunakan URL custom.{' '}
                        <button
                            type="button"
                            onClick={handleResetToAuto}
                            className="text-purple-600 hover:underline font-semibold"
                        >
                            Ganti ke otomatis?
                        </button>
                    </span>
                ) : (
                    <span>URL dibuat otomatis. Anda bisa mengubahnya di bawah.</span>
                )}
            </div>
            <div className="flex items-center gap-2 mt-2">
                <Input
                    value={customInput}
                    onChange={handleInputChange}
                    placeholder="contoh: anisa-rizky-2025"
                />
            </div>
            {status.msg && (
                <div
                    className={`flex items-center gap-1 text-xs mt-2 font-medium ${status.type === 'success'
                        ? 'text-green-600'
                        : status.type === 'error'
                            ? 'text-red-600'
                            : 'text-gray-500'
                        }`}
                >
                    {status.type === 'success' ? (
                        <CheckCircle size={14} />
                    ) : status.type === 'error' ? (
                        <XCircle size={14} />
                    ) : null}
                    {status.msg}
                </div>
            )}
        </div>
    );
};