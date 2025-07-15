// app/(dashboard)/referencia-detalle/[referenciaId]/layout.tsx

import { getReferenciaData } from '@/lib/api';
import TabList from '@/components/molecules/TabList';
import { redirect } from 'next/navigation';

interface ReferenciaDetalleLayoutProps {
  children: React.ReactNode;
  params: {
    referenciaId: string;
  };
  searchParams: { 
    collectionId?: string;
  };
}

export default async function ReferenciaDetalleLayout({
  children,
  params,
  searchParams,
}: ReferenciaDetalleLayoutProps) {
  const { referenciaId } = await params;
  // Accede a collectionId de forma segura
  const collectionId = (await searchParams)?.collectionId; 

  if (!collectionId) {
      console.warn(`[Layout] collectionId no proporcionado para referencia ${referenciaId}.`);
      // No redirijas aquí directamente, el page.tsx raíz maneja la redirección inicial.
  }

  let referenciaData;
  try {
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
          Detalles de la Referencia:{referenciaData.nombre} ({referenciaId})
        </h1>
      </header>
      <div className="container mx-auto px-4 flex-grow">
        <TabList referenciaId={referenciaId} fases={fases} currentCollectionId={collectionId} />
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}