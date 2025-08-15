// app/(dashboard)/referencia-detalle/[collectionId]/[referenciaId]/layout.tsx

import { getReferenciaData } from '@/app/globals/lib/api';
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
      // getReferenciaData no necesita collectionId si es solo para datos generales de la referencia
      referenciaData = await getReferenciaData(referenciaId);
  } catch (error) {
      console.error(`[Layout] Error al obtener referenciaData para ${referenciaId}:`, error);
      redirect('/error-generico');
  }
  
  if (!referenciaData) {
    redirect('/404');
  }

  const fases = referenciaData.fases_disponibles || [];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="bg-white shadow p-4 mb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {/* Detalles de la Referencia:{referenciaData.nombre} ({referenciaId}) */}
          {referenciaData.nombre}
        </h1>
      </header>
      <div className="container mx-auto px-4 flex-grow">
        
        <TabList referenciaId={referenciaId} fases={fases} currentCollectionId={collectionId} />     {/* Pasar collectionId a TabList */}

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
