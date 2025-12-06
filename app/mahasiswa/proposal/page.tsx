'use client';

import React, { useState } from 'react';

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
  const [open, setOpen] = useState<boolean[]>([true, false, false, false]);
  const [forms, setForms] = useState<BabForm[]>(
    Array.from({ length: 4 }, () => ({ file: null, note: '' }))
  );
  const [rows, setRows] = useState<Row[]>([]);

  function toggle(idx: number) {
    setOpen(prev => prev.map((v, i) => (i === idx ? !v : v)));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const file = e.target.files?.[0] || null;
    setForms(prev => prev.map((f, i) => (i === idx ? { ...f, file } : f)));
  }

  function handleNoteChange(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const value = e.target.value;
    setForms(prev => prev.map((f, i) => (i === idx ? { ...f, note: value } : f)));
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
    setForms(prev => prev.map((f, i) => (i === idx ? { file: null, note: '' } : f)));
    setOpen(prev => prev.map((v, i) => (i === idx ? false : v)));
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Upload form untuk tiap BAB */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="space-y-3">
            <div
              className="inline-flex items-center gap-3 bg-blue-100 rounded-full px-4 py-2 cursor-pointer select-none"
              onClick={() => toggle(idx)}
            >
              <div className="text-xl font-bold text-blue-700">+</div>
              <div className="font-semibold">Tambahkan Bab {idx + 1}</div>
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              {open[idx] ? (
                <>
                  <label className="block font-semibold mb-2 text-gray-800">Masukkan File</label>
                  <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-3">
                    <label
                      htmlFor={`file-input-${idx}`}
                      className="flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span className="text-sm text-gray-700">
                        {forms[idx].file ? forms[idx].file.name : 'Masukkan file...'}
                      </span>

                      <span>
                        <input
                          id={`file-input-${idx}`}
                          type="file"
                          onChange={e => handleFileChange(e, idx)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            (document.getElementById(`file-input-${idx}`) as HTMLInputElement)?.click()
                          }
                          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                        >
                          Pilih File
                        </button>
                      </span>
                    </label>
                  </div>

                  <label className="block font-semibold mb-2 text-gray-800">Tambahkan Keterangan</label>
                  <input
                    type="text"
                    placeholder="Keterangan singkat"
                    value={forms[idx].note}
                    onChange={e => handleNoteChange(e, idx)}
                    className="w-full border rounded px-3 py-2 mb-4"
                  />

                  <div className="flex justify-center">
                    <button
                      onClick={() => handlePosting(idx)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                      Posting
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <div className="text-sm text-gray-600 mb-2">Form tertutup. Klik header untuk buka.</div>
                  <div className="text-sm">
                    Terakhir upload:{' '}
                    <span className="font-medium">
                      {forms[idx].file ? forms[idx].file.name : '-'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tabel hasil upload */}
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
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    Belum ada file
                  </td>
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
  );
}
