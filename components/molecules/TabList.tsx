// components/molecules/TabList.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaseDisponible } from '../../app/types';

interface TabListProps {
  referenciaId: string;
  fases: FaseDisponible[];
  currentCollectionId?: string; // Recibe el collectionId del layout
}

const TabList: React.FC<TabListProps> = ({ referenciaId, fases, currentCollectionId }) => {
  const pathname = usePathname();
  console.log(`[TabList] Recibido referenciaId: ${referenciaId}, currentCollectionId: ${currentCollectionId}`);

  return (
    <nav className="flex space-x-1 border-b border-gray-200 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
      {fases.map((fase) => {
        // *** CAMBIO CLAVE: Construcción del href con collectionId como parámetro de ruta ***
        // Asegúrate de que currentCollectionId exista para construir la URL correctamente
        const href = currentCollectionId 
          ? `/referencia-detalle/${currentCollectionId}/${referenciaId}/fases/${fase.slug}` 
          : `/referencia-detalle/${referenciaId}/fases/${fase.slug}`; // Fallback (aunque no debería ocurrir si collectionId es siempre un param)

        console.log(`[TabList] Generando href para fase ${fase.slug}: ${href}`);

        // La lógica isActive debe coincidir con la nueva estructura de URL
        // Si el pathname incluye el collectionId como parte de la ruta, la comparación debe ser más específica.
        // Ejemplo: /referencia-detalle/063/PT01660/fases/jo
        const isActive = pathname.startsWith(`/referencia-detalle/${currentCollectionId}/${referenciaId}/fases/${fase.slug}`);

        return (
          <Link key={fase.slug} href={href}>
            <div
              className={`
                px-4 py-2 text-sm font-medium rounded-t-lg
                ${isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }
                transition-colors duration-200 ease-in-out cursor-pointer
              `}
            >
              {fase.nombre}
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default TabList;
