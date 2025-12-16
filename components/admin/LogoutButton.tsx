"use client";

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { adminAPI } from '@/lib/api';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      try {
        // Call logout API
        await adminAPI.logout();
        
        // Hapus cookie
        document.cookie = 'token=; path=/; max-age=0';
        
        // Redirect ke login
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
        // Tetap logout meskipun API error
        document.cookie = 'token=; path=/; max-age=0';
        router.push('/login');
      }
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
      title="Keluar dari sistem"
    >
      <LogOut className="w-5 h-5" />
      <span className="font-medium">Keluar</span>
    </button>
  );
}