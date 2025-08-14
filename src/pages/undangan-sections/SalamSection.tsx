import React from "react";
import type { Theme } from "../../types/theme";
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

// --- Props Utama (Tidak berubah) ---
interface SalamSectionProps {
  theme: Theme;
}

const variants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.18, duration: 0.7, ease: 'easeOut' }
  })
};

// ===============================================================
// SUB-KOMPONEN UNTUK LAYOUT 'CLASSIC'
// ===============================================================
const ClassicSalamLayout: React.FC<SalamSectionProps> = ({ theme }) => {
  const OrnamentAtas = theme.ornaments?.center;
  const OrnamentTengah = theme.ornaments?.separator;

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-screen text-center"
      style={{ color: theme.colors.primary, background: theme.colors.background }}
    >
      {OrnamentAtas && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <OrnamentAtas theme={theme} />
        </motion.div>
      )}

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={variants} custom={1}
        className={`text-md font-bold mb-6 px-6 italic tracking-wide ${theme.fontText}`}
        style={{ color: theme.colors.primary }}
      >
        Assalamu'alaikum Warahmatullahi Wabarakatuh
      </motion.div>

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={variants} custom={2}
        className="text-sm md:text-lg text-center mb-12 px-6 leading-relaxed max-w-xl"
        style={{ color: theme.colors.foreground }}
      >
        <span className="block mb-2 font-medium">Maha Suci Allah SWT yang telah menciptakan makhluk-Nya berpasang-pasangan.</span>
        <span className="block">Ya Allah, perkenankanlah kami menjalin ikatan suci dalam bingkai kasih sayang yang Kau ciptakan.</span>
      </motion.div>

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={variants} custom={3}
        className="relative z-10 max-w-md px-2 w-11/12 mx-auto"
      >
        <div className="italic text-sm md:text-base text-center bg-white rounded-xl shadow px-6 py-4 border">
          <span className="block mb-1" style={{ color: theme.colors.foreground }}>"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."</span>
          <span className="text-xs block font-semibold tracking-wide mt-2" style={{ color: theme.colors.primary }}>- QS. Ar-Rum: 21 -</span>
        </div>
      </motion.div>

      {OrnamentTengah && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12"
        >
          <OrnamentTengah theme={theme} />
        </motion.div>
      )}
    </section>
  );
};

// ===============================================================
// SUB-KOMPONEN UNTUK LAYOUT 'MODERN'
// ===============================================================
const ModernSalamLayout: React.FC<SalamSectionProps> = ({ theme }) => (
  <section
    className="flex flex-col justify-center min-h-screen"
    style={{ color: theme.colors.foreground, background: theme.colors.background }}
  >
    <div className="max-w-xl">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h2
          className={`text-4xl md:text-5xl mb-6 ${theme.fontTitle}`}
          style={{ color: theme.colors.primary }}
        >
          Dengan Rahmat-Mu, Kami Melangkah
        </h2>
        <div className="w-24 h-1 rounded-full mb-8" style={{ background: theme.colors.primary }}></div>
        <p className="text-md md:text-lg mb-4 leading-relaxed">
          Maha Suci Allah SWT yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah, perkenankanlah dan ridhoilah kami untuk menyatukan dua hati dalam ikatan suci pernikahan.
        </p>
        <div className="mt-8 italic text-sm border-l-4 p-4" style={{ borderColor: theme.colors.primary }}>
          <p className="mb-2">"Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya..."</p>
          <p className="font-semibold" style={{ color: theme.colors.primary }}>- QS. Ar-Rum: 21 -</p>
        </div>
      </motion.div>
    </div>
  </section>
);

// ===============================================================
// Komponen Utama yang Menjadi "Dispatcher"
// ===============================================================
const SalamSection: React.FC<SalamSectionProps> = (props) => {
  const { theme } = props;

  // Pilih sub-komponen mana yang akan di-render berdasarkan tema
  switch (theme.layout) {
    case 'modern':
      return <ModernSalamLayout {...props} />;
    case 'classic':
    default:
      return <ClassicSalamLayout {...props} />;
  }
};

export default SalamSection;