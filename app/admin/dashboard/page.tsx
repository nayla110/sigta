"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
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
  admin_nama: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMahasiswa: 0,
    totalDosen: 0
  });
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewBerita, setPreviewBerita] = useState<Berita | null>(null);
  
  const [formData, setFormData] = useState({
    judul: '',
    konten: '',
    status: 'Draft'
  });

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

  const resetForm = () => {
    setFormData({
      judul: '',
      konten: '',
      status: 'Draft'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.judul.trim() || !formData.konten.trim()) {
      alert('Judul dan konten tidak boleh kosong');
      return;
    }

    try {
      let response;
      
      if (editingId) {
        response = await beritaAPI.update(editingId, formData);
      } else {
        response = await beritaAPI.create(formData);
      }

      if (response.success) {
        alert(response.message);
        resetForm();
        fetchDashboardData();
      }
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan');
    }
  };

  const handleEdit = (berita: Berita) => {
    setFormData({
      judul: berita.judul,
      konten: berita.konten,
      status: berita.status
    });
    setEditingId(berita.id);
    setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteBerita = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      return;
    }

    try {
      const response = await beritaAPI.delete(id);
      if (response.success) {
        alert('Berita berhasil dihapus');
        fetchDashboardData();
      }
    } catch (error: any) {
      alert(error.message || 'Gagal menghapus berita');
    }
  };

  const handlePreview = (berita: Berita) => {
    setPreviewBerita(berita);
    setShowPreview(true);
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
          onClick={() => {
            if (showForm && !editingId) {
              resetForm();
            } else {
              setShowForm(!showForm);
              if (!showForm) {
                setEditingId(null);
                setFormData({ judul: '', konten: '', status: 'Draft' });
              }
            }
          }}
          className="flex items-center gap-2 bg-[#cce2ff] hover:bg-[#b3d3ff] text-[#1d4f91] font-semibold px-5 py-2 rounded-xl transition duration-200 shadow-sm"
        >
          <FaPlus className="text-[#1d4f91]" /> 
          {showForm ? 'Tutup Form' : 'Tambahkan Berita Utama'}
        </button>
      </div>

      {/* FORM BOX */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            {editingId ? 'Edit Berita' : 'Tambah Berita Baru'}
          </h2>
          
          <div className="space-y-4">
            {/* Judul */}
            <div className="flex flex-col">
              <label className="font-semibold text-[#2e3c50] mb-2">Judul Berita</label>
              <input
                type="text"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                required
                placeholder="Masukkan judul berita"
                className="border border-gray-300 rounded-lg px-4 py-3 focus:border-[#5b9aff] focus:ring-2 focus:ring-[#5b9aff]/30 outline-none"
              />
            </div>

            {/* Konten */}
            <div className="flex flex-col">
              <label className="font-semibold text-[#2e3c50] mb-2">Konten Berita</label>
              <textarea
                value={formData.konten}
                onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                required
                placeholder="Tulis konten berita di sini..."
                rows={6}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:border-[#5b9aff] focus:ring-2 focus:ring-[#5b9aff]/30 outline-none resize-none"
              />
              <span className="text-sm text-gray-500 mt-1">
                {formData.konten.length} karakter
              </span>
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label className="font-semibold text-[#2e3c50] mb-2">Status Publikasi</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:border-[#5b9aff] focus:ring-2 focus:ring-[#5b9aff]/30 outline-none"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
              <span className="text-sm text-gray-500 mt-1">
                {formData.status === 'Draft' 
                  ? 'Berita tidak akan ditampilkan di halaman publik' 
                  : 'Berita akan ditampilkan di halaman publik'}
              </span>
            </div>
          </div>

          {/* BUTTON GROUP */}
          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button"
              onClick={resetForm}
              className="bg-white border border-gray-400 text-gray-700 font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition duration-200"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="bg-[#5ba6ff] hover:bg-[#3c8efc] text-white font-semibold px-6 py-2 rounded-full shadow-sm transition duration-200"
            >
              {editingId ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      )}

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
                  <td className="py-3 px-4 text-left">
                    <div className="font-medium text-gray-800">{berita.judul}</div>
                    <div className="text-xs text-gray-500 truncate max-w-md">
                      {berita.konten.substring(0, 80)}...
                    </div>
                  </td>
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
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handlePreview(berita)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        title="Lihat"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => handleEdit(berita)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteBerita(berita.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        title="Hapus"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL PREVIEW */}
      {showPreview && previewBerita && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Preview Berita</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  previewBerita.status === 'Published' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {previewBerita.status}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {previewBerita.judul}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-4 border-b">
                <span>📅 {new Date(previewBerita.tanggal).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
                <span>✍️ {previewBerita.admin_nama || 'Administrator'}</span>
              </div>
              
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {previewBerita.konten}
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleEdit(previewBerita);
                  setShowPreview(false);
                }}
                className="px-4 py-2 bg-[#386bc0] text-white rounded-lg hover:bg-[#2d5a9f] transition"
              >
                Edit Berita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}