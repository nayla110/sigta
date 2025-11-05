// components/Shared/Logo.tsx

import Image from 'next/image';

// Komponen ini digunakan untuk menampilkan logo dan judul SIGTA.
// Menggunakan height 80 dan width 80 (atau yang Anda inginkan)
// Diletakkan di Shared agar bisa digunakan di tempat lain jika perlu.
export const Logo = () => (
    <div className="flex flex-col items-center justify-center p-4">
        <Image
            src="/logo-sigta.png" // Pastikan ini path yang benar ke file logo Anda
            alt="Logo SIGTA"
            width={72} 
            height={72}
            className="object-contain" 
        />
        <h1 className="text-xl font-bold mt-2">SIGTA</h1>
    </div>
);