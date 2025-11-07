'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Bell, User, BookOpen, CalendarDays } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const getTitle = () => {
    if (pathname?.includes('/bimbingan')) return 'Jadwal Bimbingan';
    if (pathname?.includes('/TA')) return 'Tugas Akhir';
    if (pathname?.includes('/profil')) return 'Profil Mahasiswa';
    if (pathname?.includes('/setting')) return 'Pengaturan Akun';
    return 'Selamat Datang Mahasiswa';
  };

  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    alert('Anda telah keluar dari sistem.');
    router.push('/login');
  };

  const isDashboard = pathname === '/mahasiswa/dashboard';

  // === Konstanta visual ===
  const NAVBAR_COLOR = '#153A87';   // biru tua
  const SIDEBAR_COLOR = '#8EC2FF';  // biru muda
  const SIDEBAR_BORDER = '#66A8F3';
  const SIDEBAR_WIDTH = 255;        // px
  const NAVBAR_HEIGHT = 73;         // px (h-16)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* === Navbar FULL-WIDTH (fixed) === */}
      <header
  className="fixed top-0 left-0 right-0 z-30 shadow-md flex items-center text-white"
  style={{
    height: NAVBAR_HEIGHT,
    backgroundColor: NAVBAR_COLOR,
  }}
>
  {/* === JUDUL DI POJOK KIRI === */}
  <div className="text-2xl font-semibold tracking-wide font-gentium px-6">
    {getTitle()}
  </div>

  {/* === SPACER agar ikon tetap di kanan === */}
  <div className="flex-1"></div>

  {/* === IKON DI KANAN === */}
  {isDashboard && (
    <div className="flex items-center gap-6 pr-8">
      <button className="relative p-2 rounded-full transition hover:opacity-90">
        <Bell className="w-8 h-8" color="#FDE047" />
        <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-600"></span>
      </button>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpenDropdown(!openDropdown)}
          className="flex items-center gap-2 p-1 rounded-full hover:opacity-90 transition"
        >
          <User className="w-8 h-8" />
        </button>

        {openDropdown && (
          <div className="absolute right-0 mt-3 w-44 bg-white text-gray-800 border rounded-lg shadow-md overflow-hidden z-50">
            <Link href="/mahasiswa/profil" className="block px-4 py-2 text-sm hover:bg-gray-100">
              Profil
            </Link>
            <Link href="/mahasiswa/setting" className="block px-4 py-2 text-sm hover:bg-gray-100">
              Pengaturan
            </Link>
            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t" onClick={handleLogout}>
              Keluar
            </button>
          </div>
        )}
      </div>
    </div>
  )}
</header>


      {/* === Sidebar (di bawah navbar) === */}
      <aside
        className="fixed left-0 text-black flex flex-col shadow-lg"
        style={{
          top: NAVBAR_HEIGHT,                    // mulai setelah navbar
          width: SIDEBAR_WIDTH,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          backgroundColor: SIDEBAR_COLOR
        }}
      >
        <div className="px-9 py-9 flex justify-center">
          <img src="/icons/logo.png" alt="logo" className="h-23 object-contain" />
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/mahasiswa/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition ${
                  pathname?.startsWith('/mahasiswa/dashboard')
                    ? 'bg-white text-black font-medium'
                    : 'hover:bg-[#B9D8FF] hover:text-black'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Halaman Utama</span>
              </Link>
            </li>

            <li>
              <Link
                href="/mahasiswa/bimbingan"
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition ${
                  pathname?.startsWith('/mahasiswa/bimbingan')
                    ? 'bg-white text-black font-medium'
                    : 'hover:bg-[#B9D8FF] hover:text-black'
                }`}
              >
                <CalendarDays className="w-5 h-5" />
                <span>Bimbingan</span>
              </Link>
            </li>

            <li>
              <Link
                href="/mahasiswa/TA"
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition ${
                  pathname?.startsWith('/mahasiswa/TA')
                    ? 'bg-white text-black font-medium'
                    : 'hover:bg-[#B9D8FF] hover:text-black'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Tugas Akhir</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div
          className="px-6 py-4 text-sm text-center"
          style={{ borderTop: `1px solid ${SIDEBAR_BORDER}`, backgroundColor: SIDEBAR_COLOR }}
        >
          <Link href="https://www.polibatam.ac.id/" className="underline">
            About us
          </Link>
        </div>
      </aside>

      {/* === Konten Halaman === */}
      <main
        className="bg-gray-50 min-h-screen"
        style={{
          paddingTop: NAVBAR_HEIGHT + 32,          // spasi di bawah navbar (64 + 32px padding)
          marginLeft: SIDEBAR_WIDTH,
          paddingLeft: 32,
          paddingRight: 32,
          paddingBottom: 32
        }}
      >
        {children}
      </main>
    </div>
  );
}
