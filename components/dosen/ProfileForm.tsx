'use client';

import { User } from 'lucide-react';

// Data Dummy
const initialData = {
  nama: 'Dr. Budi Santoso',
  nik: '197501012003121001',
  prodi: 'D3 Teknik Informatika',
  email: 'budi.santoso@poltek.ac.id',
  noTelp: '0812-3456-7890',
};

export const ProfileForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Data Berhasil Diubah! (Simulasi)');
  };

  const InputField = ({ label, value, name }: { label: string, value: string, name: string }) => (
    <div className="mb-4">
      <label className="block text-gray-700 font-serif font-medium mb-1">{label}</label>
      <input
        type="text"
        name={name}
        defaultValue={value}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex gap-10">
      
      {/* Bagian Kiri: Avatar */}
      <div className="flex-shrink-0 pt-10">
        <div className="w-40 h-40 bg-gray-300 rounded-full flex items-center justify-center border-4 border-gray-200">
          <User className="w-24 h-24 text-gray-500" />
        </div>
      </div>

      {/* Bagian Kanan: Form Data Card */}
      <div className="flex-grow bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-lg">
        <div className="space-y-4">
          
          <InputField label="Nama" value={initialData.nama} name="nama" />
          <InputField label="NIK" value={initialData.nik} name="nik" />
          <InputField label="Program Studi" value={initialData.prodi} name="prodi" />
          <InputField label="Email" value={initialData.email} name="email" />
          <InputField label="No Telp" value={initialData.noTelp} name="noTelp" />
          
        </div>

        {/* Tombol Ubah */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-150 shadow-md shadow-blue-300"
          >
            Ubah
          </button>
        </div>
      </div>
    </form>
  );
};