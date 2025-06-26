//app/(dashboard)/dashboard/layout.tsx
import '../../globals.css';
import { Inter } from 'next/font/google';

import AuthRouteGuard from '../../../components/AuthRouteGuard';

const inter = Inter({ subsets: ['latin'] });    //evaluar si se debe quitar

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Define las rutas que quieres proteger con autenticación dentro de este grupo (dashboard)
  const protectedPaths = [
    '/',
    '/colecciones',
    '/colecciones/*',          // Y todas las sub-rutas dinámicas
    '/productos',
    '/productos/*',
    '/referencias',
    '/referencias/*',
    '/test',                  // La página de prueba
    '/test/*',                // Y sus sub-rutas dinámicas
    // ... añade todas tus rutas protegidas aquí
  ];

  return (    
    <AuthRouteGuard protectedPaths={protectedPaths}>
        {children}
    </AuthRouteGuard>
  );
}



// import '../../globals.css';
// import { Inter } from 'next/font/google';
// import Navbar  from '@/components/organisms/Navbar';
// import Sidebar from '@/components/organisms/Sidebar';
// import Footer  from '@/components/organisms/Footer';

// const inter = Inter({ subsets: ['latin'] });      //evaluar si se debe quitar

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//         <div className="flex flex-col min-h-screen">
//           <Navbar />
//           <div className="flex flex-1">
//             <Sidebar />
//             <main className="flex-1 p-4 overflow-y-auto bg-gray-100">
//               {children}
//             </main>
//           </div>
//           <Footer />
//         </div>
//   );
// }