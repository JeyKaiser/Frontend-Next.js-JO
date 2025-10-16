// components/molecules/TabListImproved.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaseDisponible } from '@/app/modules/types';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline';

interface TabListImprovedProps {
  referenciaId: string;
  fases: FaseDisponible[];
  currentCollectionId?: string;
  collectionName?: string;
}

const TabListImproved: React.FC<TabListImprovedProps> = ({ referenciaId, fases, currentCollectionId, collectionName }) => {
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  // Find current phase from URL
  const currentPhaseSlug = pathname.split('/fases/')[1];
  const currentPhaseIndex = fases.findIndex(fase => fase.slug === currentPhaseSlug);
  
  console.log(`[TabListImproved] Recibido referenciaId: ${referenciaId}, currentCollectionId: ${currentCollectionId}, collectionName: ${collectionName}`);

  // Check scroll buttons visibility
  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Handle scroll
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Update scroll buttons on mount and scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      updateScrollButtons();
      container.addEventListener('scroll', updateScrollButtons);
      window.addEventListener('resize', updateScrollButtons);
      
      return () => {
        container.removeEventListener('scroll', updateScrollButtons);
        window.removeEventListener('resize', updateScrollButtons);
      };
    }
  }, [fases]);

  // Scroll to active tab on mount
  useEffect(() => {
    if (scrollContainerRef.current && currentPhaseIndex >= 0) {
      const activeTab = scrollContainerRef.current.children[currentPhaseIndex] as HTMLElement;
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentPhaseIndex]);
  
  const getPhaseStatus = (phaseIndex: number) => {
    if (phaseIndex < currentPhaseIndex) return 'completed';
    if (phaseIndex === currentPhaseIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="relative mb-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-secondary-900">
            Fases del Proceso
          </h3>
          <div className="flex items-center text-sm text-secondary-600 gap-2">
            <span>Fase {currentPhaseIndex + 1} de {fases.length}</span>
            <div className="w-20 bg-secondary-200 rounded-full h-1.5">
              <div 
                className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentPhaseIndex + 1) / fases.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-secondary-600">
          {Math.round(((currentPhaseIndex + 1) / fases.length) * 100)}% completado
        </div>
      </div>
      
      {/* Tab navigation with scroll controls */}
      <div className="flex items-center bg-white border border-secondary-200 rounded-lg p-1">
        {/* Left scroll button */}
        <button
          onClick={() => scroll('left')}
          className={`
            flex-shrink-0 p-2 rounded-lg transition-all duration-200
            ${
              canScrollLeft
                ? 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                : 'text-secondary-300 cursor-not-allowed'
            }
          `}
          disabled={!canScrollLeft}
          title="Desplazar hacia la izquierda"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {/* Scrollable tabs container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 flex space-x-1 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {fases.map((fase, index) => {
            const href = currentCollectionId 
              ? `/modules/referencia-detalle/${currentCollectionId}/${referenciaId}/fases/${fase.slug}` 
              : `/modules/referencia-detalle/${referenciaId}/fases/${fase.slug}`;

            const status = getPhaseStatus(index);
            const isActive = index === currentPhaseIndex;
            
            console.log(`[TabListImproved] Generando href para fase ${fase.slug}: ${href}`);

            return (
              <Link key={fase.slug} href={href}>
                <div
                  className={`
                    flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 ease-in-out cursor-pointer min-w-fit
                    ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-sm'
                        : status === 'completed'
                        ? 'bg-success-50 text-success-800 hover:bg-success-100'
                        : 'text-secondary-700 hover:bg-secondary-100'
                    }
                  `}
                >
                  {/* Phase indicator */}
                  <div
                    className={`
                      flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium
                      ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : status === 'completed'
                          ? 'bg-success-500 text-white'
                          : 'bg-secondary-200 text-secondary-600'
                      }
                    `}
                  >
                    {status === 'completed' ? (
                      <CheckIcon className="w-3 h-3" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Phase name */}
                  <span>{fase.nombre}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scroll('right')}
          className={`
            flex-shrink-0 p-2 rounded-lg transition-all duration-200
            ${
              canScrollRight
                ? 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                : 'text-secondary-300 cursor-not-allowed'
            }
          `}
          disabled={!canScrollRight}
          title="Desplazar hacia la derecha"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TabListImproved;