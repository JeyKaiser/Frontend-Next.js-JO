// app/(dashboard)/referencia-detalle/[referenciaId]/page.tsx
// Este archivo manejará la URL: /referencia-detalle/PT00001 (sin la fase)

import { getReferenciaData } from '@/lib/api';
import { notFound, redirect } from 'next/navigation';
import type { FaseDisponible } from '../../../../app/types';

interface ReferenciaBasePageProps {
  params: {
    referenciaId: string;
  };
}

export default async function ReferenciaBasePage({ params }: ReferenciaBasePageProps) {
  const { referenciaId } = await params;

  const referenciaData = await getReferenciaData(referenciaId);

  if (!referenciaData) {
    console.error(`[ReferenciaBasePage] Referencia con ID ${referenciaId} no encontrada para redirección.`);
    notFound();
  }

  // Si no hay fases disponibles, puedes redirigir a una página de "no fases" o mostrar un mensaje
  if (!referenciaData.fases_disponibles || referenciaData.fases_disponibles.length === 0) {
    console.warn(`[ReferenciaBasePage] Referencia ${referenciaId} no tiene fases disponibles para redirección.`);
    // Podrías redirigir a una ruta como /referencia-detalle/PT00001/no-fases
    // Por ahora, solo muestra un mensaje simple o lanza un error si es un caso no esperado.
    return (
        <div className="container mx-auto p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Referencia {referenciaId}</h1>
            <p className="text-red-500">No hay fases disponibles para esta referencia.</p>
        </div>
    );
  }

  // Redirigir a la primera fase disponible si no se ha especificado ninguna en la URL
  const primeraFaseSlug = referenciaData.fases_disponibles[0].slug;
  console.log(`[ReferenciaBasePage] Redirigiendo a la primera fase: ${primeraFaseSlug}`);
  redirect(`/referencia-detalle/${referenciaId}/fases/${primeraFaseSlug}`);

  // Este componente nunca debería renderizar directamente nada si la redirección ocurre
  // return null; // O un spinner si la redirección tarda mucho, aunque es instantáneo.
}

