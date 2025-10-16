import React from 'react';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';

// Data dummy untuk Kalender
const calendarDays = [
  { day: '29', disabled: true }, { day: '30', disabled: true }, { day: '31', disabled: true },
  { day: '1', disabled: false }, { day: '2', disabled: false }, { day: '3', disabled: false }, { day: '4', disabled: false },
  { day: '5', disabled: false }, { day: '6', disabled: false }, { day: '7', disabled: false },
  { day: '8', disabled: false }, { day: '9', disabled: false }, { day: '10', disabled: false }, { day: '11', disabled: false },
  { day: '12', disabled: false }, { day: '13', disabled: false }, { day: '14', disabled: false },
  { day: '15', disabled: false }, { day: '16', disabled: false }, { day: '17', disabled: false }, { day: '18', disabled: false },
  { day: '19', disabled: false }, { day: '20', disabled: false }, { day: '21', disabled: false },
  { day: '22', disabled: false }, { day: '23', disabled: false }, { day: '24', disabled: false }, { day: '25', disabled: false },
  { day: '26', disabled: false }, { day: '27', disabled: false }, { day: '28', disabled: false },
  { day: '29', disabled: false }, { day: '30', disabled: false }, { day: '1', disabled: true, highlight: true }, { day: '2', disabled: true },
];

const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const Calendar: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 max-w-lg">
      
      {/* Header Bulan dan Navigasi */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Oktober 2025</h2>
        <div className="flex space-x-2 text-gray-600">
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors"><GoChevronLeft size={20} /></button>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors"><GoChevronRight size={20} /></button>
        </div>
      </div>

      {/* Header Hari */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-500 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="font-bold">{day}</div>
        ))}
      </div>

      {/* Grid Tanggal */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg text-sm transition-colors cursor-pointer h-10 w-10 flex items-center justify-center 
              ${day.disabled ? 'text-gray-400 bg-white cursor-default' : 'text-gray-800 hover:bg-blue-100'}
              ${day.highlight ? 'bg-blue-200 font-bold text-blue-800' : ''}
            `}
          >
            {day.day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;