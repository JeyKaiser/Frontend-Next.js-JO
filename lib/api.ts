

import type { ReferenciaDetalleAPI, FaseDisponible } from '../app/types'; // Asegúrate de que esta ruta sea correcta

// Función para obtener los datos detallados de UNA ÚNICA referencia
export async function getReferenciaData(referenciaId: string): Promise<ReferenciaDetalleAPI | null> {
  const DJANGO_API_BASE_URL = 'http://localhost:8000';

  try {
    const apiUrl = `${DJANGO_API_BASE_URL}/api/referencias/${referenciaId}/`; // Esta URL llama a tu ReferenciaDetailView en Django
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

// Puedes añadir otras funciones de API aquí en el futuro
// export async function anotherApiCall(...) { ... }


// // lib/api.ts

// import { ReferenciaDetalleAPI } from '../app/types'; // Importa el tipo correcto

// const API_BASE_URL = 'http://localhost:8000/api';

// // Esta función obtiene los detalles de UNA referencia específica, incluyendo sus fases
// export async function getReferenciaData(referenciaId: string): Promise<ReferenciaDetalleAPI> {
//   const res = await fetch(`${API_BASE_URL}/referencias/${referenciaId}/`, {
//     cache: 'no-store', // Mantener 'no-store' por ahora ya que los datos de fase pueden cambiar
//   });

//   if (!res.ok) {
//     // Si la API devuelve un error (ej. 404), lanza un error para que el layout.tsx pueda capturarlo
//     const errorBody = await res.text();
//     console.error(`Error al obtener detalles de referencia ${referenciaId}: ${res.status} - ${errorBody}`);
//     throw new Error(`Failed to fetch referencia details for ${referenciaId}. Status: ${res.status}`);
//   }

//   return res.json();
// }

// // FUTURO: Aquí crearás funciones para obtener datos de fases específicas:
// // export async function getFaseData(referenciaId: string, faseSlug: string): Promise<any> {
// //   // ... implementar la llamada al endpoint de Django para la fase específica
// //   // ej. `${API_BASE_URL}/referencias/${referenciaId}/fases/${faseSlug}/`
// // }