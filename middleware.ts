// Este código es un middleware de Next.js que intercepta las solicitudes entrantes.
// Su propósito es permitir o modificar las solicitudes antes de que lleguen a las rutas específicas de la aplicación.
// En este caso, el middleware no realiza ninguna modificación y simplemente permite que la solicitud continúe sin cambios.
// El matcher está configurado para interceptar todas las rutas excepto las que comienzan con:
// "api", "_next/static", "_next/image" y "favicon.ico".
// Este middleware es útil para agregar lógica de autenticación, redirección o 
// cualquier otra funcionalidad que necesite ejecutarse antes de que se maneje la solicitud en las rutas de la aplicación.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], 
};


// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// // 1. Especifica las rutas públicas (no requieren autenticación)
// const publicPaths = [
//   '/',
//   // '/modules',
//   // '/modules/*',
//   '/modules/login', 
//   '/modules/signin', 
//   '/modules/forgot-password',      
//   '/modules/dashboard',
//   '/modules/dashboard/*',
//   '/modules/anio_coleccion',
//   '/modules/anio_coleccion/*',
//   '/modules/colecciones',
//   '/modules/colecciones/*',         
//   '/modules/productos/*',
//   '/modules/referencias',
//   '/modules/referencias/*',
//   '/modules/telas',      
//   '/modules/telas/*',
//   '/modules/test',                  
//   '/modules/test/*',
// ];

// export function middleware(request: NextRequest) {
//   // 2. Obtiene la ruta que el usuario está intentando visitar
//   const path = request.nextUrl.pathname;

//   // 3. Verifica si la ruta solicitada es una de las rutas públicas
//   const isPublicPath = publicPaths.includes(path);

//   // 4. Obtiene el token de autenticación de las cookies
//   //    Asumiremos que el token se llama 'auth-token'. ¡Esto es clave!
//   const token = request.cookies.get('auth-token')?.value;

//   // 5. Lógica de redirección
//   // Si no hay token y la ruta NO es pública, redirige a /login
//   if (!token && !isPublicPath) {
//     return NextResponse.redirect(new URL('/modules/login', request.url));
//   }

//   // Si hay token y el usuario intenta acceder a una ruta pública (como /login),
//   // redirígelo al dashboard. Evita que un usuario logueado vea la página de login.
//   if (token && isPublicPath) {
//     // La ruta del dashboard puede variar, ajústala si es necesario.
//     return NextResponse.redirect(new URL('/modules/colecciones', request.url));
//   }

//   // 6. Si ninguna de las condiciones anteriores se cumple, permite el acceso
//   return NextResponse.next();
// }

// // 7. Configuración del Matcher
// export const config = {
//   matcher: [
//     /*
//      * Coincide con todas las rutas de solicitud excepto las que comienzan con:
//      * - api (rutas de API)
//      * - _next/static (archivos estáticos)
//      * - _next/image (archivos de optimización de imágenes)
//      * - favicon.ico (icono de favoritos)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// };
