// components/molecules/TabList.tsx
'use client'; // Este componente necesita ser un Cliente Component porque usa hooks de Next.js

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Para saber qué pestaña está activa
import { FaseDisponible } from '../../app/types'; // Importa la interfaz

interface TabListProps {
  referenciaId: string;
  fases: FaseDisponible[];
}

const TabList: React.FC<TabListProps> = ({ referenciaId, fases }) => {
  const pathname = usePathname(); // Obtiene la ruta actual

  return (
    <nav className="flex space-x-1 border-b border-gray-200 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
      {fases.map((fase) => {
        const href = `/referencia-detalle/${referenciaId}/fases/${fase.slug}`;
        // Verifica si la ruta actual coincide con la URL de la pestaña
        const isActive = pathname.startsWith(href);

        return (
          <Link key={fase.slug} href={href}>
            <div
              className={`
                px-4 py-2 text-sm font-medium rounded-t-lg
                ${isActive
                  ? 'bg-blue-600 text-white shadow-md' // Estilo activo
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600' // Estilo inactivo
                }
                transition-colors duration-200 ease-in-out cursor-pointer
              `}
              // Puedes añadir roles ARIA aquí si decides implementar accesibilidad más tarde
              // role="tab"
              // aria-selected={isActive}
              // aria-controls={`panel-${fase.slug}`}
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