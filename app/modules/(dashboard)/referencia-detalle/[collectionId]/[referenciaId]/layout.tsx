// app/(dashboard)/referencia-detalle/[collectionId]/[referenciaId]/layout.tsx

import { getReferenciaData, getCollectionName, getFormattedReferenceName } from '@/app/globals/lib/api';
import TabList from '@/app/globals/components/molecules/TabList';
import { redirect } from 'next/navigation';

interface ReferenciaDetalleLayoutProps { 
  children: React.ReactNode; 
  params: { 
      collectionId: string;
      referenciaId: string;
  };
  // searchParams ya no es necesario aquí para obtener collectionId
  // searchParams: {
  //   collectionId?: string;
  // };
}

export default async function ReferenciaDetalleLayout({children, params,}: ReferenciaDetalleLayoutProps) {
  // Desestructurar ambos de params
  const { referenciaId, collectionId } = await params;
  console.log(`[ReferenciaDetalle-Layout] Recibido referenciaId: ${referenciaId}, collectionId: ${collectionId} (desde params)`);

  if (!referenciaId || !collectionId) {
    console.error("[ReferenciaDetalle-Layout] referenciaId o collectionId no proporcionados.");
    redirect('/404');
  }

  let referenciaData;
  try {
      // Enhanced: Pass collectionId to get complete information
      referenciaData = await getReferenciaData(referenciaId, collectionId);
  } catch (error) {
      console.error(`[Layout] Error al obtener referenciaData para ${referenciaId}:`, error);
      redirect('/error-generico');
  }
  
  if (!referenciaData) {
    redirect('/404');
  }

  const fases = referenciaData.fases_disponibles || [];
  
  // Get enhanced names
  const collectionName = referenciaData.collection_name || getCollectionName(collectionId);
  const referenceName = referenciaData.reference_name || getFormattedReferenceName(referenciaId);
  
  // Extract descriptive name from the API response if available
  const descriptiveName = referenciaData.nombre && referenciaData.nombre !== `Referencia ${referenciaId}` 
    ? referenciaData.nombre 
    : `Referencia ${referenciaId}`;

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
      <div className="max-w-7xl mx-auto px-6 flex-grow w-full">
        
        <TabList 
          referenciaId={referenciaId} 
          fases={fases} 
          currentCollectionId={collectionId}
          collectionName={collectionName}
        />

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
