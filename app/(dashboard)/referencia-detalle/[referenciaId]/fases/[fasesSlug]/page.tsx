// app/(dashboard)/referencia-detalle/[referenciaId]/fases/[fasesSlug]/page.tsx
// Este archivo es el que MUESTRA los detalles de la fase

import { getFaseData } from '@/lib/api';
import { notFound } from 'next/navigation';

interface ReferenciaFasePageProps {
  params: {
    referenciaId: string;
    fasesSlug: string;
  };
  searchParams: {
    collectionId?: string;
  };
}

export default async function ReferenciaFasePage({ params, searchParams }: ReferenciaFasePageProps) {
  const { referenciaId, fasesSlug } = await params;
  // Accede a collectionId de forma segura
  const collectionId = (await searchParams)?.collectionId; 

  console.log("Contenido de params en ReferenciaFasePage (después de await):", { referenciaId, fasesSlug });
  console.log("Contenido de searchParams.collectionId en ReferenciaFasePage:", collectionId);

  if (!collectionId) {
    console.error(`[ReferenciaFasePage] collectionId es requerido para la fase ${fasesSlug} de la referencia ${referenciaId}.`);
    notFound(); // Esto activará un 404 si el collectionId no llega
  }

  const faseData = await getFaseData(referenciaId, fasesSlug, collectionId);

  if (!faseData) {
    console.error(`[ReferenciaFasePage] No se pudieron obtener datos para la fase ${fasesSlug} de la referencia ${referenciaId}.`);
    notFound();
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Contenido de la Fase: {fasesSlug.toUpperCase()}</h2>
      <p className="text-gray-600">
        Esta es la página para la fase **{fasesSlug.toUpperCase()}** de la referencia **{referenciaId}**.
        Aquí es donde se cargará el contenido específico de cada fase (tablas, imágenes, formularios, etc.).
      </p>
      <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-sm overflow-auto">
        {JSON.stringify(faseData, null, 2)}
      </pre>
    </div>
  );
}