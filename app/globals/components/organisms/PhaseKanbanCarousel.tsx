// app/globals/components/organisms/PhaseKanbanCarousel.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowUturnLeftIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { FaseDisponible, MdCreacionFichaData } from '@/app/modules/types';
import Button from '@/app/globals/components/atoms/Button';
import Modal from '@/app/globals/components/atoms/Modal';
import { usePhaseKanban, PhaseData } from '@/app/modules/hooks/usePhaseKanban';
import { getFaseData } from '@/app/globals/lib/api';
import FaseMdCreacionFicha from '@/app/globals/components/organisms/FaseMdCreacionFicha';

interface PhaseKanbanCarouselProps {
  referenciaId: string;
  collectionId: string;
  fases: FaseDisponible[];
  currentPhaseSlug?: string;
  onPhaseAction?: (phaseSlug: string, action: 'deliver' | 'return', notes?: string) => Promise<void>;
  onPhaseClick?: (fase: FaseDisponible) => void;
}

const PhaseKanbanCarousel: React.FC<PhaseKanbanCarouselProps> = ({
  fases,
  currentPhaseSlug,
  onPhaseAction,
  onPhaseClick,
  referenciaId,
  collectionId,
}) => {
  // Use the custom hook for phase management
  const {
    enhancedPhases,
    progress,
    completedCount,
    selectedPhaseIndex,
    setSelectedPhaseIndex,
    getStatusColor,
    getBorderColor
  } = usePhaseKanban({ fases, currentPhaseSlug });

  // Local state for modals and actions
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'deliver' | 'return'>('deliver');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [faseMdData, setFaseMdData] = useState<MdCreacionFichaData | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchPhaseDetails = async () => {
      if (selectedPhaseIndex === null) {
        setFaseMdData(null);
        return;
      }

      const selectedPhase = enhancedPhases[selectedPhaseIndex];
      if (selectedPhase.slug === 'md-creacion-ficha') {
        setIsLoadingDetails(true);
        try {
          const data = await getFaseData(referenciaId, selectedPhase.slug, collectionId);
          setFaseMdData(data);
        } catch (error) {
          console.error("Error fetching md-creacion-ficha details:", error);
          setFaseMdData(null);
        } finally {
          setIsLoadingDetails(false);
        }
      } else {
        setFaseMdData(null);
      }
    };

    fetchPhaseDetails();
  }, [selectedPhaseIndex, enhancedPhases, referenciaId, collectionId]);

  const getStatusIcon = (status: PhaseData['status']) => {
    switch (status) {
      case 'completed':
        return <CheckIcon className="w-5 h-5 text-success-600" />;
      case 'current':
        return <ClockIcon className="w-5 h-5 text-primary-600" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="w-5 h-5 text-error-600" />;
      case 'returned':
        return <ArrowUturnLeftIcon className="w-5 h-5 text-warning-600" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-secondary-300" />;
    }
  };

  const scrollCarousel = (direction: number) => {
    if (carouselRef.current) {
      const cardWidth = 320; // Width of each card + gap
      carouselRef.current.scrollLeft += direction * cardWidth;
    }
  };

  const handlePhaseAction = async (phase: PhaseData, action: 'deliver' | 'return') => {
    setSelectedPhaseIndex(enhancedPhases.findIndex(p => p.id === phase.id));
    setActionType(action);
    setShowActionModal(true);
  };

  const submitAction = async () => {
    if (isSubmitting || selectedPhaseIndex === null) return;
    
    const phase = enhancedPhases[selectedPhaseIndex];
    if (!phase) return;

    setIsSubmitting(true);
    try {
      if (onPhaseAction) {
        await onPhaseAction(phase.slug, actionType, notes.trim() || undefined);
      }
      setShowActionModal(false);
      setNotes('');
      setSelectedPhaseIndex(null);
    } catch (error) {
      console.error('Error performing action:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showPhaseDetails = (index: number) => {
    setSelectedPhaseIndex(selectedPhaseIndex === index ? null : index);
    if (onPhaseClick) {
      onPhaseClick(fases[index]);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-secondary-200">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-600 mb-4">
          Gestión de Fases de la Referencia
        </h1>
        
        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-secondary-200 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-primary-500 transition-all duration-500 ease-in-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="text-sm text-secondary-600">
          Progreso: {completedCount} de {enhancedPhases.length} fases completadas ({Math.round(progress)}%)
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative flex items-center justify-center">
        {/* Previous Button */}
        <button
          onClick={() => scrollCarousel(-1)}
          className="absolute left-0 z-10 p-2 text-3xl text-primary-500 hover:text-primary-700 
                   transform hover:scale-110 transition-all duration-200 -translate-y-1/2 top-1/2
                   bg-white/80 rounded-full shadow-lg hover:shadow-xl"
          style={{ left: '-60px' }}
        >
          <ChevronLeftIcon className="w-8 h-8" />
        </button>

        {/* Carousel */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto scroll-smooth gap-5 p-4 w-full
                   scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]
                   [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {enhancedPhases.map((phase, index) => (
            <div
              key={phase.id}
              className={`
                flex-shrink-0 w-80 p-6 rounded-lg border-l-4 cursor-pointer
                transition-all duration-300 hover:shadow-lg
                ${getStatusColor(phase.status)}
              `}
              style={{
                scrollSnapAlign: 'start',
                borderLeftColor: getBorderColor(phase.status)
              }}
              onClick={() => showPhaseDetails(index)}
            >
              {/* Phase Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(phase.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-primary-600">
                      {index + 1}. {phase.nombre}
                    </h3>
                    <p className="text-sm text-secondary-600">
                      Area: {phase.slug.split('-')[0].toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phase Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <UserIcon className="w-4 h-4" />
                  <span><strong>Responsable:</strong> {phase.responsible}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span><strong>Inicio:</strong> {phase.startDate}</span>
                </div>
                {phase.endDate && (
                  <div className="flex items-center gap-2 text-sm text-success-600">
                    <CheckIcon className="w-4 h-4" />
                    <span><strong>Finalizada:</strong> {phase.endDate}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {(phase.canDeliver || phase.canReturn) && (
                <div className="flex gap-2 mt-4">
                  {phase.canReturn && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePhaseAction(phase, 'return');
                      }}
                      className="flex items-center gap-2 text-xs py-1 px-2 bg-secondary-200 hover:bg-secondary-300 text-secondary-700 border border-secondary-300"
                    >
                      <ArrowUturnLeftIcon className="w-4 h-4" />
                      Devolver
                    </Button>
                  )}
                  {phase.canDeliver && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePhaseAction(phase, 'deliver');
                      }}
                      className="flex items-center gap-2 text-xs py-1 px-2 bg-primary-500 hover:bg-primary-600 text-white"
                    >
                      <CheckIcon className="w-4 h-4" />
                      Entregar
                    </Button>
                  )}
                </div>
              )}

              {/* Status completed indicator */}
              {phase.status === 'completed' && (
                <div className="mt-3 p-2 bg-success-100 rounded text-xs text-success-700">
                  ✓ Fase completada
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => scrollCarousel(1)}
          className="absolute right-0 z-10 p-2 text-3xl text-primary-500 hover:text-primary-700 
                   transform hover:scale-110 transition-all duration-200 -translate-y-1/2 top-1/2
                   bg-white/80 rounded-full shadow-lg hover:shadow-xl"
          style={{ right: '-60px' }}
        >
          <ChevronRightIcon className="w-8 h-8" />
        </button>
      </div>

      {/* Details Panel */}
      {selectedPhaseIndex !== null && (
        <div className="mt-6 bg-secondary-50 border border-secondary-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-600 mb-4">
            Detalles de la Fase: {enhancedPhases[selectedPhaseIndex].nombre}
          </h3>
          
          {enhancedPhases[selectedPhaseIndex].slug === 'md-creacion-ficha' ? (
            isLoadingDetails ? (
              <p>Cargando detalles...</p>
            ) : faseMdData ? (
              <FaseMdCreacionFicha
                data={faseMdData}
                referenciaId={referenciaId}
                collectionId={collectionId}
              />
            ) : (
              <p>No se pudieron cargar los detalles.</p>
            )
          ) : (
            <div className="space-y-3">
              {Object.entries(enhancedPhases[selectedPhaseIndex].details || {}).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="font-semibold text-secondary-800">{key}:</span>{' '}
                  <span className="text-secondary-600">
                    {Array.isArray(value) ? value.join(', ') : value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={actionType === 'deliver' ? 'Entregar Fase' : 'Devolver Fase'}
      >
        <div className="space-y-4">
          {selectedPhaseIndex !== null && (
            <div>
              <h4 className="font-medium text-secondary-900 mb-2">
                {enhancedPhases[selectedPhaseIndex].nombre}
              </h4>
              <p className="text-sm text-secondary-600">
                {actionType === 'deliver' 
                  ? 'Confirma que has completado esta fase y está lista para continuar al siguiente paso.'
                  : 'Esta fase será devuelta a la fase anterior. Especifica el motivo de la devolución.'
                }
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {actionType === 'deliver' ? 'Observaciones (opcional)' : 'Motivo de devolución'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder={actionType === 'deliver' 
                ? 'Añade cualquier observación sobre el trabajo realizado...'
                : 'Explica por qué se devuelve esta fase...'
              }
              required={actionType === 'return'}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setShowActionModal(false)}
              disabled={isSubmitting}
              className="flex-1 bg-secondary-200 hover:bg-secondary-300 text-secondary-700 border border-secondary-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={submitAction}
              disabled={isSubmitting || (actionType === 'return' && !notes.trim())}
              className={`flex-1 ${
                actionType === 'deliver'
                  ? 'bg-primary-500 hover:bg-primary-600 text-white'
                  : 'bg-warning-500 hover:bg-warning-600 text-white'
              }`}
            >
              {isSubmitting ? 'Procesando...' :
               actionType === 'deliver' ? 'Entregar' : 'Devolver'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PhaseKanbanCarousel;
