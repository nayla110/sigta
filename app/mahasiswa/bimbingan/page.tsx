// app/mahasiswa/bimbingan/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BimbinganPage() {
  const pathname = usePathname();

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
    setRows(prev => [
      ...prev,
      {
        advisor: form.advisor,
        date: form.date,
        time: form.time,
        room: form.room,
        title: form.title,
        status: 'Menunggu',
      },
    ]);
    setForm({ advisor: '', date: '', time: '', room: '', title: '' });
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar (kiri) */}
      <aside className="w-55 bg-blue-900 text-white flex flex-col">
        <div className="px-6 py-6 border-b border-blue-900 flex items-center gap-3">
         <div className="items-center justify-center">
  <img
    src="/icons/logo.png"
    alt="logo"
    className="w-50 h-25 object-contain"
  />
          </div>
        </div>

        <nav className="flex-1 px-1 py-3">
          <ul className="space-y-3">
            {/* Halaman Utama */}
            <li>
              <Link
                href="/mahasiswa"
                className={`flex items-center gap-3 px-3 py-2 rounded ${
                  pathname === '/mahasiswa' ? 'bg-blue-600' : 'hover:bg-blue-700'
                }`}
              >
                <span className="w-6 h-6 rounded overflow-hidden">
                  <img src="/icons/home.png" alt="Halaman Utama" className="object-contain w-full h-full" />
                </span>
                <span className="font-medium">Halaman Utama</span>
              </Link>
            </li>

            {/* Bimbingan (active on this page) */}
            <li>
              <Link
                href="/mahasiswa/bimbingan"
                className={`flex items-center gap-3 px-3 py-2 rounded ${
                  pathname?.startsWith('/mahasiswa/bimbingan') ? 'bg-white/50 text-black' : 'hover:bg-blue-700'
                }`}
              >
                <span className="w-6 h-6 rounded overflow-hidden">
                  <img src="/icons/Bimbingan.png" alt="Bimbingan" className="object-contain w-full h-full" />
                </span>
                <span className="font-medium">Bimbingan</span>
              </Link>
            </li>

            {/* Tugas Akhir */}
            <li>
              <Link
                href="/mahasiswa/TA"
                className={`flex items-center gap-3 px-3 py-2 rounded ${
                  pathname?.startsWith('/mahasiswa/TA') ? 'bg-blue-600' : 'hover:bg-blue-700'
                }`}
              >
                <span className="w-6 h-6 rounded overflow-hidden">
                  <img src="/icons/Tugas.png" alt="Tugas Akhir" className="object-contain w-full h-full" />
                </span>
                <span className="font-medium">Tugas Akhir</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="px-6 py-4 text-sm opacity-80 text-center">
          <Link href="https://www.polibatam.ac.id/" >About us </Link>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <header className="bg-white text-black px-6 py-3 flex items-center justify-between shadow">
          <div className="text-lg font-semibold">Jadwal Bimbingan</div>
          <div className="flex items-center gap-3"></div>
        </header>

        {/* Page content */}
        <main className="p-8">
          {/* Container (mirip card putih di tengah) */}
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Form header */}
            <div className="bg-white border rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div />
                <div className="w-full text-lg font-bold text-black text-center">Isi form untuk menambah jadwal</div>
                {/* Tombol cepat ke TA */}
                <div>
                  
                </div>
              </div>

              {/* Form grid */}
              <div className="grid grid-cols-3 gap-4">
                {/* Col 1: pilih dosen, judul */}
                <div className="space-y-3 col-span-1">
                  <label className="text-sm font-medium">Pilih Dosen Pembimbing</label>
                  <select
                    name="advisor"
                    value={form.advisor}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">-- Pilih Dosen --</option>
                    {mockAdvisors.map((a, i) => (
                      <option key={i} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>

                  <label className="text-sm font-medium">Judul Tugas Akhir</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Masukkan judul Tugas Akhir"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                {/* Col 2: tanggal & waktu */}
                <div className="space-y-3 col-span-1">
                  <label className="text-sm font-medium">Pilih Tanggal</label>
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />

                  <label className="text-sm font-medium">Pilih Waktu</label>
                  <input
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                {/* Col 3: ruangan & buttons */}
                <div className="space-y-3 col-span-1">
                  <label className="text-sm font-medium">Pilih Ruangan</label>
                  <select
                    name="room"
                    value={form.room}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">-- Pilih Ruangan --</option>
                    <option value="TA.702">TA.702</option>
                    <option value="GU805">GU805</option>
                    <option value="GL201">GL201</option>
                  </select>

                  <div className="flex items-center gap-3 pt-4">

                    <button onClick={handleSave} className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border rounded shadow-sm p-4">
              <h3 className="font-semibold mb-3">Daftar Jadwal Bimbingan</h3>

              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border px-4 py-2 text-left">Dosen Pembimbing</th>
                      <th className="border px-4 py-2 text-left">Tanggal</th>
                      <th className="border px-4 py-2 text-left">Waktu</th>
                      <th className="border px-4 py-2 text-left">Ruangan</th>
                      <th className="border px-4 py-2 text-left">Judul TA</th>
                      <th className="border px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="border px-4 py-6 text-center text-gray-500">
                          Belum ada jadwal
                        </td>
                      </tr>
                    ) : (
                      rows.map((r, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border px-4 py-2">{r.advisor}</td>
                          <td className="border px-4 py-2">{r.date}</td>
                          <td className="border px-4 py-2">{r.time}</td>
                          <td className="border px-4 py-2">{r.room}</td>
                          <td className="border px-4 py-2">{r.title}</td>
                          <td className="border px-4 py-2">
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded ${
                                r.status === 'Disetujui' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
