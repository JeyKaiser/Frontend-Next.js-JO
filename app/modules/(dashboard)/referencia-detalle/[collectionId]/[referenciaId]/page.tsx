// app/(dashboard)/referencia-detalle/[collectionId]/[referenciaId]/page.tsx
// Este archivo es el ENCARGADO de la redirección inicial

import { getReferenciaData } from '../../../../../globals/lib/api';
import { redirect } from 'next/navigation';

interface ReferenciaDetallePageProps {
  params: {
    collectionId: string; // <-- Ahora es un parámetro de ruta
    referenciaId: string;
  };
  // searchParams ya no es necesario aquí para obtener collectionId
  // searchParams: {
  //   collectionId?: string;
  // };
}

export default async function ReferenciaDetallePage({ params }: ReferenciaDetallePageProps) {
  // Desestructurar ambos de params
  const { referenciaId, collectionId } = await params;
  console.log(`[ReferenciaDetalle-Page] Recibido referenciaId: ${referenciaId}, collectionId: ${collectionId} (desde params)`);

  // Ya no necesitamos la validación de collectionId aquí, ya que es un param garantizado por la ruta
  // if (!collectionId) {
  //   console.error("[ReferenciaDetalle-Page] Collection ID faltante en la URL inicial de la referencia.");
  //   redirect('/colecciones');
  // }

  // Obtener los datos de la referencia para saber sus fases
  const referenciaData = await getReferenciaData(referenciaId);
  const fases = referenciaData?.fases_disponibles || [];

  // Redirigir a la primera fase si existe
  if (fases.length > 0) {
    console.log(`[ReferenciaDetalle-Page] Redirigiendo a la primera fase: ${fases[0].slug} con collectionId: ${collectionId} (ahora como param)`);
    // *** CAMBIO CLAVE: La URL de redirección usa collectionId como parámetro de ruta ***
    redirect(`/modules/referencia-detalle/${collectionId}/${referenciaId}/fases/${fases[0].slug}`);
  } else {
    // Si no hay fases, mostrar un mensaje de que no hay nada que ver
    return (
      <div className="p-4">
        <p className="text-gray-600">No hay fases disponibles para esta referencia.</p>
      </div>
    );
  }
}
