"use client";

import { FaPlus } from "react-icons/fa";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f5f8ff] p-8 ml-[250px] box-border">
      {/* CARD SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition duration-200">
          <h3 className="text-lg font-semibold text-[#1d4f91] mb-2">
            Total Mahasiswa Bimbingan
          </h3>
          <p className="text-4xl font-bold text-[#386bc0]">10</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition duration-200">
          <h3 className="text-lg font-semibold text-[#1d4f91] mb-2">
            Total Dosen Pembimbing
          </h3>
          <p className="text-4xl font-bold text-[#386bc0]">3</p>
        </div>
      </div>

      {/* ADD BUTTON */}
      <div className="flex justify-start mb-6">
        <button className="flex items-center gap-2 bg-[#cce2ff] hover:bg-[#b3d3ff] text-[#1d4f91] font-semibold px-5 py-2 rounded-xl transition duration-200 shadow-sm">
          <FaPlus className="text-[#1d4f91]" /> Tambahkan Berita Utama
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-center border-collapse">
          <thead className="bg-[#386bc0] text-white">
            <tr>
              <th className="py-3 px-4 text-sm font-semibold">Berita Utama</th>
              <th className="py-3 px-4 text-sm font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#e9eff9]">
              <td className="py-4 px-4 text-gray-700" colSpan={2}>
                Belum ada berita ditambahkan
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
