// components/SlugGenerator.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import type { InvitationFormData } from '@/utils/caseTransform';

// --- Logika Pembuatan Slug ---
const generateBaseSlug = (form: InvitationFormData): string => {
    const clean = (name: string) => name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
    const priaName = form.mempelaiPria.namaPanggilan || form.mempelaiPria.nama.split(' ')[0] || '';
    const wanitaName = form.mempelaiWanita.namaPanggilan || form.mempelaiWanita.nama.split(' ')[0] || '';
    if (form.urutanMempelai === 'wanita-pria') return `${clean(wanitaName)}-${clean(priaName)}`;
    return `${clean(priaName)}-${clean(wanitaName)}`;
};

const checkSlugAvailability = async (slug: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase.rpc('slug_exists', { slug_to_check: slug });

        if (error) {
            console.error('Error checking slug with RPC:', error);
            return false; // Anggap tidak tersedia jika terjadi error
        }

        // RPC akan mengembalikan `true` jika ADA, `false` jika TIDAK ADA.
        // Fungsi kita harus mengembalikan `true` jika TERSEDIA. Jadi kita balik nilainya.
        return !data;

    } catch (error) {
        console.error('RPC call failed:', error);
        return false;
    }
};

const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
    if (await checkSlugAvailability(baseSlug)) return baseSlug;
    let counter = 1;
    let newSlug;
    do {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
    } while (!(await checkSlugAvailability(newSlug)));
    return newSlug;
};
// --- Akhir Logika Slug ---

type Props = {
    form: InvitationFormData;
    updateForm: (path: string, value: any) => void;
};

export const SlugGenerator: React.FC<Props> = ({ form, updateForm }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [customInput, setCustomInput] = useState('');
    const [status, setStatus] = useState<{ msg: string; type: 'success' | 'error' | '' }>({ msg: '', type: '' });
    const [useCustom, setUseCustom] = useState(false);
    const [originUrl, setOriginUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') setOriginUrl(window.location.origin);
    }, []);

    const runAutoSlug = useCallback(async () => {
        if (!form.mempelaiPria.nama || !form.mempelaiWanita.nama) return;
        setIsGenerating(true);
        setStatus({ msg: '', type: '' });
        const baseSlug = generateBaseSlug(form);
        if (baseSlug && baseSlug !== '-') {
            const uniqueSlug = await generateUniqueSlug(baseSlug);
            updateForm('slug', uniqueSlug);
        }
        setIsGenerating(false);
    }, [form.mempelaiPria.nama, form.mempelaiWanita.nama, form.mempelaiPria.namaPanggilan, form.mempelaiWanita.namaPanggilan, form.urutanMempelai, updateForm]);

    useEffect(() => {
        if (useCustom) return; // Jangan generate otomatis jika mode edit atau custom
        const timeoutId = setTimeout(runAutoSlug, 500);
        return () => clearTimeout(timeoutId);
    }, [runAutoSlug, useCustom]);

    const handleCheckCustom = async () => {
        if (!customInput) return;
        const cleanSlug = customInput.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setCustomInput(cleanSlug);
        setIsGenerating(true);
        const isAvailable = await checkSlugAvailability(cleanSlug);
        if (isAvailable) {
            setStatus({ msg: 'URL tersedia!', type: 'success' });
            updateForm('slug', cleanSlug);
            setUseCustom(true);
        } else {
            setStatus({ msg: 'URL sudah digunakan.', type: 'error' });
        }
        setIsGenerating(false);
    };

    const handleResetToAuto = () => {
        setUseCustom(false);
        setCustomInput('');
        setStatus({ msg: '', type: '' });
        runAutoSlug();
    };

    return (
        <div className="p-4 bg-white border rounded-lg">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <Link2 className="w-4 h-4" /> URL Undangan Anda
            </label>
            <div className="p-2 bg-gray-100 rounded text-sm text-purple-700 break-all font-semibold">
                {isGenerating ? <span className="italic font-normal text-gray-500">Membuat URL...</span> : `${originUrl}/${form.slug}`}
            </div>
            <div className="text-xs text-gray-500 mt-2">
                {useCustom ? (
                    <span>Menggunakan URL custom. <button onClick={handleResetToAuto} className="text-purple-600 hover:underline font-semibold">Ganti ke otomatis?</button></span>
                ) : (
                    <span>Ingin URL sendiri? Isi di bawah ini.</span>
                )}
            </div>
            <div className="flex items-center gap-2 mt-2">
                <Input value={customInput} onChange={e => setCustomInput(e.target.value)} placeholder="contoh: anisa-rizky-2025" disabled={useCustom} />
                <Button onClick={handleCheckCustom} disabled={isGenerating || useCustom} size="sm">Cek</Button>
            </div>
            {status.msg && (
                <div className={`flex items-center gap-1 text-xs mt-2 font-medium ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {status.type === 'success' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {status.msg}
                </div>
            )}
        </div>
    );
};