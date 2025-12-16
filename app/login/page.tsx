"use client";

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminAPI } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin/dashboard';
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await adminAPI.login(formData.username, formData.password);
      
      if (response.success) {
        // Simpan token ke cookie juga untuk middleware
        document.cookie = `token=${response.data.token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
        
        // Redirect ke halaman yang dituju atau dashboard
        router.push(redirectUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa username dan password Anda.');
    } finally {
      setIsLoading(false);
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
      <div className="relative z-10 bg-[#b8dcff]/90 w-[400px] rounded-[40px] flex flex-col items-center p-10 justify-center shadow-lg backdrop-blur-sm">
        {/* Logo dan judul */}
        <div className="flex items-center">
          <img src="/logo.png" alt="SigTA Logo" className="w-35 h-35 mb-3" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form login */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5 w-full mt-5">
          {/* Input Nama Pengguna */}
          <div className="bg-white rounded-full shadow-sm">
            <input
              type="text"
              placeholder="Nama Pengguna"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
        <div className="mt-4 text-xs text-gray-600 text-center">
          <p>Default Login:</p>
          <p className="font-semibold">Username: admin</p>
          <p className="font-semibold">Password: admin123</p>
        </div>
      </div>
    </div>
  );
}