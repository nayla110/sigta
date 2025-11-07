import { MdHdrStrong } from "react-icons/md";

export default function ProfilMahasiswa() {
  const mahasiswa = {
    nama: "Arwan Pradipta",
    nis: "3312411070",
    prodi: "Teknik Informatika``",
    waliDosen: "Dwi Amalia Purnamasari, S.T., M.Cs.",
    email: "arwan123@gmail.com",
    telp: "081932415561",
    foto: "icons/mhs.png",
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Profil Mahasiswa</h1>

      <div className="flex gap-8 bg-white shadow p-6 rounded-lg">
        {/* Foto Profil */}
        <div className="w-48 h-60 bg-gray-200 rounded-md overflow-hidden">
          <img
            src="/icons/mhs.png"
            alt="Foto Profil"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Data Diri */}
        <div className="flex-1">
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <td className="py-2 font-medium">Nama</td>
                <td className="px-2">:</td>
                <td>{mahasiswa.nama}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">NIS</td>
                <td className="px-2">:</td>
                <td>{mahasiswa.nis}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Program Studi</td>
                <td className="px-2">:</td>
                <td>{mahasiswa.prodi}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Wali Dosen</td>
                <td className="px-2">:</td>
                <td>{mahasiswa.waliDosen}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Email</td>
                <td className="px-2">:</td>
                <td>{mahasiswa.email}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">No. Telp</td>
                <td className="px-2">:</td>
                <td>{mahasiswa.telp}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
