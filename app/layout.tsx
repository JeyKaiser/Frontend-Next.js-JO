// Archivo encargado de definir el layout raíz de la aplicación Next.js
// Este archivo es el punto de entrada para todos los layouts específicos de la aplicación.
// Aquí se importan los estilos globales y se define el proveedor de autenticación.

import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../app/modules/(auth)/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Plataforma de Diseño',
  description: 'Gestion y desarrollo de colecciones JO',
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



