'use client';
import React, { useState } from 'react';

export default function BimbinganPage() {
  const [form, setForm] = useState({
    advisor: '',
    date: '',
    time: '',
    metode: '',
    title: '',
  });
  const mockAdvisors = [
    'Proposal',
    'Tugas Akhir',
  ];
  const [rows, setRows] = useState<Array<any>>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    if (!form.advisor || !form.date || !form.time || !form.metode || !form.title) {
      alert('Lengkapi semua field terlebih dahulu.');
      return;
    }
    setRows(prev => [...prev, { ...form, status: 'Menunggu' }]);
    setForm({ advisor: '', date: '', time: '', metode: '', title: '' });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white border rounded shadow-sm p-4">
    <div className="text-center font-bold text-xl mb-6 text-gray-800">Isi Form untuk Menambah Jadwal</div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"> 
        
        <div>
            <div className="mb-4">
                <label className="text-sm font-medium text-gray-600 block mb-1">Pilih Bimbingan</label>
                <select 
                    name="advisor" 
                    value={form.advisor} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                >
                    <option value="">-- Pilih Bimbingan --</option>
                    {mockAdvisors.map((a, i) => <option key={i} value={a}>{a}</option>)}
                </select>
            </div>

            <div> 
                <label className="text-sm font-medium text-gray-600 block mb-1">Metode Pelaksanaan</label>
                <select 
                    name="metode" 
                    value={form.metode} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                >
                    <option value="">-- Pilih Metode --</option>
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                </select>
            </div>
        </div>

        <div>
            <div className="mb-4">
                <label className="text-sm font-medium text-gray-600 block mb-1">Tanggal</label>
                <input 
                    type="date" 
                    name="date" 
                    value={form.date} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                />
            </div>

            <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Waktu</label>
                <input 
                    type="time" 
                    name="time" 
                    value={form.time} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                />
            </div>
        </div>
        
    </div>
    
    <div className="mt-8 flex justify-center">
        <button 
            onClick={handleSave} 
            className="w-full sm:w-1/3 bg-blue-700 text-white font-semibold rounded-lg py-2 hover:bg-blue-800 transition duration-200 shadow-md"
        >
            Simpan Jadwal
        </button>
    </div>
</div>

      {/* Table */}
      <div className="bg-white border rounded shadow-sm p-4">
        <h3 className="font-semibold mb-3">Daftar Jadwal Bimbingan</h3>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="border px-4 py-2">Jenis Bimbingan</th>
              <th className="border px-4 py-2">Metode Pelaksanaan</th>
              <th className="border px-4 py-2">Tanggal</th>
              <th className="border px-4 py-2">Waktu</th>
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
                  <td className="border px-4 py-2">{r.metode}</td>
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
