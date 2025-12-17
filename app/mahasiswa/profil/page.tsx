'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, GraduationCap, BookOpen, Award } from 'lucide-react';
import { mahasiswaAPI } from '@/lib/api';

interface MahasiswaProfile {
  id: string;
  nim: string;
  nama: string;
  email: string;
  no_telp: string;
  judul_ta: string;
  program_studi_nama: string;
  program_studi_kode: string;
  program_studi_jenjang: string;
  dosen_pembimbing_nama: string;
  dosen_pembimbing_nik: string;
  dosen_pembimbing_email: string;
  dosen_pembimbing_telp: string;
}

export default function ProfilMahasiswa() {
  const [mahasiswa, setMahasiswa] = useState<MahasiswaProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await mahasiswaAPI.getCurrentProfile();
      
      if (response.success) {
        setMahasiswa(response.data);
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
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Memuat profil...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!mahasiswa) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center text-gray-600">Data profil tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Profil Mahasiswa</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Foto & Info Dasar */}
        <div className="bg-white shadow-lg p-6 rounded-lg border border-gray-200">
          {/* Foto Profil */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-md">
              <User className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Nama & NIM */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{mahasiswa.nama}</h2>
            <p className="text-sm text-gray-500 mt-1">NIM: {mahasiswa.nim}</p>
          </div>

          {/* Program Studi Badge */}
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">Program Studi</p>
            <p className="text-sm font-semibold text-blue-700">
              {mahasiswa.program_studi_jenjang} {mahasiswa.program_studi_nama}
            </p>
          </div>
        </div>

        {/* Card Detail Informasi Mahasiswa */}
        <div className="lg:col-span-2 bg-white shadow-lg p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            Informasi Mahasiswa
          </h3>
          
          <div className="space-y-4">
            {/* NIM */}
            <div className="flex items-start">
              <div className="w-12 flex items-center">
                <Award className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">NIM</p>
                <p className="text-base font-medium text-gray-800">{mahasiswa.nim}</p>
              </div>
            </div>

            {/* Program Studi */}
            <div className="flex items-start">
              <div className="w-12 flex items-center">
                <GraduationCap className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Program Studi</p>
                <p className="text-base font-medium text-gray-800">
                  {mahasiswa.program_studi_jenjang} {mahasiswa.program_studi_nama}
                </p>
              </div>
            </div>

            {/* Judul TA */}
            <div className="flex items-start">
              <div className="w-12 flex items-center">
                <BookOpen className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Judul Tugas Akhir</p>
                <p className="text-base font-medium text-gray-800">
                  {mahasiswa.judul_ta || '-'}
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
                <p className="text-base font-medium text-gray-800">{mahasiswa.email}</p>
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
                  {mahasiswa.no_telp || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Dosen Pembimbing - Full Width */}
        <div className="lg:col-span-3 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-blue-300 pb-2">
            Informasi Dosen Pembimbing
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Dosen */}
            <div className="flex items-start">
              <div className="w-12 flex items-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Nama Dosen</p>
                <p className="text-base font-semibold text-gray-800">
                  {mahasiswa.dosen_pembimbing_nama || '-'}
                </p>
              </div>
            </div>

            {/* NIK Dosen */}
            <div className="flex items-start">
              <div className="w-12 flex items-center">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">NIK</p>
                <p className="text-base font-semibold text-gray-800">
                  {mahasiswa.dosen_pembimbing_nik || '-'}
                </p>
              </div>
            </div>

            {/* Email Dosen */}
            <div className="flex items-start">
              <div className="w-12 flex items-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-base font-semibold text-gray-800">
                  {mahasiswa.dosen_pembimbing_email || '-'}
                </p>
              </div>
            </div>

            {/* Telepon Dosen */}
            <div className="flex items-start">
              <div className="w-12 flex items-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">No. Telepon</p>
                <p className="text-base font-semibold text-gray-800">
                  {mahasiswa.dosen_pembimbing_telp || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Edit (Optional) */}
      <div className="mt-6">
        <button
          onClick={() => alert('Fitur edit profil akan segera hadir')}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Edit Profil
        </button>
      </div>
    </div>
  );
}