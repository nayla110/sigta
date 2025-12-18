'use client';

import { useState, useEffect } from 'react';
import { StudentCard } from '@/components/dosen/StudentCard';
import { Search, FileText, Edit2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { dokumenAPI } from '@/lib/api';

interface Mahasiswa {
  id: string;
  nim: string;
  nama: string;
  email: string;
  no_telp: string;
  judul_ta: string;
  program_studi_nama: string;
  program_studi_kode: string;
  status_ta: string;
  tugas_akhir_id: string;
}

interface Progress {
  status: string;
  current_bab: number;
  total_bab: number;
  judul_ta: string;
}

interface Dokumen {
  id: string;
  jenis_berkas: string;
  nama_file: string;
  status: string;
  catatan: string | null;
  uploaded_at: string;
}

export default function DokumenTugasAkhirPage() {
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [filteredMahasiswa, setFilteredMahasiswa] = useState<Mahasiswa[]>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [dokumenList, setDokumenList] = useState<Dokumen[]>([]);
  const [latestDokumen, setLatestDokumen] = useState<Dokumen | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempStatus, setTempStatus] = useState<'PROPOSAL' | 'TA'>('PROPOSAL');
  const [tempBab, setTempBab] = useState<number>(1);

  // ===== HELPER FUNCTIONS (di dalam komponen) =====
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Disetujui':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Ditolak':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'Menunggu':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disetujui':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Ditolak':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Menunggu':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadDokumen = async (dokumenId: string, namaFile: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/dokumen/dosen/dokumen/${dokumenId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = namaFile;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        alert(data.message || 'Gagal mengunduh dokumen');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Gagal mengunduh dokumen');
    }
  };

  const handleViewDokumen = async (dokumenId: string) => {
    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:5000/api/dokumen/dosen/dokumen/${dokumenId}/view`;
      
      // Buka di tab baru dengan token di URL
      window.open(url + '?token=' + encodeURIComponent(token || ''), '_blank');
    } catch (error) {
      console.error('View error:', error);
      alert('Gagal membuka dokumen');
    }
  };

  // ===== USE EFFECTS =====
  useEffect(() => {
    fetchMahasiswa();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMahasiswa(mahasiswaList);
    } else {
      const filtered = mahasiswaList.filter(m =>
        m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.nim.includes(searchQuery)
      );
      setFilteredMahasiswa(filtered);
    }
  }, [searchQuery, mahasiswaList]);

  // ===== API FUNCTIONS =====
  const fetchMahasiswa = async () => {
    try {
      setIsLoading(true);
      const response = await dokumenAPI.getMahasiswaBimbingan();
      
      if (response.success) {
        setMahasiswaList(response.data);
        setFilteredMahasiswa(response.data);
      }
    } catch (error) {
      console.error('Error fetching mahasiswa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMahasiswa = async (mahasiswa: Mahasiswa) => {
    setSelectedMahasiswa(mahasiswa);
    setReviewText('');

    try {
      const [progressRes, dokumenRes] = await Promise.all([
        dokumenAPI.getProgressMahasiswa(mahasiswa.id),
        dokumenAPI.getRiwayatDokumen(mahasiswa.id)
      ]);

      if (progressRes.success) {
        setProgress(progressRes.data);
        setTempStatus(progressRes.data.status === 'Proposal' ? 'PROPOSAL' : 'TA');
        setTempBab(progressRes.data.current_bab);
      }

      if (dokumenRes.success) {
        setDokumenList(dokumenRes.data);
        if (dokumenRes.data.length > 0) {
          setLatestDokumen(dokumenRes.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching detail:', error);
    }
  };

  const handleKirimReview = async () => {
    if (!latestDokumen || !reviewText.trim()) {
      alert('Mohon isi review terlebih dahulu');
      return;
    }

    try {
      const response = await dokumenAPI.reviewDokumen(
        latestDokumen.id,
        'Disetujui',
        reviewText
      );

      if (response.success) {
        alert('Review berhasil dikirim!');
        setReviewText('');
        if (selectedMahasiswa) {
          handleSelectMahasiswa(selectedMahasiswa);
        }
      }
    } catch (error: any) {
      alert(error.message || 'Gagal mengirim review');
    }
  };

  const handleReviewAction = async (status: 'Disetujui' | 'Ditolak', dokumenId: string) => {
    const catatan = prompt(`${status === 'Disetujui' ? 'Catatan persetujuan' : 'Alasan penolakan'}:`);
    
    if (status === 'Ditolak' && !catatan) {
      alert('Harap berikan alasan penolakan');
      return;
    }

    try {
      const response = await dokumenAPI.reviewDokumen(dokumenId, status, catatan || undefined);

      if (response.success) {
        alert(`Dokumen berhasil ${status === 'Disetujui' ? 'disetujui' : 'ditolak'}`);
        if (selectedMahasiswa) {
          handleSelectMahasiswa(selectedMahasiswa);
        }
      }
    } catch (error: any) {
      alert(error.message || 'Gagal mereview dokumen');
    }
  };

  // ===== RENDER =====
  if (isLoading) {
    return (
      <div className="p-4 border-b pb-4">
        <div className="text-center text-gray-600 py-8">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b pb-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-800">Dokumen Mahasiswa Bimbingan</h1>
          <p className="text-sm text-gray-500">Kelola dan review dokumen tugas akhir mahasiswa</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-xs ml-8">
          <input
            type="text"
            placeholder="Cari Mahasiswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Student Cards */}
      <div className="flex overflow-x-auto space-x-4 pb-4 mb-8">
        {filteredMahasiswa.length === 0 ? (
          <div className="text-center text-gray-500 py-8 w-full">
            {searchQuery ? 'Mahasiswa tidak ditemukan' : 'Belum ada mahasiswa bimbingan'}
          </div>
        ) : (
          filteredMahasiswa.map((mahasiswa) => (
            <div 
              key={mahasiswa.id} 
              className={`w-72 cursor-pointer transition-all hover:scale-105 ${
                selectedMahasiswa?.id === mahasiswa.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleSelectMahasiswa(mahasiswa)}
            >
              <StudentCard 
                nama={mahasiswa.nama}
                nim={mahasiswa.nim}
                prodi={mahasiswa.program_studi_nama}
                email={mahasiswa.email}
                telp={mahasiswa.no_telp || '-'}
              />
            </div>
          ))
        )}
      </div>

      {/* Detail Section */}
      {selectedMahasiswa && progress && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status & Judul */}
          <div className="col-span-1 space-y-6">
            <div className="bg-blue-800 p-6 rounded-xl shadow-lg text-white relative">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute top-4 right-4 p-2 hover:bg-blue-700 rounded-lg transition-colors"
                title="Edit Status"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-light mb-2">{progress.status}</h3>
              <p className="text-4xl font-bold">Bab {progress.current_bab}</p>
              <div className="mt-4 text-sm opacity-80">
                Progress: {progress.current_bab}/{progress.total_bab} BAB
              </div>
            </div>

            <div className="bg-blue-800 p-6 rounded-xl shadow-lg text-white">
              <h3 className="text-lg font-light mb-2">JUDUL TA:</h3>
              <p className="text-xl font-bold leading-snug">
                {progress.judul_ta || 'Belum ada judul'}
              </p>
            </div>
          </div>

          {/* Review & Riwayat */}
          <div className="lg:col-span-2 col-span-1 space-y-6">
            {/* Review Section */}
            {latestDokumen && (
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                  <div className="flex items-center">
                    <FileText className="w-6 h-6 mr-3 text-gray-600" />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">
                        {latestDokumen.nama_file}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {formatDate(latestDokumen.uploaded_at)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    latestDokumen.status === 'Disetujui' 
                      ? 'bg-green-100 text-green-700'
                      : latestDokumen.status === 'Ditolak'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {latestDokumen.status}
                  </span>
                </div>

                {latestDokumen.status === 'Menunggu' && (
                  <>
                    <div className="space-y-3 mb-4">
                      <label className="text-sm font-medium text-gray-700 block">Isi Review</label>
                      <textarea
                        placeholder="Ketik review Anda di sini..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleReviewAction('Ditolak', latestDokumen.id)}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Tolak
                      </button>
                      <button
                        onClick={handleKirimReview}
                        className="px-6 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-md flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Setujui & Kirim
                      </button>
                    </div>
                  </>
                )}

                {latestDokumen.status !== 'Menunggu' && latestDokumen.catatan && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Catatan Review:</p>
                    <p className="text-sm text-gray-600">{latestDokumen.catatan}</p>
                  </div>
                )}
              </div>
            )}

            {/* Document History - TABLE VERSION */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Riwayat Dokumen</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-800 text-white">
                      <th className="px-4 py-3 text-left text-sm">BAB</th>
                      <th className="px-4 py-3 text-left text-sm">Nama File</th>
                      <th className="px-4 py-3 text-left text-sm">Tanggal</th>
                      <th className="px-4 py-3 text-left text-sm">Status</th>
                      <th className="px-4 py-3 text-left text-sm">Catatan</th>
                      <th className="px-4 py-3 text-left text-sm">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dokumenList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          Belum ada dokumen yang diupload
                        </td>
                      </tr>
                    ) : (
                      dokumenList.map((doc, i) => (
                        <tr key={doc.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-3 border">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(doc.status)}
                              <span className="font-medium text-sm">{doc.jenis_berkas}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 border text-sm">{doc.nama_file}</td>
                          <td className="px-4 py-3 border text-xs">{formatDate(doc.uploaded_at)}</td>
                          <td className="px-4 py-3 border">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 border text-sm">
                            {doc.catatan || (doc.status === 'Menunggu' ? 'Menunggu review' : '-')}
                          </td>
                          <td className="px-4 py-3 border">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDownloadDokumen(doc.id, doc.nama_file)}
                                className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                              >
                                Download
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Selection Message */}
      {!selectedMahasiswa && !isLoading && mahasiswaList.length > 0 && (
        <div className="text-center text-gray-500 py-16">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Pilih mahasiswa untuk melihat dokumen</p>
        </div>
      )}

      {/* Modal Edit Status */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Status Mahasiswa</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Pengerjaan
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTempStatus('PROPOSAL')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      tempStatus === 'PROPOSAL'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    PROPOSAL
                  </button>
                  <button
                    onClick={() => setTempStatus('TA')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      tempStatus === 'TA'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    TA
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress BAB (1-{tempStatus === 'PROPOSAL' ? '3' : '5'})
                </label>
                <input
                  type="number"
                  min="1"
                  max={tempStatus === 'PROPOSAL' ? '3' : '5'}
                  value={tempBab}
                  onChange={(e) => setTempBab(Math.max(1, Math.min(tempStatus === 'PROPOSAL' ? 3 : 5, parseInt(e.target.value) || 1)))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert(`Status akan diupdate: ${tempStatus} - Bab ${tempBab}`);
                  setIsEditModalOpen(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}