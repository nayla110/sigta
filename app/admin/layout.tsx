'use client'; 

import { Sidebar } from '@/components/admin/Sidebar';
import { LogoutButton } from '@/components/dosen/LogoutButton';
import { Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

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
  const title = getHeaderTitle(pathname);

  // 🔹 Warna & tema header
  const headerBg = 'bg-blue-900';
  const titleColor = 'text-white';
  const shadow = 'shadow-xl';

  // 🔹 Cek apakah halaman utama (dashboard)
  const isDashboard = pathname === '/admin' || pathname.startsWith('/admin/dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      {/* === HEADER === */}
      <header
        className={`flex justify-between items-center p-5 px-8 sticky top-0 z-20 ${headerBg} ${shadow} w-full`}
      >
        {/* Judul Halaman */}
        <h1 className={`text-2xl font-semibold tracking-wide font-gentium ${titleColor}` }>
  {title}
</h1>


        {/* === Tampilkan lonceng & logout hanya di dashboard === */}
        {isDashboard && (
          <div className="flex items-center space-x-6">
            {/* 🔔 Notifikasi */}
            <div className="relative cursor-pointer">
<Bell className="w-8 h-8" color="#FDE047" />
        <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-600"></span>            </div>

            {/* 🔒 Logout */}
            <LogoutButton />
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
