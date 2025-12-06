'use client';

import { useState } from 'react';
import { StudentCard } from '@/components/dosen/StudentCard';
import { DocumentHistory } from '@/components/dosen/DocumentHistory';
import { Search, FileText, Edit2 } from 'lucide-react';

const dummyStudent = {
  nim: '3312411089',
  nama: 'Elsya Ananda Putri',
  prodi: 'Teknik Informatika',  
  email: 'nandaorelsya01@gmail.com',
  telp: '0897-7161-17168',
};

const dummyDocumentHistory = [
  { id: 1, tanggal: '09/10/2025', namaFile: 'Draft_Bab_4_Final.pdf', statusReview: true },
  { id: 2, tanggal: '09/10/2025', namaFile: 'Draft_Bab_4_Final.pdf', statusReview: true },
  { id: 3, tanggal: '09/10/2025', namaFile: 'Draft_Bab_3_Revisi.pdf', statusReview: true },
  { id: 4, tanggal: '08/10/2025', namaFile: 'Draft_Bab_2_Final.pdf', statusReview: false },
  { id: 5, tanggal: '07/10/2025', namaFile: 'Draft_Bab_1_Revisi.pdf', statusReview: false },
  { id: 6, tanggal: '06/10/2025', namaFile: 'Proposal_TA.pdf', statusReview: true },
];

export default function DokumenTugasAkhirPage() {
  const [status, setStatus] = useState<'PROPOSAL' | 'TA'>('PROPOSAL');
  const [bab, setBab] = useState<number>(3);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempStatus, setTempStatus] = useState<'PROPOSAL' | 'TA'>('PROPOSAL');
  const [tempBab, setTempBab] = useState<number>(3);

  const handleKirimReview = () => {
    alert("Review berhasil dikirim!");
  };

  const openEditModal = () => {
    setTempStatus(status);
    setTempBab(bab);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    setStatus(tempStatus);
    setBab(tempBab);
    setIsEditModalOpen(false);
  };

  return (
    <div className="p-4 border-b pb-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-800">Nama Mahasiswa</h1>
          <p className="text-sm text-gray-500">Ini adalah semua data mahasiswa bimbingan anda</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-xs ml-8">
          <input
            type="text"
            placeholder="Cari Mahasiswa..."
            className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Student Cards */}
      <div className="flex overflow-x-auto space-x-4 pb-4 mb-8">
        {[1, 2, 3, 4].map(index => (
          <div key={index} className="w-72">
            <StudentCard {...dummyStudent} nama={`Mahasiswa ${index}`} />
          </div>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Status & Judul */}
        <div className="col-span-1 space-y-6">

          <div className="bg-blue-800 p-6 rounded-xl shadow-lg text-white relative">
            <button
              onClick={openEditModal}
              className="absolute top-4 right-4 p-2 hover:bg-blue-700 rounded-lg transition-colors"
              title="Edit Status"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-light mb-2">{status}</h3>
            <p className="text-4xl font-bold">Bab {bab}</p>
          </div>

          <div className="bg-blue-800 p-6 rounded-xl shadow-lg text-white">
            <h3 className="text-lg font-light mb-2">JUDUL TA:</h3>
            <p className="text-xl font-bold leading-snug">
              Prototype Modul IoT: Monitoring Panel Surya
            </p>
          </div>
        </div>

        {/* Review & Riwayat */}
        <div className="lg:col-span-2 col-span-1">

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4 pb-4 border-b">
              <div className="flex items-center">
                <FileText className="w-6 h-6 mr-3 text-gray-600" />
                <div>
                  <h4 className="font-semibold text-gray-800">Draft_Bab_4_Final.pdf</h4>
                  <p className="text-xs text-gray-500">Kamis, 09/10/2025</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 block">Isi Review</label>
              <textarea
                placeholder="Ketik Disini"
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              ></textarea>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleKirimReview}
                className="px-6 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-md"
              >
                Kirim
              </button>
            </div>
          </div>

          <DocumentHistory history={dummyDocumentHistory} />
        </div>
      </div>

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
                  Progress BAB (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={tempBab}
                  onChange={(e) => setTempBab(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
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
                onClick={handleSaveChanges}
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