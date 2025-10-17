'use client'; 

import Link from 'next/link';
import { Home, User, CalendarDays, BookOpen, FileText } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  // Halaman Utama
  { icon: Home, label: 'Halaman Utama', href: '/dosen/dashboard' },
  // Pengajuan
  { icon: FileText, label: 'Pengajuan', href: '/dosen/pengajuan' },
  // Jadwal Bimbingan
  { icon: CalendarDays, label: 'Jadwal Bimbingan', href: '/dosen/jadwal' },
  // Dokumen Tugas Akhir
  { icon: BookOpen, label: 'Dokumen Tugas Akhir', href: '/dosen/dokumen' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  // Fungsi pengecekan khusus untuk Dashboard karena bisa diakses via '/dosen' atau '/dosen/dashboard'
  const isDashboardActive = pathname === '/dosen/dashboard' || pathname === '/dosen';
  // Pengecekan untuk Profile
  const isProfileActive = pathname.startsWith('/dosen/profile');

  return (
    // Menggunakan flex-shrink-0 dan min-h-full agar sidebar mengikuti layout di bawah header
    <aside className="w-64 bg-blue-400 flex-shrink-0 text-white shadow-xl flex flex-col justify-between z-10 font-serif min-h-full">
      
      {/* Logo/Nama Aplikasi */}
      <div className="p-4 pt-8 text-center border-b border-blue-400">
        
      </div>
      
      <div className="pt-2 flex-grow">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          // Tentukan status aktif
          const isActive = item.href === '/dosen/dashboard' ? isDashboardActive : pathname.startsWith(item.href);

          return (
            <Link 
              key={item.label}
              href={item.href}
              className={`flex items-center p-4 transition-colors text-lg font-medium 
                ${isActive 
                  ? 'bg-blue-800 border-r-4 border-white font-bold' // Status Aktif
                  : 'hover:bg-blue-600' // Status Hover
                }
              `}
            >
              <Icon className="w-6 h-6 mr-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        
      </div>
      
      {/* About Us Placeholder */}
      <div className="p-4 text-sm text--300 border-t border-blue-400">
        About us
      </div>
    </aside>
  );
};