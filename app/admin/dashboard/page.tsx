"use client";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { adminAPI, beritaAPI } from "@/lib/api";

interface DashboardStats {
  totalMahasiswa: number;
  totalDosen: number;
}

interface Berita {
  id: string;
  judul: string;
  konten: string;
  tanggal: string;
  status: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMahasiswa: 0,
    totalDosen: 0
  });
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await adminAPI.getDashboardStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Fetch berita
      const beritaResponse = await beritaAPI.getAll();
      if (beritaResponse.success) {
        setBeritaList(beritaResponse.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBerita = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      return;
    }

    try {
      const response = await beritaAPI.delete(id);
      if (response.success) {
        alert('Berita berhasil dihapus');
        fetchDashboardData(); // Refresh data
      }
    } catch (error: any) {
      alert(error.message || 'Gagal menghapus berita');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f8ff] py-8 px-26 flex items-center justify-center">
        <div className="text-xl text-gray-600">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8ff] py-8 px-26 box-border">
      {/* CARD SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-2xl p-12 border border-gray-200 hover:shadow-lg transition duration-200 text-center">
          <h3 className="text-lg font-semibold text-[#1d4f91] mb-2">
            Total Mahasiswa Bimbingan
          </h3>
          <p className="text-4xl font-bold text-[#386bc0]">{stats.totalMahasiswa}</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-12 border border-gray-200 hover:shadow-lg transition duration-200 text-center">
          <h3 className="text-lg font-semibold text-[#1d4f91] mb-2">
            Total Dosen Pembimbing
          </h3>
          <p className="text-4xl font-bold text-[#386bc0]">{stats.totalDosen}</p>
        </div>
      </div>

      {/* ADD BUTTON */}
      <div className="flex justify-start mb-6">
        <button 
          onClick={() => alert('Fitur tambah berita akan segera hadir')}
          className="flex items-center gap-2 bg-[#cce2ff] hover:bg-[#b3d3ff] text-[#1d4f91] font-semibold px-5 py-2 rounded-xl transition duration-200 shadow-sm"
        >
          <FaPlus className="text-[#1d4f91]" /> Tambahkan Berita Utama
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-center border-collapse">
          <thead className="bg-[#386bc0] text-white">
            <tr>
              <th className="py-3 px-4 text-sm font-semibold">Judul Berita</th>
              <th className="py-3 px-4 text-sm font-semibold">Tanggal</th>
              <th className="py-3 px-4 text-sm font-semibold">Status</th>
              <th className="py-3 px-4 text-sm font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {beritaList.length === 0 ? (
              <tr className="bg-[#e9eff9]">
                <td className="py-4 px-4 text-gray-700" colSpan={4}>
                  Belum ada berita ditambahkan
                </td>
              </tr>
            ) : (
              beritaList.map((berita) => (
                <tr key={berita.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700">{berita.judul}</td>
                  <td className="py-3 px-4 text-gray-700">
                    {new Date(berita.tanggal).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      berita.status === 'Published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {berita.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => alert('Fitur edit akan segera hadir')}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2 text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteBerita(berita.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}