import { ScheduleCard } from '@/components/dosen/ScheduleCard';
import { CalendarDays, Search } from 'lucide-react';

// Data dummy untuk setiap bagian
const dummySchedules = {
  permintaan: [
    { id: 1, tanggal: '08 Maret 2025', waktu: '19.00', nim: '3312411089', nama: 'Elsya Ananda Putri', lokasi: 'Zoom Online', catatan: null },
    { id: 2, tanggal: '08 Maret 2025', waktu: '19.00', nim: '3312411090', nama: 'Budi Hartono', lokasi: 'Zoom Online', catatan: 'Mohon dicek ulang judul' },
  ],
  disetujui: [
    { id: 3, tanggal: '08 Maret 2025', waktu: '19.00', nim: '3312411091', nama: 'Siti Aisyah', lokasi: 'Zoom Online', catatan: 'Bab 1 dan 2 sudah siap' },
    { id: 4, tanggal: '08 Maret 2025', waktu: '19.00', nim: '3312411092', nama: 'Rudi Santoso', lokasi: 'Zoom Online', catatan: 'Siapkan revisi Bab 3' },
  ],
  selesai: [
    { id: 5, tanggal: '08 Maret 2025', waktu: '19.00', nim: '3312411093', nama: 'Taufik Hidayat', lokasi: 'Zoom Online', catatan: 'Lulus dengan nilai A' },
    { id: 6, tanggal: '08 Maret 2025', waktu: '19.00', nim: '3312411094', nama: 'Maya Sari', lokasi: 'Zoom Online', catatan: 'Sudah selesai perbaikan' },
  ],
};

// Komponen Header Section dengan Search Bar di Kanan
const SectionHeader = ({ title, description, placeholder }: { title: string; description: string; placeholder: string }) => (
  <div className="pt-6 border-t border-gray-300">
    <div className="flex justify-between items-start mb-2">
      {/* Judul dan Deskripsi di Kiri */}
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      
      {/* Search Bar di Kanan Atas */}
      <div className="relative w-full max-w-xs">
        <input
          type="text"
          // Ini adalah placeholder untuk demonstrasi. Logika pencarian harus diimplementasikan secara terpisah.
          placeholder={placeholder}
          className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
    </div>
  </div>
);


export default function JadwalBimbinganPage() {
  return (
    <div className="space-y-10">
      {/* Judul Utama Halaman */}
      <h2 className="text-3xl font-bold text-gray-800 flex items-center font-serif mb-4">
        <CalendarDays className="w-8 h-8 mr-3 text-blue-700" />
        Jadwal Bimbingan
      </h2>

      {/* 1. PERMINTAAN (PENDING) */}
      <SectionHeader 
        title="Permintaan" 
        description="Ini adalah semua data permintaan bimbingan" 
        placeholder="Cari data permintaan..."
      />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummySchedules.permintaan.map((data) => (
          <ScheduleCard key={data.id} {...data} initialCatatan={data.catatan} status="Permintaan" />
        ))}
      </section>

      {/* 2. DISETUJUI (APPROVED) */}
      <SectionHeader 
        title="Disetujui" 
        description="Ini adalah semua data bimbingan yang telah disetujui" 
        placeholder="Cari data disetujui..."
      />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummySchedules.disetujui.map((data) => (
          <ScheduleCard key={data.id} {...data} initialCatatan={data.catatan} status="Disetujui" />
        ))}
      </section>

      {/* 3. SELESAI (COMPLETED) */}
      <SectionHeader 
        title="Selesai" 
        description="Ini adalah semua data bimbingan yang telah selesai" 
        placeholder="Cari data selesai..."
      />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummySchedules.selesai.map((data) => (
          <ScheduleCard key={data.id} {...data} initialCatatan={data.catatan} status="Selesai" />
        ))}
      </section>
    </div>
  );
}