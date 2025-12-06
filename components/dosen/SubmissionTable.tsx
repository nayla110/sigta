'use client';

import { CheckCircle, XCircle } from 'lucide-react';

// Data dummy untuk contoh tabel
const dummySubmissions = [
  {
    no: 1,
    mahasiswa: 'Elsya Ananda Putri (3312411089)',
    prodi: 'D3 Teknik Informatika',
    jenisBimbingan: 'Proposal',
    judulTA: 'Sistem Informasi Absensi Pegawai',
    ruangan: 'Online',
    tanggalWaktu: '2025-10-26, 10:00',
  },
  {
    no: 2,
    mahasiswa: 'Elsya Ananda Putri (3312411089)',
    prodi: 'S2 Teknik Komputer',
    jenisBimbingan: 'TA',
    judulTA: 'Analisis Keamanan Jaringan IoT',
    ruangan: 'Offline (Lab Komputer)',
    tanggalWaktu: '2025-10-27, 14:00',
  },
  {
    no: 3,
    mahasiswa: 'Elsya Ananda Putri (3312411089)',
    prodi: 'S2 Teknik Komputer',
    jenisBimbingan: 'Proposal',
    judulTA: 'Analisis Keamanan Jaringan IoT',
    ruangan: 'Offline (Lab Komputer)',
    tanggalWaktu: '2025-10-27, 14:00',
  },
  {
    no: 4,
    mahasiswa: 'Elsya Ananda Putri (3312411089)',
    prodi: 'S2 Teknik Komputer',
    jenisBimbingan: 'TA',
    judulTA: 'Analisis Keamanan Jaringan IoT',
    ruangan: 'Offline (Lab Komputer)',
    tanggalWaktu: '2025-10-27, 14:00',
  },
  {
    no: 5,
    mahasiswa: 'Elsya Ananda Putri (3312411089)',
    prodi: 'S2 Teknik Komputer',
    jenisBimbingan: 'Proposal',
    judulTA: 'Analisis Keamanan Jaringan IoT',
    ruangan: 'Offline (Lab Komputer)',
    tanggalWaktu: '2025-10-27, 14:00',
  },
];

export default function SubmissionTable() {
  const handleAccept = (submissionId: number) => {
    alert(`Mengajukan persetujuan untuk pengajuan No. ${submissionId}`);
    // TODO: Implementasi logika untuk menerima pengajuan (API call)
  };

  const handleReject = (submissionId: number) => {
    alert(`Mengajukan penolakan untuk pengajuan No. ${submissionId}`);
    // TODO: Implementasi logika untuk menolak pengajuan (API call)
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 max-w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-600">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              NO
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Mahasiswa (NIM)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Program Studi
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Jenis Bimbingan
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Judul TA
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Ruangan
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Tanggal & Waktu
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dummySubmissions.map((submission) => (
            <tr key={submission.no}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{submission.no}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{submission.mahasiswa}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{submission.prodi}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-3 py-1 rounded-full font-medium ${
                  submission.jenisBimbingan === 'Proposal' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {submission.jenisBimbingan}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-800">{submission.judulTA}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{submission.ruangan}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{submission.tanggalWaktu}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAccept(submission.no)}
                    className="text-green-600 hover:text-green-900 transition-colors"
                    title="Terima Pengajuan"
                  >
                    <CheckCircle className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleReject(submission.no)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                    title="Tolak Pengajuan"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}