import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInvitationBySlug } from "../features/invitations/invitationService";
import { themes } from "../types/theme";
import type { RSVP } from "../types";
import { createUcapan } from "../features/rsvp/rsvpService";
import { rsvpToApi } from "../utils/caseTransform";

export default function RSVPUndanganPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<any>(null);
  const [theme, setTheme] = useState(themes[0]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    guestName: '',
    message: '',
    attendanceStatus: 'pending' as 'attending' | 'not_attending' | 'pending',
    numberOfGuests: 1,
    contactInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (slug) {
      getInvitationBySlug(slug).then(({ data }) => {
        setData(data);
        if (data) {
          const t = themes.find(t => t.id === data.tema) || themes[0];
          setTheme(t);
        }
        setLoading(false);
      });
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.id) return;

    setIsSubmitting(true);
    try {
      const rsvpData = rsvpToApi({
        id: '',
        invitationId: data.id,
        guestName: form.guestName,
        message: form.message,
        attendanceStatus: form.attendanceStatus,
        numberOfGuests: form.numberOfGuests,
        contactInfo: form.contactInfo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      await createUcapan(rsvpData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Undangan tidak ditemukan</h1>
          <p className="text-gray-600">Mohon periksa kembali link undangan Anda</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🙏</div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: theme.primaryColor }}>
            Terima Kasih
          </h1>
          <p className="text-gray-600 mb-8">
            RSVP Anda telah kami terima. Terima kasih atas perhatian dan konfirmasinya.
          </p>
          <a
            href={`/${slug}`}
            className="inline-block px-6 py-2 rounded text-white transition-colors duration-200"
            style={{ backgroundColor: theme.primaryColor }}
          >
            Lihat Undangan
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 
          className={`text-3xl font-bold text-center mb-8 ${theme.fontTitle}`}
          style={{ color: theme.primaryColor }}
        >
          RSVP Undangan
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={form.guestName}
                onChange={(e) => setForm(prev => ({ ...prev, guestName: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ borderColor: theme.primaryColor }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Kehadiran
              </label>
              <select
                value={form.attendanceStatus}
                onChange={(e) => setForm(prev => ({ ...prev, attendanceStatus: e.target.value as 'attending' | 'not_attending' | 'pending' }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ borderColor: theme.primaryColor }}
              >
                <option value="pending">Masih mempertimbangkan</option>
                <option value="attending">Ya, saya akan hadir</option>
                <option value="not_attending">Maaf, saya tidak bisa hadir</option>
              </select>
            </div>
            {form.attendanceStatus === 'attending' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Tamu
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={form.numberOfGuests}
                  onChange={(e) => setForm(prev => ({ ...prev, numberOfGuests: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ borderColor: theme.primaryColor }}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Maksimal 5 orang
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon/WhatsApp
              </label>
              <input
                type="tel"
                value={form.contactInfo}
                onChange={(e) => setForm(prev => ({ ...prev, contactInfo: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ borderColor: theme.primaryColor }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ucapan & Doa
              </label>
              <textarea
                required
                value={form.message}
                onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ borderColor: theme.primaryColor }}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 rounded text-white font-medium transition-colors duration-200 disabled:opacity-50"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim RSVP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 