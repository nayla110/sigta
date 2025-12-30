// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper untuk get token dari localStorage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper untuk set token
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Helper untuk remove token
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    // Hapus cookie juga
    document.cookie = 'token=; path=/; max-age=0';
  }
};

// Generic fetch function dengan error handling
async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add token if exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - Token expired atau invalid
      if (response.status === 401) {
        removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      throw new Error(data.message || 'Terjadi kesalahan');
    }

    return data;
  } catch (error: any) {
    console.error('API Error:', error);
    throw error;
  }
}

// ============= AUTH API =============

export const authAPI = {
  // Login Admin
  loginAdmin: async (username: string, password: string) => {
    const data = await apiFetch('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (data.success && data.data.token) {
      setToken(data.data.token);
      if (typeof window !== 'undefined') {
        document.cookie = `token=${data.data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      }
    }
    
    return data;
  },

  // Login Mahasiswa (menggunakan NIM)
  loginMahasiswa: async (nim: string, password: string) => {
    const data = await apiFetch('/auth/mahasiswa/login', {
      method: 'POST',
      body: JSON.stringify({ nim, password }),
    });
    
    if (data.success && data.data.token) {
      setToken(data.data.token);
      if (typeof window !== 'undefined') {
        document.cookie = `token=${data.data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      }
    }
    
    return data;
  },

  // Login Dosen (menggunakan NIK)
  loginDosen: async (nik: string, password: string) => {
    const data = await apiFetch('/auth/dosen/login', {
      method: 'POST',
      body: JSON.stringify({ nik, password }),
    });
    
    if (data.success && data.data.token) {
      setToken(data.data.token);
      if (typeof window !== 'undefined') {
        document.cookie = `token=${data.data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      }
    }
    
    return data;
  },

  // Logout Universal
  logout: async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      removeToken();
    }
  },
};

// ============= ADMIN API =============

export const adminAPI = {
  // Logout
  logout: async () => {
    try {
      await apiFetch('/admin/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      removeToken();
    }
  },

  // Get Dashboard Stats
  getDashboardStats: async () => {
    return apiFetch('/admin/dashboard');
  },

  // Get Profile
  getProfile: async () => {
    return apiFetch('/admin/profile');
  },
};

// ============= DOSEN API (GABUNGAN SEMUA FUNGSI) =============

export const dosenAPI = {
  // === UNTUK ADMIN ===
  // Get all dosen
  getAll: async () => {
    return apiFetch('/dosen');
  },

  // Get dosen by ID
  getById: async (id: string) => {
    return apiFetch(`/dosen/${id}`);
  },

  // Create dosen
  create: async (dosenData: any) => {
    return apiFetch('/dosen', {
      method: 'POST',
      body: JSON.stringify(dosenData),
    });
  },

  // Update dosen (admin)
  update: async (id: string, dosenData: any) => {
    return apiFetch(`/dosen/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dosenData),
    });
  },

  // Delete dosen
  delete: async (id: string) => {
    return apiFetch(`/dosen/${id}`, {
      method: 'DELETE',
    });
  },

  // === UNTUK DOSEN YANG LOGIN ===
  // Get current profile
  getCurrentProfile: async () => {
    return apiFetch('/dosen/profile');
  },

  // Get mahasiswa bimbingan
  getMahasiswaBimbingan: async () => {
    return apiFetch('/dosen/mahasiswa-bimbingan');
  },

  // Update own profile (simple)
  updateProfile: async (profileData: any) => {
    return apiFetch('/dosen/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Update profile lengkap
  updateProfileLengkap: async (profileData: any) => {
    return apiFetch('/dosen/update-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Update password
  updatePassword: async (passwordData: {
    password_lama: string;
    password_baru: string;
    konfirmasi_password: string;
  }) => {
    return apiFetch('/dosen/update-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  // Upload foto profile
  uploadFotoProfile: async (file: File) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('foto', file);

    try {
      const response = await fetch(`${API_BASE_URL}/dosen/upload-foto`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          removeToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        throw new Error(data.message || 'Gagal upload foto');
      }

      return data;
    } catch (error: any) {
      console.error('Upload foto error:', error);
      throw error;
    }
  },
};

// ============= MAHASISWA API (GABUNGAN SEMUA FUNGSI) =============

export const mahasiswaAPI = {
  // === UNTUK ADMIN ===
  // Get all mahasiswa
  getAll: async () => {
    return apiFetch('/mahasiswa');
  },

  // Get mahasiswa by ID
  getById: async (id: string) => {
    return apiFetch(`/mahasiswa/${id}`);
  },

  // Create mahasiswa
  create: async (mahasiswaData: any) => {
    return apiFetch('/mahasiswa', {
      method: 'POST',
      body: JSON.stringify(mahasiswaData),
    });
  },

  // Update mahasiswa (admin)
  update: async (id: string, mahasiswaData: any) => {
    return apiFetch(`/mahasiswa/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mahasiswaData),
    });
  },

  // Delete mahasiswa
  delete: async (id: string) => {
    return apiFetch(`/mahasiswa/${id}`, {
      method: 'DELETE',
    });
  },

  // === UNTUK MAHASISWA YANG LOGIN ===
  // Get current profile
  getCurrentProfile: async () => {
    return apiFetch('/mahasiswa/profile');
  },

  // Update own profile (simple)
  updateProfile: async (profileData: any) => {
    return apiFetch('/mahasiswa/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Get dashboard data
  getDashboardData: async () => {
    return apiFetch('/mahasiswa/dashboard');
  },

  // Update profile lengkap
  updateProfile: async (profileData: any) => {
  return apiFetch('/mahasiswa/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
},


  // Update password
  updatePassword: async (passwordData: {
    password_lama: string;
    password_baru: string;
    konfirmasi_password: string;
  }) => {
    return apiFetch('/mahasiswa/update-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  // Upload foto profile
  uploadFotoProfile: async (file: File) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('foto', file);

    try {
      const response = await fetch(`${API_BASE_URL}/mahasiswa/upload-foto`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          removeToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        throw new Error(data.message || 'Gagal upload foto');
      }

      return data;
    } catch (error: any) {
      console.error('Upload foto error:', error);
      throw error;
    }
  },
};

// ============= BERITA API =============

export const beritaAPI = {
  // Get all berita (admin)
  getAll: async () => {
    return apiFetch('/berita');
  },

  // Get published berita (public)
  getPublished: async () => {
    return apiFetch('/berita/published');
  },

  // Get berita by ID
  getById: async (id: string) => {
    return apiFetch(`/berita/${id}`);
  },

  // Create berita
  create: async (beritaData: any) => {
    return apiFetch('/berita', {
      method: 'POST',
      body: JSON.stringify(beritaData),
    });
  },

  // Update berita
  update: async (id: string, beritaData: any) => {
    return apiFetch(`/berita/${id}`, {
      method: 'PUT',
      body: JSON.stringify(beritaData),
    });
  },

  // Delete berita
  delete: async (id: string) => {
    return apiFetch(`/berita/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============= PROGRAM STUDI API =============

export const programStudiAPI = {
  // Get all program studi
  getAll: async () => {
    return apiFetch('/program-studi');
  },
};

// ============= BIMBINGAN API =============

export const bimbinganAPI = {
  // === MAHASISWA ===
  // Create pengajuan bimbingan
  createPengajuan: async (pengajuanData: any) => {
    return apiFetch('/bimbingan/mahasiswa/pengajuan', {
      method: 'POST',
      body: JSON.stringify(pengajuanData),
    });
  },

  // Get bimbingan list mahasiswa
  getMahasiswaBimbingan: async () => {
    return apiFetch('/bimbingan/mahasiswa/list');
  },

  // === DOSEN ===
  // Get pengajuan bimbingan (optional filter by status)
  getDosenPengajuan: async (status?: string) => {
    const url = status 
      ? `/bimbingan/dosen/pengajuan?status=${status}`
      : '/bimbingan/dosen/pengajuan';
    return apiFetch(url);
  },

  // Get jadwal kalender
  getDosenJadwalKalender: async (month?: number, year?: number) => {
    let url = '/bimbingan/dosen/jadwal-kalender';
    if (month && year) {
      url += `?month=${month}&year=${year}`;
    }
    return apiFetch(url);
  },

  // Update status pengajuan (Terima/Tolak)
  updateStatusPengajuan: async (id: string, status: 'Disetujui' | 'Ditolak', catatan?: string) => {
    return apiFetch(`/bimbingan/dosen/pengajuan/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, catatan }),
    });
  },

  // Update catatan bimbingan
  updateCatatan: async (id: string, catatan: string) => {
    return apiFetch(`/bimbingan/dosen/pengajuan/${id}/catatan`, {
      method: 'PUT',
      body: JSON.stringify({ catatan }),
    });
  },

  // Tandai selesai
  tandaiSelesai: async (id: string) => {
    return apiFetch(`/bimbingan/dosen/pengajuan/${id}/selesai`, {
      method: 'PUT',
    });
  },
};

// ============= DOKUMEN API =============

export const dokumenAPI = {
  // === DOSEN ===
  // Get mahasiswa bimbingan dengan detail
  getMahasiswaBimbingan: async () => {
    return apiFetch('/dokumen/dosen/mahasiswa');
  },

  // Get progress mahasiswa (status dan bab)
  getProgressMahasiswa: async (mahasiswaId: string) => {
    return apiFetch(`/dokumen/dosen/mahasiswa/${mahasiswaId}/progress`);
  },

  // Get riwayat dokumen mahasiswa
  getRiwayatDokumen: async (mahasiswaId: string) => {
    return apiFetch(`/dokumen/dosen/mahasiswa/${mahasiswaId}/riwayat`);
  },

  // Review dokumen (approve/reject)
  reviewDokumen: async (dokumenId: string, status: 'Disetujui' | 'Ditolak', catatan?: string) => {
    return apiFetch(`/dokumen/dosen/dokumen/${dokumenId}/review`, {
      method: 'PUT',
      body: JSON.stringify({ status, catatan }),
    });
  },

  // Update status mahasiswa (untuk edit progress)
  updateMahasiswaStatus: async (mahasiswaId: string, status: string, current_bab: number) => {
    return apiFetch(`/dokumen/dosen/mahasiswa/${mahasiswaId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, current_bab }),
    });
  },

  // === MAHASISWA ===
  // Get progress mahasiswa sendiri
  getMahasiswaProgress: async () => {
    return apiFetch('/dokumen/mahasiswa/progress');
  },

  // Upload dokumen
  uploadDokumen: async (dokumenData: any) => {
    return apiFetch('/dokumen/mahasiswa/upload', {
      method: 'POST',
      body: JSON.stringify(dokumenData),
    });
  },

  // Get dokumen mahasiswa sendiri
  getMahasiswaDokumen: async () => {
    return apiFetch('/dokumen/mahasiswa/dokumen');
  },
};