// app/(dashboard)/referencia-detalle/[collectionId]/[referenciaId]/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { getReferenciaData, getCollectionName, getFormattedReferenceName } from '@/app/globals/lib/api';
import PhaseKanbanCarousel from '@/app/globals/components/organisms/PhaseKanbanCarousel';
import { redirect } from 'next/navigation';

interface ReferenciaDetalleLayoutProps { 
  children: React.ReactNode; 
  params: { 
      collectionId: string;
      referenciaId: string;
  };
}

export default function ReferenciaDetalleLayout({children, params,}: ReferenciaDetalleLayoutProps) {
  const { referenciaId, collectionId } = params;
  const [referenciaData, setReferenciaData] = useState<any>(null);
  const [currentPhaseSlug, setCurrentPhaseSlug] = useState('jo');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!referenciaId || !collectionId) {
        console.error("[ReferenciaDetalle-Layout] referenciaId o collectionId no proporcionados.");
        redirect('/404');
      }
      try {
        setLoading(true);
        const data = await getReferenciaData(referenciaId, collectionId);
        setReferenciaData(data);
        if (data && data.fases_disponibles && data.fases_disponibles.length > 0) {
          setCurrentPhaseSlug(data.fases_disponibles[0].slug);
        }
      } catch (error) {
        console.error(`[Layout] Error al obtener referenciaData para ${referenciaId}:`, error);
        redirect('/error-generico');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [referenciaId, collectionId]);

  if (loading) {
    return <div>Cargando...</div>; 
  }

  if (!referenciaData) {
    return <div>No se encontraron datos de la referencia.</div>;
  }

  const fases = referenciaData.fases_disponibles || [];
  const collectionName = referenciaData.collection_name || getCollectionName(collectionId);
  const referenceName = referenciaData.reference_name || getFormattedReferenceName(referenciaId);
  const descriptiveName = referenciaData.nombre && referenciaData.nombre !== `Referencia ${referenciaId}` 
    ? referenciaData.nombre 
    : `Referencia ${referenciaId}`;

  const handlePhaseChange = (newPhaseSlug: string) => {
    setCurrentPhaseSlug(newPhaseSlug);
  };

  return (
    <div className="flex flex-col h-full bg-secondary-50">
      <header className="bg-white shadow-soft border-b border-secondary-200 p-6 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="heading-2">
            {descriptiveName}
          </h1>
          <p className="body-medium text-secondary-600 mt-2">
            Nombre: {referenceName} • Colección: {collectionName}
          </p>
        </div>
      </header>
      <div className="max-w-8xl mx-auto px-6 flex-grow w-full">
        
        <PhaseKanbanCarousel
          referenciaId={referenciaId}
          collectionId={collectionId}
          fases={fases}
          currentPhaseSlug={currentPhaseSlug}
          onPhaseChange={handlePhaseChange}
          onPhaseAction={async (phaseSlug, action, notes) => {
            console.log(`Phase action: ${action} on ${phaseSlug}`, notes);
            // Here you would implement the actual phase action logic
            // For now, just simulate the phase change for the frontend
            if (action === 'deliver') {
              const currentIndex = fases.findIndex(f => f.slug === phaseSlug);
              if (currentIndex !== -1 && currentIndex < fases.length - 1) {
                const nextPhase = fases[currentIndex + 1];
                handlePhaseChange(nextPhase.slug);
              }
            }
          }}
        />

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
