import React, { useEffect, useState } from 'react';
import type { Theme } from '@/types/theme';
import type { AcaraData } from '@/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface AcaraSectionProps {
    theme: Theme;
    title: string;
    data: AcaraData;
}

// Helper untuk format waktu
const formatWaktu = (mulai?: string | null, selesai?: string | null, sampaiSelesai?: boolean) => {
    if (!mulai) return "-";
    const mulaiStr = mulai.slice(0, 5);
    if (sampaiSelesai) return `${mulaiStr} - Selesai`;
    if (selesai) return `${mulaiStr} - ${selesai.slice(0, 5)}`;
    return mulaiStr;
};

const AcaraSection: React.FC<AcaraSectionProps> = ({ theme, data, title }) => {
    if (!data.tanggal || !data.lokasi) {
        return null;
    }

    const [countdown, setCountdown] = useState<string>("");

    useEffect(() => {
        if (!data.tanggal || !data.waktuMulai) return;
        const target = new Date(`${data.tanggal}T${data.waktuMulai}`);

        const interval = setInterval(() => {
            const now = new Date();
            const diff = target.getTime() - now.getTime();

            if (diff <= 0) {
                setCountdown("Acara telah dilaksanakan");
                clearInterval(interval);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            setCountdown(`${days} hari ${hours} jam ${minutes} menit ${seconds} detik`);
        }, 1000);

        return () => clearInterval(interval);
    }, [data.tanggal, data.waktuMulai]);

    const formattedDate = format(new Date(data.tanggal), "EEEE, dd MMMM yyyy", { locale: localeId });
    const formattedTime = formatWaktu(data.waktuMulai, data.waktuSelesai, data.waktuSampaiSelesai);

    const handleLocationClick = () => {
        const gmapsUrl = data.lokasiUrl
            ? data.lokasiUrl
            : `https://maps.google.com/?q=${data.lokasiLat},${data.lokasiLng}`;
        window.open(gmapsUrl, '_blank');
    };

    return (
        <section
            className="relative overflow-hidden py-16 px-4"
            style={{ color: theme.primaryColor, background: theme.backgroundColor }}
        >
            <div className="flex flex-col justify-center items-center min-h-screen relative z-10">
                <div
                    className="relative max-w-xl w-full mx-auto p-6 md:p-8 rounded-2xl backdrop-blur-sm"
                    style={{ background: `${theme.backgroundColor}cc`, border: `1px solid ${theme.primaryColor}40` }}
                >
                    <div className="text-center mb-12">
                        <h2 className={`text-4xl md:text-5xl ${theme.fontTitle}`} style={{ color: theme.primaryColor }}>
                            {title}
                        </h2>
                        <div className="w-24 h-px mx-auto mt-2" style={{ background: theme.primaryColor }}></div>
                    </div>

                    <div className="flex justify-center mb-8">
                        <div className="inline-block border-2 rounded-lg overflow-hidden shadow-lg" style={{ borderColor: theme.primaryColor }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="px-4 py-2 text-center"
                                style={{ background: theme.primaryColor, color: theme.backgroundColor }}
                            >
                                <div className="text-lg font-medium tracking-wide">{formattedDate}</div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="px-4 py-4 text-center"
                                style={{ background: theme.backgroundColor }}
                            >
                                <div className="text-3xl font-bold" style={{ color: theme.primaryColor }}>{formattedTime}</div>
                                {countdown && (
                                    <div className="mt-2 text-sm font-medium" style={{ color: theme.foregroundColor }}>
                                        {countdown}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center"
                    >
                        <h3 className="text-xl mb-2" style={{ color: theme.primaryColor }}>Bertempat di:</h3>
                        <p className="text-md leading-relaxed" style={{ color: theme.foregroundColor }}>{data.lokasi}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-8 flex items-center justify-center"
                    >
                        <Button
                            onClick={handleLocationClick}
                            // --- TAMBAHKAN STYLE DI SINI ---
                            style={{
                                background: theme.primaryColor,
                                color: theme.backgroundColor
                            }}
                        >
                            <MapPin size={16} className="mr-2" />
                            Lihat Peta Lokasi
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AcaraSection;