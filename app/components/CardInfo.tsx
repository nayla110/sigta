import React from 'react';

interface CardInfoProps {
  title: string;
  count: number;
}

const CardInfo: React.FC<CardInfoProps> = ({ title, count }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center w-full" 
      // Menggunakan style inline untuk warna latar belakang yang persis seperti di SS (off-white/cream)
      style={{ backgroundColor: '#f9f9f9' }} 
    >
      <h3 className="text-xl font-semibold mb-2 text-gray-700 text-center">{title}</h3>
      <p className="text-6xl font-extrabold text-blue-700">{count}</p>
    </div>
  );
};

export default CardInfo;