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
import type { AcaraData } from '@/types';
import { LocationInput } from './LocationInput';

// Definisikan tipe untuk Props
type AcaraFormProps = {
    acaraData: AcaraData;
    path: string;
    updateForm: (path: string, value: any) => void;
    disabled?: boolean;
    themeColor?: string; // Untuk warna checkbox (misal: 'green' atau 'purple')
};

export const AcaraForm: React.FC<AcaraFormProps> = ({
    acaraData,
    path,
    updateForm,
    disabled = false,
    themeColor = 'gray'
}) => {
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
                                disabled={disabled}
                            >
                                {acaraData.tanggal ? format(new Date(acaraData.tanggal), "dd MMMM yyyy", { locale: localeId }) : "Pilih Tanggal"}
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[1000]">
                            <Calendar
                                mode="single"
                                selected={acaraData.tanggal ? new Date(acaraData.tanggal) : undefined}
                                onSelect={date => updateForm(`${path}.tanggal`, date ? format(date, "yyyy-MM-dd") : null)}
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
                        disabled={disabled}
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
                        onCheckedChange={checked => updateForm(`${path}.waktuSampaiSelesai`, checked)}
                        disabled={disabled}
                    />
                    <label
                        htmlFor={`${path}.sampaiSelesai`}
                        className={`text-sm text-${themeColor}-700 cursor-pointer`}
                    >
                        Sampai Selesai
                    </label>
                </div>
                {!acaraData.waktuSampaiSelesai && (
                    <Input
                        type="time"
                        value={acaraData.waktuSelesai || ''}
                        onChange={e => updateForm(`${path}.waktuSelesai`, e.target.value)}
                        className="bg-white mt-2"
                        disabled={disabled}
                    />
                )}
            </div>

            <Separator />

            {/* Input Lokasi */}
            <LocationInput
                acaraData={acaraData}
                path={path}
                updateForm={updateForm}
                disabled={disabled}
            />
        </div>
    );
};