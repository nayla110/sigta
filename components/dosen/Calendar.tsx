// components/dosen/Calendar.tsx

'use client';

import React from 'react';

// Fungsi untuk mendapatkan nama hari (Dimulai dari Sun, sesuai screenshot)
const getDayNames = () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Data hari yang mereplikasi tampilan Oktober 2025 di screenshot Anda
const calendarData = [
    { day: 28, isCurrentMonth: false }, { day: 29, isCurrentMonth: false }, { day: 30, isCurrentMonth: false }, // September
    { day: 1, isCurrentMonth: true }, { day: 2, isCurrentMonth: true }, { day: 3, isCurrentMonth: true }, { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true }, { day: 6, isCurrentMonth: true }, { day: 7, isCurrentMonth: true }, { day: 8, isCurrentMonth: true }, { day: 9, isCurrentMonth: true }, { day: 10, isCurrentMonth: true }, { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true }, { day: 13, isCurrentMonth: true }, { day: 14, isCurrentMonth: true }, { day: 15, isCurrentMonth: true }, { day: 16, isCurrentMonth: true }, { day: 17, isCurrentMonth: true }, { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true }, { day: 20, isCurrentMonth: true }, { day: 21, isCurrentMonth: true }, { day: 22, isCurrentMonth: true }, { day: 23, isCurrentMonth: true }, { day: 24, isCurrentMonth: true }, { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true }, { day: 27, isCurrentMonth: true }, { day: 28, isCurrentMonth: true }, { day: 29, isCurrentMonth: true }, { day: 30, isCurrentMonth: true, isHighlighted: true }, // Highlighted: 30
    { day: 31, isCurrentMonth: true, isToday: true }, // Today: 31
    { day: 1, isCurrentMonth: false }, // November
];

// Komponen untuk setiap kotak hari
const DayCell = ({ day, isCurrentMonth, isHighlighted, isToday }: { day: number, isCurrentMonth: boolean, isHighlighted?: boolean, isToday?: boolean }) => {
    const baseClasses = "border border-gray-200 h-24 p-1 transition-all text-right text-sm hover:bg-blue-50";
    let colorClasses = isCurrentMonth ? "text-gray-900" : "text-gray-400 bg-gray-50";
    let highlightClasses = isHighlighted ? "bg-blue-100/70" : "";
    let todayClasses = isToday ? "font-bold border-b-2 border-blue-600" : ""; // Mencontoh style bold pada 31

    return (
        <div className={`${baseClasses} ${colorClasses} ${highlightClasses} ${todayClasses}`}>
            {day}
        </div>
    );
};


export const Calendar = () => {
    return (
        <div className="w-full bg-white font-sans">
            

            {/* Navigasi Kalender (Today, Back, Next & Month/Week/Day) */}
            <div className="flex justify-between items-center border-b pb-2 mb-2">
                
                {/* Tombol Aksi */}
                <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm border rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                        Today
                    </button>
                    <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 transition-colors">
                        Back
                    </button>
                    <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 transition-colors">
                        Next
                    </button>
                </div>
                
                {/* Nama Bulan */}
                <span className="text-base md:text-lg font-semibold text-gray-700">
                    October 2025
                </span>
                
                {/* Tombol View */}
                <div className="flex text-sm border rounded-lg overflow-hidden">
                    <button className="px-3 py-1 bg-gray-200 text-gray-800 font-medium">
                        Month
                    </button>
                    <button className="px-3 py-1 hover:bg-gray-100">
                        Week
                    </button>
                    <button className="px-3 py-1 hover:bg-gray-100">
                        Day
                    </button>
                    <button className="px-3 py-1 hover:bg-gray-100">
                        Agenda
                    </button>
                </div>
            </div>

            {/* Grid Kalender */}
            <div className="w-full">
                
                {/* Nama Hari */}
                <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-600 border-b border-gray-300">
                    {getDayNames().map(name => (
                        <div key={name} className="py-2">
                            {name}
                        </div>
                    ))}
                </div>

                {/* Grid Tanggal */}
                <div className="grid grid-cols-7 border-t border-l border-gray-200">
                    {calendarData.map((data, index) => (
                        <DayCell
                            key={index}
                            day={data.day}
                            isCurrentMonth={data.isCurrentMonth}
                            isHighlighted={data.isHighlighted}
                            isToday={data.isToday}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};