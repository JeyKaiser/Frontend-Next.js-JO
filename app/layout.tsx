
import './globals.css'; // Tus estilos CSS globales, incluyendo las directivas de Tailwind
import { Inter } from 'next/font/google'; // Importa la fuente Inter
import { AuthProvider } from './context/AuthContext';    // Importa tu proveedor de autenticación.
import Navbar from '@/components/organisms/Navbar'; // Asume que es un componente común
import Sidebar from '@/components/organisms/Sidebar'; // Asume que es un componente común
import Footer from '@/components/organisms/Footer';                                                      

const inter = Inter({ subsets: ['latin'] }); // Inicializa tu fuente

// Metadata de la aplicación (para SEO y título de pestaña del navegador)
export const metadata = {
  title: 'JO Project',
  description: 'Gestión de Proyectos',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Aquí envuelves el 'children' con tus componentes de layout */}
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-4 overflow-y-auto bg-gray-100">

              <AuthProvider>
                {children} {/* Este es el contenido específico de cada página */}
              </AuthProvider>
            </main>
          </div>
          <Footer />
        </div>
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

