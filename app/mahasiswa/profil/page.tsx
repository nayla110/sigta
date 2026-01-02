'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  User, Mail, Phone, GraduationCap, BookOpen, Award, 
  MapPin, Calendar, UserCircle, X, Save, Edit, Lock, Camera, Eye, EyeOff 
} from 'lucide-react';
import { mahasiswaAPI } from '@/lib/api';

interface MahasiswaProfile {
  id: string;
  nim: string;
  nama: string;
  email: string;
  no_telp: string;
  judul_ta: string;
  alamat?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: string;
  foto_profil?: string;
  program_studi_nama: string;
  program_studi_kode: string;
  program_studi_jenjang: string;
  dosen_pembimbing_nama: string;
  dosen_pembimbing_nik: string;
  dosen_pembimbing_email: string;
  dosen_pembimbing_telp: string;
}

export default function ProfilMahasiswa() {
  const [mahasiswa, setMahasiswa] = useState<MahasiswaProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  
  // Form state untuk edit profil
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_telp: '',
    judul_ta: '',
    alamat: '',
    tanggal_lahir: '',
    jenis_kelamin: ''
  });

  // Form state untuk update password
  const [passwordData, setPasswordData] = useState({
    password_lama: '',
    password_baru: '',
    konfirmasi_password: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  // State untuk upload foto
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await mahasiswaAPI.getCurrentProfile();
      
      if (response.success) {
        setMahasiswa(response.data);
        setFormData({
          nama: response.data.nama,
          email: response.data.email,
          no_telp: response.data.no_telp || '',
          judul_ta: response.data.judul_ta || '',
          alamat: response.data.alamat || '',
          tanggal_lahir: response.data.tanggal_lahir || '',
          jenis_kelamin: response.data.jenis_kelamin || ''
        });
      } else {
        setError(response.message || 'Gagal memuat profil');
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat profil');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      errors.nama = 'Nama wajib diisi';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format email tidak valid';
    }

    if (formData.no_telp && !/^(\+62|62|0)[0-9]{9,12}$/.test(formData.no_telp.replace(/\s/g, ''))) {
      errors.no_telp = 'Format nomor telepon tidak valid';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setFormErrors({});
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setFormErrors({});
    if (mahasiswa) {
      setFormData({
        nama: mahasiswa.nama,
        email: mahasiswa.email,
        no_telp: mahasiswa.no_telp || '',
        judul_ta: mahasiswa.judul_ta || '',
        alamat: mahasiswa.alamat || '',
        tanggal_lahir: mahasiswa.tanggal_lahir || '',
        jenis_kelamin: mahasiswa.jenis_kelamin || ''
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      const response = await mahasiswaAPI.updateProfile(formData);
      
      if (response.success) {
        setMahasiswa(prev => prev ? { ...prev, ...formData } : null);
        setIsEditMode(false);
        alert('Profil berhasil diupdate!');
      } else {
        alert(response.message || 'Gagal mengupdate profil');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      alert(err.message || 'Terjadi kesalahan saat mengupdate profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.password_lama || !passwordData.password_baru || !passwordData.konfirmasi_password) {
      alert('Semua field password harus diisi');
      return;
    }

    if (passwordData.password_baru !== passwordData.konfirmasi_password) {
      alert('Password baru dan konfirmasi password tidak cocok');
      return;
    }

    if (passwordData.password_baru.length < 6) {
      alert('Password baru minimal 6 karakter');
      return;
    }

    try {
      const response = await mahasiswaAPI.updatePassword(passwordData);
      
      if (response.success) {
        alert('Password berhasil diupdate!');
        setShowPasswordModal(false);
        setPasswordData({
          password_lama: '',
          password_baru: '',
          konfirmasi_password: ''
        });
      } else {
        alert(response.message || 'Gagal mengupdate password');
      }
    } catch (err: any) {
      console.error('Error updating password:', err);
      alert(err.message || 'Terjadi kesalahan saat mengupdate password');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran file
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowPhotoModal(true); // Buka modal untuk preview
    }
  };

  const handleCameraClick = () => {
    // Trigger file input langsung
    fileInputRef.current?.click();
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) {
      alert('Pilih foto terlebih dahulu');
      return;
    }

    try {
      console.log('📤 Uploading foto...', selectedFile.name);
      const response = await mahasiswaAPI.uploadFotoProfile(selectedFile);
      
      console.log('✅ Upload response:', response);
      
      if (response.success) {
        alert('Foto profil berhasil diupload!');
        setShowPhotoModal(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        
        // Refresh profile untuk mendapatkan foto baru
        await fetchProfile();
      } else {
        alert(response.message || 'Gagal upload foto');
      }
    } catch (err: any) {
      console.error('❌ Error uploading photo:', err);
      alert(err.message || 'Terjadi kesalahan saat upload foto');
    }
  };

  const handleCancelUpload = () => {
    setShowPhotoModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Memuat profil...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!mahasiswa) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center text-gray-600">Data profil tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Profil Mahasiswa</h1>
        <div className="flex gap-2">
          {!isEditMode && (
            <>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <Lock className="w-4 h-4" />
                Ubah Password
              </button>
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profil
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Foto & Info Dasar */}
        <div className="bg-white shadow-lg p-6 rounded-lg border border-gray-200">
          <div className="flex justify-center mb-6 relative">
            <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-md overflow-hidden">
              {mahasiswa.foto_profil ? (
                <img 
                  src={`http://localhost:5000${mahasiswa.foto_profil}`}
                  alt="Foto Profil" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('❌ Error loading image:', mahasiswa.foto_profil);
                    // Fallback ke default avatar
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                  }}
                />
              ) : (
                <User className="w-16 h-16 text-green-600" />
              )}
            </div>
            {!isEditMode && (
              <button
                onClick={handleCameraClick}
                className="absolute bottom-0 right-1/2 transform translate-x-16 translate-y-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg"
                title="Upload Foto Profil"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{mahasiswa.nama}</h2>
            <p className="text-sm text-gray-500 mt-1">NIM: {mahasiswa.nim}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">Program Studi</p>
            <p className="text-sm font-semibold text-blue-700">
              {mahasiswa.program_studi_jenjang} {mahasiswa.program_studi_nama}
            </p>
          </div>
        </div>

        {/* Card Detail Informasi */}
        <div className="lg:col-span-2 bg-white shadow-lg p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            Informasi Mahasiswa
          </h3>
          
          {!isEditMode ? (
            <div className="space-y-4">
              <InfoField icon={<Award className="w-5 h-5 text-gray-500" />} label="NIM" value={mahasiswa.nim} />
              <InfoField icon={<GraduationCap className="w-5 h-5 text-gray-500" />} label="Program Studi" value={`${mahasiswa.program_studi_jenjang} ${mahasiswa.program_studi_nama}`} />
              <InfoField icon={<User className="w-5 h-5 text-gray-500" />} label="Nama Lengkap" value={mahasiswa.nama} />
              <InfoField icon={<Mail className="w-5 h-5 text-gray-500" />} label="Email" value={mahasiswa.email} />
              <InfoField icon={<Phone className="w-5 h-5 text-gray-500" />} label="No. Telepon" value={mahasiswa.no_telp || '-'} />
              <InfoField icon={<BookOpen className="w-5 h-5 text-gray-500" />} label="Judul Tugas Akhir" value={mahasiswa.judul_ta || '-'} />
              <InfoField icon={<MapPin className="w-5 h-5 text-gray-500" />} label="Alamat" value={mahasiswa.alamat || '-'} />
              <InfoField icon={<Calendar className="w-5 h-5 text-gray-500" />} label="Tanggal Lahir" value={mahasiswa.tanggal_lahir ? new Date(mahasiswa.tanggal_lahir).toLocaleDateString('id-ID') : '-'} />
              <InfoField icon={<UserCircle className="w-5 h-5 text-gray-500" />} label="Jenis Kelamin" value={mahasiswa.jenis_kelamin === 'L' ? 'Laki-laki' : mahasiswa.jenis_kelamin === 'P' ? 'Perempuan' : '-'} />
            </div>
          ) : (
            <div className="space-y-4">
              <FormInput label="Nama Lengkap" name="nama" value={formData.nama} onChange={handleInputChange} error={formErrors.nama} required />
              <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} error={formErrors.email} required />
              <FormInput label="No. Telepon" name="no_telp" value={formData.no_telp} onChange={handleInputChange} error={formErrors.no_telp} placeholder="Contoh: 081234567890" />
              <FormTextarea label="Judul Tugas Akhir" name="judul_ta" value={formData.judul_ta} onChange={handleInputChange} rows={3} />
              <FormTextarea label="Alamat" name="alamat" value={formData.alamat} onChange={handleInputChange} rows={3} />
              <FormInput label="Tanggal Lahir" name="tanggal_lahir" type="date" value={formData.tanggal_lahir} onChange={handleInputChange} />
              <FormSelect 
                label="Jenis Kelamin" 
                name="jenis_kelamin" 
                value={formData.jenis_kelamin} 
                onChange={handleInputChange}
                options={[
                  { value: '', label: '-- Pilih --' },
                  { value: 'L', label: 'Laki-laki' },
                  { value: 'P', label: 'Perempuan' }
                ]}
              />

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Card Dosen Pembimbing */}
        <div className="lg:col-span-3 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-blue-300 pb-2">
            Informasi Dosen Pembimbing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField icon={<User className="w-5 h-5 text-blue-600" />} label="Nama Dosen" value={mahasiswa.dosen_pembimbing_nama || '-'} />
            <InfoField icon={<Award className="w-5 h-5 text-blue-600" />} label="NIK" value={mahasiswa.dosen_pembimbing_nik || '-'} />
            <InfoField icon={<Mail className="w-5 h-5 text-blue-600" />} label="Email" value={mahasiswa.dosen_pembimbing_email || '-'} />
            <InfoField icon={<Phone className="w-5 h-5 text-blue-600" />} label="No. Telepon" value={mahasiswa.dosen_pembimbing_telp || '-'} />
          </div>
        </div>
      </div>

      {/* Modal Update Password */}
      {showPasswordModal && (
        <Modal onClose={() => setShowPasswordModal(false)} title="Ubah Password">
          <div className="space-y-4">
            <PasswordInput 
              label="Password Lama" 
              name="password_lama" 
              value={passwordData.password_lama} 
              onChange={handlePasswordChange}
              show={showPasswords.old}
              onToggle={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
            />
            <PasswordInput 
              label="Password Baru" 
              name="password_baru" 
              value={passwordData.password_baru} 
              onChange={handlePasswordChange}
              show={showPasswords.new}
              onToggle={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
            />
            <PasswordInput 
              label="Konfirmasi Password Baru" 
              name="konfirmasi_password" 
              value={passwordData.konfirmasi_password} 
              onChange={handlePasswordChange}
              show={showPasswords.confirm}
              onToggle={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
            />
            <button
              onClick={handleUpdatePassword}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Update Password
            </button>
          </div>
        </Modal>
      )}

      {/* Modal Upload Foto */}
      {showPhotoModal && (
        <Modal onClose={handleCancelUpload} title="Upload Foto Profil">
          <div className="space-y-4">
            {previewUrl ? (
              <>
                <div className="flex justify-center">
                  <img src={previewUrl} alt="Preview" className="w-48 h-48 rounded-full object-cover border-4 border-blue-200" />
                </div>
                <p className="text-center text-sm text-gray-600">
                  {selectedFile?.name}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleUploadPhoto}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                  >
                    Upload Foto
                  </button>
                  <button
                    onClick={handleCameraClick}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg"
                  >
                    Pilih Foto Lain
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <Camera className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                <p>Memproses foto...</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// Components
function InfoField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start">
      <div className="w-12 flex items-center">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-base font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function FormInput({ label, name, type = 'text', value, onChange, error, required, placeholder }: any) {
  // Set min/max untuk input date
  const dateProps = type === 'date' ? {
    min: '1800-01-01',  // Minimal tahun 1800
    max: '2025-12-31'   // Maksimal tahun 2025 (untuk mahasiswa)
  } : {};

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...dateProps}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function FormTextarea({ label, name, value, onChange, rows = 3 }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function FormSelect({ label, name, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function PasswordInput({ label, name, value, onChange, show, onToggle }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

function Modal({ onClose, title, children }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}