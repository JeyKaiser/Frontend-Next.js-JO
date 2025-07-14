// app/(dashboard)/referencias-por-anio/[collectionId]/page.tsx

import CardReferencia from '@/components/molecules/CardReferencia';
import type { ReferenciasAnioApiResponse } from '../../../../app/types';

<<<<<<< HEAD
// Definición de la interfaz de props. Sencilla y directa.
=======
>>>>>>> 0a4aad9b8c29d92ff11db95fab1bd4908b1a9143
interface ReferenciasListPageProps { 
  params: {
    collectionId: string; // El ID del AÑO/COLECCIÓN (ej. "063", "085")
  };
}

// Función para obtener referencias (sin cambios en la lógica de obtención)
async function getReferenciasList(collectionId: string): Promise<ReferenciasAnioApiResponse[] | null> {
  const DJANGO_API_BASE_URL = 'http://localhost:8000';

  try {
<<<<<<< HEAD
    const apiUrl = `${DJANGO_API_BASE_URL}/api/referencias-por-anio/${collectionId}/`;   // Esta API DEBE devolver un array de ReferenciaCardData
    console.log(`[Next.js SC - Referencias List] Solicitando API: ${apiUrl}`);
=======
    const apiUrl = `${DJANGO_API_BASE_URL}/api/referencias-por-anio/${collectionId}/`; // Esta API DEBE devolver un array de ReferenciaCardData
    console.log(`[Next.js SC - Referencias List] Solicitando API: ${apiUrl}, con ID de colección: ${collectionId}`);
>>>>>>> 0a4aad9b8c29d92ff11db95fab1bd4908b1a9143
    const res = await fetch(apiUrl, {
      cache: 'no-store',
    });
    console.log(`[Next.js SC - Referencias List] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);
    
    if (!res.ok) {
      let errorBody = 'No body';
      try {
          errorBody = await res.text();
      } catch (e) {}
      console.error(`[Next.js SC - Referencias List] Error al obtener referencias para ID '${collectionId}': STATUS ${res.status}. Cuerpo: ${errorBody}`);
      // Si el API de Django devuelve un JSON vacío o no OK, esto devuelve `null`,
      // lo que activa el mensaje "Error al cargar las referencias." en el UI.
      return null;
    }
    const data: ReferenciasAnioApiResponse[] = await res.json();
    console.log(`[Next.js SC - Referencias List] Datos recibidos:`, data);
    return data;
  } catch (error) {
    console.error("[Next.js SC - Referencias List] Error de red o al parsear JSON:", error);
    return null;
  }
}

// Exportación del componente de página
export default async function ReferenciasListPage({ params }: ReferenciasListPageProps) {
  const { collectionId } = await params; // Obtiene el ID del año/colección

  // Log para depuración:
  console.log(`[ReferenciasListPage] Cargando referencias para collectionId: ${collectionId}`);

  const modelos = await getReferenciasList(collectionId); // Obtiene los modelos (cards PT...)

  if (!modelos) {
    return (
      <div className="text-center p-8 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Error al cargar las referencias.</h1>
        <p>Verifica la API de Django o la conexión.</p>
        <p className="text-sm text-gray-500">ID de Año/Colección: {collectionId}</p>
      </div>
    );
  }

  // Si modelos es un array vacío, muestra un mensaje específico
  if (modelos.length === 0) {
    return (
      <div className="text-center p-8 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">No hay referencias disponibles.</h1>
        <p>No se encontraron referencias para el año/colección: {collectionId}.</p>
      </div>
    );
  }

  const displayTitle = `REFERENCIAS PARA EL AÑO: ${collectionId}`;
  return (
    <>
      <header className="text-center mb-10 relative">
        <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
          {displayTitle}
        </h2>
        {collectionId && (
          <p className="text-gray-600 text-lg mt-2">
            (Año: {collectionId})
          </p>
        )}
      </header>
      <div className="grid grid-cols-[repeat(auto-fit,_200px)] justify-center gap-6 px-4 py-8 items-start">
        {modelos.map((modelo, index) => {
          // Asegúrate de que U_GSP_Picture es un string
          const fullImageSrc = modelo.U_GSP_Picture
            ? `${modelo.U_GSP_Picture.replace(/\\/g, '/')}`
            : '/img/SIN FOTO.png';

          const destinationUrl = `/referencia-detalle/${modelo.U_GSP_REFERENCE}`;

          return (
            <CardReferencia
              key={modelo.U_GSP_REFERENCE || modelo.id || index}
              imageSrc={fullImageSrc}
              title={modelo.U_GSP_REFERENCE}
              subtitle={modelo.U_GSP_Desc}
              href={destinationUrl}
            />
          );
        })}
      </div>
    </>
  );
}