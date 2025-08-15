// app/(dashboard)/referencia-detalle/[collectionId]/[referenciaId]/fases/[fasesSlug]/page.tsx

import { getFaseData, getCollectionName, getFormattedReferenceName } from '@/app/globals/lib/api';
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

  // Get enhanced names for display
  const collectionName = getCollectionName(collectionId);
  const referenceName = getFormattedReferenceName(referenciaId);

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
        <div className="phase-container">
          <div className="phase-header">
            <h2 className="phase-title">Fase JO</h2>
            <p className="phase-subtitle">
              Gestión y procesamiento de datos para la referencia {referenceName} de la colección {collectionName}
            </p>
          </div>
          <div className="phase-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="content-section">
                <div className="section-header">
                  <h3 className="section-title">Información General</h3>
                </div>
                <div className="section-body">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="body-medium font-medium">Referencia:</span>
                      <span className="status-info">{referenceName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="body-medium font-medium">Colección:</span>
                      <span className="status-info">{collectionName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="body-medium font-medium">Estado:</span>
                      <span className="status-success">Activo</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="content-section">
                <div className="section-header">
                  <h3 className="section-title">Progreso de la Fase</h3>
                </div>
                <div className="section-body">
                  <div className="space-y-4">
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div className="bg-primary-500 h-2 rounded-full w-3/4"></div>
                    </div>
                    <p className="body-small">75% completado</p>
                  </div>
                </div>
              </div>
            </div>
            
            {faseData && (
              <div className="content-section">
                <div className="section-header">
                  <h3 className="section-title">Datos de la Fase</h3>
                </div>
                <div className="section-body">
                  <div className="data-preview">
                    <pre className="data-preview-code">
                      {JSON.stringify(faseData, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
      break;
    // Añade más casos para otras fases según sea necesario
    default:
      content = (
        <div className="phase-container">
          <div className="phase-header">
            <h2 className="phase-title">Fase {fasesSlug.toUpperCase()}</h2>
            <p className="phase-subtitle">
              Gestión y procesamiento de datos para la referencia {referenceName} de la colección {collectionName}
            </p>
          </div>
          <div className="phase-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="content-section">
                <div className="section-header">
                  <h3 className="section-title">Información General</h3>
                </div>
                <div className="section-body">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="body-medium font-medium">Fase:</span>
                      <span className="status-info">{fasesSlug.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="body-medium font-medium">Referencia:</span>
                      <span className="status-info">{referenceName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="body-medium font-medium">Colección:</span>
                      <span className="status-info">{collectionName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="body-medium font-medium">Estado:</span>
                      <span className="status-warning">En desarrollo</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="content-section">
                <div className="section-header">
                  <h3 className="section-title">Próximas Funcionalidades</h3>
                </div>
                <div className="section-body">
                  <div className="space-y-3">
                    <p className="body-medium">Esta fase está siendo desarrollada y contendrá:</p>
                    <ul className="space-y-2 body-small ml-4">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                        Tablas de datos específicas
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                        Formularios de gestión
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                        Herramientas de visualización
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {faseData && (
              <div className="content-section">
                <div className="section-header">
                  <h3 className="section-title">Datos de la Fase</h3>
                </div>
                <div className="section-body">
                  <div className="data-preview">
                    <pre className="data-preview-code">
                      {JSON.stringify(faseData, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
      break;
  }

  return (
    <div className="page-container">
      {content}
    </div>
  );
}

