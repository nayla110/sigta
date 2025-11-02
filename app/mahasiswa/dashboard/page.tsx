import Card from '../../../components/mahasiswa/card';
import Image from "next/image";
export default function DashboardPage() {
  // contoh data statis (nanti ganti fetch API)
  const aktivitas = [
    "Dosen Noper Ardi, S.Pd., M.Eng memberikan komentar BAB I (1 jam lalu)",
    "Mengunggah BAB II (2 hari lalu)",
    "Jadwal Bimbingan Disetujui (3 hari lalu)",
  ];

  const jadwal = [
    { text: "Kamis, 18 Oktober 2025, 10.00 AM", room: "Ruangan TA.702" },
    { text: "Selasa, 24 Oktober 2025, 13.00 AM", room: "Ruangan GU805" },
  ];

  const dosen = {
    nama: "Noper Ardi, S.Pd., M.Eng",
    nik: "122277",
    prodi: "Teknologi Rekayasa Perangkat Lunak",
    telp: "085376166392",
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <Card title="Aktivitas Terbaru">
            <ul className="list-disc pl-4 space-y-2">
              {aktivitas.map((a, i) => <li key={i}>{a}</li>)}
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

        <div className="">
          <Card title="Informasi Dosen Pembimbing">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {/* letakkan file avatar di public/avatar-placeholder.png */}
                <Image src="/logo.png" alt="profil" width={80} height={80} />
              </div>
              <div className="mt-10 w-full text-sm space-y-2 ">
      <div className="flex">
        <span className="w-20 font-semibold">Nama</span>
        <span className="mr-2">:</span>
        <span>{dosen.nama}</span>
      </div>
      <div className="flex">
        <span className="w-20 font-semibold">NIK</span>
        <span className="mr-2">:</span>
        <span>{dosen.nik}</span>
      </div>
      <div className="flex">
        <span className="w-20 font-semibold">Prodi</span>
        <span className="mr-2">:</span>
        <span>{dosen.prodi}</span>
      </div>
      <div className="flex">
        <span className="w-20 font-semibold">Telp</span>
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
