// components/molecules/TabList.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaseDisponible } from '@/app/modules/types';

interface TabListProps {
  referenciaId: string;
  fases: FaseDisponible[];
  currentCollectionId?: string; // Recibe el collectionId del layout
  collectionName?: string; // Recibe el nombre de la colección
}

const TabList: React.FC<TabListProps> = ({ referenciaId, fases, currentCollectionId, collectionName }) => {
  const pathname = usePathname();
  console.log(`[TabList] Recibido referenciaId: ${referenciaId}, currentCollectionId: ${currentCollectionId}, collectionName: ${collectionName}`);

  return (
    <nav className="flex space-x-1 border-b border-secondary-200 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
      {fases.map((fase) => {
        // *** CORRECCIÓN: Construcción del href con el prefijo /modules/ correcto ***
        // Asegúrate de que currentCollectionId exista para construir la URL correctamente
        const href = currentCollectionId 
          ? `/modules/referencia-detalle/${currentCollectionId}/${referenciaId}/fases/${fase.slug}` 
          : `/modules/referencia-detalle/${referenciaId}/fases/${fase.slug}`; // Fallback (aunque no debería ocurrir si collectionId es siempre un param)

        console.log(`[TabList] Generando href para fase ${fase.slug}: ${href}`);

        // La lógica isActive debe coincidir con la nueva estructura de URL
        // Si el pathname incluye el collectionId como parte de la ruta, la comparación debe ser más específica.
        // Ejemplo: /modules/referencia-detalle/063/PT01660/fases/jo
        const isActive = pathname.startsWith(`/modules/referencia-detalle/${currentCollectionId}/${referenciaId}/fases/${fase.slug}`);

        return (
          <Link key={fase.slug} href={href}>
            <div
              className={`
                px-4 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-200 ease-in-out cursor-pointer
                ${isActive
                  ? 'bg-primary-600 text-white shadow-sm border-primary-600'
                  : 'text-secondary-700 hover:bg-secondary-50 hover:text-primary-600 border-transparent hover:border-primary-200'
                }
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
