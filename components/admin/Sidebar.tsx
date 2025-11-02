"use client";

import Link from "next/link";
import {
  FaHome,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUsers,
} from "react-icons/fa";

export default function Sidebar() {
  const menuItems = [
    { name: "Halaman Utama", href: "/admin/dashboard", icon: <FaHome /> },
    { name: "Mahasiswa", href: "/admin/mahasiswa", icon: <FaGraduationCap /> },
    { name: "Dosen", href: "/admin/dosen", icon: <FaChalkboardTeacher /> },
    { name: "Daftar Pengguna", href: "/admin/pengguna", icon: <FaUsers /> },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-[250px] bg-[#1d4f91] text-white flex flex-col justify-between shadow-lg">
      <div>
        <div className="py-6 text-center border-b border-white/20">
          <h1 className="text-xl font-bold tracking-wide">Admin Panel</h1>
        </div>

        <nav className="mt-6">
          <ul className="flex flex-col gap-2 px-4">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#305ea8] transition duration-200"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="text-center mb-6 text-sm text-white/70">
        <p>© 2025 Sistem Akademik</p>
        <p className="hover:text-white transition">About us</p>
      </div>
    </aside>
  );
}
