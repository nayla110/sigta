'use client'; 

import Link from 'next/link';
import { Home, User, CalendarDays, BookOpen, FileText } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';


// Asumsi: Logo diletakkan di public/logo-sigta.png
// Kita akan membuat komponen Logo-nya di dalam file Sidebar ini agar tidak perlu import dari Shared
const Logo = () => (
    <div className="flex items-center justify-center p-4">
        <Image
            src="/logo-sigta.png" // Path ke file logo Anda di folder public
            alt="Logo SIGTA"
            width={94}
            height={694}
            className="object-contain" 
        />
    </div>
);

const navItems = [
    // Halaman Utama
    // Menggunakan ikon Home dan label 'Halaman Utama'
    { icon: Home, label: 'Halaman Utama', href: '/admin/dashboard' },
    // Mahasiswa
    // Menggunakan ikon User (atau ikon lain yang relevan) dan label 'Mahasiswa'
    { icon: User, label: 'Mahasiswa', href: '/admin/mahasiswa' },
    // Dosen
    // Menggunakan ikon User (atau ikon lain yang relevan) dan label 'Dosen'
    { icon: User, label: 'Dosen', href: '/admin/dosen' },
    // Daftar Pengguna
    // Menggunakan ikon User (atau ikon lain yang lebih sesuai, seperti UserGroup jika ada) dan label 'Daftar Pengguna'
    { icon: User, label: 'Daftar Pengguna', href: '/admin/pengguna' },
];


export const Sidebar = () => {
  const pathname = usePathname();

  // Fungsi pengecekan khusus untuk Dashboard karena bisa diakses via '/dosen' atau '/dosen/dashboard'
  const isDashboardActive = pathname === '/admin/dashboard' || pathname === '/admin';
  // Pengecekan untuk Profile
  const isProfileActive = pathname.startsWith('/admin/profile');

  return (
    // Menggunakan flex-shrink-0 dan min-h-full agar sidebar mengikuti layout di bawah header
    <aside className="w-64 bg-blue-300  text-black shadow-xl flex flex-col justify-between z-10 font-serif min-h-full">
      
      {/* Logo/Nama Aplikasi */}
      <div className="p-4 pt-8 text-center">
        {/* --- PENAMBAHAN KODE: PENGGUNAAN KOMPONEN LOGO --- */}
        <Logo />
      </div>

      <div className="pt-2 flex-1 flex flex-col px-3 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          // Tentukan status aktif
          const isActive = item.href === '/dosen/dashboard' ? isDashboardActive : pathname.startsWith(item.href);

          return (
            <Link 
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition 
                ${isActive 
                  ? 'bg-white text-black font-medium'
                    : 'hover:bg-blue-200 hover:text-black'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        
      </div>
      
      {/* About Us Placeholder */}
      <Link href="https://www.polibatam.ac.id/" className="underline">
            About us
          </Link>
    </aside>
  );
};