import React, { useEffect, useState } from 'react';
import type { Theme } from '@/types/theme';
import type { AcaraData } from '@/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

// --- Props Utama (Tidak berubah) ---
interface AcaraSectionProps {
    theme: Theme;
    title: string;
    data: AcaraData;
}

// Helper untuk format waktu (bisa dipindah ke utils jika digunakan di tempat lain)
const formatWaktu = (mulai?: string | null, selesai?: string | null, sampaiSelesai?: boolean) => {
    if (!mulai) return "-";
    const mulaiStr = mulai.slice(0, 5);
    if (sampaiSelesai) return `${mulaiStr} - Selesai`;
    if (selesai) return `${mulaiStr} - ${selesai.slice(0, 5)}`;
    return mulaiStr;
};

// ===============================================================
// SUB-KOMPONEN UNTUK LAYOUT 'CLASSIC' (Desain Anda Saat Ini)
// ===============================================================
const ClassicAcaraLayout: React.FC<AcaraSectionProps> = ({ theme, data, title }) => {
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

    const formattedDate = format(new Date(data.tanggal!), "EEEE, dd MMMM yyyy", { locale: localeId });
    const formattedTime = formatWaktu(data.waktuMulai, data.waktuSelesai, data.waktuSampaiSelesai);
    const handleLocationClick = () => {
        const gmapsUrl = data.lokasiUrl || `https://maps.google.com/?q=${data.lokasiLat},${data.lokasiLng}`;
        window.open(gmapsUrl, '_blank');
    };

    return (
        <section className="relative overflow-hidden px-4 py-4" style={{ background: theme.colors.background }}>
            <div className="flex flex-col justify-center items-center h-full relative z-10">
                <div
                    className="relative max-w-xl w-full mx-auto p-6 md:p-8 rounded-2xl backdrop-blur-sm"
                    style={{ background: `${theme.colors.background}cc`, border: `1px solid ${theme.colors.primary}40` }}
                >
                    <div className="text-center mb-12">
                        <h2 className={`text-4xl md:text-5xl ${theme.fontTitle}`} style={{ color: theme.colors.primary }}>{title}</h2>
                        <div className="w-24 h-px mx-auto mt-2" style={{ background: theme.colors.primary }}></div>
                    </div>
                    <div className="flex justify-center mb-8">
                        <div className="inline-block border-2 rounded-lg overflow-hidden shadow-lg" style={{ borderColor: theme.colors.primary }}>
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="px-4 py-2 text-center" style={{ background: theme.colors.primary, color: theme.colors.primaryForeground }}>
                                <div className="text-lg font-medium tracking-wide">{formattedDate}</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="px-4 py-4 text-center" style={{ background: theme.colors.background }}>
                                <div className="text-3xl font-bold" style={{ color: theme.colors.primary }}>{formattedTime}</div>
                                {countdown && <div className="mt-2 text-sm font-medium" style={{ color: theme.colors.foreground }}>{countdown}</div>}
                            </motion.div>
                        </div>
                    </div>
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="text-center">
                        <h3 className="text-xl mb-2" style={{ color: theme.colors.primary }}>Bertempat di:</h3>
                        <p className="text-md leading-relaxed" style={{ color: theme.colors.foreground }}>{data.lokasi}</p>
                    </motion.div>
                    {(data.lokasiUrl || (data.lokasiLat && data.lokasiLng)) && (
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-8 flex items-center justify-center">
                            <Button onClick={handleLocationClick} style={{ background: theme.colors.primary, color: theme.colors.primaryForeground }}>
                                <MapPin size={16} className="mr-2" />
                                Lihat Peta Lokasi
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

// ===============================================================
// SUB-KOMPONEN UNTUK LAYOUT 'MODERN' (Desain Baru)
// ===============================================================
const ModernAcaraLayout: React.FC<AcaraSectionProps> = ({ theme, data, title }) => {
    const formattedDate = format(new Date(data.tanggal!), "dd MMMM yyyy", { locale: localeId });
    const formattedTime = formatWaktu(data.waktuMulai, data.waktuSelesai, data.waktuSampaiSelesai);
    const handleLocationClick = () => {
        const gmapsUrl = data.lokasiUrl || `https://maps.google.com/?q=${data.lokasiLat},${data.lokasiLng}`;
        window.open(gmapsUrl, '_blank');
    };

    return (
        <section className="py-16 px-4" style={{ background: theme.colors.secondary }}>
            <div
                className="max-w-xl mx-auto p-8 rounded-lg"
                style={{ background: theme.colors.background, color: theme.colors.foreground }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <h2 className={`text-3xl md:text-4xl ${theme.fontTitle} mb-6`} style={{ color: theme.colors.primary }}>{title}</h2>
                    <div className="space-y-4 text-left">
                        <div className="flex items-center gap-4">
                            <Calendar className="w-5 h-5" style={{ color: theme.colors.primary }} />
                            <span className="font-semibold">{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Clock className="w-5 h-5" style={{ color: theme.colors.primary }} />
                            <span>{formattedTime}</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <MapPin className="w-5 h-5 mt-1" style={{ color: theme.colors.primary }} />
                            <div>
                                <p className="font-semibold">{data.lokasi}</p>
                                {(data.lokasiUrl || (data.lokasiLat && data.lokasiLng)) && (
                                    <Button variant="link" onClick={handleLocationClick} className="p-0 h-auto text-sm">Lihat Peta Lokasi</Button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// ===============================================================
// Komponen Utama yang Menjadi "Dispatcher"
// ===============================================================
const AcaraSection: React.FC<AcaraSectionProps> = (props) => {
    if (!props.data.tanggal || !props.data.lokasi) {
        return null;
    }

    const { theme } = props;

    switch (theme.layout) {
        case 'modern':
            return <ModernAcaraLayout {...props} />;
        case 'classic':
        default:
            return <ClassicAcaraLayout {...props} />;
    }
};

export default AcaraSection;