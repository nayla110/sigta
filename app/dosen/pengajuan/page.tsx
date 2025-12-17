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
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Topik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Tanggal & Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Catatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pengajuanList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 italic">
                    Tidak ada pengajuan bimbingan
                  </td>
                </tr>
              ) : (
                pengajuanList.map((pengajuan) => (
                  <tr key={pengajuan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {pengajuan.mahasiswa_nama}
                      <br />
                      <span className="text-xs text-gray-500">({pengajuan.nim})</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {pengajuan.program_studi_kode} - {pengajuan.program_studi_nama}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {pengajuan.topik}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {formatTanggal(pengajuan.tanggal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(pengajuan.status)}`}>
                        {pengajuan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {pengajuan.catatan || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {pengajuan.status === 'Menunggu' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAccept(pengajuan.id)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Terima Pengajuan"
                          >
                            <CheckCircle className="w-6 h-6" />
                          </button>
                          <button
                            onClick={() => handleReject(pengajuan.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Tolak Pengajuan"
                          >
                            <XCircle className="w-6 h-6" />
                          </button>
                        </div>
                      )}
                      {pengajuan.status === 'Disetujui' && (
                        <span className="text-green-600 text-sm">✓ Disetujui</span>
                      )}
                      {pengajuan.status === 'Ditolak' && (
                        <span className="text-red-600 text-sm">✗ Ditolak</span>
                      )}
                      {pengajuan.status === 'Selesai' && (
                        <span className="text-blue-600 text-sm">✓ Selesai</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}