'use client';
import React, { useState, useEffect } from 'react';
import { bimbinganAPI } from '@/lib/api';

interface Bimbingan {
  id: string;
  tanggal: string;
  topik: string;
  status: string;
  catatan: string | null;
  dosen_nama: string;
}

export default function BimbinganPage() {
  const [form, setForm] = useState({
    tanggal: '',
    waktu: '',
    metode: '',
    topik: '',
  });
  
  const [rows, setRows] = useState<Bimbingan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBimbingan();
  }, []);

  const fetchBimbingan = async () => {
    try {
      setIsLoading(true);
      const response = await bimbinganAPI.getMahasiswaBimbingan();
      
      if (response.success) {
        setRows(response.data);
      }
    } catch (error) {
      console.error('Error fetching bimbingan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    if (!form.tanggal || !form.waktu || !form.metode || !form.topik) {
      alert('Lengkapi semua field terlebih dahulu.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await bimbinganAPI.createPengajuan(form);
      
      if (response.success) {
        alert('Pengajuan bimbingan berhasil dikirim!');
        setForm({ tanggal: '', waktu: '', metode: '', topik: '' });
        fetchBimbingan(); // Refresh list
      }
    } catch (error: any) {
      alert(error.message || 'Gagal mengirim pengajuan');
    } finally {
      setIsSubmitting(false);
    }
  }

  const formatTanggal = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Disetujui':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Ditolak':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Selesai':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Form Section */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md">
        <div className="text-center font-bold text-xl mb-6 text-gray-800">
          Isi Form untuk Menambah Jadwal Bimbingan
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"> 
          <div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Jenis Bimbingan
              </label>
              <select 
                name="topik" 
                value={form.topik} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              >
                <option value="">-- Pilih Jenis --</option>
                <option value="Proposal">Proposal</option>
                <option value="Tugas Akhir">Tugas Akhir</option>
              </select>
            </div>

            <div> 
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Metode Pelaksanaan
              </label>
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
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Tanggal
              </label>
              <input 
                type="date" 
                name="tanggal" 
                value={form.tanggal} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Waktu
              </label>
              <input 
                type="time" 
                name="waktu" 
                value={form.waktu} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full sm:w-1/3 bg-blue-700 text-white font-semibold rounded-lg py-2 hover:bg-blue-800 transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4">
        <h3 className="font-semibold mb-3 text-lg text-gray-800">
          Riwayat Pengajuan Bimbingan
        </h3>
        
        {isLoading ? (
          <div className="text-center py-8 text-gray-600">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-3 px-4 border text-left">Tanggal & Waktu</th>
                  <th className="py-3 px-4 border text-left">Topik</th>
                  <th className="py-3 px-4 border text-left">Dosen</th>
                  <th className="py-3 px-4 border text-left">Status</th>
                  <th className="py-3 px-4 border text-left">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="border py-6 text-center text-gray-500 italic">
                      Belum ada pengajuan bimbingan
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border">{formatTanggal(r.tanggal)}</td>
                      <td className="py-3 px-4 border">{r.topik}</td>
                      <td className="py-3 px-4 border">{r.dosen_nama}</td>
                      <td className="py-3 px-4 border">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 border text-sm text-gray-600">
                        {r.catatan || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}