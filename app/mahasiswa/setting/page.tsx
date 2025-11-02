"use client";
import { useState } from "react";

export default function SettingPage() {
  const [formData, setFormData] = useState({
    nama: "Budi Santoso",
    nis: "123456",
    prodi: "Teknologi Rekayasa Perangkat Lunak",
    email: "budi@email.com",
    telp: "085312345678",
    passwordLama: "",
    passwordBaru: ""
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    alert("Data berhasil disimpan (nanti diganti ke API)");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Pengaturan Akun</h1>
      <form onSubmit={handleSave} className="bg-white shadow p-6 rounded-lg space-y-6">
        
        {/* Ubah Profil */}
        <div>
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">Ubah Profil</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama</label>
              <input name="nama" value={formData.nama} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">NIS</label>
              <input name="nis" value={formData.nis} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Program Studi</label>
              <input name="prodi" value={formData.prodi} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">No. Telepon</label>
              <input name="telp" value={formData.telp} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>
        </div>

        {/* Ubah Password */}
        <div>
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">Ubah Password</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password Lama</label>
              <input type="password" name="passwordLama" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password Baru</label>
              <input type="password" name="passwordBaru" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
