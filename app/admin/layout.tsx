'use client'; 

import { Sidebar } from '@/components/admin/Sidebar';
import { Bell } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';

// 🔹 Fungsi untuk menentukan judul halaman
const getHeaderTitle = (pathname: string) => {
  if (pathname.startsWith('/admin/dashboard') || pathname === '/admin') return 'Selamat Datang Admin';
  if (pathname.startsWith('/admin/mahasiswa')) return 'Kelola Akun Mahasiswa';
  if (pathname.startsWith('/admin/dosen')) return 'Kelola Akun Dosen';
  if (pathname.startsWith('/admin/pengguna')) return 'Daftar Pengguna Sistem';
  return 'SIGTA Admin';
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const title = getHeaderTitle(pathname);

  // 🔹 Warna & tema header
  const headerBg = 'bg-blue-900';
  const titleColor = 'text-white';
  const shadow = 'shadow-xl';

  // 🔹 Cek apakah halaman utama (dashboard)
  const isDashboard = pathname === '/admin' || pathname.startsWith('/admin/dashboard');

  // 🔹 Fungsi Logout
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
    <div className="flex flex-col min-h-screen">
      {/* === HEADER === */}
      <header
        className={`flex justify-between items-center p-5 px-8 sticky top-0 z-20 ${headerBg} ${shadow} w-full`}
      >
        {/* Judul Halaman */}
        <h1 className={`text-2xl font-semibold tracking-wide font-gentium ${titleColor}`}>
          {title}
        </h1>

        {/* === Tampilkan lonceng & logout hanya di dashboard === */}
        {isDashboard && (
          <div className="flex items-center space-x-6">
            {/* 🔔 Notifikasi */}
            <div className="relative cursor-pointer">
              <Bell className="w-8 h-8" color="#FDE047" />
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-600"></span>
            </div>

            {/* 🔒 Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
              title="Keluar dari sistem"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-5 h-5" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Keluar</span>
            </button>
          </div>
        )}
      </header>

      {/* === SIDEBAR + KONTEN === */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Area Konten */}
        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}