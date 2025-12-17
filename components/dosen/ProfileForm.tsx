'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, GraduationCap, BookOpen } from 'lucide-react';
import { dosenAPI } from '@/lib/api';

interface DosenProfile {
  id: string;
  nik: string;
  nama: string;
  email: string;
  no_telp: string;
  program_studi_nama: string;
  program_studi_jenjang: string;
  total_mahasiswa_bimbingan: number;
}

export default function ProfileForm() {
  const [dosen, setDosen] = useState<DosenProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await dosenAPI.getCurrentProfile();
      
      if (response.success) {
        setDosen(response.data);
      } else {
        setError(response.message || 'Gagal memuat profil');
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat profil');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 font-serif">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Memuat profil...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 font-serif">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!dosen) {
    return (
      <div className="max-w-6xl mx-auto p-6 font-serif">
        <div className="text-center text-gray-600">Data profil tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 font-serif">
      <h1 className="text-2xl font-semibold mb-6">Profil Dosen</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Foto & Info Dasar */}
        <div className="bg-white shadow-lg p-6 rounded-lg border border-gray-200">
          {/* Foto Profil */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-md">
              <User className="w-16 h-16 text-blue-600" />
            </div>
          </div>

          {/* Nama & NIK */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{dosen.nama}</h2>
            <p className="text-sm text-gray-500 mt-1">NIK: {dosen.nik}</p>
          </div>

          {/* Stats */}
          <div className="bg-blue-50 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mahasiswa Bimbingan</span>
              <span className="text-2xl font-bold text-blue-600">
                {dosen.total_mahasiswa_bimbingan}
              </span>
            </div>
          </div>
        </div>

        {/* Card Detail Informasi */}
        <div className="lg:col-span-2 bg-white shadow-lg p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            Informasi Detail
          </h3>
          
          <div className="space-y-4">
            {/* Program Studi */}
            <div className="flex items-start">
              <div className="w-12 flex items-center">
                <GraduationCap className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Program Studi</p>
                <p className="text-base font-medium text-gray-800">
                  {dosen.program_studi_jenjang} {dosen.program_studi_nama}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start">
              <div className="w-12 flex items-center">
                <Mail className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-base font-medium text-gray-800">{dosen.email}</p>
              </div>
            </div>

            {/* No Telepon */}
            <div className="flex items-start">
              <div className="w-12 flex items-center">
                <Phone className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">No. Telepon</p>
                <p className="text-base font-medium text-gray-800">
                  {dosen.no_telp || '-'}
                </p>
              </div>
            </div>

            {/* NIK */}
            <div className="flex items-start">
              <div className="w-12 flex items-center">
                <BookOpen className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">NIK</p>
                <p className="text-base font-medium text-gray-800">{dosen.nik}</p>
              </div>
            </div>
          </div>

          {/* Tombol Edit (Optional) */}
          <div className="mt-6 pt-4 border-t">
            <button
              onClick={() => alert('Fitur edit profil akan segera hadir')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Edit Profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}