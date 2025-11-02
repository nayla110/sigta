"use client";

type Berita = {
  id: number;
  judul: string;
  tanggal: string;
};

type BeritaTableProps = {
  data: Berita[];
};

export default function BeritaTable({ data }: BeritaTableProps) {
  return (
    <div className="overflow-x-auto mt-6 rounded-2xl shadow-lg border border-blue-100 bg-white">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-gradient-to-r from-[#5ba6ff] to-[#3c8efc] text-white">
          <tr>
            <th className="py-3 px-4 text-left font-semibold">Berita Utama</th>
            <th className="py-3 px-4 text-left font-semibold">Tanggal</th>
            <th className="py-3 px-4 text-center font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-blue-50 transition duration-200 border-b last:border-none"
              >
                <td className="py-3 px-4">{item.judul}</td>
                <td className="py-3 px-4">{item.tanggal}</td>
                <td className="py-3 px-4 text-center">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-3 py-1.5 rounded-lg transition-all duration-200 shadow-sm mx-1">
                    Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1.5 rounded-lg transition-all duration-200 shadow-sm mx-1">
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="py-6 text-center text-gray-500 italic">
                Belum ada berita ditambahkan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
