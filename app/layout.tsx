import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';


export const metadata: Metadata = {
  title: 'Portfolio Manager',
  description: 'Track and manage your stock portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className='bg-white text-black'>
          {children}
          <Toaster />
      </body>
    </html>
  );
}