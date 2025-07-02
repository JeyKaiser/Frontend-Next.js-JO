//app/(dashboard)/dashboard/layout.tsx
import '../../globals.css';
import { Inter } from 'next/font/google';

import AuthRouteGuard from '../../../components/AuthRouteGuard';

const inter = Inter({ subsets: ['latin'] });    //evaluar si se debe quitar

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Define las rutas que quieres proteger con autenticación dentro de este grupo (dashboard)
  const protectedPaths = [
    '/',
    '/anio_coleccion',
    '/anio_coleccion/*',
    '/colecciones',
    '/colecciones/*',         
    '/productos/*',
    '/referencias',
    '/referencias/*',
    '/telas',      
    '/telas/*',
    '/test',                  
    '/test/*',                
    // ... añade todas tus rutas protegidas aquí
  ];

  return (    
    <AuthRouteGuard protectedPaths={protectedPaths}>
        {children}
    </AuthRouteGuard>
  );
}

