"use client";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { dosenAPI, programStudiAPI } from "@/lib/api";

interface Dosen {
  id: string;
  nik: string;
  nama: string;
  email: string;
  no_telp: string;
  program_studi_id: string;
  program_studi_nama: string;
}

interface ProgramStudi {
  id: string;
  kode: string;
  nama: string;
  jenjang: string;
}

export default function DosenPage() {
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [prodiList, setProdiList] = useState<ProgramStudi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    email: '',
    password: '',
    no_telp: '',
    program_studi_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [dosenRes, prodiRes] = await Promise.all([
        dosenAPI.getAll(),
        programStudiAPI.getAll()
      ]);

      if (dosenRes.success) setDosenList(dosenRes.data);
      if (prodiRes.success) setProdiList(prodiRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nik: '',
      nama: '',
      email: '',
      password: '',
      no_telp: '',
      program_studi_id: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;
      
      if (editingId) {
        // Update
        response = await dosenAPI.update(editingId, formData);
      } else {
        // Create
        response = await dosenAPI.create(formData);
      }

      if (response.success) {
        alert(response.message);
        resetForm();
        fetchData();
      }
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan');
    }
  };

  const handleEdit = (dosen: Dosen) => {
    setFormData({
      nik: dosen.nik,
      nama: dosen.nama,
      email: dosen.email,
      password: '', // Don't populate password
      no_telp: dosen.no_telp || '',
      program_studi_id: dosen.program_studi_id
    });
    setEditingId(dosen.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus dosen ini?')) {
      return;
    }

    try {
      const response = await dosenAPI.delete(id);
      if (response.success) {
        alert('Dosen berhasil dihapus');
        fetchData();
      }
    } catch (error: any) {
      alert(error.message || 'Gagal menghapus dosen');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f8ff] py-8 px-26 flex items-center justify-center">
        <div className="text-xl text-gray-600">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8ff] py-8 px-26 box-border">
      {/* JUDUL */}
      <h1 className="bg-[#1d4f91] text-white text-center text-2xl font-bold py-4 rounded-t-2xl shadow-sm">
        Kelola Akun Dosen
      </h1>

      {/* TOMBOL TAMBAH */}
      <div className="flex justify-start mt-6 mb-4">
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#cce2ff] hover:bg-[#b3d3ff] text-[#1d4f91] font-semibold px-5 py-2 rounded-xl shadow-sm transition duration-200"
        >
          <FaPlus /> {showForm ? 'Tutup Form' : 'Tambah Akun Dosen'}
        </button>
      </div>

      {/* FORM BOX */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingId ? 'Edit Dosen' : 'Tambah Dosen Baru'}
          </h2>
          
          {/* BARIS 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div className="flex flex-col">
              <label className="font-semibold text-[#2e3c50] mb-2">Nama Dosen</label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:border-[#5b9aff] focus:ring-2 focus:ring-[#5b9aff]/30 outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-[#2e3c50] mb-2">Kata Sandi</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingId}
                placeholder={editingId ? 'Kosongkan jika tidak ingin diubah' : ''}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:border-[#5b9aff] focus:ring-2 focus:ring-[#5b9aff]/30 outline-none"
              />
            </div>
          </div>

          {/* BARIS 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div className="flex flex-col">
              <label className="font-semibold text-[#2e3c50] mb-2">NIK Dosen</label>
              <input
                type="text"
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:border-[#5b9aff] focus:ring-2 focus:ring-[#5b9aff]/30 outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-[#2e3c50] mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:border-[#5b9aff] focus:ring-2 focus:ring-[#5b9aff]/30 outline-none"
              />
            </div>
          </div>

          {/* BARIS 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div className="flex flex-col">
              <label className="font-semibold text-[#2e3c50] mb-2">Program Studi</label>
              <select 
                value={formData.program_studi_id}
                onChange={(e) => setFormData({ ...formData, program_studi_id: e.target.value })}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:border-[#5b9aff] focus:ring-2 focus:ring-[#5b9aff]/30 outline-none"
              >
                <option value="">Pilih Program Studi</option>
                {prodiList.map(prodi => (
                  <option key={prodi.id} value={prodi.id}>
                    {prodi.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-[#2e3c50] mb-2">No Telp</label>
              <input
                type="text"
                value={formData.no_telp}
                onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:border-[#5b9aff] focus:ring-2 focus:ring-[#5b9aff]/30 outline-none"
              />
            </div>
          </div>

          {/* BUTTON GROUP */}
          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button"
              onClick={resetForm}
              className="bg-white border border-gray-400 text-gray-700 font-semibold px-5 py-2 rounded-full hover:bg-gray-100 transition duration-200"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="bg-[#5ba6ff] hover:bg-[#3c8efc] text-white font-semibold px-6 py-2 rounded-full shadow-sm transition duration-200"
            >
              {editingId ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      )}

      {/* TABEL DOSEN */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
        <table className="w-full text-center border-collapse">
          <thead className="bg-[#386bc0] text-white">
            <tr>
              <th className="py-3 px-4 text-sm font-semibold">Nama</th>
              <th className="py-3 px-4 text-sm font-semibold">NIK</th>
              <th className="py-3 px-4 text-sm font-semibold">Program Studi</th>
              <th className="py-3 px-4 text-sm font-semibold">Email</th>
              <th className="py-3 px-4 text-sm font-semibold">No Telp</th>
              <th className="py-3 px-4 text-sm font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dosenList.length === 0 ? (
              <tr className="bg-[#e9eff9] text-gray-700">
                <td className="py-4 px-4" colSpan={6}>
                  Belum ada data dosen
                </td>
              </tr>
            ) : (
              dosenList.map((dosen) => (
                <tr key={dosen.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{dosen.nama}</td>
                  <td className="py-3 px-4">{dosen.nik}</td>
                  <td className="py-3 px-4">{dosen.program_studi_nama}</td>
                  <td className="py-3 px-4">{dosen.email}</td>
                  <td className="py-3 px-4">{dosen.no_telp || '-'}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleEdit(dosen)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dosen.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}