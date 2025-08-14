import React from 'react';
import type { Theme } from "@/types/theme";
import { motion } from 'framer-motion';
import Countdown from "./Countdown";
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import type { CoverTipe, UrutanMempelai } from '@/types';
import { toTitleCase } from '@/utils/toTitleCase';

// Helper components for ornaments remain the same
const AnimatedTopOrnament: React.FC<{ isLocked: boolean; className: string; children: React.ReactNode; }> = ({ isLocked, className, children }) => (
  <motion.div
    initial={{ opacity: 0, y: -60 }}
    animate={isLocked ? { opacity: 0 } : { opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
    className={`absolute top-0 z-10 ${className}`}
  >
    {children}
  </motion.div>
);

const AnimatedBottomOrnament: React.FC<{ isLocked: boolean; className: string; children: React.ReactNode; }> = ({ isLocked, className, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    animate={isLocked ? { opacity: 0 } : { opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeInOut', delay: 0.3 }}
    className={`absolute bottom-4 z-0 ${className}`}
  >
    {children}
  </motion.div>
);


const hexToRgba = (hex: string, alpha: number = 1): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return `rgba(255, 255, 255, ${alpha})`;
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
  const OrnamentAtas = theme.ornaments?.coverTop;
  const OrnamentBawah = theme.ornaments?.coverBottom;

  // Perbaikan: pastikan urutan nama tampil benar dan handle null/undefined dengan lebih aman
  const namaPria = toTitleCase(data.namaPanggilanPria || data.namaPria || "");
  const namaWanita = toTitleCase(data.namaPanggilanWanita || data.namaWanita || "");
  console.log(data.urutanMempelai);
  const namaTampil = data.urutanMempelai === 'wanita-pria'
    ? `${namaWanita} & ${namaPria}`
    : `${namaPria} & ${namaWanita}`;

  const tanggalFormatted = data.tanggal ? format(new Date(data.tanggal), "dd MMMM yyyy", { locale: localeId }) : null;

  const getBackgroundStyle = () => {
    const imageUrl = data.coverTipe === 'upload'
      ? data.coverUrl
      : data.coverTipe === 'gambar'
        ? data.coverGambarPilihan
        : null;

    if (imageUrl) {
      // --- PERBAIKI AKSES WARNA DI SINI ---
      const overlayColor = hexToRgba(theme.colors.background, 0.8);
      return {
        backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor}), url(${imageUrl})`
      };
    }

    return {
      background: `linear-gradient(to top, ${theme.colors.background}, ${theme.colors.secondary}aa)`
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`relative flex flex-col justify-center items-center text-center p-4 ${isFullScreen ? 'min-h-screen' : ''} ${theme.fontText}`}
      style={{
        color: theme.colors.foreground,
        overflow: "hidden",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...getBackgroundStyle(),
      }}
    >
      {OrnamentAtas && (
        <>
          <AnimatedTopOrnament isLocked={isLocked} className="right-0">
            <OrnamentAtas theme={theme} />
          </AnimatedTopOrnament>
          <AnimatedTopOrnament isLocked={isLocked} className="left-0 scale-x-[-1]">
            <OrnamentAtas theme={theme} />
          </AnimatedTopOrnament>
        </>
      )}

      <div className="relative z-20 flex flex-col items-center justify-center h-full">
        <motion.div
          animate={{ y: isLocked ? '-15vh' : 0 }}
          transition={{ duration: 1.2, ease: [0.83, 0, 0.17, 1] }}
          className="flex flex-col items-center"
        >
          <p className="tracking-widest text-sm mb-4">THE WEDDING OF</p>
          <h1
            className={`text-4xl md:text-6xl ${theme.fontTitle}`}
            style={{ color: theme.colors.primary }}
          >
            {namaTampil}
          </h1>
          {tanggalFormatted && <p className="mt-4 text-lg">{tanggalFormatted}</p>}
          {data.tanggal && <Countdown targetDate={data.tanggal} theme={theme} />}
        </motion.div>

        {/* Tambahkan delay saat pertama kali tampil */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLocked ? 1 : 0 }}
          transition={{
            duration: 0.5,
            delay: 0.5, // delay muncul pertama kali (misal 1.2 detik)
          }}
          className={`absolute -bottom-20 flex flex-col items-center ${!isLocked ? 'pointer-events-none' : ''}`}
        >
          {namaTamu && (
            <div className="mb-8 text-center">
              <p className="text-sm">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="text-lg font-bold mt-1" style={{ color: theme.colors.primary }}>{namaTamu}</p>
            </div>
          )}
          <Button
            onClick={onOpen}
            disabled={!isLocked}
            style={{
              background: theme.colors.primary,
              color: theme.colors.primaryForeground
            }}
          >
            Buka Undangan
          </Button>
        </motion.div>
      </div>

      {OrnamentBawah && (
        <>
          <AnimatedBottomOrnament isLocked={isLocked} className="-right-1">
            <OrnamentBawah theme={theme} />
          </AnimatedBottomOrnament>
          <AnimatedBottomOrnament isLocked={isLocked} className="-left-1 scale-x-[-1]">
            <OrnamentBawah theme={theme} />
          </AnimatedBottomOrnament>
        </>
      )}
    </motion.div>
  );
};

export default CoverSection;