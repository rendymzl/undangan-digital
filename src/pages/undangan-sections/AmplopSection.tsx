import React from "react";
import type { Theme } from "../../types/theme";
import { motion } from 'framer-motion';
import type { AmplopDigital } from "@/types";
import { toast } from "sonner";

// --- Props Utama ---
interface AmplopSectionProps {
  theme: Theme;
  data: {
    namaPria: string;
    namaWanita: string;
    rekening: AmplopDigital[];
  };
}

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' as const }
  })
};

// ===============================================================
// Komponen Pendukung: GiftCard (Reusable)
// ===============================================================
const GiftCard: React.FC<{ theme: Theme; item: AmplopDigital }> = ({ theme, item }) => {
  const { bank, nomor, atasNama, qrUrl } = item;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(`Nomor ${bank} berhasil disalin!`))
      .catch(() => toast.error("Gagal menyalin teks."));
  };

  return (
    <div className="w-full text-center p-6 rounded-2xl shadow-lg border" style={{ background: `${theme.colors.background}99`, borderColor: `${theme.colors.primary}30` }}>
      {qrUrl ? (
        <img src={qrUrl} alt={`QR Code for ${bank}`} className="w-32 h-32 mx-auto mb-4 rounded-md" />
      ) : (
        <h3 className="text-xl font-semibold" style={{ color: theme.colors.primary }}>{bank}</h3>
      )}
      <p className="text-2xl font-mono my-3 tracking-wider" style={{ color: theme.colors.foreground }}>{nomor}</p>
      <p className="text-sm mb-4" style={{ color: theme.colors.foreground }}>a/n {atasNama}</p>
      <button onClick={() => copyToClipboard(nomor)} className="px-4 py-2 text-xs rounded-full transition-transform hover:scale-105" style={{ background: theme.colors.primary, color: theme.colors.primaryForeground }}>
        Salin Nomor
      </button>
    </div>
  );
};


// ===============================================================
// SUB-KOMPONEN UNTUK LAYOUT 'CLASSIC' (Desain Anda Saat Ini)
// ===============================================================
const ClassicAmplopLayout: React.FC<AmplopSectionProps> = ({ theme, data }) => (
  <div className="w-full max-w-xl text-center flex flex-col items-center">
    <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} custom={1} className={`text-4xl md:text-5xl mb-2 ${theme.fontTitle}`} style={{ color: theme.colors.primary }}>
      Hadiah Pernikahan
    </motion.h2>
    <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} custom={2} className="text-sm md:text-base leading-relaxed mb-8" style={{ color: theme.colors.foreground }}>
      Doa restu Anda adalah hadiah terindah. Namun, jika Anda ingin memberikan tanda kasih, kami telah menyediakan fitur di bawah ini untuk kemudahan Anda.
    </motion.p>
    <div className="w-full flex flex-col items-center gap-6">
      {data.rekening.map((rek, i) => (
        <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} custom={i + 3} className="w-full max-w-sm flex justify-center">
          <GiftCard theme={theme} item={rek} />
        </motion.div>
      ))}
    </div>
  </div>
);

// ===============================================================
// SUB-KOMPONEN UNTUK LAYOUT 'MODERN' (Desain Baru)
// ===============================================================
const ModernAmplopLayout: React.FC<AmplopSectionProps> = ({ theme, data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    {/* Kolom Kiri: Teks */}
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="text-center md:text-left"
    >
      <h2 className={`text-4xl md:text-5xl mb-4 ${theme.fontTitle}`} style={{ color: theme.colors.primary }}>Tanda Kasih</h2>
      <p className="text-base leading-relaxed" style={{ color: theme.colors.foreground }}>
        Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih, Anda dapat melakukannya dengan lebih mudah melalui fitur di samping.
      </p>
    </motion.div>
    {/* Kolom Kanan: Daftar Amplop */}
    <div className="w-full flex flex-col items-center gap-6">
      {data.rekening.map((rek, i) => (
        <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} custom={i + 1} className="w-full max-w-sm flex justify-center">
          <GiftCard theme={theme} item={rek} />
        </motion.div>
      ))}
    </div>
  </div>
);


// ===============================================================
// Komponen Utama yang Menjadi "Dispatcher"
// ===============================================================
const AmplopSection: React.FC<AmplopSectionProps> = (props) => {
  const { theme, data } = props;

  if (!data.rekening || data.rekening.length === 0) return null;

  const renderLayout = () => {
    switch (theme.layout) {
      case 'modern':
        return <ModernAmplopLayout {...props} />;
      case 'classic':
      default:
        return <ClassicAmplopLayout {...props} />;
    }
  };

  return (
    <section
      className={`relative p-8 flex flex-col items-center justify-center ${theme.fontText}`}
      style={{ background: `linear-gradient(to top, ${theme.colors.background}, ${theme.colors.secondary}20)` }}
    >
      {renderLayout()}
    </section>
  );
};

export default AmplopSection;