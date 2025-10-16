//app/page.tsx
//archivo encargado de redirigir al usuario a la página de inicio o al login
// Este archivo es el punto de entrada para la aplicación Next.js y maneja la lógica de autenticación.

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/modules/(auth)/context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/modules/dashboard');
      } else {
        router.push('/modules/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <h1>Redirigiendo...</h1>
      <p>Espera un momento mientras verificamos tu estado de autenticación.</p>      
    </div>
  );
}


// // app/page.tsx
// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function HomePage() {
//   const router = useRouter();

//   useEffect(() => {
//     // Redirige inmediatamente al usuario a la página de login
//     router.replace('/modules/login');
//   }, [router]);

//   return null; // No renderiza nada en esta página, ya que la redirección es inmediata
// }