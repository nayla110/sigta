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

// ============= ADMIN API =============

export const adminAPI = {
  // Login
  login: async (username: string, password: string) => {
    const data = await apiFetch('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (data.success && data.data.token) {
      setToken(data.data.token);
    }
    
    return data;
  },

  // Logout
  logout: async () => {
    await apiFetch('/admin/logout', { method: 'POST' });
    removeToken();
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

// ============= DOSEN API =============

export const dosenAPI = {
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

  // Update dosen
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
};

// ============= MAHASISWA API =============

export const mahasiswaAPI = {
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

  // Update mahasiswa
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