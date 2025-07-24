import React from 'react';
import type { Theme } from '@/types/theme';
import type { MempelaiData } from '@/types'; // Import tipe data utama
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

// --- Tipe Props yang Sudah Diperbaiki ---
interface ProfileSectionProps {
  theme: Theme;
  data: {
    mempelai1: MempelaiData;
    mempelai2: MempelaiData;
  };
  formatOrangTua: (
    bapak: string | null,
    ibu: string | null,
    almBapak: boolean,
    almIbu: boolean,
    anakKe: string | null,
    isPria: boolean
  ) => string | null;
  mempelai1IsPria: boolean;
}

// --- Komponen Internal untuk Menampilkan Satu Kartu Profil ---
const ProfileCard: React.FC<{
  mempelai: MempelaiData,
  theme: Theme,
  delay: number,
  isPria: boolean,
  formatOrangTua: ProfileSectionProps['formatOrangTua']
}> = ({ mempelai, theme, delay, isPria, formatOrangTua }) => {
  const variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  const getInstagramUsername = (url: string | null): string | null => {
    if (!url) return null;
    try {
      // Filter untuk menghapus string kosong dari hasil split (misal dari "https://")
      const pathParts = new URL(url).pathname.split('/').filter(part => part);
      return pathParts.pop() || null; // Ambil bagian terakhir
    } catch (error) {
      // Jika URL tidak valid, kembalikan null
      console.error("Invalid Instagram URL:", error);
      return null;
    }
  };

  // Panggil fungsi formatOrangTua di dalam komponen
  const ortuString = formatOrangTua(
    mempelai.bapak,
    mempelai.ibu,
    mempelai.almBapak,
    mempelai.almIbu,
    mempelai.anakKe,
    isPria
  );

  const instagramUsername = getInstagramUsername(mempelai.instagram);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={variants}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay }}
      className="flex flex-col items-center text-center group w-full px-4"
    >
      <div className="relative mb-4">
        {mempelai.foto ? (
          <img
            src={mempelai.foto}
            alt={mempelai.nama}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 shadow-lg group-hover:shadow-xl transition-all duration-300"
            style={{ borderColor: theme.primaryColor }}
          />
        ) : (
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg" style={{ background: theme.primaryColor, color: theme.backgroundColor }}>
            {mempelai.nama?.[0] || 'A'}
          </div>
        )}
      </div>
      <h3 className={`text-3xl md:text-4xl ${theme.fontTitle}`} style={{ color: theme.primaryColor }}>{mempelai.nama}</h3>
      {mempelai.namaPanggilan && <p className="text-md mt-1" style={{ color: theme.foregroundColor }}>({mempelai.namaPanggilan})</p>}

      {/* Tampilkan string orang tua yang sudah diformat */}
      {ortuString && <p className="mt-2 text-sm md:text-base leading-relaxed" style={{ color: theme.foregroundColor }}>{ortuString}</p>}

      {mempelai.instagram && (
        <a href={mempelai.instagram!}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-2 transition-transform hover:scale-105"
          aria-label={`Instagram ${mempelai.nama}`}
          style={{ color: theme.primaryColor }}>
          <Instagram className="w-5 h-5 transition-transform hover:scale-110" style={{ color: theme.primaryColor }} />
          <span className="font-medium text-sm">@{instagramUsername}</span>
        </a>
      )}
    </motion.div>
  );
};

// --- Komponen Utama ProfileSection ---
const ProfileSection: React.FC<ProfileSectionProps> = ({ theme, data, formatOrangTua, mempelai1IsPria }) => {
  const { mempelai1, mempelai2 } = data;

  return (
    <section
      className="relative py-16 px-4 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: theme.backgroundColor, color: theme.foregroundColor }}
    >
      {/* Anda bisa menambahkan ornamen di sini jika perlu */}

      <div className="z-10 flex flex-col items-center w-full max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-12 px-2 text-sm md:text-base leading-loose"
        >
          Dengan Rahmat Tuhan Yang Maha Esa, kami menyatukan dua hati dalam satu cinta, mengikat janji suci dalam sebuah pernikahan:
        </motion.p>
        <div className="flex flex-col items-center gap-8 w-full">
          <ProfileCard mempelai={mempelai1} theme={theme} delay={0.2} isPria={mempelai1IsPria} formatOrangTua={formatOrangTua} />
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`text-6xl md:text-7xl ${theme.fontTitle} select-none`}
            style={{ color: theme.primaryColor }}
          >
            &
          </motion.span>
          <ProfileCard mempelai={mempelai2} theme={theme} delay={0.4} isPria={!mempelai1IsPria} formatOrangTua={formatOrangTua} />
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;