import React from 'react';
import { GoBellFill } from 'react-icons/go';

const Header = () => {
  return (
    // Fixed header dengan warna biru gelap agar kontras dengan teks putih "Selamat Datang"
    <header className="fixed top-0 left-0 w-full h-16 bg-blue-800 text-white flex items-center px-8 z-20 shadow-md">
      <div className="flex justify-between items-center w-full ml-64"> {/* Margin kiri untuk menyeimbangkan sidebar */}
        <h1 className="text-3xl font-gentium font-medium" style={{ color: '#dbe9ff' }}>Selamat Datang</h1>
        <div className="relative cursor-pointer">
          {/* Ikon Notifikasi (warna merah/oranye untuk badge) */}
          <GoBellFill size={30} className="text-yellow-400" />
          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-blue-800 bg-red-500"></span>
        </div>
      </div>
    </header>
  );
};

export default Header;