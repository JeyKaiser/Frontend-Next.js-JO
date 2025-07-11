// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  
  return NextResponse.next();
}

export const config = {
  // Deja el matcher vacío o ajusta para que no intercepte rutas de autenticación
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Excluye api, static, etc.
};




// // middleware.js
// import { NextResponse } from 'next/server';

// export function middleware(request) {
//   const accessToken = request.cookies.get('accessToken'); // Si usas cookies para el token
//   const { pathname } = request.nextUrl;

//   // Si estás en la ruta de login y ya tienes un token, redirige al home
//   if (pathname === '/login' && accessToken) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   // Si no estás en login y no tienes un token, redirige al login
//   if (pathname !== '/login' && !accessToken) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   return NextResponse.next();
// }

// // Aquí defines qué rutas serán interceptadas por este middleware
// export const config = {
//   matcher: ['/', '/colecciones/:path*', '/productos/:path*', '/login'], // Rutas que quieres proteger/redirigir
// };