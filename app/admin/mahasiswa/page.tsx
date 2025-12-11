"use client";
import { FaPlus } from "react-icons/fa";

export default function MahasiswaPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc] py-8 px-26 box-border">
      {/* HEADER */}
      <div className="bg-[#1E429F] text-white text-center py-4 rounded-t-md shadow">
        <h1 className="text-2xl font-semibold tracking-wide">
          Kelola Akun Mahasiswa
        </h1>
      </div>

      {/* BUTTON TAMBAH */}
      <div className="flex justify-start mt-6">
        <button className="flex items-center gap-2 bg-[#e5f0ff] hover:bg-[#cfe3ff] text-[#1E429F] font-semibold px-5 py-2 rounded-lg shadow transition duration-200">
          <FaPlus className="text-sm" />
          Tambah Akun Mahasiswa
        </button>
      </div>

      {/* FORM */}
      <div className="bg-white mt-6 p-8 rounded-xl border border-gray-200 shadow-sm">
        {/* BARIS 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">
              Masukkan Nama Mahasiswa
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4C82E0]"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Dosen Pembimbing</label>
            <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4C82E0]">
              <option>Pilih Dosen</option>
              <option>Riwinoto, S.T., M.Kom</option>
              <option>Noper Ardi, S.Pd., M.Eng</option>
              <option>Yeni Rokhayati, S.Si., M.Sc</option>
              <option>Swono Sibagariang, S.Kom., M.Kom</option>
              <option>Agus Riady , A.Md.Kom.</option>
              <option>Agung Riyadi, S.Si., M.Kom</option>
            </select>
          </div>
        </div>

        {/* BARIS 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">
              NIM Mahasiswa
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4C82E0]"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4C82E0]"
            />
          </div>
        </div>

        {/* BARIS 3 (DIPERBARUI: Prodi & Judul TA) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">
              Program Studi
            </label>
            <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4C82E0]">
              <option>Pilih Prodi</option>
              <option>Tekbik Informatika</option>
              <option>Teknologi Rekayasa Perangkat Lunak</option>
              <option>Teknologi Keamanan Cyber</option>
              <option>Animasi</option>
              <option>Teknologi Permainan</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">
              Judul Tugas Akhir
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4C82E0]"
            />
          </div>
        </div>
        
        {/* BARIS 4 (DIPERBARUI: No Telp & Kata Sandi) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-4">
          <div className="flex flex-col sm:w-1/2"> {/* Ini adalah kolom No Telp yang dipindah dari Baris 3 */}
            <label className="font-medium text-gray-700 mb-1">No Telp</label>
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4C82E0]"
            />
          </div>
          {/* Kata Sandi dipindah ke sini dari Baris 4 sebelumnya */}
          <div className="flex flex-col sm:w-1/2"> 
            <label className="font-medium text-gray-700 mb-1">Kata Sandi</label>
            <input
              type="password"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4C82E0]"
            />
          </div>
        </div>


        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button className="bg-gray-100 border border-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-md hover:bg-gray-200 transition">
            Kembali
          </button>
          <button className="bg-[#386bc0] hover:bg-[#2752a6] text-white font-semibold px-8 py-2 rounded-md transition">
            Simpan
          </button>
        </div>
      </div>

      {/* TABEL */}
      <div className="bg-white mt-6 rounded-xl border border-gray-200 shadow overflow-hidden">
        <table className="w-full text-center border-collapse text-sm">
          <thead className="bg-[#386bc0] text-white">
            <tr>
              <th className="py-3 px-2">Nama</th>
              <th className="py-3 px-2">NIM</th>
              <th className="py-3 px-2">Program Studi</th>
              {/* === KOLOM BARU === */}
              <th className="py-3 px-2">Judul TA</th>
              {/* === KOLOM BARU === */}
              <th className="py-3 px-2">Wali Dosen</th>
              <th className="py-3 px-2">Email</th>
              <th className="py-3 px-2">No Telp</th>
              {/* Kata Sandi Dihapus dari Header Tabel jika tidak ingin ditampilkan */}
              <th className="py-3 px-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#e9eff9] text-gray-700">
              <td className="py-4 px-2" colSpan={9}>
                Belum ada data mahasiswa
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}