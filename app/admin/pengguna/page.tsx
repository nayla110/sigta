"use client";

import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { mahasiswaAPI, dosenAPI } from "@/lib/api";

interface Mahasiswa {
  id: string;
  nim: string;
  nama: string;
  program_studi_nama: string;
  judul_ta: string;
  dosen_pembimbing_nama: string;
}

interface Dosen {
  id: string;
  nik: string;
  nama: string;
  program_studi_nama: string;
}

export default function DaftarPengguna() {
  const [showMahasiswa, setShowMahasiswa] = useState(true);
  const [showDosen, setShowDosen] = useState(true);
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mahasiswaCounts, setMahasiswaCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [mahasiswaRes, dosenRes] = await Promise.all([
        mahasiswaAPI.getAll(),
        dosenAPI.getAll()
      ]);

      if (mahasiswaRes.success) {
        setMahasiswaList(mahasiswaRes.data);
        
        // Hitung jumlah mahasiswa per dosen
        const counts: Record<string, number> = {};
        mahasiswaRes.data.forEach((mhs: any) => {
          if (mhs.dosen_pembimbing_id) {
            counts[mhs.dosen_pembimbing_id] = (counts[mhs.dosen_pembimbing_id] || 0) + 1;
          }
        });
        setMahasiswaCounts(counts);
      }
      
      if (dosenRes.success) {
        setDosenList(dosenRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 md:p-10 flex items-center justify-center">
        <div className="text-xl text-gray-600">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Daftar Pengguna
        </h1>
        <h2 className="text-lg text-gray-500 text-center mb-10">
          Data Dosen dan Mahasiswa
        </h2>

        {/* === Mahasiswa Section === */}
        <div className="mb-8">
          <button
            onClick={() => setShowMahasiswa(!showMahasiswa)}
            className="flex items-center gap-2 text-lg font-semibold bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition-all"
          >
            <FaChevronDown
              className={`transition-transform duration-300 ${
                showMahasiswa ? "rotate-180" : ""
              }`}
            />
            Mahasiswa ({mahasiswaList.length})
          </button>

          {showMahasiswa && (
            <div className="overflow-x-auto mt-4">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-blue-50">
                  <tr className="text-left text-gray-700">
                    <th className="py-3 px-4 border-b">No</th>
                    <th className="py-3 px-4 border-b">Mahasiswa (NIM)</th>
                    <th className="py-3 px-4 border-b">Program Studi</th>
                    <th className="py-3 px-4 border-b">Judul TA</th>
                    <th className="py-3 px-4 border-b">Dosen Pembimbing</th>
                  </tr>
                </thead>
                <tbody>
                  {mahasiswaList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-6 text-gray-500 italic"
                      >
                        Belum ada data mahasiswa
                      </td>
                    </tr>
                  ) : (
                    mahasiswaList.map((mahasiswa, index) => (
                      <tr key={mahasiswa.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 border-b">{index + 1}</td>
                        <td className="py-3 px-4 border-b">
                          {mahasiswa.nama} ({mahasiswa.nim})
                        </td>
                        <td className="py-3 px-4 border-b">
                          {mahasiswa.program_studi_nama}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {mahasiswa.judul_ta || '-'}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {mahasiswa.dosen_pembimbing_nama || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* === Dosen Section === */}
        <div>
          <button
            onClick={() => setShowDosen(!showDosen)}
            className="flex items-center gap-2 text-lg font-semibold bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg transition-all"
          >
            <FaChevronDown
              className={`transition-transform duration-300 ${
                showDosen ? "rotate-180" : ""
              }`}
            />
            Dosen ({dosenList.length})
          </button>

          {showDosen && (
            <div className="overflow-x-auto mt-4">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-purple-50">
                  <tr className="text-left text-gray-700">
                    <th className="py-3 px-4 border-b">No</th>
                    <th className="py-3 px-4 border-b">Dosen (NIK)</th>
                    <th className="py-3 px-4 border-b">Program Studi</th>
                    <th className="py-3 px-4 border-b">
                      Mahasiswa Bimbingan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dosenList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-6 text-gray-500 italic"
                      >
                        Belum ada data dosen
                      </td>
                    </tr>
                  ) : (
                    dosenList.map((dosen, index) => (
                      <tr key={dosen.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 border-b">{index + 1}</td>
                        <td className="py-3 px-4 border-b">
                          {dosen.nama} ({dosen.nik})
                        </td>
                        <td className="py-3 px-4 border-b">
                          {dosen.program_studi_nama}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {mahasiswaCounts[dosen.id] || 0} mahasiswa
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}