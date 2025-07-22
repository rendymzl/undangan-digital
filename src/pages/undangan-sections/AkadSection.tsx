import type { Theme } from "@/types/theme";
import React, { useEffect, useState } from "react";
import TopSVG from "../../components/ornament/topSVG";
import RightSVG2 from "../../components/ornament/rightSVG2";
import { motion } from 'framer-motion';

type AkadSectionProps = {
  theme: Theme;
  data: {
    tanggal: string;
    waktuAkad: string;
    lokasiAkad: string;
    lokasiAkadLat?: number;
    lokasiAkadLng?: number;
    lokasiAkadUrl?: string;
    waktuAkadSelesai?: string;
    sampaiSelesai?: boolean;
  };
};

// Fungsi format tanggal Indonesia
function formatTanggalIndo(tanggal: string | null | undefined) {
  if (!tanggal) return "-";
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const d = new Date(tanggal);
  if (isNaN(d.getTime())) return tanggal;
  const hariStr = hari[d.getDay()];
  const tgl = d.getDate();
  const bln = bulan[d.getMonth()];
  const thn = d.getFullYear();
  return `${hariStr}, ${tgl} ${bln} ${thn}`;
}
// Fungsi format jam HH:mm
function formatJam(jam: string | undefined | null) {
  if (!jam) return "";
  // Ambil hanya HH:mm
  return jam.slice(0,5);
}
// Fungsi format waktu
function formatWaktu(mulai?: string, selesai?: string, sampaiSelesai?: boolean) {
  if (!mulai) return "-";
  const mulaiStr = formatJam(mulai);
  if (sampaiSelesai) return `${mulaiStr} - Selesai`;
  if (selesai) return `${mulaiStr} - ${formatJam(selesai)}`;
  return mulaiStr;
}

const AkadSection: React.FC<AkadSectionProps> = ({ theme, data }) => {
  const parseTanggal = (tanggal: string) => {
    const parts = tanggal.split('-');
    return {
      tahun: parts[0],
      bulan: parts[1],
      tanggal: parts[2]
    };
  };

  const handleClickLokasi = () => {
    // Jika ada url map, gunakan url map
    if (data.lokasiAkadUrl) {
      window.open(data.lokasiAkadUrl, '_blank');
    }
    // Jika ada koordinat, gunakan koordinat
    else if (data.lokasiAkadLat && data.lokasiAkadLng) {
      window.open(`https://www.google.com/maps?q=${data.lokasiAkadLat},${data.lokasiAkadLng}`, '_blank');
    } 
    // Jika tidak ada koordinat, gunakan pencarian berdasarkan alamat
    else {
      const query = encodeURIComponent(data.lokasiAkad);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  const tanggalInfo = parseTanggal(data.tanggal);
  // Tanggal dan waktu akad
  const tanggalAkadStr = formatTanggalIndo(data.tanggal);
  const waktuAkadStr = formatWaktu(data.waktuAkad, data.waktuAkadSelesai, data.sampaiSelesai);

  // Countdown
  const [countdown, setCountdown] = useState<string>("");
  useEffect(() => {
    if (!data.tanggal || !data.waktuAkad) return;
    const target = new Date(`${data.tanggal}T${data.waktuAkad}`);
    const update = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown("Acara telah dimulai");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown(`${days} hari ${hours} jam ${minutes} menit ${seconds} detik`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [data.tanggal, data.waktuAkad]);

  // Tampilkan tombol jika ada url, koordinat, atau alamat
  const showButton = !!(data.lokasiAkadUrl || (data.lokasiAkadLat && data.lokasiAkadLng) || data.lokasiAkad);

  return (
    <div className={`page relative overflow-hidden`} style={{ color: theme.primaryColor, background: theme.backgroundColor }}>
      {/* Ornamen Atas */}
      {/* <motion.div
        initial={{ opacity: 0, scale: 0.7, y: -40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="absolute left-1/2 top-6 -translate-x-1/2 z-20 scale-75 opacity-80"
        style={{ marginTop: '-2rem' }}
      >
        <TopSVG color={theme.primaryColor} />
      </motion.div> */}
      {/* <motion.div
        initial={{ opacity: 0, scale: 0.7, y: -40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="absolute right-2 z-0 origin-top-right transform"
      >
        <RightSVG2 color={theme.primaryColor} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: -40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="absolute left-2 z-0 origin-top-right transform"
      >
        <div className="scale-x-[-1]">
          <RightSVG2 color={theme.primaryColor} />
        </div>
      </motion.div> */}
      <div className="flex flex-col justify-center items-center min-h-screen relative z-10 py-12 px-4 md:px-8">
        <div className="relative max-w-xl w-full mx-4 p-8 rounded-2xl backdrop-blur-sm" style={{ background: `linear-gradient(135deg, ${theme.backgroundColor}f0, ${theme.backgroundColor}80)`, border: `1px solid ${theme.primaryColor}30` }}>
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl ${theme.fontTitle}`} style={{ color: theme.primaryColor }}>Akad Nikah</h2>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${theme.primaryColor}, transparent)` }}></div>
          </div>
          {/* Ornamen kanan/kiri bisa ditambahkan di sini */}
          <div className="flex justify-center mb-8">
            <div className="inline-block border-2 rounded-lg overflow-hidden shadow-lg" style={{ borderColor: theme.primaryColor }}>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className="px-4 py-2 text-center"
                style={{ background: theme.primaryColor }}
              >
                <div className="text-lg font-medium tracking-wide" style={{ color: theme.backgroundColor }}>{tanggalAkadStr}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.22, ease: 'easeOut' }}
                className="px-4 py-4 text-center"
                style={{ background: theme.backgroundColor }}
              >
                <div className="text-3xl font-bold" style={{ color: theme.primaryColor }}>{waktuAkadStr}</div>
                <div className="mt-2 text-sm font-medium text-gray-700" style={{ color: theme.primaryColor }}>
                  {countdown}
                </div>
              </motion.div>
            </div>
          </div>
          {/* <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.34, ease: 'easeOut' }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <svg className="w-5 h-5" style={{ color: theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg font-medium" style={{ color: theme.primaryColor }}>{data.waktuAkad}</span>
          </motion.div> */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.46, ease: 'easeOut' }}
            className="flex items-center justify-center gap-4 my-6"
          >
            <div className="flex-1 h-px" style={{ background: `${theme.primaryColor}40` }}></div>
            <div className="text-2xl" style={{ color: theme.primaryColor }}>❦</div>
            <div className="flex-1 h-px" style={{ background: `${theme.primaryColor}40` }}></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.58, ease: 'easeOut' }}
            className="text-center"
          >
            <h3 className="text-xl mb-3" style={{ color: theme.primaryColor }}>Bertempat di</h3>
            <p className="text-sm mb-2" style={{ color: theme.primaryColor }}>{data.lokasiAkad}</p>
          </motion.div>
          {/* Tampilkan tombol hanya jika ada koordinat */}
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
              className="mt-8 flex items-center justify-center"
            >
              <button 
                className="group relative px-6 py-3 rounded-lg overflow-hidden transition-all duration-300" 
                style={{ background: theme.primaryColor, color: theme.backgroundColor }} 
                onClick={handleClickLokasi}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-black transition-opacity duration-300"></div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">Lihat Lokasi Akad</span>
                </div>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AkadSection; 