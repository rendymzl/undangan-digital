import React, { useState } from "react";
import type { Theme } from "../../types/theme";
import type { AttendanceStatus, RSVP } from '@/types';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock } from "lucide-react";

// Fungsi untuk menampilkan label status kehadiran dalam bahasa Indonesia dengan icon lucide
function getAttendanceStatusLabel(status: AttendanceStatus) {
  switch (status) {
    case 'attending':
      return (
        <span className="inline-flex items-center gap-1">
          <CheckCircle size={16} className="text-green-600" />
          Hadir
        </span>
      );
    case 'not_attending':
      return (
        <span className="inline-flex items-center gap-1">
          <XCircle size={16} className="text-red-500" />
          Berhalangan
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1">
          <Clock size={16} className="text-yellow-500" />
          Belum Pasti
        </span>
      );
    default:
      return '';
  }
}

// --- Props Utama (Tidak berubah) ---
interface UcapanDanRSVPSectionProps {
  theme: Theme;
  ucapanList: RSVP[];
  invitationId: string;
  onSubmit: (form: { guestName: string; message: string; attendanceStatus: 'attending' | 'not_attending' | 'pending' }) => Promise<void>;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  isPreview?: boolean;
}

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const }
  })
};

// ===============================================================
// Komponen Pendukung: RSVPForm (Reusable)
// ===============================================================
const RSVPForm: React.FC<Pick<UcapanDanRSVPSectionProps, 'theme' | 'onSubmit' | 'isPreview'>> = ({ theme, onSubmit, isPreview }) => {
  const [form, setForm] = useState({ guestName: '', message: '', attendanceStatus: 'attending' as 'attending' | 'not_attending' | 'pending' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guestName || !form.message) {
      alert("Nama dan ucapan harus diisi.");
      return;
    }
    setIsSubmitting(true);
    await onSubmit(form);
    setForm({ guestName: '', message: '', attendanceStatus: 'attending' });
    setIsSubmitting(false);
  };

  // Pada mode preview, form tetap tampil tapi semua input dan tombol disabled
  if (isPreview) {
    return (
      <form className="space-y-4 pointer-events-none opacity-80">
        <Input
          name="guestName"
          type="text"
          placeholder="Nama Anda"
          value="Budi"
          disabled
          className="bg-white"
        />
        <Textarea
          name="message"
          placeholder="Tuliskan ucapan dan doa..."
          rows={4}
          value="Selamat menempuh hidup baru, semoga menjadi keluarga sakinah mawaddah warahmah."
          disabled
          className="bg-white"
        />
        <Select name="attendanceStatus" value="attending" disabled>
          <SelectTrigger className="w-full bg-white" disabled>
            <SelectValue placeholder="Konfirmasi Kehadiran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="attending" disabled>Insya Allah, Hadir</SelectItem>
            <SelectItem value="not_attending" disabled>Maaf, Berhalangan</SelectItem>
            <SelectItem value="pending" disabled>Belum Dapat Memastikan</SelectItem>
          </SelectContent>
        </Select>
        <Button
          type="button"
          className="w-full"
          style={{ background: theme.colors.primary, color: theme.colors.primaryForeground }}
          disabled
        >
          Kirim Ucapan
        </Button>
        <div className="text-center text-xs text-gray-500 mt-2">Form RSVP akan aktif setelah undangan dipublikasikan.</div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="guestName" type="text" placeholder="Nama Anda" value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} required className="bg-white" />
      <Textarea name="message" placeholder="Tuliskan ucapan dan doa..." rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className="bg-white" />
      <Select name="attendanceStatus" value={form.attendanceStatus} onValueChange={(value) => setForm({ ...form, attendanceStatus: value as any })}>
        <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Konfirmasi Kehadiran" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="attending">Insya Allah, Hadir</SelectItem>
          <SelectItem value="not_attending">Maaf, Berhalangan</SelectItem>
          <SelectItem value="pending">Belum Dapat Memastikan</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" className="w-full" style={{ background: theme.colors.primary, color: theme.colors.primaryForeground }} disabled={isSubmitting}>
        {isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
      </Button>
    </form>
  );
};

// ===============================================================
// SUB-KOMPONEN UNTUK LAYOUT 'CLASSIC' (Form di Atas, Daftar di Bawah)
// ===============================================================
const ClassicUcapanLayout: React.FC<UcapanDanRSVPSectionProps> = (props) => {
  const { theme, ucapanList, page, pageSize, totalCount, onPageChange, isPreview } = props;

  // Jika preview, tampilkan ucapan dummy
  // Jika mode preview, tampilkan beberapa ucapan dummy dengan status kehadiran berbeda
  const ucapanListToShow: RSVP[] = isPreview
    ? [
      {
        id: 'dummy1',
        invitationId: 'preview',
        guestName: 'Budi',
        message: 'Selamat menempuh hidup baru, semoga bahagia selalu!',
        attendanceStatus: 'attending'
      },
      {
        id: 'dummy2',
        invitationId: 'preview',
        guestName: 'Siti',
        message: 'Barakallah, semoga menjadi keluarga sakinah mawaddah warahmah.',
        attendanceStatus: 'attending'
      },
      {
        id: 'dummy3',
        invitationId: 'preview',
        guestName: 'Andi',
        message: 'Maaf, saya belum bisa memastikan kehadiran. Semoga acaranya lancar!',
        attendanceStatus: 'pending'
      },
      {
        id: 'dummy4',
        invitationId: 'preview',
        guestName: 'Dewi',
        message: 'Mohon maaf, saya berhalangan hadir. Semoga bahagia selalu!',
        attendanceStatus: 'not_attending'
      }
    ]
    : ucapanList;

  const totalPages = Math.ceil(totalCount / pageSize);
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} custom={2} className="mb-12">
        <RSVPForm {...props} />
      </motion.div>

      <div className="space-y-4 max-h-screen overflow-y-auto pr-2">
        {ucapanListToShow.map((ucapan, i) => (
          <motion.div key={ucapan.id || i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={variants} custom={i}>
            <Card className="p-4" style={{ backgroundColor: theme.colors.secondary }}>
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold" style={{ color: theme.colors.primary }}>{ucapan.guestName}</h3>
                  <span
                    className={`
                        text-xs 
                        px-2 py-1 
                        rounded-full 
                        font-medium
                        flex items-center gap-1
                        ${ucapan.attendanceStatus === 'attending' ? 'bg-green-100 text-green-700' : ''}
                        ${ucapan.attendanceStatus === 'not_attending' ? 'bg-red-100 text-red-700' : ''}
                        ${ucapan.attendanceStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                      `}
                  >
                    {getAttendanceStatusLabel(ucapan.attendanceStatus)}
                  </span>
                </div>
                <p className="text-sm mt-1" style={{ color: theme.colors.foreground }}>{ucapan.message}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <Button onClick={() => onPageChange(page - 1)} disabled={page === 1} variant="outline">
            Sebelumnya
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages}
          </span>
          <Button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} variant="outline">
            Selanjutnya
          </Button>
        </div>
      )}

    </div>
  );
};

// ===============================================================
// SUB-KOMPONEN UNTUK LAYOUT 'MODERN' (Form & Daftar Berdampingan)
// ===============================================================
const ModernUcapanLayout: React.FC<UcapanDanRSVPSectionProps> = (props) => {
  const { theme, ucapanList, page, pageSize, totalCount, onPageChange, isPreview } = props;

  // Jika preview, tampilkan ucapan dummy
  const ucapanListToShow: RSVP[] = isPreview
    ? [
      {
        id: 'dummy1',
        invitationId: 'preview',
        guestName: 'Budi',
        message: 'Selamat menempuh hidup baru, semoga bahagia selalu!',
        attendanceStatus: 'attending'
      },
      {
        id: 'dummy2',
        invitationId: 'preview',
        guestName: 'Siti',
        message: 'Barakallah, semoga menjadi keluarga sakinah mawaddah warahmah.',
        attendanceStatus: 'attending'
      },
      {
        id: 'dummy3',
        invitationId: 'preview',
        guestName: 'Andi',
        message: 'Maaf, saya belum bisa memastikan kehadiran. Semoga acaranya lancar!',
        attendanceStatus: 'pending'
      },
      {
        id: 'dummy4',
        invitationId: 'preview',
        guestName: 'Dewi',
        message: 'Mohon maaf, saya berhalangan hadir. Semoga bahagia selalu!',
        attendanceStatus: 'not_attending'
      }
    ]
    : ucapanList;

  const totalPages = Math.ceil(totalCount / pageSize);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      {/* Kolom Kiri: Form */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} custom={1}>
        <h3 className={`text-2xl ${theme.fontTitle} mb-4`} style={{ color: theme.colors.primary }}>Kirim Ucapan & Doa</h3>
        <RSVPForm {...props} />
      </motion.div>

      {/* Kolom Kanan: Daftar Ucapan */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} custom={2}>
        <div className="space-y-4 max-h-screen overflow-y-auto pr-2">
          {ucapanListToShow.map((ucapan, i) => (
            <motion.div key={ucapan.id || i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={variants} custom={i}>
              <Card className="p-4" style={{ backgroundColor: theme.colors.secondary }}>
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold" style={{ color: theme.colors.primary }}>{ucapan.guestName}</h3>
                    <span
                      className={`
                        text-xs 
                        px-2 py-1 
                        rounded-full 
                        font-medium
                        flex items-center gap-1
                        ${ucapan.attendanceStatus === 'attending' ? 'bg-green-100 text-green-700' : ''}
                        ${ucapan.attendanceStatus === 'not_attending' ? 'bg-red-100 text-red-700' : ''}
                        ${ucapan.attendanceStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                      `}
                    >
                      {getAttendanceStatusLabel(ucapan.attendanceStatus)}
                    </span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: theme.colors.foreground }}>{ucapan.message}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <Button onClick={() => onPageChange(page - 1)} disabled={page === 1} variant="outline">
              Sebelumnya
            </Button>
            <span className="text-sm text-muted-foreground">
              Halaman {page} dari {totalPages}
            </span>
            <Button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} variant="outline">
              Selanjutnya
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
};

// ===============================================================
// Komponen Utama yang Menjadi "Dispatcher"
// ===============================================================
const UcapanDanRSVPSection: React.FC<UcapanDanRSVPSectionProps> = (props) => {
  const { theme } = props;

  const renderLayout = () => {
    switch (theme.layout) {
      case 'modern':
        return <ModernUcapanLayout {...props} />;
      case 'classic':
      default:
        return <ClassicUcapanLayout {...props} />;
    }
  };

  return (
    <section className="py-16 px-4" style={{ background: theme.colors.background }}>
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={variants}
        className={`text-4xl md:text-5xl mb-12 text-center ${theme.fontTitle}`}
        style={{ color: theme.colors.primary }}
      >
        Ucapan & Doa Restu
      </motion.h2>

      {renderLayout()}
    </section>
  );
};

export default UcapanDanRSVPSection;