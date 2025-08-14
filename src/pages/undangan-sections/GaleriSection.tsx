import React from "react";
import type { Theme } from "@/types/theme";
import { motion } from 'framer-motion';

// --- Props Utama (Tidak berubah) ---
interface GaleriSectionProps {
  theme: Theme;
  images: string[];
};

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const }
  })
};

// ===============================================================
// SUB-KOMPONEN UNTUK LAYOUT 'CLASSIC' (Desain Grid Standar)
// ===============================================================
const ClassicGaleriLayout: React.FC<GaleriSectionProps> = ({ theme, images }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl">
    {images.map((img, i) => (
      <motion.div
        key={i}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={variants}
        custom={i + 1}
        className="aspect-[3/4] w-full overflow-hidden rounded-xl border shadow-lg group"
        style={{ borderColor: theme.colors.secondary }}
      >
        <img
          src={img}
          alt={`Galeri ${i + 1}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </motion.div>
    ))}
  </div>
);

// ===============================================================
// SUB-KOMPONEN UNTUK LAYOUT 'MODERN' (Desain Masonry/Pinterest Style)
// ===============================================================
const ModernGaleriLayout: React.FC<GaleriSectionProps> = ({ theme, images }) => (
  <div className="w-full max-w-5xl columns-2 md:columns-3 gap-4">
    {images.map((img, i) => (
      <motion.div
        key={i}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={variants}
        custom={i + 1}
        className="mb-4 break-inside-avoid rounded-xl overflow-hidden border shadow-lg group"
        style={{ borderColor: theme.colors.secondary }}
      >
        <img
          src={img}
          alt={`Galeri ${i + 1}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </motion.div>
    ))}
  </div>
);


// ===============================================================
// Komponen Utama yang Menjadi "Dispatcher"
// ===============================================================
const GaleriSection: React.FC<GaleriSectionProps> = (props) => {
  const { theme, images } = props;

  if (!images || images.length === 0) {
    return null;
  }

  const renderLayout = () => {
    switch (theme.layout) {
      case 'modern':
        return <ModernGaleriLayout {...props} />;
      case 'classic':
      default:
        return <ClassicGaleriLayout {...props} />;
    }
  };

  return (
    <section
      className="relative py-16 px-4 flex flex-col items-center justify-center"
      style={{ background: theme.colors.background }}
    >
      <div className="w-full max-w-5xl text-center flex flex-col items-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
          custom={0}
          className={`text-4xl md:text-5xl mb-12 ${theme.fontTitle}`}
          style={{ color: theme.colors.primary }}
        >
          Momen Bahagia Kami
        </motion.h2>

        {renderLayout()}
      </div>
    </section>
  );
};

export default GaleriSection;