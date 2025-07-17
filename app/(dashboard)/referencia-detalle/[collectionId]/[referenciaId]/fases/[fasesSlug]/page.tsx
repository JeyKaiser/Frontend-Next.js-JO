// app/(dashboard)/referencia-detalle/[collectionId]/[referenciaId]/fases/[fasesSlug]/page.tsx

import { getFaseData } from '@/lib/api';
import { notFound } from 'next/navigation';

interface ReferenciaFasePageProps {
  params: {
    collectionId: string; // <-- Ahora es un parámetro de ruta
    referenciaId: string;
    fasesSlug: string;
  };
  // searchParams ya no es necesario aquí para collectionId
  // searchParams: {
  //   collectionId?: string;
  // };
}

export default async function ReferenciaFasePage({ params }: ReferenciaFasePageProps) {
  // Desestructurar todos los parámetros de ruta
  const { referenciaId, collectionId, fasesSlug } = params; 

  console.log("Contenido de params en ReferenciaFasePage (después de await):", { referenciaId, collectionId, fasesSlug });
  
  // Llama a la API para obtener los datos específicos de esta fase, pasando el collectionId
  const faseData = await getFaseData(referenciaId, fasesSlug, collectionId); // <-- Pasa collectionId aquí

  if (!faseData) {
    console.error(`[ReferenciaFasePage] No se pudieron obtener datos para la fase ${fasesSlug} de la referencia ${referenciaId}.`);
    notFound();
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Contenido de la Fase: {fasesSlug.toUpperCase()}</h2>
      <p className="text-gray-600">
        Esta es la página para la fase **{fasesSlug.toUpperCase()}** de la referencia **{referenciaId}**.
        Colección: **{collectionId}**
      </p>
      <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-sm overflow-auto">
        {JSON.stringify(faseData, null, 2)}
      </pre>
    </div>
  );
}

