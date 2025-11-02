"use client";
import Sidebar from "../../components/mahasiswa/sidebar";
import Header from "../../components/mahasiswa/header";

export default function MahasiswaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar kiri */}
      <Sidebar />

      {/* Konten utama kanan */}
      <div className="flex-1 flex flex-col">
        {/* Header atas */}
        <Header />

        {/* Isi halaman */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
