// components/molecules/TimelineStage.tsx
'use client';

import React from 'react';
import { 
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { 
  ProductionStage, 
  PhaseActionRequest,
  formatDuration
} from '@/app/modules/types/production';
import PhaseCard from './PhaseCard';

interface TimelineStageProps {
  stage: ProductionStage;
  stageIndex: number;
  totalStages: number;
  currentPhaseSlug?: string;
  onPhaseAction: (request: PhaseActionRequest) => Promise<void>;
  disabled?: boolean;
}

const TimelineStage: React.FC<TimelineStageProps> = ({
  stage,
  stageIndex,
  totalStages,
  currentPhaseSlug,
  onPhaseAction,
  disabled = false
}) => {
  const getStageStatus = () => {
    const completedPhases = stage.phases.filter(p => p.status === 'completed').length;
    const totalPhases = stage.phases.length;
    const hasActivePhase = stage.phases.some(p => p.status === 'in-progress' || p.status === 'overdue');
    const hasOverduePhase = stage.phases.some(p => p.status === 'overdue');
    
    if (completedPhases === totalPhases) {
      return 'completed';
    } else if (hasOverduePhase) {
      return 'overdue';
    } else if (hasActivePhase) {
      return 'in-progress';
    } else if (completedPhases > 0) {
      return 'partial';
    } else {
      return 'pending';
    }
  };

  const getStageIcon = () => {
    const status = getStageStatus();
    
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-6 h-6 text-success-600" />;
      case 'in-progress':
      case 'partial':
        return <ClockIcon className="w-6 h-6 text-primary-600" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="w-6 h-6 text-error-600" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full border-2 border-secondary-300 bg-white flex items-center justify-center">
            <span className="text-xs font-medium text-secondary-500">{stageIndex + 1}</span>
          </div>
        );
    }
  };

  const getStageHeaderColor = () => {
    const status = getStageStatus();
    
    switch (status) {
      case 'completed':
        return 'border-success-200 bg-success-50';
      case 'in-progress':
      case 'partial':
        return 'border-primary-200 bg-primary-50';
      case 'overdue':
        return 'border-error-200 bg-error-50';
      default:
        return 'border-secondary-200 bg-secondary-50';
    }
  };

  const getProgressPercentage = () => {
    const completedPhases = stage.phases.filter(p => p.status === 'completed').length;
    return Math.round((completedPhases / stage.phases.length) * 100);
  };

  const getEstimatedVsActual = () => {
    const estimated = stage.estimatedDuration;
    const actual = stage.actualDuration || 0;
    const inProgressDuration = stage.phases
      .filter(p => p.status === 'in-progress' || p.status === 'overdue')
      .reduce((sum, p) => {
        if (p.dates.received) {
          const now = new Date();
          const received = new Date(p.dates.received);
          const hours = Math.floor((now.getTime() - received.getTime()) / (1000 * 60 * 60));
          return sum + hours;
        }
        return sum;
      }, 0);
    
    return {
      estimated,
      actual: actual + inProgressDuration,
      isOverEstimate: (actual + inProgressDuration) > estimated
    };
  };

  const progressPercentage = getProgressPercentage();
  const timeInfo = getEstimatedVsActual();
  const isConnectorVisible = stageIndex < totalStages - 1;

  return (
    <div className="relative">
      {/* Stage Header */}
      <div className={`
        rounded-lg border-2 p-4 mb-4 transition-all duration-300
        ${getStageHeaderColor()}
      `}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {getStageIcon()}
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                {stage.name}
              </h3>
              <p className="text-sm text-secondary-600 mt-1">
                {stage.description}
              </p>
            </div>
          </div>
          
          <div className="text-right space-y-1">
            <div className="text-sm font-medium text-secondary-900">
              {progressPercentage}% Completado
            </div>
            <div className="text-xs text-secondary-600">
              {stage.phases.filter(p => p.status === 'completed').length} de {stage.phases.length} fases
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                getStageStatus() === 'completed' ? 'bg-success-500' :
                getStageStatus() === 'overdue' ? 'bg-error-500' :
                'bg-primary-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Time Information */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="text-secondary-600">
              Estimado: {formatDuration(timeInfo.estimated)}
            </span>
            <span className={`font-medium ${
              timeInfo.isOverEstimate ? 'text-error-600' : 'text-secondary-700'
            }`}>
              Actual: {formatDuration(timeInfo.actual)}
            </span>
          </div>
          
          {timeInfo.isOverEstimate && (
            <span className="text-error-600 font-medium">
              +{formatDuration(timeInfo.actual - timeInfo.estimated)} sobre estimado
            </span>
          )}
        </div>
      </div>

      {/* Phase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {stage.phases.map((phase, phaseIndex) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            isActive={phase.slug === currentPhaseSlug}
            onAction={onPhaseAction}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Stage Connector */}
      {isConnectorVisible && (
        <div className="relative flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-secondary-300" />
            <div className={`
              w-3 h-3 rounded-full border-2 
              ${getStageStatus() === 'completed' 
                ? 'border-success-500 bg-success-500' 
                : 'border-secondary-300 bg-white'
              }
            `} />
            <div className="w-8 h-px bg-secondary-300" />
          </div>
          
          {/* Stage transition label */}
          <div className="absolute -bottom-6 bg-white px-2 py-1 rounded text-xs text-secondary-500 border border-secondary-200">
            Siguiente Etapa
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineStage;