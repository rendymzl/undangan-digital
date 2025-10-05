import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { LocationInput } from './LocationInput';
import type { AcaraData } from '@/types';

type AcaraFormProps = {
    acaraData: AcaraData;
    path: string;
    updateForm: (path: string, value: any) => void;
    disabled?: boolean; // Prop ini sekarang hanya untuk lokasi
    themeColor?: string;
};

export const AcaraForm: React.FC<AcaraFormProps> = ({
    acaraData,
    path,
    updateForm,
    disabled = false,
    themeColor = 'gray'
}) => {
    const handleSampaiSelesaiChange = (checked: boolean) => {
        updateForm(`${path}.waktuSampaiSelesai`, checked);
        // Jika dicentang, kosongkan nilai waktu selesai
        if (checked) {
            updateForm(`${path}.waktuSelesai`, "");
        }
    };

    return (
        <div className="space-y-4">
            {/* Tanggal & Waktu Mulai */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <Label>Tanggal</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`w-full justify-between font-normal bg-white ${!acaraData.tanggal && "text-muted-foreground"}`}
                            // --- HAPUS 'disabled' DARI SINI ---
                            >
                                {acaraData.tanggal ? format(new Date(acaraData.tanggal), "dd MMMM yyyy", { locale: localeId }) : "Pilih Tanggal"}
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[1000]">
                            <Calendar
                                mode="single"
                                selected={acaraData.tanggal ? new Date(acaraData.tanggal) : undefined}
                                onSelect={(date: string | number | Date) => updateForm(`${path}.tanggal`, date ? format(date, "yyyy-MM-dd") : null)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-col gap-1">
                    <Label>Waktu Mulai</Label>
                    <Input
                        type="time"
                        value={acaraData.waktuMulai || ''}
                        onChange={e => updateForm(`${path}.waktuMulai`, e.target.value)}
                        className="bg-white"
                    // --- HAPUS 'disabled' DARI SINI ---
                    />
                </div>
            </div>

            {/* Waktu Selesai */}
            <div>
                <Label>Waktu Selesai</Label>
                <div className="flex items-center gap-2 mt-1">
                    <Checkbox
                        id={`${path}.sampaiSelesai`}
                        checked={acaraData.waktuSampaiSelesai}
                        // Gunakan handler baru
                        onCheckedChange={handleSampaiSelesaiChange}
                        disabled={disabled}
                    />
                    <label
                        htmlFor={`${path}.sampaiSelesai`}
                        className={`text-sm text-${themeColor}-700 cursor-pointer`}
                    >
                        Sampai Selesai
                    </label>
                </div>

                {/* --- PERBAIKAN DI SINI --- */}
                {/* Input sekarang selalu di-render, tetapi dinonaktifkan secara kondisional */}
                <Input
                    type="time"
                    value={acaraData.waktuSelesai || ''}
                    onChange={e => updateForm(`${path}.waktuSelesai`, e.target.value)}
                    className="bg-white mt-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    // Dinonaktifkan jika 'disabled' dari props atau jika 'sampaiSelesai' dicentang
                    disabled={disabled || acaraData.waktuSampaiSelesai}
                />
            </div>

            <Separator />

            {/* Input Lokasi */}
            <LocationInput
                acaraData={acaraData}
                path={path}
                updateForm={updateForm}
                disabled={disabled} // <-- 'disabled' HANYA DITERAPKAN DI SINI
            />
        </div>
    );
};