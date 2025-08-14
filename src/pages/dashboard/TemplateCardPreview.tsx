import React from 'react';
import type { Theme } from '@/types/theme';
import { Button } from '@/components/ui/button'; // Import Button for the fake button

interface Props {
    theme: Theme;
}

export const TemplateCardPreview: React.FC<Props> = ({ theme }) => {
    const { colors, fontTitle, fontText, ornaments } = theme;
    const Ornament = ornaments?.coverBottom;

    return (
        <div
            className="aspect-[12/11] w-full p-2 flex flex-col items-center justify-between overflow-hidden"
            style={{ background: colors.background, color: colors.foreground }}
        >
            {/* --- Main Content Area --- */}
            <div className="flex flex-col items-center justify-center text-center">
                {/* Ornament Preview */}
                {Ornament && (
                    <div className="scale-[0.4] -mb-2 opacity-80">
                        <Ornament theme={theme} />
                    </div>
                )}

                {/* Text Preview */}
                <p className={`text-[9px] opacity-80 ${fontText}`}>The Wedding Of</p>
                <h3 className={`text-2xl leading-tight mt-1 ${fontTitle}`} style={{ color: colors.primary }}>
                    Bride & Groom
                </h3>
                <p className={`text-[10px] mt-2 ${fontText}`}>Minggu, 6 Januari 2030</p>

                {/* Countdown Preview */}
                <div className="mt-3 flex justify-center space-x-1">
                    {['Hari', 'Jam', 'Menit', 'Detik'].map((label) => (
                        <div
                            key={label}
                            className="flex flex-col items-center justify-center w-8 h-8 rounded-sm"
                            style={{ backgroundColor: colors.primary, color: colors.primaryForeground }}
                        >
                            <span className={`text-xs font-bold ${fontTitle}`}>00</span>
                            <span className={`text-[6px] -mt-1 opacity-80 ${fontText}`}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- "Kepada Yth" & Button Preview --- */}
            <div className="w-full text-center mb-2">
                <p className="text-[8px] opacity-80">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                <p className={`text-xs font-semibold mt-0.5`} style={{ color: colors.primary }}>Nama Tamu</p>
                {/* <div
                    className="text-xs font-semibold py-1 px-4 rounded-full mt-2 inline-block"
                    style={{ backgroundColor: colors.primary, color: colors.primaryForeground }}
                >
                    Buka Undangan
                </div> */}
            </div>
        </div>
    );
};