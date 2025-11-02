"use client";

import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";

export default function AddBeritaButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/admin/tambah-berita")}
      className="group flex items-center gap-2 bg-gradient-to-r from-[#5ba6ff] to-[#3c8efc] text-white font-semibold px-5 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
    >
      <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition">
        <FaPlus className="text-white text-sm" />
      </div>
      <span className="tracking-wide">Tambahkan Berita Utama</span>
    </button>
  );
}
