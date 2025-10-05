import React from 'react';
import type { Theme } from '@/types/theme';
import type { MempelaiData } from '@/types';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { formatOrangTua, toTitleCase } from '@/utils/text-formatting';

// --- Props Utama (Tidak berubah) ---
interface ProfileSectionProps {
  theme: Theme;
  data: {
    mempelai1: MempelaiData;
    mempelai2: MempelaiData;
  };
  mempelai1IsPria: boolean;
}

// ===============================================================
// Komponen Pendukung: ProfileCard (Reusable)
// ===============================================================
const profileCardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom: number = 0.2) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom, duration: 0.7, ease: [0.4, 0, 0.2, 1] }
  })
};

const ProfileCard: React.FC<{ mempelai: MempelaiData, theme: Theme, isPria: boolean, delay?: number }> = ({ mempelai, theme, isPria, delay = 0.2 }) => {
  const getInstagramUsername = (url: string | null): string | null => {
    if (!url) return null;
    try {
      const pathParts = new URL(url).pathname.split('/').filter(part => part);
      return pathParts.pop() || null;
    } catch {
      return null;
    }
  };

  const ortuString = formatOrangTua(mempelai.bapak, mempelai.ibu, mempelai.almBapak, mempelai.almIbu, mempelai.anakKe, isPria);
  const instagramUsername = getInstagramUsername(mempelai.instagram);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={profileCardVariants}
      custom={delay}
      className="flex flex-col items-center text-center group w-full px-4"
    >
      <div className="relative mb-4">
        {mempelai.foto ? (
          <img src={mempelai.foto} alt={mempelai.nama} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 shadow-lg" style={{ borderColor: theme.colors.primary }} />
        ) : (
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg" style={{ background: theme.colors.primary, color: theme.colors.background }}>
            {mempelai.nama?.[0] || 'A'}
          </div>
        )}
      </div>
      <h3 className={`text-3xl md:text-4xl ${theme.fontTitle}`} style={{ color: theme.colors.primary }}>{toTitleCase(mempelai.nama)}</h3>
      {mempelai.namaPanggilan && <p className="text-md mt-1" style={{ color: theme.colors.foreground }}>({toTitleCase(mempelai.namaPanggilan)})</p>}
      {ortuString && <p className="mt-2 text-sm md:text-base leading-relaxed" style={{ color: theme.colors.foreground }}>{ortuString}</p>}
      {instagramUsername && (
        <a href={mempelai.instagram!} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-2 transition-transform hover:scale-105" style={{ color: theme.colors.primary }}>
          <Instagram className="w-5 h-5" />
          <span className="font-medium text-sm">@{instagramUsername}</span>
        </a>
      )}
    </motion.div>
  );
};

// ===============================================================
// SUB-KOMPONEN UNTUK LAYOUT 'CLASSIC' (Atas-Bawah)
// ===============================================================
const ClassicProfileLayout: React.FC<ProfileSectionProps> = ({ theme, data, mempelai1IsPria }) => (
  <div className="flex flex-col items-center gap-8 w-full">
    <ProfileCard mempelai={data.mempelai1} theme={theme} isPria={mempelai1IsPria} delay={0.2} />
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
      className={`text-6xl md:text-7xl ${theme.fontTitle} select-none`}
      style={{ color: theme.colors.primary }}
    >
      &
    </motion.span>
    <ProfileCard mempelai={data.mempelai2} theme={theme} isPria={!mempelai1IsPria} delay={0.4} />
  </div>
);

// ===============================================================
// SUB-KOMPONEN UNTUK LAYOUT 'MODERN' (Kiri-Kanan di layar besar)
// ===============================================================
const ModernProfileLayout: React.FC<ProfileSectionProps> = ({ theme, data, mempelai1IsPria }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 items-start w-full">
    <ProfileCard mempelai={data.mempelai1} theme={theme} isPria={mempelai1IsPria} />
    <ProfileCard mempelai={data.mempelai2} theme={theme} isPria={!mempelai1IsPria} />
  </div>
);

// ===============================================================
// Komponen Utama yang Menjadi "Dispatcher"
// ===============================================================
const ProfileSection: React.FC<ProfileSectionProps> = (props) => {
  const { theme } = props;

  const renderLayout = () => {
    switch (theme.layout) {
      case 'modern':
        return <ModernProfileLayout {...props} />;
      case 'classic':
      default:
        return <ClassicProfileLayout {...props} />;
    }
  };

  return (
    <section
      className="relative py-16 px-4 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: theme.colors.background }}
    >
      <div className="z-10 flex flex-col items-center w-full max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-12 px-2 text-sm md:text-base leading-loose"
          style={{ color: theme.colors.foreground }}
        >
          Dengan memohon rahmat dan ridho Allah SWT, izinkan kami berbagi kabar bahagia mengenai niat tulus kami untuk menyatukan dua hati dalam ikatan suci pernikahan:
        </motion.p>
        {renderLayout()}
      </div>
    </section>
  );
};

export default ProfileSection;