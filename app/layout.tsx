import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SIGTA - Bimbingan Tugas Akhir',
  description: 'Sistem Informasi Bimbingan Tugas Akhir',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
