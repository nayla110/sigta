export default function ProfilMahasiswa() {
  const mahasiswa = {
    nama: "Budi Santoso",
    nis: "123456",
    prodi: "Teknologi Rekayasa Perangkat Lunak",
    waliDosen: "Noper Ardi, S.Pd., M.Eng",
    email: "budi@email.com",
    telp: "085312345678",
    foto: "/avatar-placeholder.png",
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Profil Mahasiswa</h1>

      <div className="flex gap-8 bg-white shadow p-6 rounded-lg">
        {/* Foto Profil */}
        <div className="w-48 h-60 bg-gray-200 rounded-md overflow-hidden">
          <img src="/mahasiswa.foto.jpg" alt="Foto Profil" className="w-full h-full object-cover" />
        </div>

        {/* Data Diri */}
        <div className="flex-1">
          <table className="table-auto w-full">
            <tbody>
              <tr><td className="py-2 font-medium">Nama</td><td>:</td><td>{mahasiswa.nama}</td></tr>
              <tr><td className="py-2 font-medium">NIS</td><td>:</td><td>{mahasiswa.nis}</td></tr>
              <tr><td className="py-2 font-medium">Program Studi</td><td>:</td><td>{mahasiswa.prodi}</td></tr>
              <tr><td className="py-2 font-medium">Wali Dosen</td><td>:</td><td>{mahasiswa.waliDosen}</td></tr>
              <tr><td className="py-2 font-medium">Email</td><td>:</td><td>{mahasiswa.email}</td></tr>
              <tr><td className="py-2 font-medium">No. Telp</td><td>:</td><td>{mahasiswa.telp}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
