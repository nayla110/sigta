'use client'; 

import { Sidebar } from '@/components/dosen/Sidebar';
import { LogoutButton } from '@/components/dosen/LogoutButton';
import { Bell, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Fungsi untuk mendapatkan judul (tetap)
const getHeaderTitle = (pathname: string) => {
  if (pathname.startsWith('/dosen/profile')) return 'Profil Dosen';
  if (pathname.startsWith('/dosen/dashboard') || pathname === '/dosen') return 'Selamat Datang';
  if (pathname.startsWith('/dosen/pengajuan')) return 'Pengajuan Bimbingan';
  if (pathname.startsWith('/dosen/jadwal')) return 'Jadwal Bimbingan';
  if (pathname.startsWith('/dosen/dokumen')) return 'Dokumen Tugas Akhir';
  return 'SIGTA Dosen';
};

export default function DosenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = getHeaderTitle(pathname); 

  // TEMA HEADER BARU: Biru Tua, sesuai gambar
  // Catatan: Ini akan membuat Header BIRU di SEMUA HALAMAN, bukan putih.
  const headerBg = 'bg-blue-900'; // Warna Biru Sidebar
  const titleColor = 'text-white'; // Judul Putih
  const shadow = 'shadow-xl';

  const HeaderAction = (
    <div className="flex items-center space-x-4">
      {/* Lonceng */}
      <div className="relative cursor-pointer">
        <Bell className="w-8 h-8 text-yellow-300" fill="#fde047" /> 
        <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-600"></span>
      </div>

      {/* Foto Profil */}
      <Link href="/dosen/profile" className="cursor-pointer">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                        bg-gray-200 text-gray-700 transition-shadow hover:shadow-lg border-2
                        ${pathname.startsWith('/dosen/profile') ? 'border-yellow-300' : 'border-transparent'}`}
        >
          <User className="w-6 h-6" /> 
        </div>
      </Link>
      
      {/* Tombol Logout */}
      <LogoutButton /> 
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* --- BAGIAN 1: HEADER PENUH --- */}
      <header className={`flex justify-between items-center p-4 px-8 sticky top-0 z-20 ${headerBg} ${shadow} w-full`}>
        <h1 className={`text-4xl font-serif font-bold ${titleColor}`}>
          {title}
        </h1>
        
        <div className="flex items-center space-x-6"> 
          {HeaderAction}
        </div>
      </header>

      {/* --- BAGIAN 2: SIDEBAR dan CONTENT (di bawah Header) --- */}
      <div className="flex flex-1">
        
        {/* Sidebar (Fixed di Kiri) */}
        {/* Catatan: Kita ganti fixed jadi sticky atau biarkan static karena Header sudah fixed/sticky */}
        <Sidebar /> {/* Sidebar sudah menggunakan w-64 */}
        
        {/* Main Content Area */}
        {/* Gunakan w-full dan overflow-y-auto untuk konten yang panjang */}
        <main className="flex-1 p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}