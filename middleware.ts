import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  const { pathname } = request.nextUrl;

  // Halaman yang butuh authentication
  const protectedAdminRoutes = [
    '/admin/dashboard',
    '/admin/mahasiswa',
    '/admin/dosen',
    '/admin/pengguna'
  ];

  const protectedDosenRoutes = [
    '/dosen/dashboard',
    '/dosen/pengajuan',
    '/dosen/jadwal',
    '/dosen/dokumen',
    '/dosen/profile',
    '/dosen/setting'
  ];

  const protectedMahasiswaRoutes = [
    '/mahasiswa/dashboard',
    '/mahasiswa/bimbingan',
    '/mahasiswa/proposal',
    '/mahasiswa/TA',
    '/mahasiswa/profil',
    '/mahasiswa/setting'
  ];

  // Cek jika mengakses halaman admin tanpa token
  if (protectedAdminRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Cek jika mengakses halaman dosen tanpa token
  if (protectedDosenRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Cek jika mengakses halaman mahasiswa tanpa token
  if (protectedMahasiswaRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Jika sudah login, redirect dari /login ke dashboard
  if (pathname === '/login' && token) {
    // Bisa ditambahkan logic untuk cek role dari token
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dosen/:path*',
    '/mahasiswa/:path*',
    '/login'
  ]
};