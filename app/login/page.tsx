export default function LoginPage() {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center font-sans"
      style={{
        backgroundImage: "url('/deab004c-dd02-4817-8172-1be704cef392.jpg')",
      }}
    >
      {/* Overlay gelap transparan */}
      <div className="absolute inset-0 bg-black/50"></div>
      {/* ubah bg-black/50 jadi bg-black/30 kalau mau lebih terang, atau bg-black/70 kalau mau lebih gelap */}

      {/* Card login */}
      <div className="relative z-10 bg-[#b8dcff]/90 w-[400px] rounded-[40px] flex flex-col items-center p-10 justify-center shadow-lg backdrop-blur-sm">
        {/* Logo dan judul */}
        <div className="flex items-center">
          <img src="/logo.png" alt="SigTA Logo" className="w-35 h-35 mb-3" />
        </div>

        {/* Form login */}
        <form className="flex flex-col space-y-5 w-full mt-5">
          {/* Input Nama Pengguna */}
          <div className="bg-white rounded-full shadow-sm">
            <input
              type="text"
              placeholder="Nama Pengguna"
              className="w-full rounded-full py-3 px-5 text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* Input Kata Sandi */}
          <div className="bg-white rounded-full shadow-sm">
            <input
              type="password"
              placeholder="Kata Sandi"
              className="w-full rounded-full py-3 px-5 text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            className="bg-white text-blue-600 font-medium rounded-full py-2 hover:bg-blue-100 transition"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
