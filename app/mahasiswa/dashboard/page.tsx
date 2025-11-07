'use client';
import { useState } from 'react';
import Card from '../../../components/mahasiswa/card';
import Image from 'next/image';
import { User } from 'lucide-react';

export default function DashboardPage() {
  const aktivitas = [
    'Dosen Noper Ardi, S.Pd., M.Eng memberikan komentar BAB I (1 jam lalu)',
    'Mengunggah BAB II (2 hari lalu)',
    'Jadwal Bimbingan Disetujui (3 hari lalu)',
  ];

  const jadwal = [
    { text: 'Kamis, 18 Oktober 2025, 10.00 AM', room: 'Ruangan TA.702' },
    { text: 'Selasa, 24 Oktober 2025, 13.00 AM', room: 'Ruangan GU805' },
  ];

  const dosen = {
    nama: 'Noper Ardi, S.Pd., M.Eng',
    nik: '122277',
    prodi: 'Teknologi Rekayasa Perangkat Lunak',
    telp: '085376166392',
  };

  // path foto dosen di folder /public
  const fotoDosen = '/icons/dosen.png';
  const [imgError, setImgError] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      {/* 🔹 Konten utama Dashboard */}
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
              {jadwal.map((j, i) => (
                <div key={i} className="p-3 border rounded">
                  <p className="font-medium">{j.text}</p>
                  <p className="text-sm text-gray-600">{j.room}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card title="Informasi Dosen Pembimbing">
            <div className="flex flex-col items-center text-center">
              {/* Foto dosen bulat + fallback */}
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-200 shadow-md mx-auto bg-gray-100 flex items-center justify-center">
                {!imgError ? (
                  <Image
                    src={fotoDosen}
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
                  <span className="w-24 font-semibold">Telp</span>
                  <span className="mr-2">:</span>
                  <span>{dosen.telp}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
