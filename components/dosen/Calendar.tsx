'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { bimbinganAPI } from '@/lib/api';

interface JadwalBimbingan {
  id: string;
  tanggal: string;
  topik: string;
  status: string;
  catatan: string | null;
  nim: string;
  mahasiswa_nama: string;
  program_studi_nama: string;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  jadwal: JadwalBimbingan[];
}

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jadwalList, setJadwalList] = useState<JadwalBimbingan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    fetchJadwal();
  }, [currentMonth, currentYear]);

  const fetchJadwal = async () => {
    try {
      setIsLoading(true);
      const response = await bimbinganAPI.getDosenJadwalKalender(
        currentMonth + 1, 
        currentYear
      );
      
      if (response.success) {
        setJadwalList(response.data);
      }
    } catch (error) {
      console.error('Error fetching jadwal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const prevLastDay = new Date(currentYear, currentMonth, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    const lastDateOfMonth = lastDay.getDate();
    const prevLastDate = prevLastDay.getDate();

    const days: CalendarDay[] = [];

    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevLastDate - i,
        isCurrentMonth: false,
        jadwal: []
      });
    }

    // Current month days
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const jadwalForDay = jadwalList.filter(j => {
        const jadwalDate = new Date(j.tanggal);
        return jadwalDate.getDate() === i &&
               jadwalDate.getMonth() === currentMonth &&
               jadwalDate.getFullYear() === currentYear;
      });

      days.push({
        date: i,
        isCurrentMonth: true,
        jadwal: jadwalForDay
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        jadwal: []
      });
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day: CalendarDay) => {
    if (day.isCurrentMonth && day.jadwal.length > 0) {
      const clickedDate = new Date(currentYear, currentMonth, day.date);
      setSelectedDate(clickedDate);
      setShowModal(true);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();
  const isToday = (day: CalendarDay) => {
    return day.isCurrentMonth &&
           day.date === today.getDate() &&
           currentMonth === today.getMonth() &&
           currentYear === today.getFullYear();
  };

  const getSelectedDateJadwal = () => {
    if (!selectedDate) return [];
    return jadwalList.filter(j => {
      const jadwalDate = new Date(j.tanggal);
      return jadwalDate.getDate() === selectedDate.getDate() &&
             jadwalDate.getMonth() === selectedDate.getMonth() &&
             jadwalDate.getFullYear() === selectedDate.getFullYear();
    });
  };

  return (
    <div className="w-full bg-white font-sans rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        {/* Navigation */}
        <div className="flex items-center space-x-3">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors font-medium"
          >
            Hari Ini
          </button>
          <button
            onClick={goToPreviousMonth}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Month/Year Display */}
        <h2 className="text-xl font-bold text-gray-800">
          {MONTHS[currentMonth]} {currentYear}
        </h2>

        {/* Loading indicator */}
        <div className="w-24">
          {isLoading && (
            <span className="text-sm text-gray-500">Memuat...</span>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day names */}
        {DAYS.map(day => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const hasJadwal = day.jadwal.length > 0;
          const isTodayDate = isToday(day);

          return (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              className={`
                min-h-[100px] p-2 border border-gray-200 transition-all
                ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-900'}
                ${hasJadwal && day.isCurrentMonth ? 'cursor-pointer hover:bg-blue-50' : ''}
                ${isTodayDate ? 'bg-blue-100 font-bold border-blue-400' : ''}
              `}
            >
              <div className="text-sm mb-1">{day.date}</div>
              
              {/* Jadwal indicators */}
              {day.isCurrentMonth && day.jadwal.length > 0 && (
                <div className="space-y-1">
                  {day.jadwal.slice(0, 2).map((jadwal, idx) => (
                    <div
                      key={idx}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded truncate"
                      title={`${jadwal.mahasiswa_nama} - ${jadwal.topik}`}
                    >
                      {formatTime(jadwal.tanggal)} - {jadwal.mahasiswa_nama}
                    </div>
                  ))}
                  {day.jadwal.length > 2 && (
                    <div className="text-xs text-blue-600 font-semibold">
                      +{day.jadwal.length - 2} lainnya
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Detail Jadwal */}
      {showModal && selectedDate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                Jadwal Bimbingan - {selectedDate.toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {getSelectedDateJadwal().length === 0 ? (
                <p className="text-center text-gray-500">Tidak ada jadwal</p>
              ) : (
                <div className="space-y-4">
                  {getSelectedDateJadwal().map((jadwal) => (
                    <div
                      key={jadwal.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">
                            {jadwal.mahasiswa_nama}
                          </h4>
                          <p className="text-sm text-gray-600">
                            NIM: {jadwal.nim} | {jadwal.program_studi_nama}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-blue-600">
                          {formatTime(jadwal.tanggal)}
                        </span>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Topik:</span> {jadwal.topik}
                        </p>
                        {jadwal.catatan && (
                          <p className="text-sm text-gray-700 mt-2">
                            <span className="font-semibold">Catatan:</span> {jadwal.catatan}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          {jadwal.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};