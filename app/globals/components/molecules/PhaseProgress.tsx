// components/molecules/PhaseProgress.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaseDisponible } from '@/app/modules/types';
import { ChevronRightIcon, CheckIcon, ClockIcon } from '@heroicons/react/24/outline';

interface PhaseProgressProps {
  referenciaId: string;
  fases: FaseDisponible[];
  currentCollectionId?: string;
  collectionName?: string;
}

// Phase workflow order and grouping
const PHASE_WORKFLOW = {
  'Inicio': ['jo'],
  'Modelado': ['md-creacion-ficha', 'md-creativo', 'md-corte', 'md-confeccion', 'md-fitting', 'md-tecnico', 'md-trazador'],
  'Costeo': ['costeo'],
  'Patronaje': ['pt-tecnico', 'pt-cortador', 'pt-fitting', 'pt-trazador']
};

const PhaseProgress: React.FC<PhaseProgressProps> = ({ 
  referenciaId, 
  fases, 
  currentCollectionId, 
  collectionName 
}) => {
  const pathname = usePathname();
  
  // Find current phase from URL
  const currentPhaseSlug = pathname.split('/fases/')[1];
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
    <div className="bg-white border border-secondary-200 rounded-lg p-6 mb-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-secondary-900">
            Progreso de Fases
          </h3>
          {currentCollectionId && (
            <Link 
              href={`/modules/referencia-detalle/${currentCollectionId}/${referenciaId}/timeline?currentPhase=${currentPhaseSlug || ''}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <ClockIcon className="w-4 h-4" />
              Timeline Empresarial
            </Link>
          )}
        </div>
        <div className="flex items-center text-sm text-secondary-600">
          <span>Fase {currentPhaseIndex + 1} de {fases.length}</span>
          <div className="ml-4 flex-1 bg-secondary-200 rounded-full h-1.5">
            <div 
              className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentPhaseIndex + 1) / fases.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {groupedPhases.map((group, groupIndex) => (
          <div key={group.groupName} className="relative">
            <h4 className="text-sm font-medium text-secondary-700 mb-3 uppercase tracking-wide">
              {group.groupName}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {group.phases.map((fase, phaseIndex) => {
                const globalPhaseIndex = fases.findIndex(f => f.slug === fase.slug);
                const status = getPhaseStatus(globalPhaseIndex);
                const isActive = globalPhaseIndex === currentPhaseIndex;
                const href = getPhaseHref(fase);
                
                return (
                  <Link key={fase.slug} href={href}>
                    <div
                      className={`
                        relative p-3 rounded-lg border transition-all duration-200 cursor-pointer
                        ${
                          isActive
                            ? 'bg-primary-50 border-primary-200 shadow-sm'
                            : status === 'completed'
                            ? 'bg-success-50 border-success-200 hover:bg-success-100'
                            : 'bg-white border-secondary-200 hover:bg-secondary-50 hover:border-secondary-300'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
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
                        
                        {isActive && (
                          <ChevronRightIcon className="w-4 h-4 text-primary-500" />
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhaseProgress;