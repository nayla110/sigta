'use client';

import { Sidebar } from '@/components/dosen/Sidebar';
import { Bell, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// Tentukan judul header berdasarkan path
const getHeaderTitle = (pathname: string) => {
  if (pathname.startsWith('/dosen/profile')) return 'Profil Dosen';
  if (pathname.startsWith('/dosen/setting')) return 'Pengaturan Akun';
  if (pathname.startsWith('/dosen/dashboard') || pathname === '/dosen')
    return 'Selamat Datang';
  if (pathname.startsWith('/dosen/pengajuan')) return 'Pengajuan Bimbingan';
  if (pathname.startsWith('/dosen/jadwal')) return 'Jadwal Bimbingan';
  if (pathname.startsWith('/dosen/dokumen')) return 'Dokumen Tugas Akhir';
  return 'SIGTA Dosen';
};

export default function DosenLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const title = getHeaderTitle(pathname);

  // Tampilkan ikon di header hanya pada dashboard (opsional)
  const isDashboard = pathname === '/dosen' || pathname.startsWith('/dosen/dashboard');

  // Dropdown user
  const [openUser, setOpenUser] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar / tekan ESC
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setOpenUser(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpenUser(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  // Logout function
  const logout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      setOpenUser(false);
      
      // Hapus token dari localStorage dan cookie
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; max-age=0';
      
      // Redirect ke login
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="flex items-center sticky top-0 z-20 w-full px-8 py-4 bg-blue-900 shadow-xl">
        {/* Judul di kiri */}
        <h1 className="text-2xl font-semibold tracking-wide font-gentium text-white">
          {title}
        </h1>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Ikon kanan (opsional di dashboard) */}
        {isDashboard && (
          <div className="flex items-center gap-6">
            {/* Bell */}
            <div className="relative cursor-pointer">
              <Bell className="w-8 h-8 text-yellow-300" />
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-600" />
            </div>

            {/* User dropdown */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setOpenUser(v => !v)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-blue-800 transition"
                aria-haspopup="menu"
                aria-expanded={openUser}
                aria-label="Menu pengguna"
              >
                <User className="w-8 h-8 text-white" />
              </button>

              {openUser && (
                <div
                  className="absolute right-0 mt-3 w-48 rounded-lg border bg-white text-gray-800 shadow-md overflow-hidden z-50"
                  role="menu"
                >
                  <Link
                    href="/dosen/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setOpenUser(false)}
                  >
                    Profil
                  </Link>
                  <Link
                    href="/dosen/setting"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setOpenUser(false)}
                  >
                    Pengaturan
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t"
                    role="menuitem"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* SIDEBAR + CONTENT */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}