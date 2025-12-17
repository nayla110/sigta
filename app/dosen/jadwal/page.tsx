'use client';

import React from 'react';
import { Calendar } from '@/components/dosen/Calendar';

const JadwalBimbinganPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 font-serif mb-2">
          Jadwal Bimbingan
        </h2>
        <p className="text-gray-600">
          Kalender menampilkan jadwal bimbingan yang telah disetujui
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <Calendar />
      </div>
    </div>
  );
};

export default JadwalBimbinganPage;