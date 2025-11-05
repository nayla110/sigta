interface DashboardCardProps {
  prodi: string;
  total: number;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ prodi, total }) => {
  return (
    // Styling bersih. Lebar dikontrol oleh grid di page.tsx
    <div className="bg-gray-100 p-8 rounded-2xl shadow-lg text-center border border-gray-200">
      <h3 className="text-xl font-serif font-bold text-gray-700 mb-4">
        Total Mahasiswa Bimbingan {prodi}
      </h3>
      <p className="text-7xl font-serif font-extrabold text-gray-800">{total}</p>
    </div>
  );
};