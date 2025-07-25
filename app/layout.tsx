import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from './context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'JO Project',
  description: 'Gestión de Proyectos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          {children} {/* Aquí van todos los layouts específicos */}
        </AuthProvider>
      </body>
    </html>
  );
}

