'use client'; 

import Link from 'next/link';
import { Home, FileText, CalendarDays, BookOpen } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

// Logo Component
const Logo = () => (
    <div className="flex items-center justify-center p-4">
        <Image
            src="/logo-sigta.png"
            alt="Logo SIGTA"
            width={94}
            height={694}
            className="object-contain" 
        />
    </div>
);

const navItems = [
  { icon: Home, label: 'Halaman Utama', href: '/dosen/dashboard' },
  { icon: FileText, label: 'Pengajuan', href: '/dosen/pengajuan' },
  { icon: CalendarDays, label: 'Jadwal Bimbingan', href: '/dosen/jadwal' },
  { icon: BookOpen, label: 'Dokumen Tugas Akhir', href: '/dosen/dokumen' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  const isDashboardActive = pathname === '/dosen/dashboard' || pathname === '/dosen';

  return (
    <aside className="w-64 bg-blue-300 text-black shadow-xl flex flex-col justify-between z-10 font-serif min-h-full">
      
      {/* Logo */}
      <div className="p-4 pt-8 text-center">
        <Logo />
      </div>

      {/* Navigation Menu */}
      <div className="pt-2 flex-1 flex flex-col px-3 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
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
      
      {/* About Us Link */}
      <div className="p-4 text-center">
        <Link href="https://www.polibatam.ac.id/" className="underline hover:text-blue-700">
          About us
        </Link>
      </div>
    </aside>
  );
};