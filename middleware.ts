import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define las rutas que no requieren autenticación
const publicPaths = ['/modules/login', '/modules/signin', '/modules/forgot-password', '/'];

// Define la ruta a la que se redirige un usuario ya autenticado si intenta acceder a una ruta pública
const defaultRedirect = '/modules/dashboard';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('auth_token')?.value;

  // Comprueba si la ruta actual es una de las rutas públicas
  const isPublic = publicPaths.some(p => path.startsWith(p));

  // Si el usuario está autenticado (tiene un token)
  if (token) {
    // Si intenta acceder a una ruta pública, redirígelo a su dashboard
    // Esto evita que un usuario logueado vea la página de login de nuevo
    if (isPublic) {
      return NextResponse.redirect(new URL(defaultRedirect, request.url));
    }
  } 
  // Si el usuario no está autenticado (no tiene token)
  else {
    // Y está intentando acceder a una ruta protegida, redirígelo a la página de login
    if (!isPublic) {
      return NextResponse.redirect(new URL('/modules/login', request.url));
    }
  }

  // Si ninguna de las condiciones de redirección se cumple, permite que la solicitud continúe
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas de solicitud excepto las que comienzan con:
     * - api (rutas de API)
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (icono de favoritos)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
