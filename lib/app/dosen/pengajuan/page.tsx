import { SubmissionTable } from '@/components/dosen/SubmissionTable';
import { FileText } from 'lucide-react';

export default function PengajuanBimbinganPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center font-serif">
        <FileText className="w-8 h-8 mr-3 text-blue-700" />
        Pengajuan Bimbingan Mahasiswa
      </h2>

      {/* Komponen Tabel Pengajuan */}
      <SubmissionTable />
    </div>
  );
}