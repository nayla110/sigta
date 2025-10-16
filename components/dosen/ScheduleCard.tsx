'use client';

import { useState } from 'react';
import { User, MapPin, CheckSquare, XSquare, MessageSquare, GraduationCap } from 'lucide-react';

interface ScheduleCardProps {
  id: number;
  status: 'Permintaan' | 'Disetujui' | 'Selesai';
  tanggal: string;
  waktu: string;
  nim: string;
  nama: string;
  lokasi: string;
  initialCatatan: string | null;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  id,
  status,
  tanggal,
  waktu,
  nim,
  nama,
  lokasi,
  initialCatatan,
}) => {
  // Gunakan state lokal untuk input catatan
  const [catatan, setCatatan] = useState(initialCatatan || ''); 

  // Logika Aksi
  const handleAction = (action: string) => {
    alert(`${action} jadwal ${nim} (${status}). Catatan saat ini: ${catatan}`);
    // TODO: Implementasi logika API call untuk Menerima/Menolak/Selesai
  };

  // --- Render Tombol Aksi berdasarkan Status ---
  const renderActions = () => {
    switch (status) {
      case 'Permintaan':
        return (
          // Tombol Setuju dan Tolak
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => handleAction('Setuju')}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center"
            >
              Setuju
            </button>
            <button
              onClick={() => handleAction('Tolak')}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center"
            >
              Tolak
            </button>
          </div>
        );
      case 'Disetujui':
        return (
          // Tombol Tandai Selesai
          <div className="flex justify-end mt-4">
            <button
              onClick={() => handleAction('Tandai Selesai')}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center"
            >
              Tandai Selesai
            </button>
          </div>
        );
      case 'Selesai':
        return (
          // Tombol Selesai (Detail)
          <div className="flex justify-end mt-4">
            <button
              onClick={() => handleAction('Lihat Detail')}
              className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              Selesai
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // Render Catatan (Input field untuk Permintaan/Disetujui, Read-only untuk Selesai)
  const renderCatatan = () => {
    // Tampilkan input field jika statusnya Permintaan atau Disetujui
    if (status === 'Disetujui' || status === 'Permintaan') {
      return (
        <div className="flex items-center text-gray-700 text-sm mt-2">
          <User className="w-4 h-4 mr-2 text-gray-500" />
          <span className="font-semibold whitespace-nowrap">Catatan:</span>
          <input
            type="text"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Tulis catatan bimbingan..."
            className="ml-2 w-full p-1 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
          />
        </div>
      );
    }
    
    // Tampilkan teks read-only jika statusnya Selesai
    const catatanDisplay = catatan && catatan.trim() !== '' ? catatan : '-';
    return (
      <div className="flex items-center text-gray-700 text-sm mt-2">
        <User className="w-4 h-4 mr-2 text-gray-500" />
        <span className="font-semibold whitespace-nowrap">Catatan:</span>
        <span className="ml-2">{catatanDisplay}</span>
        {catatanDisplay !== '-' && <span className="ml-1 text-blue-500">✅</span>}
      </div>
    );
  };


  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
      <h3 className="text-xl font-semibold mb-3 text-gray-900 font-serif">
        Diskusi Pendahuluan
      </h3>
      
      <div className="space-y-2 text-gray-700 text-sm">
        <div className="flex items-center">
          <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
          {tanggal} | {waktu}
        </div>
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-gray-500" />
          {nim} - {nama}
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
          {lokasi}
        </div>
        
        {renderCatatan()}
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4">
        {renderActions()}
      </div>
    </div>
  );
};