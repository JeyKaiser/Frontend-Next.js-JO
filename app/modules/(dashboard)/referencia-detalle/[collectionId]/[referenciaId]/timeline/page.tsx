// app/(dashboard)/referencia-detalle/[collectionId]/[referenciaId]/timeline/page.tsx

import { getReferenciaData, getCollectionName, getFormattedReferenceName } from '@/app/globals/lib/api';
import { notFound } from 'next/navigation';
import ProductionTimeline from '@/app/globals/components/organisms/ProductionTimeline';

interface ReferenciaTimelinePageProps {
  params: {
    collectionId: string;
    referenciaId: string;
  };
  searchParams: {
    currentPhase?: string;
  };
}

export default async function ReferenciaTimelinePage({ 
  params, 
  searchParams 
}: ReferenciaTimelinePageProps) {
  const { referenciaId, collectionId } = params;
  const { currentPhase } = searchParams;

  console.log(`[ReferenciaTimelinePage] Loading timeline for ${referenciaId} in collection ${collectionId}`);

  // Get reference data to obtain available phases
  const referenciaData = await getReferenciaData(referenciaId, collectionId);

  if (!referenciaData) {
    console.error(`[ReferenciaTimelinePage] No se pudieron obtener datos para la referencia ${referenciaId}.`);
    notFound();
  }

  // Get enhanced names for display
  const collectionName = getCollectionName(collectionId);
  const referenceName = getFormattedReferenceName(referenciaId);

  return (
    <div className="page-container">
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-secondary-600 mb-4">
          <a href="/modules/colecciones" className="hover:text-primary-600">
            Colecciones
          </a>
          <span>/</span>
          <a 
            href={`/modules/colecciones/${collectionId}/referencias-por-anio`}
            className="hover:text-primary-600"
          >
            {collectionName}
          </a>
          <span>/</span>
          <a 
            href={`/modules/referencia-detalle/${collectionId}/${referenciaId}`}
            className="hover:text-primary-600"
          >
            {referenceName}
          </a>
          <span>/</span>
          <span className="text-secondary-900 font-medium">Timeline de Producción</span>
        </nav>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">
              Timeline de Producción
            </h1>
            <p className="text-secondary-600 mt-1">
              Control empresarial de fases para {referenceName}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href={`/modules/referencia-detalle/${collectionId}/${referenciaId}`}
              className="inline-flex items-center px-4 py-2 border border-secondary-300 rounded-lg text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50 transition-colors"
            >
              ← Volver a Fases
            </a>
          </div>
        </div>
      </div>

      <ProductionTimeline
        referenciaId={referenciaId}
        fases={referenciaData.fases_disponibles || []}
        currentCollectionId={collectionId}
        collectionName={collectionName}
        currentPhaseSlug={currentPhase}
      />
    </div>
  );
}