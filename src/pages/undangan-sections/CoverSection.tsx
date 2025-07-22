import TopRightCornerSVG from "../../components/ornament/topRightCornerSVG";
import RightSVG1 from "../../components/ornament/rightSVG1";
import type { Theme } from "@/types/theme";
import { motion } from 'framer-motion';

type CoverSectionProps = {
  theme: Theme;
  data: {
    namaPria: string;
    namaWanita: string;
    namaPanggilanPria?: string;
    namaPanggilanWanita?: string;
  };
  namaTamu: string;
  onOpen: () => void;
  isLocked: boolean;
  isFullScreen?: boolean;
};

const CoverSection: React.FC<CoverSectionProps> = ({ theme, data, namaTamu, onOpen, isLocked, isFullScreen }) => {

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`page page-cover page-cover-top ${isFullScreen ? 'min-h-screen flex flex-col justify-center' : ''} ${theme.fontText}  font-theme-smooth`}
      style={{ color: theme.foregroundColor, background: theme.backgroundColor, position: "relative", overflow: "hidden" }}
      data-density="hard"
    >
      {/* Ornamen Atas kanan */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: -60 }}
        animate={isLocked ? { opacity: 0, scale: 0.7, y: -60 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="absolute top-0 right-0 z-0 origin-top-right transform translate-y-2 -translate-x-2"
      >
        <TopRightCornerSVG color={theme.primaryColor} />
      </motion.div>
      {/* Ornamen Atas kiri */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: -60 }}
        animate={isLocked ? { opacity: 0, scale: 0.7, y: -60 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="absolute top-0 left-0 z-0 origin-top-left transform translate-y-2 translate-x-2"
      >
        <div className="scale-x-[-1]">
          <TopRightCornerSVG color={theme.primaryColor} />
        </div>
      </motion.div>
      <div className="flex flex-col justify-center items-center h-full z-10 relative">
        <div className={`absolute flex flex-col justify-center items-center transition-all duration-1000 ease-in-out ${isLocked ? 'mb-36' : 'mt-0'}`}>
          <div className="uppercase text-xs tracking-widest text-gray-500 mb-4 font-semibold" style={{ letterSpacing: "0.18em" }}>THE WEDDING OF</div>
          <div className={`font-great-vibes ${theme.fontTitle} text-4xl md:text-6xl font-normal tracking-wide mb-6 text-center drop-shadow-lg`} style={{ color: theme.primaryColor, textShadow: "0 2px 12px #0001" }}>
            {(data.namaPanggilanPria || data.namaPria)} &amp; {(data.namaPanggilanWanita || data.namaWanita)}
          </div>
        </div>

        {(
          <div className={`absolute flex flex-col items-center w-full transition-all duration-1000 ease-in-out ${isLocked ? 'mt-36 opacity-100' : 'mt-0 opacity-0'}`}>
            <div className="mb-8 text-center">
              <div className="text-base font-medium mb-1">Kepada Yth;</div>
              <div className="text-base font-medium mb-1">Bapak/Ibu/Saudara/i</div>
              <div className="text-lg font-bold mt-1 font-lato" style={{ color: theme.primaryColor }}>{namaTamu}</div>
            </div>
            <button
              className="mt-4 px-8 py-3 rounded-xl bg-primary text-white font-bold text-lg shadow-lg hover:scale-105 hover:bg-primary/90 transition flex items-center gap-2 disabled:opacity-60"
              style={{ background: theme.primaryColor, boxShadow: "0 4px 16px #0002" }}
              onClick={onOpen}
              disabled={!isLocked ? true : false}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Buka Undangan
            </button>
          </div>
        )}
        {/* Countdown akan tetap di bawah tombol, diatur dari parent */}
      </div>
      {/* Ornamen Bawah kanan */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 60 }}
        animate={isLocked ? { opacity: 0, scale: 0.7, y: 60 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="absolute bottom-4 -right-1 z-0"
      >
        <RightSVG1 color={theme.primaryColor} />
      </motion.div>
      {/* Ornamen Bawah kiri */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 60 }}
        animate={isLocked ? { opacity: 0, scale: 0.7, y: 60 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="absolute bottom-4 -left-1 z-0"
      >
        <div className=" scale-x-[-1]">
          <RightSVG1 color={theme.primaryColor} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CoverSection; 