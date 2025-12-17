'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { bimbinganAPI } from '@/lib/api';

interface Pengajuan {
  id: string;
  nim: string;
  mahasiswa_nama: string;
  program_studi_nama: string;
  program_studi_kode: string;
  tanggal: string;
  topik: string;
  status: string;
  catatan: string | null;
  created_at: string;
}

export default function PengajuanBimbinganPage() {
  const [pengajuanList, setPengajuanList] = useState<Pengajuan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    fetchPengajuan();
  }, [filterStatus]);

  const fetchPengajuan = async () => {
    try {
      setIsLoading(true);
      const response = await bimbinganAPI.getDosenPengajuan(filterStatus);
      
      if (response.success) {
        setPengajuanList(response.data);
      }
    } catch (error) {
      console.error('Error fetching pengajuan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    const catatan = prompt('Tambahkan catatan (opsional):');
    
    try {
      const response = await bimbinganAPI.updateStatusPengajuan(id, 'Disetujui', catatan || undefined);
      
      if (response.success) {
        alert('Pengajuan berhasil disetujui!');
        fetchPengajuan();
      }
    } catch (error: any) {
      alert(error.message || 'Gagal menyetujui pengajuan');
    }
  };

  const handleReject = async (id: string) => {
    const catatan = prompt('Alasan penolakan:');
    
    if (!catatan) {
      alert('Harap berikan alasan penolakan');
      return;
    }
    
    try {
      const response = await bimbinganAPI.updateStatusPengajuan(id, 'Ditolak', catatan);
      
      if (response.success) {
        alert('Pengajuan berhasil ditolak');
        fetchPengajuan();
      }
    } catch (error: any) {
      alert(error.message || 'Gagal menolak pengajuan');
    }
  };

  const formatTanggal = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu':
        return 'bg-yellow-100 text-yellow-700';
      case 'Disetujui':
        return 'bg-green-100 text-green-700';
      case 'Ditolak':
        return 'bg-red-100 text-red-700';
      case 'Selesai':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800 font-serif">
          Pengajuan Bimbingan Mahasiswa
        </h2>

        {/* Filter Status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Semua Status</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-600">Memuat data...</div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Mahasiswa (NIM)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Program Studi
                </th>
                <th className="px-6 py-3 text-