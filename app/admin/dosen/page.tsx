"use client";

import { FaPlus } from "react-icons/fa";

export default function DosenPage() {
  return (
    <div className="min-h-screen bg-[#f5f8ff] py-8 px-26 box-border">
      {/* JUDUL */}
      <h1 className="bg-[#1d4f91] text-white text-center text-2xl font-bold py-4 rounded-t-2xl shadow-sm">
        Kelola Akun Dosen
      </h1>

      {/* TOMBOL TAMBAH */}
      <div className="flex justify-start mt-6 mb-4">
        <button className="flex items-center gap-2 bg-[#cce2ff] hover:bg-[#b3d3ff] text-[#1d4f91] font-semibold px-5 py-2 rounded-xl shadow-sm transition duration-200">
          <FaPlus /> Tambah Akun Dosen
        </button>
      </div>

      {/* FORM BOX */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md mb-8">
        {/* BARIS 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <div className="flex flex-col">
            <label className="font-semibold text-[#2e3c50] mb-2">
              Masukkan Nama Dosen
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:border-[#5b9aff] focus:ring-2 focus:ring-[#5b9aff]/30 outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-[#2e3c50] mb-2">
              Kata Sandi
            </label>
            <input
              type="password"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:border-[#5b9aff] focus:ring-2 focus:ring-[#5b9aff]/30 outline-none"
            />
          </div>
        </div>

        {/* BARIS 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <div className="flex flex-col">
            <label className="font-semibold text-[#2e3c50] mb-2">
              NIK Dosen
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:border-[#5b9aff] focus:ring-2 focus:ring-[#5b9aff]/30 outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-[#2e3c50] mb-2">
              Email
            </label>
            <input
              type="email"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:border-[#5b9aff] focus:ring-2 focus:ring-[#5b9aff]/30 outline-none"
            />
          </div>
        </div>

        {/* BARIS 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <div className="flex flex-col">
            <label className="font-semibold text-[#2e3c50] mb-2">
              Program Studi
            </label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:border-[#5b9aff] focus:ring-2 focus:ring-[#5b9aff]/30 outline-none">
              <option>Pilih Program Studi</option>
              <option>Teknik Informatika</option>
              <option>Teknologi Rekayasa Perangkat Lunak</option>
              <option>Teknologi Keamanan Cyber</option>
              <option>Animasi</option>
              <option>Teknologi Permainan</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-[#2e3c50] mb-2">No Telp</label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:border-[#5b9aff] focus:ring-2 focus:ring-[#5b9aff]/30 outline-none"
            />
          </div>
        </div>

        {/* BUTTON GROUP */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="bg-white border border-gray-400 text-gray-700 font-semibold px-5 py-2 rounded-full hover:bg-gray-100 transition duration-200">
            Kembali
          </button>
          <button className="bg-[#5ba6ff] hover:bg-[#3c8efc] text-white font-semibold px-6 py-2 rounded-full shadow-sm transition duration-200">
            Simpan
          </button>
        </div>
      </div>

      {/* TABEL DOSEN */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
        <table className="w-full text-center border-collapse">
          <thead className="bg-[#386bc0] text-white">
            <tr>
              <th className="py-3 px-4 text-sm font-semibold">Nama</th>
              <th className="py-3 px-4 text-sm font-semibold">NIK</th>
              <th className="py-3 px-4 text-sm font-semibold">Program Studi</th>
              <th className="py-3 px-4 text-sm font-semibold">Kata Sandi</th>
              <th className="py-3 px-4 text-sm font-semibold">Email</th>
              <th className="py-3 px-4 text-sm font-semibold">No Telp</th>
              <th className="py-3 px-4 text-sm font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#e9eff9] text-gray-700">
              <td className="py-4 px-4" colSpan={7}>
                Belum ada data dosen
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
