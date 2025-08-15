//app/components/AuthRouteGuard.tsx
'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/modules/(auth)/context/AuthContext';

interface AuthRouteGuardProps {
  children: ReactNode;
  protectedPaths: string[]; // Rutas que requieren autenticación
}

export default function AuthRouteGuard({ children, protectedPaths }: AuthRouteGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const currentPath = usePathname(); // Usar usePathname para obtener la ruta actual

  const isProtected = protectedPaths.some(path => {
    // Para rutas dinámicas, necesitas una lógica más sofisticada si el patrón no es simple
    // Ej: /colecciones/[slug] coincide con /colecciones
    if (path.endsWith('/*')) {                  // Si la ruta protegida es un patrón como '/dashboard/*'
      const base = path.slice(0, -2);           // Elimina '/*'
      return currentPath.startsWith(base);
    }
    return currentPath === path;
  });


  useEffect(() => {
    // Si la verificación inicial ha terminado (loading es false)
    // Y la ruta actual es protegida (requiere autenticación)
    // Y el usuario NO está autenticado, entonces redirige a /login.
    if (!loading && isProtected && !isAuthenticated) {
      console.log(`[AuthRouteGuard] Redirigiendo a /login desde ${currentPath}. (isProtected: ${isProtected}, isAuthenticated: ${isAuthenticated})`);
      router.replace('/modules/login');
    }
    // Si la verificación inicial ha terminado (loading es false)
    // Y el usuario está autenticado
    // Y la ruta actual es /login, entonces redirige a /dashboard.
    if (!loading && !isProtected && isAuthenticated && currentPath === '/modules/login') {
      console.log(`[AuthRouteGuard] Redirigiendo a /dashboard desde ${currentPath}. (isAuthenticated: ${isAuthenticated})`);
      router.replace('/modules/colecciones');
      // router.replace('/modules/dashboard');
    }

  }, [isAuthenticated, loading, router, isProtected, currentPath]);

  // Si aún estamos cargando el estado de autenticación O si la ruta es protegida y el usuario no está autenticado,
  // mostramos un spinner o null para evitar que el contenido no autenticado se muestre brevemente.
  // IMPORTANTE: Esto solo aplica después de la hidratación. El render inicial del servidor
  // mostrará el contenido default o el spinner inicial del layout.
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Cargando autenticación...</p>
      </div>
    );
  }

  // Si la ruta es protegida y el usuario no está autenticado, devuelve null
  // porque el useEffect ya se encarga de la redirección.
  if (isProtected && !isAuthenticated) {
    return null;
  }

  // Si el usuario está autenticado O la ruta no es protegida, renderiza el contenido
  return <>{children}</>;
}
