import React from "react";
import type { Theme } from "@/types/theme";
import { motion } from 'framer-motion';

type GaleriSectionProps = {
  theme: Theme;
  images: string[];
};

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' as const }
  })
};

const GaleriSection: React.FC<GaleriSectionProps> = ({ theme, images }) => (
  <div
    className={`page relative`}
    style={{ color: theme.primaryColor, background: theme.backgroundColor }}
  >
    <div className="flex flex-col justify-center items-center h-full w-11/12 mb-12">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={variants}
        custom={1}
        className={`text-3xl text-center mb-6 tracking-wider ${theme.fontTitle}`}
        style={{ color: theme.primaryColor }}
      >
        Galeri
      </motion.h2>
      <div className="grid grid-cols-2 gap-4">
        {images.map((img, i) => (
          <motion.img
            key={i}
            src={img}
            alt={`Galeri ${i + 1}`}
            className="rounded-xl border shadow-lg"
            style={{ borderColor: theme.secondaryColor }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={variants}
            custom={i + 2}
          />
        ))}
      </div>
    </div>
  </div>
);

export default GaleriSection; 