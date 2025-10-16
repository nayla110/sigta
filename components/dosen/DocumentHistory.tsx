import { Search, FileText, CheckCircle } from 'lucide-react';

interface DocumentEntry {
  id: number;
  tanggal: string;
  namaFile: string;
  statusReview: boolean;
}

interface DocumentHistoryProps {
  history: DocumentEntry[];
}

export const DocumentHistory: React.FC<DocumentHistoryProps> = ({ history }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Riwayat Dokumen Masuk</h3>
      
      {/* Search Bar */}
      <div className="relative mb-5">
        <input
          type="text"
          placeholder="Cari Dokumen"
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {/* Daftar Riwayat Dokumen */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {history.map((doc) => (
          <div 
            key={doc.id}
            className="flex justify-between items-center p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-3 text-blue-500" />
              <span className="text-sm text-gray-700">
                <span className="font-medium">{doc.tanggal}</span> - {doc.namaFile}
              </span>
            </div>
            {doc.statusReview && (
              <CheckCircle className="w-5 h-5 text-blue-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};