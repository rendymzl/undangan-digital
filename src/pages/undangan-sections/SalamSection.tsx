import React from "react";
import type { Theme } from "../../types/theme";
import TopSVG from "../../components/ornament/topSVG";
import CenterSVG from "../../components/ornament/centerSVG";
import RightSVG2 from "../../components/ornament/rightSVG2";
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

type SalamSectionProps = {
  theme: Theme;
};

const variants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.18, duration: 0.7, ease: 'easeOut' }
  })
};

const SalamSection: React.FC<SalamSectionProps> = ({ theme }) => (
  <div
    className={`page relative flex flex-col items-center justify-center ${theme.fontText}`}
    style={{ background: theme.backgroundColor, color: theme.primaryColor }}
  >
    <div className="flex flex-col justify-center items-center min-h-screen relative z-10">
      {/* Ornamen atas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: -40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="absolute top-0 left-1/2 -translate-x-1/2 mb-6"
      >
        <TopSVG color={theme.primaryColor} />

      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: -40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <CenterSVG color={theme.primaryColor} />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={variants}
        custom={1}
        className={`text-lg md:text-xl font-bold mb-6 px-6 italic text-center tracking-wide drop-shadow-sm ${theme.fontText}`}
        style={{ color: theme.primaryColor }}
      >
        Assalamu'alaikum Warahmatullahi Wabarakatuh
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={variants}
        custom={2}
        className="text-sm md:text-lg text-center mb-12 px-6 leading-relaxed max-w-xl"
        style={{ color: theme.primaryColor }}
      >
        <span className="block mb-2 font-medium">Maha Suci Allah SWT yang telah menciptakan makhluk-Nya berpasang-pasangan.</span>
        <span className="block">Ya Allah, perkenankanlah kami menjalin ikatan suci dalam bingkai kasih sayang yang Kau ciptakan.</span>
      </motion.div>

      <div className="relative w-full">
        {/* Ornamen kiri */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, x: -40 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute left-0 top-0 -translate-y-1/2 z-0 scale-75 opacity-80"
        >
          <div className="scale-x-[-1]">
            <RightSVG2 color={theme.primaryColor} />
          </div>
        </motion.div>

        {/* Ornamen kanan */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, x: 40 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute right-0 top-0 -translate-y-1/2 z-0 scale-75 opacity-80"
        >
          <RightSVG2 color={theme.primaryColor} />
        </motion.div>

        {/* Card Ayat */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
          custom={3}
          className="relative z-10 max-w-md px-2 w-11/12 mx-auto"
        >
          <div className="italic text-sm md:text-base text-center text-gray-600 bg-white rounded-xl shadow px-6 py-4 border border-gray-100">
            <span className="block mb-1">"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."</span>
            <span className="text-xs block font-semibold tracking-wide" style={{ color: theme.primaryColor }}>- QS. Ar-Rum: 21 -</span>
          </div>
        </motion.div>
      </div>

      {/* <div className="w-42 bottom-12 absolute h-1 mx-auto rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${theme.primaryColor}, transparent)` }}></div> */}
    </div>
  </div>
);

export default SalamSection; 