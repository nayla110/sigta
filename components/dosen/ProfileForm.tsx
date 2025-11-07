'use client';

import { User } from "lucide-react";

const dosen = {
  nama: "Noper Ardi, S.Pd., M.Eng",
  nik: "122277",
  prodi: "Teknologi Rekayasa Perangkat Lunak",
  email: "budi.santoso@poltek.ac.id",
  noTelp: "085376166392",
};

export default function ProfileForm() {
  const handleEdit = () => {
    alert("Fitur edit masih simulasi.");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-serif">
      <h1 className="text-2xl font-semibold mb-6">Profil Dosen</h1>

      <div className="flex gap-8 bg-white shadow-lg p-6 rounded-lg border border-gray-200">
        
        {/* Foto Profil */}
        <div className="w-48 h-60 bg-gray-200 rounded-md overflow-hidden">
          <img
            src="/icons/dosen.png"
            alt="Foto Profil"
            className="w-full h-full object-cover"
          />
        </div>

        {/* DATA DOSEN */}
        <div className="flex-1">
          <table className="table-auto w-full text-sm">
            <tbody>
              <tr className="border-b">
                <td className="py-3 font-medium w-40">Nama</td>
                <td className="px-2">:</td>
                <td>{dosen.nama}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium">NIK</td>
                <td className="px-2">:</td>
                <td>{dosen.nik}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium">Program Studi</td>
                <td className="px-2">:</td>
                <td>{dosen.prodi}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium">Email</td>
                <td className="px-2">:</td>
                <td>{dosen.email}</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">No. Telp</td>
                <td className="px-2">:</td>
                <td>{dosen.noTelp}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
