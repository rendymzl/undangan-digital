import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getAmplopByInvitation,
  addAmplop,
  updateAmplop,
  deleteAmplop,
} from '../../features/amplop/amplopService';
import type { AmplopDigital } from '../../features/amplop/amplopService';

const defaultForm: Partial<AmplopDigital> = {
  bank: '',
  atas_nama: '',
  nomor: '',
  catatan: '',
  qr_url: ''
};

const AmplopDigitalManagePage: React.FC = () => {
  const { invitationId } = useParams<{ invitationId: string }>();
  const [list, setList] = useState<AmplopDigital[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<AmplopDigital>>(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    if (!invitationId) return;
    try {
      const data = await getAmplopByInvitation(invitationId);
      setList(data);
    } catch (e) {
      alert('Gagal mengambil data amplop digital');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [invitationId]);

  const handleEdit = (item: AmplopDigital) => {
    setForm(item);
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus rekening ini?')) return;
    await deleteAmplop(id);
    fetchData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await updateAmplop(editId, form);
      } else {
        await addAmplop({ ...form, invitation_id: invitationId } as any);
      }
      setShowForm(false);
      setForm(defaultForm);
      setEditId(null);
      fetchData();
    } catch (e) {
      alert('Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Kelola Amplop Digital</h1>
      <button
        className="mb-4 px-4 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700"
        onClick={() => { setShowForm(true); setForm(defaultForm); setEditId(null); }}
      >
        + Tambah Rekening
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border mb-8">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Bank</th>
              <th className="p-2 border">Atas Nama</th>
              <th className="p-2 border">Nomor</th>
              <th className="p-2 border">Catatan</th>
              <th className="p-2 border">QR</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={6} className="text-center p-4">Belum ada rekening</td></tr>
            )}
            {list.map(item => (
              <tr key={item.id}>
                <td className="border p-2">{item.bank}</td>
                <td className="border p-2">{item.atas_nama}</td>
                <td className="border p-2">{item.nomor}</td>
                <td className="border p-2">{item.catatan}</td>
                <td className="border p-2">{item.qr_url && <img src={item.qr_url} alt="QR" className="h-12" />}</td>
                <td className="border p-2">
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(item.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal/Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowForm(false)}>&times;</button>
            <h2 className="text-lg font-bold mb-4">{editId ? 'Edit' : 'Tambah'} Rekening</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Bank</label>
                <input className="w-full border rounded px-2 py-1" value={form.bank || ''} onChange={e => setForm(f => ({ ...f, bank: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Atas Nama</label>
                <input className="w-full border rounded px-2 py-1" value={form.atas_nama || ''} onChange={e => setForm(f => ({ ...f, atas_nama: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nomor Rekening</label>
                <input className="w-full border rounded px-2 py-1" value={form.nomor || ''} onChange={e => setForm(f => ({ ...f, nomor: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catatan</label>
                <input className="w-full border rounded px-2 py-1" value={form.catatan || ''} onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">QR Code (opsional)</label>
                <input type="file" accept="image/*" onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setForm(f => ({ ...f, qr_url: ev.target?.result as string }));
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }} />
                {form.qr_url && <img src={form.qr_url} alt="QR" className="h-16 mt-2" />}
              </div>
              <button type="submit" className="w-full py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmplopDigitalManagePage; 