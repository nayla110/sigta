import { DashboardCard } from '@/components/dosen/DashboardCard';
import { Calendar } from '@/components/dosen/Calendar';

export default function DosenDashboardPage() {
  return (
    // Membungkus seluruh konten dengan max-w untuk membatasi lebar
    <div className="max-w-5xl mx-auto space-y-8"> 
      {/* Card Section: Grid 2 kolom */}
      <section className="grid grid-cols-2 gap-6">
        <DashboardCard prodi="IF" total={2} />
        <DashboardCard prodi="TRPL" total={5} />
      </section>

      {/* Calendar Section: Tambahkan mx-auto di sini */}
      <section className="pt-4">
        {/* Tambahkan div pembungkus w-full dan mx-auto untuk meratakan Calendar */}
        <div className="w-full mx-auto"> 
          <Calendar />
        </div>
      </section>
    </div>
  );
}