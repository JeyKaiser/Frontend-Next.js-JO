// app/(dashboard)/referencias-por-anio/[collectionId]/page.tsx
import CardReferencia from '@/app/globals/components/molecules/CardReferencia';
import type { ReferenciasAnioApiResponse } from '@/app/modules/types';
import Link from 'next/link';

interface ReferenciasListPageProps {
  params: {
    collectionId: string;
  };
}

async function getReferenciasList(collectionId: string): Promise<ReferenciasAnioApiResponse[] | null> {
  const DJANGO_API_BASE_URL = 'http://localhost:8000';
  try {
    const apiUrl = `${DJANGO_API_BASE_URL}/api/referencias-por-anio/${collectionId}/`;
    console.log(`[Next.js SC - Referencias List] Solicitando API: ${apiUrl}`);
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) {
      let errorBody = 'No body';
      try { errorBody = await res.text(); } catch (e) {}
      console.error(`[Next.js SC - Referencias List] Error al obtener referencias para ID '${collectionId}': STATUS ${res.status}. Cuerpo: ${errorBody}`);
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

export default async function ReferenciasListPage({ params }: ReferenciasListPageProps) {
  const { collectionId } = await params;
  console.log(`[ReferenciasListPage] Cargando referencias para collectionId: ${collectionId}`);

  const modelos = await getReferenciasList(collectionId);

  if (!modelos) {
    return (
      <div className="text-center p-8 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Error al cargar las referencias.</h1>
        <p>Verifica la API de Django o la conexión.</p>
        <p className="text-sm text-gray-500">ID de Año/Colección: {collectionId}</p>
      </div>
    );
  }

  if (modelos.length === 0) {
    return (
      <div className="text-center p-8 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">No hay referencias disponibles.</h1>
        <p>No se encontraron referencias para el año/colección: {collectionId}.</p>
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
        {collectionId && (
          <p className="text-gray-600 text-lg mt-2">
            (Año: {collectionId})
          </p>
        )}
      </header>
      <div className="grid grid-cols-[repeat(auto-fit,_200px)] justify-center gap-6 px-4 py-8 items-start">
        {modelos.map((modelo, index) => {
          const fullImageSrc = modelo.U_GSP_Picture
            ? `${modelo.U_GSP_Picture.replace(/\\/g, '/')}`
            : '/img/SIN FOTO.png';

          // *** CAMBIO CRUCIAL: Incluir collectionId como parte de la ruta ***
          const destinationUrl = `/modules/referencia-detalle/${collectionId}/${modelo.U_GSP_REFERENCE}`;
          console.log(`[ReferenciasListPage] Generando enlace para ${modelo.U_GSP_REFERENCE}: ${destinationUrl} collectionId: ${collectionId}`);

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


