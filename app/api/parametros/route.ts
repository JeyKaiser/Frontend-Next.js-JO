import { NextResponse } from 'next/server';

// URL del backend real
const BACKEND_URL = 'http://localhost:8000/sap/api/parametros/';

export async function GET() {
  try {
    // El servidor de Next.js hace la petición al backend
    const response = await fetch(BACKEND_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Opcional: cachear la respuesta para mejorar el rendimiento
      // next: { revalidate: 60 } // Revalidar cada 60 segundos
    });

    if (!response.ok) {
      // Si el backend responde con un error, lo pasamos al frontend
      return NextResponse.json(
        { error: `Error desde el backend: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("DATOS RECIBIDOS EN LA RUTA API (desde el backend):", data);
    return NextResponse.json(data);

  } catch (error: any) {
    // Si hay un error en la conexión con el backend
    console.error('Error al contactar el backend:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al contactar el backend', details: error.message },
      { status: 500 }
    );
  }
}
