// components/molecules/ActionConfirmation.tsx
'use client';

import React from 'react';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import Button from '@/app/globals/components/atoms/Button';
import Modal from '@/app/globals/components/atoms/Modal';

export type ActionType = 'deliver' | 'return';

interface ActionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: ActionType;
  phaseName: string;
  areaName: string;
  isLoading?: boolean;
  notes?: string;
  onNotesChange?: (notes: string) => void;
}

const ActionConfirmation: React.FC<ActionConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  phaseName,
  areaName,
  isLoading = false,
  notes = '',
  onNotesChange
}) => {
  const getActionConfig = () => {
    switch (actionType) {
      case 'deliver':
        return {
          title: 'Confirmar Entrega de Fase',
          icon: <CheckCircleIcon className="w-8 h-8 text-success-600" />,
          message: `¿Estás seguro de que deseas entregar la fase "${phaseName}"?`,
          description: 'Esta acción marcará la fase como completada y la enviará al siguiente paso del proceso.',
          confirmText: 'Entregar Fase',
          confirmVariant: 'primary' as const,
          notesLabel: 'Observaciones (opcional)',
          notesPlaceholder: 'Añade comentarios sobre el trabajo realizado...'
        };
      case 'return':
        return {
          title: 'Confirmar Devolución de Fase',
          icon: <ArrowUturnLeftIcon className="w-8 h-8 text-warning-600" />,
          message: `¿Estás seguro de que deseas devolver la fase "${phaseName}"?`,
          description: 'Esta acción devolverá la fase al paso anterior. Es importante especificar el motivo.',
          confirmText: 'Devolver Fase',
          confirmVariant: 'warning' as const,
          notesLabel: 'Motivo de devolución (requerido)',
          notesPlaceholder: 'Explica por qué se devuelve esta fase...'
        };
    }
  };

  const config = getActionConfig();
  const isNotesRequired = actionType === 'return';
  const canConfirm = !isLoading && (!isNotesRequired || notes.trim().length > 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title}
      size="md"
    >
      <div className="space-y-6">
        {/* Icon and Message */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {config.icon}
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            {config.message}
          </h3>
          <p className="text-sm text-secondary-600">
            {config.description}
          </p>
        </div>

        {/* Phase Information */}
        <div className="bg-secondary-50 rounded-lg p-4">
          <h4 className="font-medium text-secondary-900 mb-2">
            Información de la Fase
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary-600">Fase:</span>
              <span className="font-medium text-secondary-900">{phaseName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Área:</span>
              <span className="font-medium text-secondary-900">{areaName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Fecha:</span>
              <span className="font-medium text-secondary-900">
                {new Date().toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {onNotesChange && (
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {config.notesLabel}
              {isNotesRequired && <span className="text-error-500 ml-1">*</span>}
            </label>
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              className={`
                w-full p-3 border rounded-lg resize-none transition-colors
                ${isNotesRequired && !notes.trim() 
                  ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
                  : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                }
              `}
              rows={4}
              placeholder={config.notesPlaceholder}
              disabled={isLoading}
            />
            {isNotesRequired && !notes.trim() && (
              <p className="mt-1 text-sm text-error-600">
                Es obligatorio especificar el motivo de la devolución
              </p>
            )}
          </div>
        )}

        {/* Warning for Critical Actions */}
        {actionType === 'return' && (
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-warning-800 mb-1">
                  Advertencia Importante
                </h4>
                <p className="text-sm text-warning-700">
                  La devolución de una fase puede afectar los tiempos de entrega y requerirá 
                  trabajo adicional del área anterior. Asegúrate de que el motivo esté claramente especificado.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-secondary-200">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={onConfirm}
            disabled={!canConfirm}
            className="flex-1"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </div>
            ) : (
              config.confirmText
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ActionConfirmation;