"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm">
      <h2 className="text-xl font-medium">Dashboard Mahasiswa</h2>

      <div className="flex items-center gap-6 relative">
        {/* Notifikasi */}
        <button className="relative text-2xl">
          🔔
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            1
          </span>
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-xl">
              👤
            </div>
          </button>

          {openDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-md py-2">
              <Link href="/mahasiswa/profil" className="block px-4 py-2 hover:bg-gray-100">Profil</Link>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">Keluar</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
