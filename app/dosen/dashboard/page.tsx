'use client';

import { useEffect, useState } from 'react';
import { DashboardCard } from '@/components/dosen/DashboardCard';
import { Calendar } from '@/components/dosen/Calendar';
import { dosenAPI } from '@/lib/api';

interface MahasiswaStats {
  IF: number;
  TRPL: number;
}

export default function DosenDashboardPage() {
  const [stats, setStats] = useState<MahasiswaStats>({ IF: 0, TRPL: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await dosenAPI.getMahasiswaBimbingan();
      
      if (response.success) {
        // Hitung jumlah mahasiswa per prodi
        const mahasiswaList = response.data;
        const ifCount = mahasiswaList.filter((m: any) => 
          m.program_studi_kode === 'IF'
        ).length;
        const trplCount = mahasiswaList.filter((m: any) => 
          m.program_studi_kode === 'TRPL'
        ).length;

        setStats({ IF: ifCount, TRPL: trplCount });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center text-gray-600">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8"> 
      {/* Card Section: Grid 2 kolom */}
      <section className="grid grid-cols-2 gap-6">
        <DashboardCard prodi="IF" total={stats.IF} />
        <DashboardCard prodi="TRPL" total={stats.TRPL} />
      </section>

      {/* Calendar Section */}
      <section className="pt-4">
        <div className="w-full mx-auto"> 
          <Calendar />
        </div>
      </section>
    </div>
  );
}