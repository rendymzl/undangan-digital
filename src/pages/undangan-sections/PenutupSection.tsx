import React from "react";
import type { Theme } from "../../types/theme";
import { Heart } from 'lucide-react';
import TopSVG from '../../components/ornament/topSVG';
import TopRightCornerSVG from '../../components/ornament/topRightCornerSVG';
import RightSVG1 from '../../components/ornament/rightSVG1';
import { motion } from 'framer-motion';
import { toTitleCase } from "@/utils/toTitleCase";
import type { UrutanMempelai } from "@/types";

type PenutupSectionProps = {
  theme: Theme;
  data: {
    namaPria: string;
    namaWanita: string;
    urutanMempelai?: UrutanMempelai | null;
  };
};

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' as const }
  })
};

const PenutupSection: React.FC<PenutupSectionProps> = ({ theme, data }) => (
  <div
    className={`page page-cover page-cover-bottom min-h-screen ${theme.fontText}`}
    style={{ color: theme.primaryColor, background: theme.backgroundColor, position: "relative", overflow: "hidden" }}
    data-density="hard"
  >
    {/* Ornamen Bawah kanan */}
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="absolute bottom-4 -right-1 z-0"
    >
      <RightSVG1 color={theme.primaryColor} />
    </motion.div>
    {/* Ornamen Bawah kiri */}
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="absolute bottom-4 -left-1 z-0"
    >
      <div className="scale-x-[-1]">
        <RightSVG1 color={theme.primaryColor} />
      </div>
    </motion.div>
    <div className="flex flex-col justify-between items-center min-h-screen py-12 relative z-10">
      <div className="flex flex-col justify-center items-center flex-1">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
          custom={1}
          className={`text-5xl mb-8 ${theme.fontTitle}`}
          style={{ color: theme.primaryColor }}
        >
          Terima Kasih
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
          custom={2}
          className="text-lg font-medium text-center mb-8 px-6"
          style={{ color: theme.primaryColor }}
        >
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
          custom={3}
          className={`mt-8 text-md`}
          style={{ color: theme.primaryColor }}
        >
          Salam hangat,
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
          custom={4}
          className={`mt-8 text-3xl ${theme.fontTitle}`}
          style={{ color: theme.primaryColor }}
        >
          {data.urutanMempelai === 'wanita-pria'
            ? `${toTitleCase(data.namaWanita)} & ${toTitleCase(data.namaPria)}`
            : `${toTitleCase(data.namaPria)} & ${toTitleCase(data.namaWanita)}`
          }
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
          custom={5}
          className="mt-8 text-3xl"
          style={{ color: theme.secondaryColor }}
        >
          ❀
        </motion.div>
      </div>
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={variants}
        custom={6}
        className="w-full flex flex-col items-center justify-center mt-10 mb-4"
      >
        <span className="flex items-center gap-2 text-gray-500 text-sm font-light">
          Dibuat dengan <Heart className="inline w-4 h-4 text-red-500" fill="#ef4444" /> oleh{' '}
          {/* BARU: Mengganti span dengan tag <a> */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
          >
            Dua Mempelai
          </a>
        </span>
      </motion.footer>
    </div>
  </div>
);

export default PenutupSection; 