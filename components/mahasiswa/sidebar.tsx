"use client";
import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
  return (
    <div className="p-6 flex flex-col h-full p-6 bg-blue-900 text-white">
      <div className="mb-6 flex justify-center">
        <Image
          src="/logo.png"         
          alt="Logo"
          width={150}          
          height={150}
          className="object-contain"
        />
      </div>

      <nav className="space-y-2">
        <Link href="/mahasiswa/dashboard" className="block py-5 px-3 rounded hover:bg-white/10">Halaman Utama</Link>
        <Link href="/" className="block py-5 px-3 rounded hover:bg-white/10">Bimbingan</Link>
        <Link href="#" className="block py-5 px-3 rounded hover:bg-white/10">Tugas Akhir</Link>
      </nav>    

     {/* About us di bawah */}
      <div className="mt-69 pt-4 text-sm text-white border-t border-white/30">
        About us
      </div>
    </div>
  );
}
