import React, { useState } from "react";
import type { Theme } from "../../types/theme";
import type { RSVP } from '@/types';
import { Check, X, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const variants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] as any }
  })
};

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

export default function UcapanDanRSVPSection({
  theme,
  ucapanList,
  invitationId,
  onSubmit,
  page,
  pageSize,
  totalCount,
  onPageChange,
  isPreview
}: UcapanDanRSVPSectionProps) {
  const [form, setForm] = useState({
    guestName: '',
    message: '',
    attendanceStatus: 'pending' as 'attending' | 'not_attending' | 'pending',
  });
  const [errors, setErrors] = useState({
    guestName: '',
    message: '',
    attendanceStatus: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {
      guestName: form.guestName.trim() ? '' : 'Nama harus diisi',
      message: form.message.trim() ? '' : 'Ucapan tidak boleh kosong',
      attendanceStatus: '', // Tidak perlu validasi wajib pilih kehadiran
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(form);
      setForm({ guestName: '', message: '', attendanceStatus: 'pending' });
    } catch (error) {
      // error handling bisa ditambah
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
          custom={1}
          className={`text-3xl mb-8 text-center ${theme.fontTitle}`}
          style={{ color: theme.primaryColor }}
        >
          Ucapan & Doa
        </motion.h2>

        {/* Form RSVP */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
          custom={2}
          className="mb-8"
        >
          {isPreview ? (
            <div className="bg-black/10 backdrop-blur-sm p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">
                Ini adalah mode preview. Form RSVP akan aktif pada undangan yang sudah dipublish.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="guestName"
                type="text"
                placeholder="Nama Lengkap"
                value={form.guestName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white/80 focus:outline-none focus:ring-2 transition-all duration-200"
                style={{ borderColor: theme.secondaryColor, boxShadow: errors.guestName ? '0 0 0 2px #f87171' : undefined }}
              />
              {errors.guestName && <div className="text-xs text-red-500">{errors.guestName}</div>}
              <textarea
                name="message"
                placeholder="Tuliskan ucapan dan doa..."
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white/80 focus:outline-none focus:ring-2 transition-all duration-200"
                style={{ borderColor: theme.secondaryColor, boxShadow: errors.message ? '0 0 0 2px #f87171' : undefined }}
              />
              {errors.message && <div className="text-xs text-red-500">{errors.message}</div>}
              <select
                name="attendanceStatus"
                value={form.attendanceStatus}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white/80 focus:outline-none focus:ring-2 transition-all duration-200"
                style={{ borderColor: theme.secondaryColor, boxShadow: errors.attendanceStatus ? '0 0 0 2px #f87171' : undefined }}
              >
                <option value="" disabled>Konfirmasi Kehadiran</option>
                <option value="attending">Hadir</option>
                <option value="not_attending">Tidak Hadir</option>
                <option value="pending">Belum Tahu</option>
              </select>
              {errors.attendanceStatus && <div className="text-xs text-red-500">{errors.attendanceStatus}</div>}
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg shadow transition-transform hover:scale-105"
                style={{ background: theme.primaryColor, color: theme.backgroundColor }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
              </button>
            </form>
          )}
        </motion.div>

        {/* Daftar Ucapan */}
        <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent" style={{ scrollBehavior: 'smooth' }}>
          {ucapanList.map((ucapan) => (
            <div
              key={ucapan.id}
              className="p-4 rounded-lg"
              style={{ backgroundColor: theme.secondaryColor }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold" style={{ color: theme.primaryColor }}>
                    {ucapan.guestName}
                  </h3>
                  <p className="text-sm" style={{ color: theme.foregroundColor }}>
                    {ucapan.message}
                  </p>
                </div>
                <span 
                  className={`text-xs px-2 py-1 rounded ${
                    ucapan.attendanceStatus === 'attending'
                      ? 'bg-green-100 text-green-800'
                      : ucapan.attendanceStatus === 'not_attending'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {ucapan.attendanceStatus === 'attending'
                    ? 'Hadir'
                    : ucapan.attendanceStatus === 'not_attending'
                    ? 'Tidak Hadir'
                    : 'Belum Pasti'}
                </span>
              </div>
              <div className="text-xs" style={{ color: theme.foregroundColor }}>
                {new Date(ucapan.createdAt || new Date()).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {!isPreview && totalCount > pageSize && (
          <div className="flex justify-between items-center mt-6">
            <button
              className="px-4 py-2 rounded text-sm transition-colors duration-200"
              style={{ 
                backgroundColor: page > 1 ? theme.primaryColor : `${theme.primaryColor}40`,
                color: page > 1 ? theme.backgroundColor : theme.primaryColor,
                opacity: page > 1 ? 1 : 0.5,
                cursor: page > 1 ? 'pointer' : 'not-allowed'
              }}
              onClick={() => page > 1 && onPageChange(page - 1)}
              disabled={page === 1}
            >
              Sebelumnya
            </button>
            <span className="text-sm" style={{ color: theme.primaryColor }}>
              Halaman {page} dari {Math.max(1, Math.ceil(totalCount / pageSize))}
            </span>
            <button
              className="px-4 py-2 rounded text-sm transition-colors duration-200"
              style={{ 
                backgroundColor: page < Math.ceil(totalCount / pageSize) ? theme.primaryColor : `${theme.primaryColor}40`,
                color: page < Math.ceil(totalCount / pageSize) ? theme.backgroundColor : theme.primaryColor,
                opacity: page < Math.ceil(totalCount / pageSize) ? 1 : 0.5,
                cursor: page < Math.ceil(totalCount / pageSize) ? 'pointer' : 'not-allowed'
              }}
              onClick={() => page < Math.ceil(totalCount / pageSize) && onPageChange(page + 1)}
              disabled={page >= Math.ceil(totalCount / pageSize)}
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </section>
  );
} 