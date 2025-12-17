'use client';

import React, { useState, useEffect } from 'react';
import { dokumenAPI } from '@/lib/api';
import { AlertCircle, CheckCircle, Clock, XCircle, Upload, FileText } from 'lucide-react';

interface Progress {
  status: string;
  current_bab: number;
  next_bab: number;
  max_bab: number;
  can_upload_next: boolean;
  can_access_ta: boolean;
  approved_babs: number[];
}

interface Dokumen {
  id: string;
  jenis_berkas: string;
  nama_file: string;
  status: string;
  catatan: string | null;
  uploaded_at: string;
}

type BabForm = {
  file: File | null;
  note: string;
};

export default function ProposalPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [dokumenList, setDokumenList] = useState<Dokumen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState<boolean[]>([true, false, false]);
  const [forms, setForms] = useState<BabForm[]>(
    Array.from({ length: 3 }, () => ({ file: null, note: '' }))
  );
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [progressRes, dokumenRes] = await Promise.all([
        dokumenAPI.getMahasiswaProgress(),
        dokumenAPI.getMahasiswaDokumen()
      ]);

      if (progressRes.success) {
        setProgress(progressRes.data);
      }

      if (dokumenRes.success) {
        setDokumenList(dokumenRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  function toggle(idx: number) {
    setOpen(prev => prev.map((v, i) => (i === idx ? !v : v)));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const file = e.target.files?.[0] || null;
    setForms(prev => prev.map((f, i) => (i === idx ? { ...f, file } : f)));
  }

  function handleNoteChange(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const value = e.target.value;
    setForms(prev => prev.map((f, i) => (i === idx ? { ...f, note: value } : f)));
  }

  async function handlePosting(idx: number) {
    if (!progress) return;

    const babNumber = idx + 1;
    const entry = forms[idx];

    // Validasi file
    if (!entry.file) {
      alert('Pilih file terlebih dahulu.');
      return;
    }

    // Validasi: hanya bisa upload BAB yang diizinkan
    if (babNumber !== progress.next_bab) {
      alert(`Anda hanya bisa mengupload BAB ${progress.next_bab}. Selesaikan BAB sebelumnya terlebih dahulu.`);
      return;
    }

    // Cek apakah sudah ada dokumen pending untuk BAB ini
    const hasPending = dokumenList.some(
      d => d.jenis_berkas.includes(`BAB ${babNumber}`) && d.status === 'Menunggu'
    );

    if (hasPending) {
      alert(`Anda sudah memiliki dokumen BAB ${babNumber} yang sedang menunggu review.`);
      return;
    }

    try {
      setIsUploading(true);

      const dokumenData = {
        jenis_berkas: `Proposal BAB ${babNumber}`,
        nama_file: entry.file.name,
        catatan: entry.note || null
      };

      const response = await dokumenAPI.uploadDokumen(dokumenData);

      if (response.success) {
        alert('Dokumen berhasil diupload dan menunggu review dosen!');
        
        // Reset form
        setForms(prev => prev.map((f, i) => (i === idx ? { file: null, note: '' } : f)));
        setOpen(prev => prev.map((v, i) => (i === idx ? false : v)));
        
        // Refresh data
        fetchData();
      }
    } catch (error: any) {
      alert(error.message || 'Gagal mengupload dokumen');
    } finally {
      setIsUploading(false);
    }
  }

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

  const canUploadBab = (babNumber: number) => {
    if (!progress) return false;
    return babNumber === progress.next_bab;
  };

  const isBabLocked = (babNumber: number) => {
    if (!progress) return true;
    return babNumber > progress.next_bab;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center text-gray-600 py-8">Memuat data...</div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center text-red-600 py-8">Gagal memuat data progress</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Progress Info */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Upload Dokumen Proposal</h1>
            <p className="text-blue-100">Status: {progress.status}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{progress.current_bab}/{progress.max_bab}</div>
            <p className="text-blue-100 text-sm">BAB Selesai</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 bg-blue-800 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-white h-full transition-all duration-500"
            style={{ width: `${(progress.current_bab / progress.max_bab) * 100}%` }}
          />
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>
            {progress.can_upload_next 
              ? `Anda bisa mengupload BAB ${progress.next_bab} setelah BAB sebelumnya disetujui dosen`
              : 'Semua BAB proposal sudah diupload'}
          </span>
        </div>
      </div>

      {/* Upload form untuk tiap BAB */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, idx) => {
          const babNumber = idx + 1;
          const isLocked = isBabLocked(babNumber);
          const canUpload = canUploadBab(babNumber);
          const isApproved = progress.approved_babs.includes(babNumber);
          const hasPending = dokumenList.some(
            d => d.jenis_berkas.includes(`BAB ${babNumber}`) && d.status === 'Menunggu'
          );

          return (
            <div key={idx} className="space-y-3">
              <div
                className={`inline-flex items-center gap-3 rounded-full px-4 py-2 cursor-pointer select-none ${
                  isLocked 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isApproved
                    ? 'bg-green-100 text-green-700'
                    : canUpload
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
                onClick={() => !isLocked && toggle(idx)}
              >
                <div className="text-xl font-bold">
                  {isLocked ? '🔒' : isApproved ? '✓' : hasPending ? '⏳' : '+'}
                </div>
                <div className="font-semibold">BAB {babNumber}</div>
              </div>

              <div className={`bg-white border rounded-2xl p-6 shadow-sm ${
                isLocked ? 'opacity-50' : ''
              }`}>
                {isLocked ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🔒</div>
                    <p className="text-gray-600 font-medium">BAB Terkunci</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Selesaikan BAB sebelumnya terlebih dahulu
                    </p>
                  </div>
                ) : isApproved ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">✅</div>
                    <p className="text-green-600 font-medium">BAB Disetujui</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Dokumen Anda telah disetujui dosen
                    </p>
                  </div>
                ) : hasPending ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">⏳</div>
                    <p className="text-yellow-600 font-medium">Menunggu Review</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Dokumen sedang direview dosen
                    </p>
                  </div>
                ) : open[idx] ? (
                  <>
                    <label className="block font-semibold mb-2 text-gray-800">Masukkan File</label>
                    <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-3">
                      <label
                        htmlFor={`file-input-${idx}`}
                        className="flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <span className="text-sm text-gray-700 truncate">
                          {forms[idx].file ? forms[idx].file.name : 'Pilih file...'}
                        </span>

                        <input
                          id={`file-input-${idx}`}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={e => handleFileChange(e, idx)}
                          className="hidden"
                          disabled={!canUpload}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(`file-input-${idx}`)?.click();
                          }}
                          disabled={!canUpload}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Pilih
                        </button>
                      </label>
                    </div>

                    <label className="block font-semibold mb-2 text-gray-800">Keterangan</label>
                    <input
                      type="text"
                      placeholder="Tambahkan keterangan (opsional)"
                      value={forms[idx].note}
                      onChange={e => handleNoteChange(e, idx)}
                      disabled={!canUpload}
                      className="w-full border rounded-lg px-3 py-2 mb-4 disabled:bg-gray-100"
                    />

                    <div className="flex justify-center">
                      <button
                        onClick={() => handlePosting(idx)}
                        disabled={!canUpload || isUploading || !forms[idx].file}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isUploading ? 'Mengupload...' : 'Upload Dokumen'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600">Klik header untuk membuka form</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabel hasil upload */}
      <div className="bg-white border rounded-2xl shadow-md p-6">
        <h3 className="font-semibold mb-4 text-xl">Riwayat Upload & Review Dosen</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-3 text-left">BAB</th>
                <th className="px-4 py-3 text-left">Nama File</th>
                <th className="px-4 py-3 text-left">Tanggal Upload</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Komentar Dosen</th>
              </tr>
            </thead>
            <tbody>
              {dokumenList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Belum ada dokumen yang diupload
                  </td>
                </tr>
              ) : (
                dokumenList
                  .filter(d => d.jenis_berkas.includes('Proposal'))
                  .map((doc, i) => (
                    <tr key={doc.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3 border">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(doc.status)}
                          <span className="font-medium">{doc.jenis_berkas}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 border">{doc.nama_file}</td>
                      <td className="px-4 py-3 border text-sm">{formatDate(doc.uploaded_at)}</td>
                      <td className="px-4 py-3 border">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 border text-sm">
                        {doc.catatan || (doc.status === 'Menunggu' ? 'Menunggu review dosen' : '-')}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Alert jika bisa akses TA */}
      {progress.can_access_ta && (
        <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Selamat! Anda sudah bisa mengakses halaman Tugas Akhir</p>
            <p className="text-sm mt-1">Dosen pembimbing Anda telah mengubah status Anda. Silakan lanjutkan ke halaman Tugas Akhir.</p>
          </div>
        </div>
      )}
    </div>
  );
}