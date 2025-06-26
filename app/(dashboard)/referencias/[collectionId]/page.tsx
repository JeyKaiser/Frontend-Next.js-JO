// app/(dashboard)/referencias/[collectionId]/page.tsx
// 'use client'; // No necesita ser cliente si solo hace fetch y renderiza.

// Update the import path if CardReferencia is located elsewhere, for example:
import CardReferencia from '../../../../components/molecules/CardReferencia';
// Or provide the correct relative path based on your project structure
import type { ReferenciaData } from '../../../types'; 

interface ReferenciasPageProps {
  params: {
    collectionId: string; // El ID de la colección/año que viene de la URL
  };
}

async function getReferencias(collectionId: string): Promise<ReferenciaData[] | null> {
  const DJANGO_API_BASE_URL = 'http://localhost:8000';

  try {
    const apiUrl = `${DJANGO_API_BASE_URL}/api/referencias/${collectionId}/`;
    
    console.log(`[Next.js SC - Referencias] Solicitando API: ${apiUrl}`);

    const res = await fetch(apiUrl, {
      cache: 'no-store', // Siempre obtiene los últimos datos
    });

    console.log(`[Next.js SC - Referencias] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);

    if (!res.ok) {
      let errorBody = 'No body';
      try {
          errorBody = await res.text();
      } catch (e) {}
      console.error(`[Next.js SC - Referencias] Error al obtener referencias para ID '${collectionId}': STATUS ${res.status}. Cuerpo: ${errorBody}`);
      // Podrías devolver un array vacío o un error específico
      return null;
    }

    const data: ReferenciaData[] = await res.json();
    console.log(`[Next.js SC - Referencias] Datos recibidos:`, data);
    return data;
  } catch (error) {
    console.error("[Next.js SC - Referencias] Error de red o al parsear JSON:", error);
    return null;
  }
}

export default async function ReferenciasPage({ params }: ReferenciasPageProps) {
  const { collectionId } = params;
  const modelos = await getReferencias(collectionId);

  if (!modelos) { // Si es null, hubo un error de carga o API
    return (
      <div className="text-center p-8 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Error al cargar las referencias.</h1>
        <p>Verifica la API de Django o la conexión.</p>
        <p className="text-sm text-gray-500">ID de Colección: {collectionId}</p>
      </div>
    );
  }

  return (
    <>
      <header className="text-center mb-10 relative">
        <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
          REFERENCIAS PARA ID: {collectionId}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mx-auto mt-2 rounded-full" />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8">
        {modelos.length === 0 && (
            <p className="col-span-full text-center text-gray-600">No hay referencias disponibles para este ID.</p>
        )}
        {modelos.map((modelo, index) => (
          // Usamos el índice como key si no hay un ID único garantizado en cada 'modelo'
          <CardReferencia
            key={modelo.U_GSP_REFERENCE || index} // Usa una propiedad única si existe, si no, index
            imageSrc={modelo.U_GSP_Picture}
            title={modelo.U_GSP_REFERENCE}
            description={modelo.U_GSP_Desc}
            // No hay href en tus referencias.html, así que no se pasa aquí
            // Si necesitas un href, agrégalo a la CardReferencia y a los datos de Django
          />
        ))}
      </div>
    </>
  );
}