import CardReferencia from '@/components/molecules/CardReferencia';
import type { ReferenciaData } from '../../../types';

interface ReferenciasPageProps {
  params: {
    collectionId: string; // El ID de la colección/año que viene de la URL
  };
}

// Función para obtener referencias (sin cambios en la lógica de obtención)
async function getReferencias(collectionId: string): Promise<ReferenciaData[] | null> {
  const DJANGO_API_BASE_URL = 'http://localhost:8000';

  try {
    const apiUrl = `${DJANGO_API_BASE_URL}/api/referencias/${collectionId}/`;

    console.log(`[Next.js SC - Referencias] Solicitando API: ${apiUrl}`);

    const res = await fetch(apiUrl, {
      cache: 'no-store',
    });

    console.log(`[Next.js SC - Referencias] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);

    if (!res.ok) {
      let errorBody = 'No body';
      try {
          errorBody = await res.text();
      } catch (e) {}
      console.error(`[Next.js SC - Referencias] Error al obtener referencias para ID '${collectionId}': STATUS ${res.status}. Cuerpo: ${errorBody}`);
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

  if (!modelos) {
    return (
      <div className="text-center p-8 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Error al cargar las referencias.</h1>
        <p>Verifica la API de Django o la conexión.</p>
        <p className="text-sm text-gray-500">ID de Colección: {collectionId}</p>
      </div>
    );
  }

  const displayTitle = `REFERENCIAS DEL AÑO: ${collectionId}`;

  return (
    <>
      <header className="text-center mb-10 relative">
        <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
          {displayTitle}
        </h2>
        {/* <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mx-auto mt-2 rounded-full" /> */}
        {collectionId && (
          <p className="text-gray-600 text-lg mt-2">
            (Colección: {collectionId})
          </p>
        )}
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,_200px)] justify-center gap-6 px-4 py-8 items-start">
        {modelos.length === 0 && (
            <p className="col-span-full text-center text-gray-600">No hay referencias disponibles para este ID.</p>
        )}
        {modelos.map((modelo, index) => {
          const fullImageSrc = modelo.U_GSP_Picture
            ? `${modelo.U_GSP_Picture.replace(/\\/g, '/')}`
            : '/img/SIN FOTO.png';

          return (
            <CardReferencia
              key={modelo.U_GSP_REFERENCE || modelo.id || index}
              imageSrc={fullImageSrc}
              title={modelo.U_GSP_REFERENCE}
              subtitle={modelo.U_GSP_Desc}
              referencePt={modelo.U_GSP_REFERENCE}
              collectionId={collectionId}
            />
          );
        })}
      </div>
    </>
  );
}
