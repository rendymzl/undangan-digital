import React from 'react';
import type { Theme } from "@/types/theme";
import { motion } from 'framer-motion';
import Countdown from "./Countdown"; // Pastikan path import ini benar
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import TopRightCornerSVG from "../../components/ornament/topRightCornerSVG";
import RightSVG1 from "../../components/ornament/rightSVG1";
import { Button } from '@/components/ui/button'; // Import Button jika belum ada
import type { CoverTipe, UrutanMempelai } from '@/types';
import { toTitleCase } from '@/utils/toTitleCase';


const hexToRgba = (hex: string, alpha: number = 1): string => {
  console.log('hex', hex)
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  console.log('result hex', result)
  if (!result) {
    return `rgba(255, 255, 255, ${alpha})`; // Fallback ke putih jika format hex salah
  }
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

type CoverSectionProps = {
  theme: Theme;
  data: {
    namaPria: string;
    namaWanita: string;
    namaPanggilanPria?: string | null;
    namaPanggilanWanita?: string | null;
    tanggal?: string | null;
    coverTipe?: CoverTipe;
    coverUrl?: string | null;
    coverGambarPilihan?: string | null;
    urutanMempelai?: UrutanMempelai | null;
  };
  namaTamu: string;
  onOpen: () => void;
  isLocked: boolean;
  isFullScreen?: boolean;
};

const CoverSection: React.FC<CoverSectionProps> = ({ theme, data, namaTamu, onOpen, isLocked, isFullScreen }) => {


  console.log('data.namaPanggilanPria', data.namaPanggilanPria)

  const namaTampil = data.urutanMempelai == 'wanita-pria' ? `${toTitleCase(data.namaPanggilanWanita || data.namaWanita)} & ${toTitleCase(data.namaPanggilanPria || data.namaPria)}` : `${toTitleCase(data.namaPanggilanPria || data.namaPria)} & ${toTitleCase(data.namaPanggilanWanita || data.namaWanita)}`;
  const tanggalFormatted = data.tanggal ? format(new Date(data.tanggal), "dd MMMM yyyy", { locale: localeId }) : null;

  const getBackgroundStyle = () => {
    // Prioritas: Upload, Gambar Pilihan, Warna
    console.log('data.coverTipe', data.coverTipe)
    const imageUrl = data.coverTipe === 'upload'
      ? data.coverUrl
      : data.coverTipe === 'gambar'
        ? data.coverGambarPilihan
        : null;

    if (imageUrl) {
      // Ambil warna latar dari tema dan beri transparansi (misal: 0.6 atau 60%)
      const overlayColor = hexToRgba(theme.backgroundColor, 0.8);
      return {
        backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor}), url(${imageUrl})`
      };
    }

    // Fallback ke warna tema
    return {
      background: `linear-gradient(to top, ${theme.backgroundColor}, ${theme.secondaryColor}aa)`
    };
  };
  return (
    <motion.div
      // --- PERBAIKAN DI SINI ---
      initial={{ opacity: 0, scale: 1.1 }} // Mulai dengan sedikit zoom dan transparan
      animate={{ opacity: 1, scale: 1 }}   // Animasikan ke ukuran normal dan solid
      transition={{ duration: 1, ease: "easeOut" }} // Atur durasi animasi
      className={`relative flex flex-col justify-center items-center text-center p-4 ${isFullScreen ? 'min-h-screen' : ''} ${theme.fontText}`}
      style={{
        color: theme.foregroundColor,
        // background: `linear-gradient(to top, ${theme.backgroundColor}, ${theme.secondaryColor}aa)`,
        overflow: "hidden",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...getBackgroundStyle(),
      }}
    >
      {/* Ornamen-ornamen dengan animasi */}
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={isLocked ? { opacity: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
        className="absolute top-0 right-0 z-10"
      >
        <TopRightCornerSVG color={theme.primaryColor} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={isLocked ? { opacity: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
        className="absolute top-0 left-0 z-10 scale-x-[-1]"
      >
        <TopRightCornerSVG color={theme.primaryColor} />
      </motion.div>

      <div className="relative z-20 flex flex-col items-center justify-center h-full">
        {/* --- PERBAIKAN ANIMASI PADA BLOK KONTEN UTAMA --- */}
        <motion.div
          // Saat terkunci (isLocked=true), posisinya -15vh (sedikit ke atas)
          // Saat terbuka (isLocked=false), animasikan ke posisi y: 0 (tengah)
          animate={{ y: isLocked ? '-15vh' : 0 }}
          transition={{ duration: 1.2, ease: [0.83, 0, 0.17, 1] }}
          className="flex flex-col items-center"
        >
          <p className="tracking-widest text-sm mb-4">THE WEDDING OF</p>
          <h1
            className={`text-4xl md:text-6xl ${theme.fontTitle}`}
            style={{ color: theme.primaryColor }}
          >
            {namaTampil}
          </h1>
          {tanggalFormatted && <p className="mt-4 text-lg">{tanggalFormatted}</p>}
          {data.tanggal && <Countdown targetDate={data.tanggal} theme={theme} />}
        </motion.div>

        {/* --- PERBAIKAN ANIMASI PADA BLOK TOMBOL --- */}
        <motion.div
          animate={{ opacity: isLocked ? 1 : 0 }} // Menghilang saat undangan dibuka
          transition={{ duration: 0.5 }}
          // Diposisikan secara absolut agar tidak mempengaruhi posisi blok utama
          className={`absolute -bottom-[15vh] flex flex-col items-center ${!isLocked ? 'pointer-events-none' : ''}`}
        >
          {namaTamu && (
            <div className="mb-8 text-center">
              <p className="text-sm">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="text-lg font-bold mt-1" style={{ color: theme.primaryColor }}>{namaTamu}</p>
            </div>
          )}
          <Button
            onClick={onOpen}
            disabled={!isLocked}
            style={{
              background: theme.primaryColor,
              color: theme.backgroundColor
            }}
          >
            Buka Undangan
          </Button>
        </motion.div>
      </div>

      {/* Ornamen Bawah */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isLocked ? { opacity: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut', delay: 0.3 }}
        className="absolute bottom-4 -right-1 z-0"
      >
        <RightSVG1 color={theme.primaryColor} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isLocked ? { opacity: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut', delay: 0.3 }}
        className="absolute bottom-4 -left-1 z-0 scale-x-[-1]"
      >
        <RightSVG1 color={theme.primaryColor} />
      </motion.div>
    </motion.div>
  );
};

export default CoverSection;