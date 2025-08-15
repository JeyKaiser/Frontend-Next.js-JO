// lib/api.ts

import type { ReferenciaDetalleAPI, FaseDisponible } from '@/app/modules/types/index';

const DJANGO_API_BASE_URL = 'http://localhost:8000';

// Función para obtener los datos detallados de UNA ÚNICA referencia (sin cambios en URL)
export async function getReferenciaData(referenciaId: string): Promise<ReferenciaDetalleAPI | null> {
  try {
    const apiUrl = `${DJANGO_API_BASE_URL}/api/detalle-referencia/${referenciaId}/`;
    console.log(`[Next.js SC - Referencia Detalle] Solicitando API: ${apiUrl}`);

    const res = await fetch(apiUrl, {
      cache: 'no-store',
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


// Nueva función para obtener los datos de una fase específica
// Ahora collectionId es un parámetro de ruta
export async function getFaseData(referenciaId: string, fasesSlug: string, collectionId: string): Promise<any | null> {
    try {
        // *** CAMBIO CLAVE: Construcción de la URL de la API con collectionId como parámetro de ruta ***
        const apiUrl = `${DJANGO_API_BASE_URL}/api/fases/${collectionId}/${referenciaId}/${fasesSlug}/`;
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
            console.error(`[Next.js SC - Fase Detalle] Error al obtener datos para fase '${fasesSlug}' de referencia '${referenciaId}' (Colección: ${collectionId}): STATUS ${res.status}. Cuerpo: ${errorBody}`);
            return null;
        }

        const data = await res.json();
        console.log(`[Next.js SC - Fase Detalle] Datos recibidos para fase ${fasesSlug}:`, data);
        return data;
    } catch (error) {
        console.error(`[Next.js SC - Fase Detalle] Error de red o al parsear JSON para fase ${fasesSlug} (Colección: ${collectionId}):`, error);
        return null;
    }
}
