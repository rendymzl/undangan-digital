import React from "react";
import type { Theme } from "../../types/theme";
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

// --- Props Utama ---
interface CeritaSectionProps {
  theme: Theme;
  data: {
    cerita: string;
    // Tambahkan coverUrl agar bisa digunakan di layout modern
    coverUrl?: string | null;
  };
}

const variants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: 'easeOut' as const }
  })
};

// ===============================================================
// SUB-KOMPONEN UNTUK LAYOUT 'CLASSIC' (Desain Anda Saat Ini)
// ===============================================================
const ClassicCeritaLayout: React.FC<CeritaSectionProps> = ({ theme, data }) => (
  <section
    className={`relative p-8 flex flex-col items-center justify-center ${theme.fontText}`}
    style={{ background: theme.colors.background }}
  >
    <div className="w-full max-w-xl text-center flex flex-col items-center">
      <motion.h2
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={variants} custom={1}
        className={`text-4xl md:text-5xl mb-4 ${theme.fontTitle}`}
        style={{ color: theme.colors.primary }}
      >
        Cerita Cinta Kami
      </motion.h2>
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={variants} custom={2}
        className="text-2xl mb-6"
        style={{ color: theme.colors.secondary }}
      >
        ❦
      </motion.div>
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={variants} custom={3}
        className="relative border-b pb-4"
        style={{ borderColor: `${theme.colors.secondary}80` }}
      >
        <span className={`absolute -top-2 -left-3 text-5xl opacity-20 ${theme.fontTitle}`}>&quot;</span>
        <p className="text-base md:text-lg leading-relaxed italic text-center px-8" style={{ color: theme.colors.foreground }}>{data.cerita}</p>
        <span className={`absolute -bottom-4 -right-3 text-5xl opacity-20 ${theme.fontTitle}`}>&quot;</span>
      </motion.div>
    </div>
  </section>
);

// ===============================================================
// SUB-KOMPONEN UNTUK LAYOUT 'MODERN' (Desain Baru)
// ===============================================================
const ModernCeritaLayout: React.FC<CeritaSectionProps> = ({ theme, data }) => (
  <section
    className="py-16 px-4"
    style={{ background: theme.colors.secondary }}
  >
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-8 items-center">
      {/* Kolom Kiri: Gambar (menggunakan coverUrl) */}
      {data.coverUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="aspect-square rounded-lg overflow-hidden"
        >
          <img src={data.coverUrl} alt="Cerita Cinta" className="w-full h-full object-cover" />
        </motion.div>
      )}

      {/* Kolom Kanan: Teks Cerita */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className={`text-left ${!data.coverUrl ? 'md:col-span-2 text-center' : ''}`}
      >
        <h2
          className={`text-4xl md:text-5xl mb-4 ${theme.fontTitle}`}
          style={{ color: theme.colors.primary }}
        >
          Our Love Story
        </h2>
        <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: theme.colors.foreground }}>
          {data.cerita}
        </p>
      </motion.div>
    </div>
  </section>
);


// ===============================================================
// Komponen Utama yang Menjadi "Dispatcher"
// ===============================================================
const CeritaSection: React.FC<CeritaSectionProps> = (props) => {
  if (!props.data.cerita) {
    return null;
  }

  const { theme } = props;

  switch (theme.layout) {
    case 'modern':
      return <ModernCeritaLayout {...props} />;
    case 'classic':
    default:
      return <ClassicCeritaLayout {...props} />;
  }
};

export default CeritaSection;