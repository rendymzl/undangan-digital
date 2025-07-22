import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { addAmplop, updateAmplop, getAmplopByInvitation } from "../features/amplop/amplopService";
import { getInvitationBySlug } from "../features/invitations/invitationService";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { themes } from "../types/theme";
import type { Invitation } from '@/types';
import type { AmplopDigital } from '../features/amplop/amplopService';

export default function AmplopUndanganPage() {
  const { slug } = useParams<{ slug: string }>();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [amplop, setAmplop] = useState<AmplopDigital | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ nomor: string; bank: string; atasNama: string }>({ nomor: '', bank: '', atasNama: '' });
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState(themes[0]);

  useEffect(() => {
    if (slug) {
      getInvitationBySlug(slug).then(({ data }) => {
        setInvitation(data);
        if (data) {
          const t = themes.find(t => t.id === data.tema) || themes[0];
          setTheme(t);
        }
        if (data && data.id) {
          getAmplopByInvitation(data.id).then((dataList) => {
            const data = dataList[0] || null;
            setAmplop(data);
            if (data) {
              setForm({ nomor: data.nomor, bank: data.bank, atasNama: data.atas_nama });
            }
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      });
    }
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation) return;
    setSaving(true);
    try {
      let result;
      if (amplop && amplop.id) {
        result = await updateAmplop(amplop.id, {
          nomor: form.nomor,
          bank: form.bank,
          atas_nama: form.atasNama,
        });
      } else {
        result = await addAmplop({
          invitation_id: invitation.id,
          nomor: form.nomor,
          bank: form.bank,
          atas_nama: form.atasNama,
        });
      }
      toast.success("Data amplop digital berhasil disimpan!");
      setAmplop(result);
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan info amplop");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!invitation) return <div className="min-h-screen flex items-center justify-center">Undangan tidak ditemukan.</div>;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: theme.backgroundColor }}
    >
      <Card className="max-w-xl w-full p-8 shadow-lg" style={{ background: theme.secondaryColor }}>
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: theme.primaryColor, fontFamily: theme.fontTitle }}
        >
          Amplop Digital
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3 mb-6" style={{ fontFamily: theme.fontText }}>
          <Input name="nomor" placeholder="No. Rekening" value={form.nomor} onChange={handleChange} required />
          <Input name="bank" placeholder="Bank" value={form.bank} onChange={handleChange} required />
          <Input name="atasNama" placeholder="Nama Pemilik Rekening" value={form.atasNama} onChange={handleChange} required />
          <Button type="submit" disabled={saving} className="w-full">{saving ? "Menyimpan..." : "Simpan Info Amplop"}</Button>
        </form>
        {amplop && (
          <div className="mt-6 p-4 bg-gray-50 rounded shadow" style={{ fontFamily: theme.fontText }}>
            <div className="font-semibold">Info Rekening:</div>
            <div>No. Rekening: {amplop.nomor}</div>
            <div>Bank: {amplop.bank}</div>
            <div>Atas Nama: {amplop.atas_nama}</div>
          </div>
        )}
      </Card>
    </div>
  );
} 