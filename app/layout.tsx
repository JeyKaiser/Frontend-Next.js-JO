// app/layout.tsx
import './globals.css'; // O tus estilos globales
import { Inter } from 'next/font/google';
import { AuthProvider } from './context/AuthContext'; // Importa tu AuthProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Django-Next.js JWT Auth',
  description: 'Authentication example with Django and Next.js JWT',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider> {/* Envuelve aquí */}
      </body>
    </html>
  );
}



// // app/layout.tsx
// import './globals.css';
// import { Inter } from 'next/font/google';
// import styles from '@/styles/BaseLayout.module.css';


// const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'JO Project',
//   description: 'Gestión de Proyectos',
// };

// // Componente Cliente para manejar el logout y el almacenamiento local
// // Separamos esta lógica de cliente del RootLayout para mantenerlo como Server Component
// // si es posible, o simplemente para modularizar.
// function ClientSideLogoutButton() {
//   const handleLogout = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     // Para forzar una recarga y redirigir al login, o usar useRouter si el contexto lo permite.
//     window.location.href = '/login';
//   };
//   return <button onClick={handleLogout}>Cerrar Sesión</button>;
// }


// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode; // Tipado para 'children'
// }) {
//   return (
//     <html lang="es" className={inter.className}>
//       <body>
//         <div className={styles.bodyGrid}>
//           {/* Navbar - Puede seguir siendo un Server Component si no tiene interactividad */}
//           <nav className={styles.navbar}>
//             <div>
//               <ul>
//                 <li><a href="#">Dashboard</a></li>
//                 <li><a href="#">Gestión</a></li>
//                 <li><a href="#">Reportes</a></li>
//               </ul>
//             </div>
//             <form>
//               <input type="search" placeholder="Buscar..." />
//               <button type="submit">Buscar</button>
//             </form>
//           </nav>

//           {/* Sidebar - Puede seguir siendo un Server Component si no tiene interactividad */}
//           <div className={styles.sidebarContainer}>
//             <div>
//               <div className={styles.previewBox}>
//                 <p>Vista Previa</p>
//               </div>
//               <ul className={styles.sidebarMenu}>
//                 <li><a href="/">Inicio</a></li>
//                 <li><a href="/colecciones">Colecciones</a></li>
//                 <li><a href="/productos">Productos</a></li>
//                 <li><a href="/categorias">Categorías</a></li>
//                 <li><a href="/configuracion">Configuración</a></li>
//                 <li><ClientSideLogoutButton /></li> {/* Usamos el componente cliente para el botón */}
//               </ul>
//             </div>
//             <div className={styles.adBox}>
//               <p>Notificaciones</p>
//             </div>
//           </div>

//           {/* Contenido Principal */}
//           <main className={styles.container}>
//             {children}
//           </main>

//           {/* Footer */}
//           <footer className={styles.footer}>
//             <p>© 2024 Diseño JO</p>
//           </footer>
//         </div>
//       </body>
//     </html>
//   );
// }