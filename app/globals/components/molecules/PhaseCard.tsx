// components/molecules/PhaseCard.tsx
'use client';

import React, { useState } from 'react';
import { 
  CheckIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  ArrowUturnLeftIcon,
  ArrowRightIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { 
  ProductionPhase, 
  PhaseActionRequest,
  formatDuration,
  calculateDuration
} from '@/app/modules/types/production';
import Button from '@/app/globals/components/atoms/Button';
import Modal from '@/app/globals/components/atoms/Modal';

interface PhaseCardProps {
  phase: ProductionPhase;
  isActive: boolean;
  onAction: (request: PhaseActionRequest) => Promise<void>;
  disabled?: boolean;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ 
  phase, 
  isActive, 
  onAction, 
  disabled = false 
}) => {
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'deliver' | 'return'>('deliver');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusIcon = () => {
    switch (phase.status) {
      case 'completed':
        return <CheckIcon className="w-5 h-5 text-success-600" />;
      case 'in-progress':
        return <ClockIcon className="w-5 h-5 text-primary-600" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="w-5 h-5 text-error-600" />;
      case 'returned':
        return <ArrowUturnLeftIcon className="w-5 h-5 text-warning-600" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-secondary-300" />;
    }
  };

  const getStatusColor = () => {
    switch (phase.status) {
      case 'completed':
        return 'border-success-200 bg-success-50';
      case 'in-progress':
        return 'border-primary-200 bg-primary-50 shadow-soft';
      case 'overdue':
        return 'border-error-200 bg-error-50';
      case 'returned':
        return 'border-warning-200 bg-warning-50';
      default:
        return 'border-secondary-200 bg-white';
    }
  };

  const getStatusText = () => {
    switch (phase.status) {
      case 'completed':
        return 'Completada';
      case 'in-progress':
        return 'En Progreso';
      case 'overdue':
        return 'Retrasada';
      case 'returned':
        return 'Devuelta';
      default:
        return 'Pendiente';
    }
  };

  const getDurationInfo = () => {
    if (phase.dates.received && phase.dates.delivered) {
      const actualDuration = calculateDuration(phase.dates.received, phase.dates.delivered);
      return {
        type: 'completed',
        duration: actualDuration,
        text: `Duración: ${formatDuration(actualDuration)}`
      };
    } else if (phase.dates.received) {
      const currentDuration = calculateDuration(phase.dates.received);
      const isOverdue = currentDuration > phase.metrics.estimatedDuration;
      return {
        type: isOverdue ? 'overdue' : 'in-progress',
        duration: currentDuration,
        text: `Transcurrido: ${formatDuration(currentDuration)} / ${formatDuration(phase.metrics.estimatedDuration)}`
      };
    } else {
      return {
        type: 'estimated',
        duration: phase.metrics.estimatedDuration,
        text: `Estimado: ${formatDuration(phase.metrics.estimatedDuration)}`
      };
    }
  };

  const handleAction = async (type: 'deliver' | 'return') => {
    setActionType(type);
    setShowActionModal(true);
  };

  const submitAction = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onAction({
        phaseId: phase.id,
        action: actionType,
        notes: notes.trim() || undefined
      });
      setShowActionModal(false);
      setNotes('');
    } catch (error) {
      console.error('Error performing action:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const durationInfo = getDurationInfo();
  const lastAction = phase.actions[phase.actions.length - 1];

  return (
    <>
      <div className={`
        relative p-4 rounded-lg border-2 transition-all duration-300
        ${getStatusColor()}
        ${isActive ? 'ring-2 ring-primary-200 ring-offset-2' : ''}
        ${disabled ? 'opacity-60' : 'hover:shadow-medium'}
      `}>
        {/* Phase Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <h4 className="font-semibold text-secondary-900 text-sm">
                {phase.name}
              </h4>
              <p className="text-xs text-secondary-600">
                {phase.areaName}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${phase.status === 'completed' ? 'bg-success-100 text-success-800' :
                phase.status === 'in-progress' ? 'bg-primary-100 text-primary-800' :
                phase.status === 'overdue' ? 'bg-error-100 text-error-800' :
                phase.status === 'returned' ? 'bg-warning-100 text-warning-800' :
                'bg-secondary-100 text-secondary-800'}
            `}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Duration Information */}
        <div className="mb-3">
          <div className="flex items-center gap-2 text-xs text-secondary-600">
            <ClockIcon className="w-4 h-4" />
            <span className={
              durationInfo.type === 'overdue' ? 'text-error-600 font-medium' :
              durationInfo.type === 'completed' ? 'text-success-600' :
              'text-secondary-600'
            }>
              {durationInfo.text}
            </span>
          </div>
          
          {/* Progress bar for in-progress phases */}
          {phase.status === 'in-progress' && (
            <div className="mt-2">
              <div className="w-full bg-secondary-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    durationInfo.type === 'overdue' ? 'bg-error-500' : 'bg-primary-500'
                  }`}
                  style={{ 
                    width: `${Math.min(100, (durationInfo.duration / phase.metrics.estimatedDuration) * 100)}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Responsible User */}
        {phase.responsibleUser && (
          <div className="flex items-center gap-2 text-xs text-secondary-600 mb-3">
            <UserIcon className="w-4 h-4" />
            <span>Responsable: {phase.responsibleUser}</span>
          </div>
        )}

        {/* Dates */}
        <div className="space-y-1 mb-3">
          {phase.dates.received && (
            <div className="flex items-center gap-2 text-xs text-secondary-600">
              <CalendarIcon className="w-4 h-4" />
              <span>Recibido: {new Date(phase.dates.received).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          )}
          {phase.dates.delivered && (
            <div className="flex items-center gap-2 text-xs text-success-600">
              <CheckIcon className="w-4 h-4" />
              <span>Entregado: {new Date(phase.dates.delivered).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          )}
        </div>

        {/* Last Action */}
        {lastAction && (
          <div className="mb-3 p-2 bg-secondary-50 rounded text-xs">
            <p className="text-secondary-700">
              <span className="font-medium">Última acción:</span> {lastAction.type === 'deliver' ? 'Entregada' : 'Devuelta'} por {lastAction.user}
            </p>
            {lastAction.notes && (
              <p className="text-secondary-600 mt-1">{lastAction.notes}</p>
            )}
          </div>
        )}

        {/* Phase Notes */}
        {phase.notes && (
          <div className="mb-3 p-2 bg-warning-50 rounded text-xs">
            <p className="text-warning-800">{phase.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        {(phase.canDeliver || phase.canReturn) && !disabled && (
          <div className="flex gap-2">
            {phase.canDeliver && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAction('deliver')}
                className="flex items-center gap-2 text-xs"
              >
                <ArrowRightIcon className="w-4 h-4" />
                Entregar
              </Button>
            )}
            {phase.canReturn && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAction('return')}
                className="flex items-center gap-2 text-xs"
              >
                <ArrowUturnLeftIcon className="w-4 h-4" />
                Devolver
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={actionType === 'deliver' ? 'Entregar Fase' : 'Devolver Fase'}
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-secondary-900 mb-2">
              {phase.name} - {phase.areaName}
            </h4>
            <p className="text-sm text-secondary-600">
              {actionType === 'deliver' 
                ? 'Confirma que has completado esta fase y está lista para continuar al siguiente paso.'
                : 'Esta fase será devuelta a la fase anterior. Especifica el motivo de la devolución.'
              }
            </p>
          </div>

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
              variant="secondary"
              onClick={() => setShowActionModal(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant={actionType === 'deliver' ? 'primary' : 'warning'}
              onClick={submitAction}
              disabled={isSubmitting || (actionType === 'return' && !notes.trim())}
              className="flex-1"
            >
              {isSubmitting ? 'Procesando...' : 
               actionType === 'deliver' ? 'Entregar' : 'Devolver'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PhaseCard;