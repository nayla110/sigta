// app/tugas-akhir/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type BabForm = {
  file: File | null;
  note: string;
};

type Row = {
  bab: string;
  filename: string;
  note: string;
  komentar?: string;
};

export default function Page() {
  const pathname = usePathname();

  // accordion open/close
  const [open, setOpen] = useState<boolean[]>([true, false, false, false]);

  // forms for each BAB
  const [forms, setForms] = useState<BabForm[]>(
    Array.from({ length: 4 }, () => ({ file: null, note: '' }))
  );

  // table rows
  const [rows, setRows] = useState<Row[]>([]);

  function toggle(idx: number) {
    setOpen(prev => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setForms(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], file: f };
      return copy;
    });
  }

  function handleNoteChange(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const value = e.target.value;
    setForms(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], note: value };
      return copy;
    });
  }

  function handlePosting(idx: number) {
    const entry = forms[idx];
    if (!entry.file) {
      alert('Pilih file terlebih dahulu.');
      return;
    }

    const newRow: Row = {
      bab: `BAB ${idx + 1}`,
      filename: entry.file.name,
      note: entry.note || '-',
      komentar: '',
    };

    setRows(prev => [newRow, ...prev]);

    // reset form for this BAB
    setForms(prev => {
      const copy = [...prev];
      copy[idx] = { file: null, note: '' };
      return copy;
    });

    // optionally close the accordion for this bab
    setOpen(prev => {
      const copy = [...prev];
      copy[idx] = false;
      return copy;
    });
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

            {/* Bimbingan */}
            <li>
              <Link
                href="/mahasiswa/bimbingan"
                className={`flex items-center gap-3 px-3 py-2 rounded ${
                  pathname?.startsWith('/mahasiswa/bimbingan') ? 'bg-blue-600' : 'hover:bg-blue-700'
                }`}
              >
                <span className="w-6 h-6 rounded overflow-hidden">
                  <img src="/icons/Bimbingan.png" alt="Bimbingan" className="object-contain w-full h-full" />
                </span>
                <span className="font-medium">Bimbingan</span>
              </Link>
            </li>

            {/* Tugas Akhir (active on this page) */}
            <li>
              <Link
                href="/mahasiswa/TA"
                className={`flex items-center gap-3 px-3 py-2 rounded ${
                  pathname?.startsWith('/mahasiswa/TA') ? 'bg-white/50 text-black' : 'hover:bg-blue-700'
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

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <header className="bg-white text-black px-6 py-3 flex items-center justify-between shadow">
          <div className="text-lg font-semibold">Tugas Akhir</div>
          <div className="flex items-center gap-3"></div>
        </header>

        {/* Page content */}
        <main className="p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Grid 2x2 cards for BAB 1..4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="space-y-3">
                  {/* pill header */}
                  <div
                    className="inline-flex items-center gap-3 bg-blue-100 rounded-full px-4 py-2 cursor-pointer select-none"
                    onClick={() => toggle(idx)}
                  >
                    <div className="text-xl font-bold text-blue-700">+</div>
                    <div className="font-semibold">Tambahkan Bab {idx + 1}</div>
                  </div>

                  {/* card */}
                  <div className="bg-white border rounded-2xl p-6 shadow-sm">
                    <div className={open[idx] ? '' : 'hidden'}>
                      {/* Label: Masukkan File */}
                      <label className="block font-semibold mb-2 text-gray-800">Masukkan File</label>

                      {/* Kotak upload */}
                      <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-3">
                        <label
                          htmlFor={`file-input-${idx}`}
                          className="flex items-center justify-between gap-3 cursor-pointer"
                        >
                          <span className="text-sm text-gray-700">
                            {forms[idx].file ? forms[idx].file.name : 'Masukkan file...'}
                          </span>

                          <span className="inline-block">
                            <input
                              id={`file-input-${idx}`}
                              type="file"
                              onChange={(e) => handleFileChange(e, idx)}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const el = document.getElementById(`file-input-${idx}`) as HTMLInputElement | null;
                                el?.click();
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                            >
                              Pilih File
                            </button>
                          </span>
                        </label>
                      </div>

                      {/* Keterangan */}
                      <label className="block font-semibold mb-2 text-gray-800">Tambahkan Keterangan</label>
                      <input
                        type="text"
                        placeholder="Keterangan singkat"
                        value={forms[idx].note}
                        onChange={(e) => handleNoteChange(e, idx)}
                        className="w-full border rounded px-3 py-2 mb-4"
                      />

                      {/* Tombol Posting */}
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handlePosting(idx)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                        >
                          Posting
                        </button>
                      </div>
                    </div>

                    {/* Ringkasan bila form tertutup */}
                    <div className={open[idx] ? 'hidden' : ''}>
                      <div className="text-sm text-gray-600 mb-2">Form tertutup. Klik header untuk buka.</div>
                      <div className="text-sm">
                        Terakhir upload:{' '}
                        <span className="font-medium">
                          {forms[idx].file ? forms[idx].file.name : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table showing uploaded BABs and comments */}
            <div className="bg-white border rounded shadow-sm p-4">
              <h3 className="font-semibold mb-3">File tiap BAB & Komentar Dosen Penguji</h3>

              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="px-4 py-2 text-left">File tiap BAB</th>
                      <th className="px-4 py-2 text-left">Keterangan</th>
                      <th className="px-4 py-2 text-left">Komentar Dosen Penguji</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-gray-500">Belum ada file</td>
                      </tr>
                    ) : (
                      rows.map((r, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-3 border">{r.bab} — {r.filename}</td>
                          <td className="px-4 py-3 border">{r.note}</td>
                          <td className="px-4 py-3 border">{r.komentar || '-'}</td>
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
