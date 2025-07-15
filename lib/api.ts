

import type { ReferenciaDetalleAPI, FaseDisponible } from '../app/types'; // Asegúrate de que esta ruta sea correcta

const DJANGO_API_BASE_URL = 'http://localhost:8000';

// Función para obtener los datos detallados de UNA ÚNICA referencia
export async function getReferenciaData(referenciaId: string, 
  collectionId?: string
): Promise<ReferenciaDetalleAPI | null> {

  try {
    const apiUrl = `${DJANGO_API_BASE_URL}/api/detalle-referencia/${referenciaId}/`; // Esta URL llama a tu ReferenciaDetailView en Django
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

export async function getFaseData(
  referenciaId: string,
  fasesSlug: string,
  collectionId?: string // Hazlo opcional por si no siempre lo necesitas
): Promise<any | null> {
    try {
        let apiUrl = `${DJANGO_API_BASE_URL}/api/fases/${fasesSlug}/${referenciaId}/`;
        
        // Añade collectionId como query parameter si está presente
        if (collectionId) {
            apiUrl += `?collectionId=${collectionId}`;
        }

        console.log(`[Next.js SC - Fase Detalle] Solicitando API: ${apiUrl}`);

        const res = await fetch(apiUrl, {
            cache: 'no-store',
        });

        console.log(`[Next.js SC - Fase Detalle] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);

        if (!res.ok) {
            let errorBody = 'No body';
            try {
                errorBody = await res.text();
            } catch (e) {}
            console.error(`[Next.js SC - Fase Detalle] Error al obtener datos para fase '${fasesSlug}' de referencia '${referenciaId}': STATUS ${res.status}. Cuerpo: ${errorBody}`);
            return null;
        }

        const data = await res.json();
        console.log(`[Next.js SC - Fase Detalle] Datos recibidos para fase ${fasesSlug}:`, data);
        return data;
    } catch (error) {
        console.error(`[Next.js SC - Fase Detalle] Error de red o al parsear JSON para fase ${fasesSlug}:`, error);
        return null;
    }
}
