// components/organisms/ProductionTimeline.tsx
'use client';

import React, { useState } from 'react';
import { 
  ClockIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  RefreshIcon,
  InformationCircleIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useProductionTimeline } from '@/app/modules/hooks/useProductionTimeline';
import { FaseDisponible } from '@/app/modules/types';
import { PhaseActionRequest, formatDuration } from '@/app/modules/types/production';
import TimelineStage from '@/app/globals/components/molecules/TimelineStage';
import Button from '@/app/globals/components/atoms/Button';

interface ProductionTimelineProps {
  referenciaId: string;
  fases: FaseDisponible[];
  currentCollectionId: string;
  collectionName: string;
  currentPhaseSlug?: string;
}

const ProductionTimeline: React.FC<ProductionTimelineProps> = ({
  referenciaId,
  fases,
  currentCollectionId,
  collectionName,
  currentPhaseSlug
}) => {
  const [showMetrics, setShowMetrics] = useState(false);
  
  const {
    timeline,
    loading,
    error,
    performAction,
    refreshTimeline,
    getPhaseProgress,
    getCurrentPhase,
    getOverduePhases
  } = useProductionTimeline({
    referenciaId,
    fases,
    currentCollectionId,
    collectionName,
    currentPhaseSlug
  });

  const handlePhaseAction = async (request: PhaseActionRequest) => {
    await performAction(request);
  };

  const handleRefresh = async () => {
    await refreshTimeline();
  };

  if (loading && !timeline) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshIcon className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-secondary-600">Cargando línea de tiempo de producción...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-50 border border-error-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <ExclamationTriangleIcon className="w-6 h-6 text-error-600" />
          <h3 className="text-lg font-semibold text-error-900">Error al cargar timeline</h3>
        </div>
        <p className="text-error-700 mb-4">{error}</p>
        <Button variant="secondary" onClick={handleRefresh}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (!timeline) {
    return (
      <div className="bg-warning-50 border border-warning-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <InformationCircleIcon className="w-6 h-6 text-warning-600" />
          <p className="text-warning-800">No se encontró información del timeline de producción.</p>
        </div>
      </div>
    );
  }

  const currentPhase = getCurrentPhase();
  const overduePhases = getOverduePhases();
  const progress = getPhaseProgress();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white border border-secondary-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">
              Timeline de Producción
            </h2>
            <div className="flex items-center gap-4 text-sm text-secondary-600">
              <span className="font-medium">Referencia: {referenciaId}</span>
              <span>•</span>
              <span>Colección: {timeline.collectionName}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMetrics(!showMetrics)}
              className="flex items-center gap-2"
            >
              <ChartBarIcon className="w-4 h-4" />
              {showMetrics ? 'Ocultar' : 'Ver'} Métricas
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-secondary-900">
              Progreso General
            </h3>
            <span className="text-lg font-bold text-primary-600">
              {progress}%
            </span>
          </div>
          
          <div className="w-full bg-secondary-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary-600">
              {timeline.stages.flatMap(s => s.phases).filter(p => p.status === 'completed').length} de{' '}
              {timeline.stages.flatMap(s => s.phases).length} fases completadas
            </span>
            {timeline.isCompleted && (
              <span className="flex items-center gap-1 text-success-600 font-medium">
                <CheckCircleIcon className="w-4 h-4" />
                Producción Completada
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Current Phase & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Current Phase */}
        {currentPhase && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <ClockIcon className="w-5 h-5 text-primary-600" />
              <h4 className="font-semibold text-primary-900">Fase Actual</h4>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-primary-800">{currentPhase.name}</p>
              <p className="text-sm text-primary-700">{currentPhase.areaName}</p>
              {currentPhase.responsibleUser && (
                <p className="text-sm text-primary-600">
                  Responsable: {currentPhase.responsibleUser}
                </p>
              )}
              {currentPhase.dates.received && (
                <p className="text-xs text-primary-600">
                  Iniciada: {new Date(currentPhase.dates.received).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Alerts */}
        {overduePhases.length > 0 && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-error-600" />
              <h4 className="font-semibold text-error-900">
                Fases Retrasadas ({overduePhases.length})
              </h4>
            </div>
            <div className="space-y-2">
              {overduePhases.slice(0, 2).map(phase => (
                <div key={phase.id} className="text-sm">
                  <p className="font-medium text-error-800">{phase.name}</p>
                  <p className="text-error-600">{phase.areaName}</p>
                </div>
              ))}
              {overduePhases.length > 2 && (
                <p className="text-xs text-error-600">
                  Y {overduePhases.length - 2} más...
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Metrics Panel */}
      {showMetrics && (
        <div className="bg-white border border-secondary-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Métricas de Producción
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-secondary-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="w-5 h-5 text-secondary-600" />
                <span className="text-sm font-medium text-secondary-700">
                  Tiempo Estimado
                </span>
              </div>
              <p className="text-xl font-bold text-secondary-900">
                {formatDuration(timeline.totalEstimatedDuration)}
              </p>
            </div>
            
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ClockIcon className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">
                  Tiempo Transcurrido
                </span>
              </div>
              <p className="text-xl font-bold text-primary-900">
                {formatDuration(timeline.totalActualDuration || 0)}
              </p>
            </div>
            
            {timeline.startDate && (
              <div className="bg-success-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="w-5 h-5 text-success-600" />
                  <span className="text-sm font-medium text-success-700">
                    Fecha de Inicio
                  </span>
                </div>
                <p className="text-sm font-bold text-success-900">
                  {new Date(timeline.startDate).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            )}
            
            {timeline.targetCompletionDate && (
              <div className="bg-warning-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="w-5 h-5 text-warning-600" />
                  <span className="text-sm font-medium text-warning-700">
                    Fecha Objetivo
                  </span>
                </div>
                <p className="text-sm font-bold text-warning-900">
                  {new Date(timeline.targetCompletionDate).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline Stages */}
      <div className="space-y-8">
        {timeline.stages.map((stage, index) => (
          <TimelineStage
            key={stage.id}
            stage={stage}
            stageIndex={index}
            totalStages={timeline.stages.length}
            currentPhaseSlug={currentPhaseSlug}
            onPhaseAction={handlePhaseAction}
            disabled={loading}
          />
        ))}
      </div>

      {/* Completion Message */}
      {timeline.isCompleted && timeline.actualCompletionDate && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-6 text-center">
          <CheckCircleIcon className="w-12 h-12 text-success-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-success-900 mb-2">
            ¡Producción Completada!
          </h3>
          <p className="text-success-700">
            Referencia {referenciaId} completada el{' '}
            {new Date(timeline.actualCompletionDate).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductionTimeline;