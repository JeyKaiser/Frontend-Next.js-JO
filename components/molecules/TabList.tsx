// components/molecules/TabList.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaseDisponible } from '../../app/types'; // Asegúrate de que la ruta sea correcta

interface TabListProps {
  referenciaId: string;
  fases: FaseDisponible[];
  currentCollectionId?: string; // <--- Acepta el nuevo prop
}

const TabList: React.FC<TabListProps> = ({ referenciaId, fases, currentCollectionId }) => {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-1 border-b border-gray-200 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
      {fases.map((fase) => {
        // Construye el href, incluyendo el collectionId como query parameter
        const href = `/referencia-detalle/${referenciaId}/fases/${fase.slug}${currentCollectionId ? `?collectionId=${currentCollectionId}` : ''}`;

        // Verifica si la ruta actual coincide con la URL de la pestaña
        // Esto puede necesitar un ajuste si también quieres que coincida con el query param
        const isActive = pathname.startsWith(`/referencia-detalle/${referenciaId}/fases/${fase.slug}`);
        // O más robusto: const isActive = pathname === `/referencia-detalle/${referenciaId}/fases/${fase.slug}` && window.location.search.includes(`collectionId=${currentCollectionId}`);
        // Pero para la activación visual, `startsWith` es a menudo suficiente.

        return (
          <Link key={fase.slug} href={href}>
            <button
              className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors duration-200 ease-in-out
                ${isActive
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-700 hover:bg-gray-100'
                }`}
            >
              {fase.nombre}
            </button>
          </Link>
        );
      })}
    </nav>
  );
};

export default TabList;