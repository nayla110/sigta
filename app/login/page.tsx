"use client";

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAPI } from '@/lib/api';

type UserRole = 'admin' | 'mahasiswa' | 'dosen';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [role, setRole] = useState<UserRole>('admin');
  const [formData, setFormData] = useState({
    identifier: '', // username/nim/nik
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let response;
      let redirectPath = '/';

      // Login berdasarkan role
      switch (role) {
        case 'admin':
          response = await authAPI.loginAdmin(formData.identifier, formData.password);
          redirectPath = searchParams.get('redirect') || '/admin/dashboard';
          break;
        
        case 'mahasiswa':
          response = await authAPI.loginMahasiswa(formData.identifier, formData.password);
          redirectPath = '/mahasiswa/dashboard';
          break;
        
        case 'dosen':
          response = await authAPI.loginDosen(formData.identifier, formData.password);
          redirectPath = '/dosen/dashboard';
          break;
      }

      if (response.success) {
        // Simpan token ke cookie
        document.cookie = `token=${response.data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        
        // Redirect ke halaman yang sesuai
        router.push(redirectPath);
      }
    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa kredensial Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  // Label dinamis berdasarkan role
  const getIdentifierLabel = () => {
    switch (role) {
      case 'admin': return 'Username';
      case 'mahasiswa': return 'NIM';
      case 'dosen': return 'NIK';
    }
  };

  const getIdentifierPlaceholder = () => {
    switch (role) {
      case 'admin': return 'Masukkan username';
      case 'mahasiswa': return 'Masukkan NIM';
      case 'dosen': return 'Masukkan NIK';
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center font-sans"
      style={{
        backgroundImage: "url('/deab004c-dd02-4817-8172-1be704cef392.jpg')",
      }}
    >
      {/* Overlay gelap transparan */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Card login */}
      <div className="relative z-10 bg-[#b8dcff]/90 w-[450px] rounded-[40px] flex flex-col items-center p-10 justify-center shadow-lg backdrop-blur-sm">
        {/* Logo dan judul */}
        <div className="flex items-center mb-4">
          <img src="/logo.png" alt="SigTA Logo" className="w-35 h-35" />
        </div>

        {/* Role Selector */}
        <div className="w-full mb-6">
          <div className="flex gap-2 bg-white/50 rounded-full p-1">
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                role === 'admin' 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'text-gray-600 hover:bg-white/30'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole('mahasiswa')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                role === 'mahasiswa' 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'text-gray-600 hover:bg-white/30'
              }`}
            >
              Mahasiswa
            </button>
            <button
              type="button"
              onClick={() => setRole('dosen')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                role === 'dosen' 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'text-gray-600 hover:bg-white/30'
              }`}
            >
              Dosen
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form login */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5 w-full">
          {/* Input Identifier (Username/NIM/NIK) */}
          <div className="bg-white rounded-full shadow-sm">
            <input
              type="text"
              placeholder={getIdentifierPlaceholder()}
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              required
              disabled={isLoading}
              className="w-full rounded-full py-3 px-5 text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent disabled:opacity-50"
            />
          </div>

          {/* Input Kata Sandi */}
          <div className="bg-white rounded-full shadow-sm">
            <input
              type="password"
              placeholder="Kata Sandi"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={isLoading}
              className="w-full rounded-full py-3 px-5 text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent disabled:opacity-50"
            />
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-white text-blue-600 font-medium rounded-full py-2 hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        {/* Info default login */}
        
      </div>
    </div>
  );
}