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



