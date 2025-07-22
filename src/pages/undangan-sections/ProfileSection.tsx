import React from 'react';
import type { Theme } from '../../types/theme';
import RightSVG1 from '../../components/ornament/rightSVG1';
import { motion } from 'framer-motion';

interface ProfileSectionProps {
  theme: Theme;
  data: {
    namaPria: string;
    namaPanggilanPria?: string;
    fotoPria?: string;
    bioPria?: string;
    ortuPria?: string;
    namaWanita: string;
    namaPanggilanWanita?: string;
    fotoWanita?: string;
    bioWanita?: string;
    ortuWanita?: string;
  };
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ theme, data }) => {
  console.log('ProfileSection data', data);
  const variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };
  return (
    <section
      className={`relative px-4 flex flex-col items-center justify-center overflow-hidden`}
      style={{ background: theme.backgroundColor, color: theme.foregroundColor }}
    >
      {/* Ornamen Kanan/Kiri Atas */}
      <div className="absolute top-1/2 -right-1 z-0">
        <RightSVG1 color={theme.primaryColor} />
      </div>
      <div className="absolute top-1/2 -left-1 z-0">
        <div className="scale-x-[-1]">
          <RightSVG1 color={theme.primaryColor} />
        </div>
      </div>
      {/* Ornamen Kanan/Kiri Bawah */}
      {/* <div className="absolute bottom-42 -right-1 z-0">
        <RightSVG1 color={theme.primaryColor} />
      </div>
      <div className="absolute bottom-42 -left-1 z-0">
        <div className="scale-x-[-1]">
          <RightSVG1 color={theme.primaryColor} />
        </div>
      </div> */}
      <div className="z-10 flex flex-col items-center w-full max-w-3xl text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0 }}
          className="mb-8 px-2"
        >
          <p className="text-sm md:text-base" style={{ lineHeight: 1.7 }}>
            Dengan memohon rahmat dan ridho Allah SWT, kami dengan gembira mengumumkan niat tulus kami untuk menyatukan dua hati dalam ikatan suci pernikahan:
          </p>
        </motion.div>
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Profil Pria */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={variants}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.12 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="relative mb-4">
              {data.fotoPria ? (
                <img
                  src={data.fotoPria}
                  alt={data.namaPria}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 shadow-lg group-hover:shadow-2xl transition-all duration-300 ease-in-out"
                  style={{ borderColor: theme.primaryColor }}
                />
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg" style={{ background: theme.primaryColor, color: theme.backgroundColor }}>
                  {data.namaPria?.[0] || 'A'}
                </div>
              )}
            </div>
            <h3 className={`text-3xl md:text-4xl ${theme.fontTitle}`} style={{ color: theme.primaryColor }}>{data.namaPria}</h3>
            {data.namaPanggilanPria && <div className="text-xs text-gray-500">({data.namaPanggilanPria})</div>}
            {data.ortuPria && <p className="mt-2 text-xs md:text-base" style={{ color: theme.foregroundColor }}>{data.ortuPria}</p>}
            {data.bioPria && <div className="text-xs text-gray-600 mt-1 text-center">{data.bioPria}</div>}
          </motion.div>
          {/* Ampersand */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={variants}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.24 }}
            className="flex items-center justify-center"
          >
            <span className={`text-6xl md:text-7xl ${theme.fontTitle} select-none`} style={{ color: theme.primaryColor }}>
              &
            </span>
          </motion.div>
          {/* Profil Wanita */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={variants}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.36 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="relative mb-4">
              {data.fotoWanita ? (
                <img
                  src={data.fotoWanita}
                  alt={data.namaWanita}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 shadow-lg group-hover:shadow-2xl transition-all duration-300 ease-in-out"
                  style={{ borderColor: theme.primaryColor }}
                />
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg" style={{ background: theme.primaryColor, color: theme.backgroundColor }}>
                  {data.namaWanita?.[0] || 'A'}
                </div>
              )}
            </div>
            <h3 className={`text-3xl md:text-4xl ${theme.fontTitle}`} style={{ color: theme.primaryColor }}>{data.namaWanita}</h3>
            {data.namaPanggilanWanita && <div className="text-xs text-gray-500">({data.namaPanggilanWanita})</div>}
            {data.ortuWanita && <p className="mt-2 text-xs md:text-base" style={{ color: theme.foregroundColor }}>{data.ortuWanita}</p>}
            {data.bioWanita && <div className="text-xs text-gray-600 mt-1 text-center">{data.bioWanita}</div>}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection; 