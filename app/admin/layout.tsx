"use client";

import React from "react";
import Link from "next/link";
import {
  FaHome,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUsers,
} from "react-icons/fa";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;           
}) {
  return (
    <div className="min-h-screen flex bg-[#f5f8ff]">
      {/* SIDEBAR */}
      <aside className="fixed top-0 left-0 h-full w-[220px] bg-[#1d4f91] text-black flex flex-col justify-between shadow-lg">
        <div>
         <div className="items-center justify-center">
  <img
    src="/icons/logo.png"
    alt="logo"
    className="w-60 h-25 object-contain"
  />
          </div>

          <nav className="mt-6">
            <ul className="flex flex-col gap-2 px-4">
              <li>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#305ea8] transition duration-200"
                >
                  <FaHome className="text-lg" />
                  <span>Halaman Utama</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/mahasiswa"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#305ea8] transition duration-200"
                >
                  <FaGraduationCap className="text-lg" />
                  <span>Mahasiswa</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/dosen"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#305ea8] transition duration-200"
                >
                  <FaChalkboardTeacher className="text-lg" />
                  <span>Dosen</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/pengguna"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#305ea8] transition duration-200"
                >
                  <FaUsers className="text-lg" />
                  <span>Daftar Pengguna</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

         <div className="px-6 py-4 text-sm opacity-80 text-center">
          <Link href="https://www.polibatam.ac.id/" >About us </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-[250px] flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="flex justify-between items-center bg-white px-10 py-4 shadow-sm border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-700">
            Selamat Datang Admin
          </h1>
          
          <button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium px-4 py-2 rounded-lg shadow-md transition duration-200">
            Keluar
          </button>

        </header>

        {/* MAIN SECTION */}
        <main className="flex-1 p-10 bg-[#f5f8ff]">{children}</main>
      </div>
    </div>
  );
}
