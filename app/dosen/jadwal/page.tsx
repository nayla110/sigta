// app/dosen/jadwal/page.tsx

'use client';

import React from 'react';
// Import Calendar dari lokasi yang benar
import { Calendar } from '@/components/dosen/Calendar'; 

// Halaman ini hanya akan merender konten utama (kalender),
// karena Sidebar dan Header diasumsikan sudah ada di layout.tsx.

const JadwalBimbinganPage = () => {
    return (
      
        // Hapus div wrapper h-screen, Sidebar, dan Header.
        // Halaman ini hanya berisi konten yang akan diisi ke dalam layout.

        <main className="flex-1 p-6 md:p-8">
            
            {/* Component Calendar (Full-Featured) akan ditampilkan di sini. */}
            <div className="bg-white p-6 shadow-xl rounded-xl">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center font-serif">

        Jadwal Bimbingan
      </h2>
                <Calendar />
            </div>

            {/* Jika Anda perlu menampilkan kartu-kartu kecil seperti di dashboard:
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <DashboardCard title="Total Bimbingan Bulan Ini" value="12" />
                <DashboardCard title="Mahasiswa Menunggu Konfirmasi" value="3" />
            </div>
            */}
        </main>
    );
};

export default JadwalBimbinganPage;