import React from "react";
import type { Theme } from "../../types/theme";
import { motion } from 'framer-motion';

type AmplopSectionProps = {
  theme: Theme;
  data: {
    namaPria: string;
    namaWanita: string;
    rekening: { bank: string; accountNumber: string; accountName: string }[];
  };
};

const GiftCard: React.FC<{ theme: Theme; bank: string; accountNumber: string; accountName: string }> = ({ theme, bank, accountNumber, accountName }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => alert(`${text} berhasil disalin!`))
      .catch(() => alert("Gagal menyalin teks."));
  };
  return (
    <div className="w-full max-w-sm text-center p-6 rounded-2xl shadow-lg border" style={{ background: "rgba(255,255,255,0.6)", borderColor: `${theme.secondaryColor}80` }}>
      <h3 className="text-xl font-semibold" style={{ color: theme.primaryColor }}>{bank}</h3>
      <p className="text-2xl font-mono my-3 tracking-wider" style={{ color: theme.primaryColor }}>{accountNumber}</p>
      <p className="text-sm mb-4" style={{ color: theme.primaryColor }}>a/n {accountName}</p>
      <button onClick={() => copyToClipboard(accountNumber)} className="px-4 py-2 text-xs rounded-full transition-transform hover:scale-105" style={{ background: theme.primaryColor, color: theme.backgroundColor }}>
        Salin Nomor Rekening
      </button>
    </div>
  );
};

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' as const }
  })
};

const AmplopSection: React.FC<AmplopSectionProps> = ({ theme, data }) => {
  if (!data.rekening || data.rekening.length === 0) return null;
  return (
    <div
      className={`page relative p-8 flex flex-col items-center justify-center ${theme.fontText}`}
      style={{ background: `linear-gradient(to top, ${theme.backgroundColor}, ${theme.secondaryColor}20)`, color: theme.primaryColor }}
    >
      <div className="w-full max-w-xl text-center flex flex-col items-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
          custom={1}
          className={`text-4xl md:text-5xl mb-2 ${theme.fontTitle}`}
          style={{ color: theme.primaryColor }}
        >
          Hadiah Pernikahan
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
          custom={2}
          className="text-sm md:text-base leading-relaxed mb-8"
        >
          Doa restu Anda adalah hadiah terindah bagi kami. Namun, jika Anda ingin memberikan tanda kasih, kami telah menyediakan fitur di bawah ini untuk kemudahan Anda.
        </motion.p>
        <div className="w-full flex flex-col items-center gap-6">
          {data.rekening.map((rek, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={variants}
              custom={i + 3}
              className="w-full flex justify-center"
            >
              <GiftCard theme={theme} bank={rek.bank} accountNumber={rek.accountNumber} accountName={rek.accountName} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AmplopSection; 