'use client';

import { useState, useEffect } from 'react';
import Card from '../../../components/mahasiswa/card';
import Image from 'next/image';
import { User } from 'lucide-react';
import { mahasiswaAPI } from '@/lib/api';

interface DosenInfo {
  nama: string;
  nik: string;
  email: string;
  telp: string;
  prodi: string;
}

interface JadwalBimbingan {
  id: string;
  tanggal: string;
  topik: string;
  status: string;
}

export default function DashboardPage() {
  const [dosen, setDosen] = useState<DosenInfo | null>(null);
  const [jadwalBimbingan, setJadwalBimbingan] = useState<JadwalBimbingan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await mahasiswaAPI.getDashboardData();
      
      if (response.success) {
        const { mahasiswa, jadwal_bimbingan } = response.data;
        
        // Set dosen info
        if (mahasiswa.dosen_nama) {
          setDosen({
            nama: mahasiswa.dosen_nama,
            nik: mahasiswa.dosen_nik || '-',
            email: mahasiswa.dosen_email || '-',
            telp: mahasiswa.dosen_telp || '-',
            prodi: mahasiswa.program_studi_nama || '-'
          });
        }

        // Set jadwal bimbingan
        setJadwalBimbingan(jadwal_bimbingan || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Dummy aktivitas (bisa diganti dengan data real dari backend nanti)
  const aktivitas = [
    'Mengunggah BAB II (2 hari lalu)',
    'Jadwal Bimbingan Disetujui (3 hari lalu)',
  ];

  // Format tanggal
  const formatTanggal = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center text-gray-600">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Konten utama Dashboard */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <Card title="Aktivitas Terbaru">
            <ul className="list-disc pl-4 space-y-2">
              {aktivitas.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </Card>

          <Card title="Jadwal Bimbingan Mendatang">
            <div className="space-y-3">
              {jadwalBimbingan.length > 0 ? (
                jadwalBimbingan.map((jadwal) => (
                  <div key={jadwal.id} className="p-3 border rounded">
                    <p className="font-medium">{jadwal.topik}</p>
                    <p className="text-sm text-gray-600">{formatTanggal(jadwal.tanggal)}</p>
                    <p className="text-xs text-gray-500 mt-1">Status: {jadwal.status}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Belum ada jadwal bimbingan</p>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card title="Informasi Dosen Pembimbing">
            {dosen ? (
              <div className="flex flex-col items-center text-center">
                {/* Foto dosen bulat + fallback */}
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-200 shadow-md mx-auto bg-gray-100 flex items-center justify-center">
                  {!imgError ? (
                    <Image
                      src="/icons/dosen.png"
                      alt="Foto Dosen Pembimbing"
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                      priority
                    />
                  ) : (
                    <User className="w-14 h-14 text-gray-400" />
                  )}
                </div>

                <div className="mt-10 w-full text-sm space-y-2">
                  <div className="flex">
                    <span className="w-24 font-semibold">Nama</span>
                    <span className="mr-2">:</span>
                    <span>{dosen.nama}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-semibold">NIK</span>
                    <span className="mr-2">:</span>
                    <span>{dosen.nik}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-semibold">Prodi</span>
                    <span className="mr-2">:</span>
                    <span>{dosen.prodi}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-semibold">Email</span>
                    <span className="mr-2">:</span>
                    <span className="text-xs">{dosen.email}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-semibold">Telp</span>
                    <span className="mr-2">:</span>
                    <span>{dosen.telp}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center">Belum ada dosen pembimbing</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}