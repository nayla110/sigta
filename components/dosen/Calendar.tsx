import { ChevronLeft, ChevronRight } from 'lucide-react';

const dates = [
    { day: 29, month: 'prev', weekend: false }, { day: 30, month: 'prev', weekend: false }, { day: 31, month: 'prev', weekend: false },
    { day: 1, month: 'current', weekend: false }, { day: 2, month: 'current', weekend: false }, { day: 3, month: 'current', weekend: true }, { day: 4, month: 'current', weekend: true },
    { day: 5, month: 'current', weekend: true }, { day: 6, month: 'current', weekend: false }, { day: 7, month: 'current', weekend: false }, { day: 8, month: 'current', weekend: false }, { day: 9, month: 'current', weekend: false }, { day: 10, month: 'current', weekend: true }, { day: 11, month: 'current', weekend: true },
    { day: 12, month: 'current', weekend: true }, { day: 13, month: 'current', weekend: false }, { day: 14, month: 'current', weekend: false }, { day: 15, month: 'current', weekend: false }, { day: 16, month: 'current', weekend: false }, { day: 17, month: 'current', weekend: true }, { day: 18, month: 'current', weekend: true },
    { day: 19, month: 'current', weekend: true }, { day: 20, month: 'current', weekend: false }, { day: 21, month: 'current', weekend: false }, { day: 22, month: 'current', weekend: false }, { day: 23, month: 'current', weekend: false }, { day: 24, month: 'current', weekend: true }, { day: 25, month: 'current', weekend: true },
    { day: 26, month: 'current', weekend: true }, { day: 27, month: 'current', weekend: false }, { day: 28, month: 'current', weekend: false }, { day: 29, month: 'current', weekend: false }, { day: 30, month: 'current', weekend: false }, { day: 1, month: 'next', weekend: true }, { day: 2, month: 'next', weekend: true },
];

const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const Calendar = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mx-auto    max-w-lg">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-bold text-gray-800">Oktober 2025</h4>
        <div className="flex space-x-2">
          <button className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {daysOfWeek.map(day => (
          <div key={day} className="font-medium text-gray-600">
            {day}
          </div>
        ))}

        {dates.map((date, index) => (
          <div 
            key={index}
            className={`p-2 rounded-lg transition-colors cursor-pointer 
                        ${date.month === 'prev' || date.month === 'next' ? 'text-gray-400 bg-gray-50' : 'text-gray-700 hover:bg-blue-100'}
                        ${(date.day === 1 && date.month === 'next') || (date.day === 30 && date.month === 'current') ? 'bg-blue-50 text-blue-800 font-bold border-2 border-blue-200' : ''} 
            `}
          >
            {date.day}
          </div>
        ))}
      </div>
    </div>
  );
};