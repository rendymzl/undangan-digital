import React from "react";
import type { Theme } from "../../types/theme";
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { toTitleCase } from "@/utils/toTitleCase";
import type { UrutanMempelai } from "@/types";

// --- Props Utama ---
interface PenutupSectionProps {
  theme: Theme;
  data: {
    namaPria: string;
    namaWanita: string;
    urutanMempelai?: UrutanMempelai | null;
  };
};

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' as const }
  })
};

// ===============================================================
// SUB-KOMPONEN UNTUK LAYOUT 'CLASSIC' (Desain Anda Saat Ini)
// ===============================================================
const ClassicPenutupLayout: React.FC<PenutupSectionProps> = ({ theme, data }) => {
  const OrnamenBawah = theme.ornaments?.coverBottom;

  return (
    <div className="relative flex flex-col justify-between items-center min-h-screen py-16 px-4">
      {/* Konten Utama */}
      <div className="flex flex-col justify-center items-center flex-1 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} custom={1} className={`text-5xl mb-8 ${theme.fontTitle}`} style={{ color: theme.colors.primary }}>
          Terima Kasih
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} custom={2} className="text-lg font-medium mb-8 max-w-lg" style={{ color: theme.colors.foreground }}>
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} custom={3} className="mt-8 text-md" style={{ color: theme.colors.foreground }}>
          Salam hangat,
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} custom={4} className={`mt-4 text-3xl ${theme.fontTitle}`} style={{ color: theme.colors.primary }}>
          {data.urutanMempelai === 'wanita-pria'
            ? `${toTitleCase(data.namaWanita)} & ${toTitleCase(data.namaPria)}`
            : `${toTitleCase(data.namaPria)} & ${toTitleCase(data.namaWanita)}`
          }
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} custom={5} className="w-full flex flex-col items-center justify-center mt-10">
        <span className="flex items-center gap-2 text-gray-500 text-sm font-light">
          Dibuat dengan <Heart className="inline w-4 h-4 text-red-500" fill="#ef4444" /> oleh{' '}
          <a href="/" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
            Menantikan
          </a>
        </span>
      </motion.footer>

      {/* Ornamen Bawah Dinamis */}
      {OrnamenBawah && (
        <>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="absolute bottom-4 -right-1 z-0">
            <OrnamenBawah theme={theme} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="absolute bottom-4 -left-1 z-0 scale-x-[-1]">
            <OrnamenBawah theme={theme} />
          </motion.div>
        </>
      )}
    </div>
  );
};

// ===============================================================
// SUB-KOMPONEN UNTUK LAYOUT 'MODERN' (Desain Baru)
// ===============================================================
const ModernPenutupLayout: React.FC<PenutupSectionProps> = ({ theme, data }) => {
  const OrnamenAtas = theme.ornaments?.separator;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      {OrnamenAtas && (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
          <OrnamenAtas theme={theme} />
        </motion.div>
      )}
      <motion.p
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} custom={1}
        className="text-base mt-8 max-w-lg" style={{ color: theme.colors.foreground }}
      >
        Atas kehadiran dan doa restu yang telah diberikan, kami mengucapkan terima kasih yang tulus.
      </motion.p>
      <motion.p
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} custom={2}
        className={`mt-4 text-4xl ${theme.fontTitle}`} style={{ color: theme.colors.primary }}
      >
        {data.urutanMempelai === 'wanita-pria'
          ? `${toTitleCase(data.namaWanita)} & ${toTitleCase(data.namaPria)}`
          : `${toTitleCase(data.namaPria)} & ${toTitleCase(data.namaWanita)}`
        }
      </motion.p>
      <motion.footer initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} custom={3} className="w-full absolute bottom-8 flex flex-col items-center justify-center">
        <span className="flex items-center gap-2 text-gray-500 text-sm font-light">
          Wedding Invitation by{' '}
          <a href="/" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
            Menantikan
          </a>
        </span>
      </motion.footer>
    </div>
  );
};


// ===============================================================
// Komponen Utama yang Menjadi "Dispatcher"
// ===============================================================
const PenutupSection: React.FC<PenutupSectionProps> = (props) => {
  const { theme } = props;

  const renderLayout = () => {
    switch (theme.layout) {
      case 'modern':
        return <ModernPenutupLayout {...props} />;
      case 'classic':
      default:
        return <ClassicPenutupLayout {...props} />;
    }
  };

  return (
    <section
      className={`relative overflow-hidden ${theme.fontText}`}
      style={{ background: theme.colors.background }}
    >
      {renderLayout()}
    </section>
  );
};

export default PenutupSection;