// src/app/layout.tsx
// ... (tus importaciones y metadata) ...
import './globals.css'; 
import { Inter } from 'next/font/google';
import { AuthProvider } from './context/AuthContext'; // Asegúrate de la ruta correcta


const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.className}>
      <body>
        {/* ENVUELVE TU CONTENIDO CON AuthProvider */}
        <AuthProvider>
          <div>
            {/* Navbar, Sidebar, Footer, y Main aquí */}
            {/* ... */}
            <main>
              {children}
            </main>
            {/* ... */}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}



// // app/layout.tsx
// import './globals.css'; 
// import { Inter } from 'next/font/google';
// import { ReactNode } from 'react';
// import { AuthProvider } from './context/AuthContext';


// const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'Django-Next.js JWT Auth',
//   description: 'Authentication example with Django and Next.js JWT',
// };
// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="es">
//       <body className={inter.className}>
//         <AuthProvider>
//           {children}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

