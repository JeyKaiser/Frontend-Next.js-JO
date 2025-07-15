// app/(dashboard)/referencia-detalle/[referenciaId]/page.tsx
// Este archivo es el ENCARGADO de la redirección inicial

import { getReferenciaData } from '@/lib/api'; // Asegúrate de importar la función correcta
import { redirect } from 'next/navigation';

interface ReferenciaDetallePageProps {
  params: {
    referenciaId: string;
  };
  searchParams: { // Necesitas esto para capturar el collectionId cuando la URL sea /referencia-detalle/PT01660?collectionId=063
    collectionId?: string;
  };
}

export default async function ReferenciaDetallePage({ params, searchParams }: ReferenciaDetallePageProps) {
  // 1. Desestructurar y esperar params y searchParams
  const { referenciaId } = await params;
  // Accede a collectionId de forma segura
  const collectionId = (await searchParams)?.collectionId; 

  // 2. Verificar si collectionId está presente ANTES de intentar redirigir
  if (!collectionId) {
    console.error("[ReferenciaDetallePage] Collection ID faltante en la URL inicial de la referencia. No se puede redirigir a una fase específica.");
    // Redirige a una página segura o muestra un error si el collectionId es indispensable desde el inicio
    redirect('/colecciones'); // Ejemplo: redirige a la página de selección de colecciones
  }

  // 3. Obtener los datos de la referencia para saber sus fases
  const referenciaData = await getReferenciaData(referenciaId);
  const fases = referenciaData?.fases_disponibles || [];

  // 4. Redirigir a la primera fase si existe
  if (fases.length > 0) {
    // IMPORTANTE: Construir la URL de redirección incluyendo el collectionId
    console.log(`[ReferenciaDetallePage] Redirigiendo a la primera fase: ${fases[0].slug} con collectionId: ${collectionId}`);
    redirect(`/referencia-detalle/${referenciaId}/fases/${fases[0].slug}?collectionId=${collectionId}`);
  } else {
    // Si no hay fases, mostrar un mensaje de que no hay nada que ver
    return (
      <div className="p-4">
        <p className="text-gray-600">No hay fases disponibles para esta referencia.</p>
      </div>
    );
  }
}