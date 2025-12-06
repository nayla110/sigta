import {  MonitorDot, Mail, Phone, GraduationCap } from 'lucide-react';

interface StudentCardProps {
  nama: string;
  nim: string;
  prodi: string;
  email: string;
  telp: string;
}

export const StudentCard: React.FC<StudentCardProps> = ({ nama, nim, prodi, email, telp }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="flex items-center mb-4">
        {/* Placeholder Foto/Avatar */}
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mr-4">
          <GraduationCap className="w-8 h-8 text-gray-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{nama}</h3>
          <p className="text-sm text-gray-500">{nim}</p>
        </div>
      </div>
      
      <div className="space-y-1 text-sm text-gray-600 border-t pt-3">
        <div className="flex items-center">
          <MonitorDot className="w-4 h-4 mr-2 text-gray-400" />
          <span className="truncate">{prodi}</span>
        </div>
        <div className="flex items-center">
          <Mail className="w-4 h-4 mr-2 text-gray-400" />
          <span className="truncate">{email}</span>
        </div>
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-2 text-gray-400" />
          <span>{telp}</span>
        </div>
      </div>
    </div>
  );
};