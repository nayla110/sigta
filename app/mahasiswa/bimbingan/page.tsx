'use client';
import React, { useState } from 'react';

export default function BimbinganPage() {
  const [form, setForm] = useState({
    advisor: '',
    date: '',
    time: '',
    room: '',
    title: '',
  });
  const mockAdvisors = [
    'Noper Ardi, S.Pd., M.Eng',
    'Agus Fadillah, S.T., M.T.',
    'Haswandi Arif, S.Pd., M.Sc',
  ];
  const [rows, setRows] = useState<Array<any>>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    if (!form.advisor || !form.date || !form.time || !form.room || !form.title) {
      alert('Lengkapi semua field terlebih dahulu.');
      return;
    }
    setRows(prev => [...prev, { ...form, status: 'Menunggu' }]);
    setForm({ advisor: '', date: '', time: '', room: '', title: '' });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white border rounded shadow-sm p-4">
        <div className="text-center font-bold text-lg mb-4">Isi form untuk menambah jadwal</div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Pilih Dosen Pembimbing</label>
            <select name="advisor" value={form.advisor} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="">-- Pilih Dosen --</option>
              {mockAdvisors.map((a, i) => <option key={i} value={a}>{a}</option>)}
            </select>
            <label className="text-sm font-medium mt-3 block">Judul Tugas Akhir</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Masukkan judul TA" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Tanggal</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            <label className="text-sm font-medium mt-3 block">Waktu</label>
            <input type="time" name="time" value={form.time} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Ruangan</label>
            <select name="room" value={form.room} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="">-- Pilih Ruangan --</option>
              <option value="TA.702">TA.702</option>
              <option value="GU805">GU805</option>
              <option value="GL201">GL201</option>
            </select>
            <button onClick={handleSave} className="mt-4 w-full bg-blue-700 text-white rounded py-2 hover:bg-blue-800">
              Simpan
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded shadow-sm p-4">
        <h3 className="font-semibold mb-3">Daftar Jadwal Bimbingan</h3>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="border px-4 py-2">Dosen</th>
              <th className="border px-4 py-2">Tanggal</th>
              <th className="border px-4 py-2">Waktu</th>
              <th className="border px-4 py-2">Ruangan</th>
              <th className="border px-4 py-2">Judul</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={6} className="border py-4 text-center text-gray-500">Belum ada jadwal</td></tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border px-4 py-2">{r.advisor}</td>
                  <td className="border px-4 py-2">{r.date}</td>
                  <td className="border px-4 py-2">{r.time}</td>
                  <td className="border px-4 py-2">{r.room}</td>
                  <td className="border px-4 py-2">{r.title}</td>
                  <td className="border px-4 py-2 text-yellow-600">{r.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
