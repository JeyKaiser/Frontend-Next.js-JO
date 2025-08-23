// components/molecules/PhaseSidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaseDisponible } from '@/app/modules/types';
import { ChevronRightIcon, CheckIcon, ChevronLeftIcon, ChevronDoubleLeftIcon } from '@heroicons/react/24/outline';

interface PhaseSidebarProps {
  referenciaId: string;
  fases: FaseDisponible[];
  currentCollectionId?: string;
  collectionName?: string;
}

const PHASE_WORKFLOW = {
  'Inicio': ['jo'],
  'Modelado': ['md-creacion-ficha', 'md-creativo', 'md-corte', 'md-confeccion', 'md-fitting', 'md-tecnico', 'md-trazador'],
  'Costeo': ['costeo'],
  'Patronaje': ['pt-tecnico', 'pt-cortador', 'pt-fitting', 'pt-trazador']
};

const PhaseSidebar: React.FC<PhaseSidebarProps> = ({ 
  referenciaId, 
  fases, 
  currentCollectionId, 
  collectionName 
}) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Find current phase from URL
  const currentPhaseSlug = pathname.split('/fases/')[1];
  const currentPhase = fases.find(fase => fase.slug === currentPhaseSlug);
  const currentPhaseIndex = fases.findIndex(fase => fase.slug === currentPhaseSlug);
  
  // Group phases by workflow category
  const groupedPhases = Object.entries(PHASE_WORKFLOW).map(([groupName, phaseSlugs]) => {
    const groupPhases = fases.filter(fase => phaseSlugs.includes(fase.slug));
    return { groupName, phases: groupPhases };
  }).filter(group => group.phases.length > 0);

  const getPhaseStatus = (phaseIndex: number) => {
    if (phaseIndex < currentPhaseIndex) return 'completed';
    if (phaseIndex === currentPhaseIndex) return 'current';
    return 'upcoming';
  };

  const getPhaseHref = (fase: FaseDisponible) => {
    return currentCollectionId 
      ? `/modules/referencia-detalle/${currentCollectionId}/${referenciaId}/fases/${fase.slug}`
      : `/modules/referencia-detalle/${referenciaId}/fases/${fase.slug}`;
  };

  return (
    <div className={`
      bg-white border-r border-secondary-200 transition-all duration-300 ease-in-out flex flex-col
      ${isCollapsed ? 'w-16' : 'w-80'}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-secondary-200 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <h3 className="font-semibold text-secondary-900 mb-1">
              Navegación de Fases
            </h3>
            <p className="text-sm text-secondary-600">
              {currentPhase?.nombre || 'Fase no encontrada'}
            </p>
          </div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
          title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5 text-secondary-600" />
          ) : (
            <ChevronDoubleLeftIcon className="w-5 h-5 text-secondary-600" />
          )}
        </button>
      </div>

      {/* Progress Overview */}
      {!isCollapsed && (
        <div className="p-4 border-b border-secondary-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              {currentPhaseIndex + 1}
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-900">
                Fase {currentPhaseIndex + 1} de {fases.length}
              </p>
              <p className="text-xs text-secondary-600">
                {Math.round(((currentPhaseIndex + 1) / fases.length) * 100)}% completado
              </p>
            </div>
          </div>
          
          <div className="w-full bg-secondary-200 rounded-full h-1.5">
            <div 
              className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentPhaseIndex + 1) / fases.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Phase List */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
          {groupedPhases.map((group, groupIndex) => (
            <div key={group.groupName} className="mb-6 last:mb-2">
              {!isCollapsed && (
                <h4 className="px-2 py-2 text-xs font-medium text-secondary-500 uppercase tracking-wide mb-2">
                  {group.groupName}
                </h4>
              )}
              
              <div className="space-y-1">
                {group.phases.map((fase, phaseIndex) => {
                  const globalPhaseIndex = fases.findIndex(f => f.slug === fase.slug);
                  const status = getPhaseStatus(globalPhaseIndex);
                  const isActive = globalPhaseIndex === currentPhaseIndex;
                  const href = getPhaseHref(fase);
                  
                  return (
                    <Link key={fase.slug} href={href}>
                      <div
                        className={`
                          flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer relative group
                          ${
                            isActive
                              ? 'bg-primary-50 border border-primary-200 shadow-sm'
                              : status === 'completed'
                              ? 'hover:bg-success-50 border border-transparent hover:border-success-200'
                              : 'hover:bg-secondary-50 border border-transparent hover:border-secondary-200'
                          }
                        `}
                        title={isCollapsed ? fase.nombre : ''}
                      >
                        <div
                          className={`
                            flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                            ${
                              isActive
                                ? 'bg-primary-500 text-white'
                                : status === 'completed'
                                ? 'bg-success-500 text-white'
                                : 'bg-secondary-200 text-secondary-600'
                            }
                          `}
                        >
                          {status === 'completed' ? (
                            <CheckIcon className="w-4 h-4" />
                          ) : (
                            <span>{globalPhaseIndex + 1}</span>
                          )}
                        </div>
                        
                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <p
                              className={`
                                text-sm font-medium truncate
                                ${
                                  isActive
                                    ? 'text-primary-900'
                                    : status === 'completed'
                                    ? 'text-success-900'
                                    : 'text-secondary-700'
                                }
                              `}
                            >
                              {fase.nombre}
                            </p>
                            <p className="text-xs text-secondary-500 capitalize">
                              {status === 'completed' ? 'Completada' : status === 'current' ? 'Actual' : 'Pendiente'}
                            </p>
                          </div>
                        )}
                        
                        {isActive && !isCollapsed && (
                          <ChevronRightIcon className="w-4 h-4 text-primary-500" />
                        )}
                        
                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                          <div className="absolute left-full ml-2 px-3 py-2 bg-secondary-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            {fase.nombre}
                            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-secondary-900 rotate-45"></div>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer with quick actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-secondary-200">
          <div className="flex gap-2">
            {currentPhaseIndex > 0 && (
              <Link href={getPhaseHref(fases[currentPhaseIndex - 1])}>
                <button className="flex-1 px-3 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-100 border border-secondary-200 rounded-lg transition-colors duration-200">
                  ← Anterior
                </button>
              </Link>
            )}
            {currentPhaseIndex < fases.length - 1 && (
              <Link href={getPhaseHref(fases[currentPhaseIndex + 1])}>
                <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors duration-200">
                  Siguiente →
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseSidebar;