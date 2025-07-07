

import type { ReferenciaDetalleAPI, FaseDisponible } from '../app/types'; // Asegúrate de que esta ruta sea correcta

// Función para obtener los datos detallados de UNA ÚNICA referencia
export async function getReferenciaData(referenciaId: string): Promise<ReferenciaDetalleAPI | null> {
  const DJANGO_API_BASE_URL = 'http://localhost:8000';

  try {
    const apiUrl = `${DJANGO_API_BASE_URL}/api/referencias1/${referenciaId}/`; // Esta URL llama a tu ReferenciaDetailView en Django
    console.log(`[Next.js SC - Referencia Detalle] Solicitando API: ${apiUrl}`);

    const res = await fetch(apiUrl, {
      cache: 'no-store', // Asegúrate de que no haya caché si los datos cambian a menudo
    });

    console.log(`[Next.js SC - Referencia Detalle] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);

    if (!res.ok) {
      let errorBody = 'No body';
      try {
          errorBody = await res.text();
      } catch (e) {}
      console.error(`[Next.js SC - Referencia Detalle] Error al obtener detalles para ID '${referenciaId}': STATUS ${res.status}. Cuerpo: ${errorBody}`);
      return null;
    }

    const data: ReferenciaDetalleAPI = await res.json();
    console.log(`[Next.js SC - Referencia Detalle] Datos recibidos:`, data);
    return data;
  } catch (error) {
    console.error("[Next.js SC - Referencia Detalle] Error de red o al parsear JSON:", error);
    return null;
  }
}
