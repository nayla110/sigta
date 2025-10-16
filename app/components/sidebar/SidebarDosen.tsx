import React from 'react';
import { GoHome, GoFile, GoCalendar, GoBook } from 'react-icons/go';
import Link from 'next/link';

const SidebarDosen = () => {
  // Data navigasi Dosen
  const navItems = [
    { label: 'Halaman Utama', href: '/dosen/dashboard', icon: GoHome, active: true },
    { label: 'Pengajuan', href: '/dosen/pengajuan', icon: GoFile, active: false },
    { label: 'Jadwal Bimbingan', href: '/dosen/jadwal', icon: GoCalendar, active: false },
    { label: 'Dokumen Tugas Akhir', href: '/dosen/dokumen', icon: GoBook, active: false },
  ];

  return (
    // Sidebar tetap (fixed) dengan warna biru
    <div className="w-64 h-screen fixed top-0 left-0 bg-blue-600 text-white flex flex-col justify-between shadow-xl z-10">
      <div className="p-4 pt-20 space-y-2"> {/* Padding atas disesuaikan agar tidak tertimpa header */}
        {navItems.map((item) => (
            <Link 
                key={item.label}
                href={item.href} 
                className={`flex items-center p-3 text-lg font-medium transition-colors rounded-lg 
                ${item.active ? 'bg-blue-700 text-white shadow-inner' : 'text-blue-100 hover:bg-blue-500'}
                `}
            >
                <item.icon size={24} className="mr-3" />
                <span>{item.label}</span>
            </Link>
        ))}
      </div>
      <div className="p-4 text-sm text-center text-blue-200">
        About us
      </div>
    </div>
  );
};

export default SidebarDosen;