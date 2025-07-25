import React from "react";
import type { Theme } from "../../types/theme";
import { motion } from 'framer-motion';

type CeritaSectionProps = {
  theme: Theme;
  data: {
    cerita: string;
  };
};

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.18, duration: 0.7, ease: 'easeOut' as const }
  })
};

const CeritaSection: React.FC<CeritaSectionProps> = ({ theme, data }) => (
  <div
    className={`page relative p-8 flex flex-col items-center justify-center ${theme.fontText}`}
    style={{ color: theme.primaryColor, background: `${theme.backgroundColor}` }}
  >
    <div className="w-full max-w-xl text-center flex flex-col items-center">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={variants}
        custom={1}
        className={`text-4xl md:text-5xl mb-4 ${theme.fontTitle}`}
        style={{ color: theme.primaryColor }}
      >
        Cerita Cinta Kami
      </motion.h2>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={variants}
        custom={2}
        className="text-2xl mb-6"
        style={{ color: theme.secondaryColor }}
      >
        ❦
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={variants}
        custom={3}
        className="relative border-b pb-4"
        style={{ borderColor: `${theme.secondaryColor}80` }}
      >
        <span className={`absolute -top-2 -left-3 text-5xl opacity-20`} style={{ color: theme.primaryColor, fontFamily: theme.fontTitle }}>&quot;</span>
        <p className="text-base md:text-lg leading-relaxed italic text-center px-8" style={{ color: theme.primaryColor }}>{data.cerita}</p>
        <span className={`absolute -bottom-4 -right-3 text-5xl opacity-20`} style={{ color: theme.primaryColor, fontFamily: theme.fontTitle }}>&quot;</span>
      </motion.div>
    </div>
  </div>
);

export default CeritaSection; 