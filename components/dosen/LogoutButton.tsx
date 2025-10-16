'use client';

export const LogoutButton = () => {
  const handleLogout = () => {
    // Implementasi logika logout di sini
    console.log('Logging out...');
    alert('Anda telah keluar (Logout Simulasi)');
    // Contoh: window.location.href = '/login';
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-150 shadow-md text-sm" // Tambahkan text-sm agar lebih ringkas
    >
      Logout
    </button>
  );
};