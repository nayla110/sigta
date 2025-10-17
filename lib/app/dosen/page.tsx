import { redirect } from 'next/navigation';

export default function DosenRootPage() {
  // Mengarahkan (redirect) pengguna dari /dosen ke /dosen/dashboard
  redirect('/dosen/dashboard');
}