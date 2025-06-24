// app/layout.tsx
import './globals.css'; 
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Django-Next.js JWT Auth',
  description: 'Authentication example with Django and Next.js JWT',
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

