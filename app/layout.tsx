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




// export default function RootLayout({              // El componente RootLayout que envuelve toda tu aplicación.
//   children,
// }: {
//   children: React.ReactNode; // Tipado para las props 'children'
// }) {
//   return (
//     // La etiqueta <html> y <body> son parte del Root Layout y no debe repetirse en layouts anidados.
//     <html lang="es" className={inter.className}>     
//       <body>
//         {/* El AuthProvider envuelve todo para que el contexto de autenticación
//             esté disponible para CUALQUIER componente o página en tu aplicación,
//             incluyendo la página de login y las páginas protegidas. */}
//         <AuthProvider>
          
//           {children}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

