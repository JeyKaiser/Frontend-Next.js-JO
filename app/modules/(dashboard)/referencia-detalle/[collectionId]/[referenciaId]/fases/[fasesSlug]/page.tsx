// app/(dashboard)/referencia-detalle/[collectionId]/[referenciaId]/fases/[fasesSlug]/page.tsx

import { getFaseData } from '@/app/globals/lib/api';
import { notFound } from 'next/navigation';
import FaseMdCreacionFicha from '@/app/globals/components/organisms/FaseMdCreacionFicha';
import { MdCreacionFichaData } from '@/app/modules/types/index'; 

interface ReferenciaFasePageProps {
  params: {
    collectionId: string;
    referenciaId: string;
    fasesSlug: string;
  };
}

export default async function ReferenciaFasePage({ params }: ReferenciaFasePageProps) {
  const { referenciaId, collectionId, fasesSlug } = params; 

  console.log("Contenido de params en ReferenciaFasePage:", { referenciaId, collectionId, fasesSlug });

  // La validación de collectionId ya no es estrictamente necesaria aquí si es un param de ruta garantizado
  // if (!collectionId) {
  //   console.error(`[ReferenciaFasePage] collectionId es requerido para la fase ${fasesSlug} de la referencia ${referenciaId}.`);
  //   notFound();
  // }

  // Llama a la API para obtener los datos específicos de esta fase
  const faseData = await getFaseData(referenciaId, fasesSlug, collectionId); 

  if (!faseData) {
    console.error(`[ReferenciaFasePage] No se pudieron obtener datos para la fase ${fasesSlug} de la referencia ${referenciaId}.`);
    notFound();
  }

  // Renderizado condicional del contenido de la fase
  let content;
  switch (fasesSlug) {
    case 'md-creacion-ficha':
      // Asegúrate de que faseData coincide con la interfaz MdCreacionFichaData
      content = (
        <FaseMdCreacionFicha 
          data={faseData as MdCreacionFichaData} // Castea el tipo para asegurar compatibilidad
          referenciaId={referenciaId} 
          collectionId={collectionId} 
        />
      );
      break;
    case 'jo':
      content = (
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Contenido de la Fase: JO</h2>
          <p className="text-gray-600">
            Esta es la página para la fase **JO** de la referencia **{referenciaId}** de la colección **{collectionId}**.
          </p>
          <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-sm overflow-auto">
            {JSON.stringify(faseData, null, 2)}
          </pre>
        </div>
      );
      break;
    // Añade más casos para otras fases según sea necesario
    default:
      content = (
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Contenido de la Fase: {fasesSlug.toUpperCase()}</h2>
          <p className="text-gray-600">
            Esta es la página para la fase **{fasesSlug.toUpperCase()}** de la referencia **{referenciaId}** de la colección **{collectionId}**.
            Aquí es donde se cargará el contenido específico de cada fase (tablas, imágenes, formularios, etc.).
          </p>
          <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-sm overflow-auto">
            {JSON.stringify(faseData, null, 2)}
          </pre>
        </div>
      );
      break;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {content}
    </div>
  );
}

