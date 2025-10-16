// components/molecules/PhaseDropdown.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaseDisponible } from '@/app/modules/types';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

interface PhaseDropdownProps {
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

const PhaseDropdown: React.FC<PhaseDropdownProps> = ({ 
  referenciaId, 
  fases, 
  currentCollectionId, 
  collectionName 
}) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Find current phase from URL
  const currentPhaseSlug = pathname.split('/fases/')[1];
  const currentPhase = fases.find(fase => fase.slug === currentPhaseSlug);
  const currentPhaseIndex = fases.findIndex(fase => fase.slug === currentPhaseSlug);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handlePhaseSelect = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative mb-6" ref={dropdownRef}>
      {/* Current Phase Display with Progress */}
      <div className="bg-white border border-secondary-200 rounded-lg p-4 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              {currentPhaseIndex + 1}
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">
                {currentPhase?.nombre || 'Fase no encontrada'}
              </h3>
              <p className="text-sm text-secondary-600">
                Fase {currentPhaseIndex + 1} de {fases.length}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors duration-200"
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            Cambiar Fase
            <ChevronDownIcon 
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`} 
            />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 bg-secondary-200 rounded-full h-1.5">
            <div 
              className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentPhaseIndex + 1) / fases.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-secondary-500 font-medium">
            {Math.round(((currentPhaseIndex + 1) / fases.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-secondary-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="p-2">
            {groupedPhases.map((group, groupIndex) => (
              <div key={group.groupName} className="mb-4 last:mb-0">
                <h4 className="px-3 py-2 text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  {group.groupName}
                </h4>
                
                <div className="space-y-1">
                  {group.phases.map((fase, phaseIndex) => {
                    const globalPhaseIndex = fases.findIndex(f => f.slug === fase.slug);
                    const status = getPhaseStatus(globalPhaseIndex);
                    const isActive = globalPhaseIndex === currentPhaseIndex;
                    const href = getPhaseHref(fase);
                    
                    return (
                      <Link key={fase.slug} href={href} onClick={handlePhaseSelect}>
                        <div
                          className={`
                            flex items-center gap-3 px-3 py-2 mx-1 rounded-lg transition-colors duration-200
                            ${
                              isActive
                                ? 'bg-primary-50 text-primary-900'
                                : 'hover:bg-secondary-50 text-secondary-700'
                            }
                          `}
                        >
                          <div
                            className={`
                              flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium
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
                              <CheckIcon className="w-3 h-3" />
                            ) : (
                              <span>{globalPhaseIndex + 1}</span>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              isActive ? 'text-primary-900' : 'text-secondary-900'
                            }`}>
                              {fase.nombre}
                            </p>
                            {status !== 'current' && (
                              <p className="text-xs text-secondary-500 capitalize">
                                {status === 'completed' ? 'Completada' : 'Pendiente'}
                              </p>
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
      )}
    </div>
  );
};

export default PhaseDropdown;