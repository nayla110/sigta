"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function DaftarPengguna() {
  const [showMahasiswa, setShowMahasiswa] = useState(true);
  const [showDosen, setShowDosen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Daftar Pengguna
        </h1>
        <h2 className="text-lg text-gray-500 text-center mb-10">
          Data Dosen dan Mahasiswa
        </h2>

        {/* === Mahasiswa Section === */}
        <div className="mb-8">
          <button
            onClick={() => setShowMahasiswa(!showMahasiswa)}
            className="flex items-center gap-2 text-lg font-semibold bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition-all"
          >
            <FaChevronDown
              className={`transition-transform duration-300 ${
                showMahasiswa ? "rotate-180" : ""
              }`}
            />
            Mahasiswa
          </button>

          {showMahasiswa && (
            <div className="overflow-x-auto mt-4">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-blue-50">
                  <tr className="text-left text-gray-700">
                    <th className="py-3 px-4 border-b">No</th>
                    <th className="py-3 px-4 border-b">Mahasiswa (NIM)</th>
                    <th className="py-3 px-4 border-b">Program Studi</th>
                    <th className="py-3 px-4 border-b">Judul TA</th>
                    <th className="py-3 px-4 border-b">Dosen Pembimbing</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      Belum ada data mahasiswa
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* === Dosen Section === */}
        <div>
          <button
            onClick={() => setShowDosen(!showDosen)}
            className="flex items-center gap-2 text-lg font-semibold bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg transition-all"
          >
            <FaChevronDown
              className={`transition-transform duration-300 ${
                showDosen ? "rotate-180" : ""
              }`}
            />
            Dosen
          </button>

          {showDosen && (
            <div className="overflow-x-auto mt-4">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-purple-50">
                  <tr className="text-left text-gray-700">
                    <th className="py-3 px-4 border-b">No</th>
                    <th className="py-3 px-4 border-b">Dosen (NIK)</th>
                    <th className="py-3 px-4 border-b">Program Studi</th>
                    <th className="py-3 px-4 border-b">
                      Mahasiswa Bimbingan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      Belum ada data dosen
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
