// components/molecules/ProductionMetrics.tsx
'use client';

import React from 'react';
import { 
  ClockIcon,
  CalendarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';
import { 
  ProductionTimeline, 
  formatDuration,
  calculateDuration
} from '@/app/modules/types/production';

interface ProductionMetricsProps {
  timeline: ProductionTimeline;
  className?: string;
}

const ProductionMetrics: React.FC<ProductionMetricsProps> = ({ 
  timeline, 
  className = '' 
}) => {
  // Calculate overall metrics
  const allPhases = timeline.stages.flatMap(s => s.phases);
  const completedPhases = allPhases.filter(p => p.status === 'completed');
  const overduePhases = allPhases.filter(p => p.status === 'overdue');
  const inProgressPhases = allPhases.filter(p => p.status === 'in-progress');
  
  // Time calculations
  const totalEstimated = timeline.totalEstimatedDuration;
  const totalActual = timeline.totalActualDuration || 0;
  const variance = totalActual - totalEstimated;
  const variancePercentage = totalEstimated > 0 ? Math.round((variance / totalEstimated) * 100) : 0;
  
  // Efficiency calculations
  const completedEstimated = completedPhases.reduce((sum, p) => sum + p.metrics.estimatedDuration, 0);
  const completedActual = completedPhases.reduce((sum, p) => {
    if (p.dates.received && p.dates.delivered) {
      return sum + calculateDuration(p.dates.received, p.dates.delivered);
    }
    return sum;
  }, 0);
  
  const efficiency = completedEstimated > 0 ? Math.round((completedEstimated / completedActual) * 100) : 100;
  
  // Stage performance
  const stageMetrics = timeline.stages.map(stage => {
    const stageEstimated = stage.estimatedDuration;
    const stageActual = stage.actualDuration || 0;
    const stageVariance = stageActual - stageEstimated;
    const stageProgress = stage.phases.filter(p => p.status === 'completed').length / stage.phases.length;
    
    return {
      name: stage.name,
      progress: Math.round(stageProgress * 100),
      estimated: stageEstimated,
      actual: stageActual,
      variance: stageVariance,
      onSchedule: stageVariance <= 0 || stageProgress === 1
    };
  });

  // Risk assessment
  const getRiskLevel = () => {
    if (overduePhases.length > 2) return 'high';
    if (overduePhases.length > 0 || variancePercentage > 20) return 'medium';
    return 'low';
  };

  const riskLevel = getRiskLevel();

  const metrics = [
    {
      label: 'Progreso General',
      value: `${timeline.completionPercentage}%`,
      icon: <ChartBarIcon className="w-5 h-5" />,
      color: timeline.completionPercentage >= 75 ? 'success' : timeline.completionPercentage >= 50 ? 'warning' : 'primary',
      description: `${completedPhases.length} de ${allPhases.length} fases completadas`
    },
    {
      label: 'Tiempo Estimado',
      value: formatDuration(totalEstimated),
      icon: <CalendarIcon className="w-5 h-5" />,
      color: 'secondary',
      description: 'Duración total estimada'
    },
    {
      label: 'Tiempo Transcurrido',
      value: formatDuration(totalActual),
      icon: <ClockIcon className="w-5 h-5" />,
      color: variance > 0 ? 'error' : 'success',
      description: variance > 0 ? `+${formatDuration(variance)} sobre estimado` : 'Dentro del tiempo estimado'
    },
    {
      label: 'Eficiencia',
      value: `${efficiency}%`,
      icon: efficiency >= 100 ? <TrendingUpIcon className="w-5 h-5" /> : <TrendingDownIcon className="w-5 h-5" />,
      color: efficiency >= 90 ? 'success' : efficiency >= 70 ? 'warning' : 'error',
      description: efficiency >= 100 ? 'Mejor que estimado' : 'Por debajo del estimado'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'success':
        return 'bg-success-50 border-success-200 text-success-700';
      case 'warning':
        return 'bg-warning-50 border-warning-200 text-warning-700';
      case 'error':
        return 'bg-error-50 border-error-200 text-error-700';
      case 'primary':
        return 'bg-primary-50 border-primary-200 text-primary-700';
      default:
        return 'bg-secondary-50 border-secondary-200 text-secondary-700';
    }
  };

  return (
    <div className={`bg-white border border-secondary-200 rounded-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
          Métricas de Producción
        </h3>
        <p className="text-sm text-secondary-600">
          Análisis de rendimiento y seguimiento de tiempos
        </p>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className={`border rounded-lg p-4 ${getColorClasses(metric.color)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 rounded-lg bg-white/50`}>
                {metric.icon}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold mb-1">
                {metric.value}
              </p>
              <p className="text-sm font-medium mb-1">
                {metric.label}
              </p>
              <p className="text-xs opacity-80">
                {metric.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Assessment */}
      <div className={`
        border rounded-lg p-4 mb-6
        ${riskLevel === 'high' ? 'bg-error-50 border-error-200' :
          riskLevel === 'medium' ? 'bg-warning-50 border-warning-200' :
          'bg-success-50 border-success-200'}
      `}>
        <div className="flex items-center gap-3 mb-2">
          {riskLevel === 'high' ? (
            <ExclamationTriangleIcon className="w-5 h-5 text-error-600" />
          ) : riskLevel === 'medium' ? (
            <ExclamationTriangleIcon className="w-5 h-5 text-warning-600" />
          ) : (
            <CheckCircleIcon className="w-5 h-5 text-success-600" />
          )}
          <h4 className={`font-semibold ${
            riskLevel === 'high' ? 'text-error-900' :
            riskLevel === 'medium' ? 'text-warning-900' :
            'text-success-900'
          }`}>
            Evaluación de Riesgo: {
              riskLevel === 'high' ? 'Alto' :
              riskLevel === 'medium' ? 'Medio' :
              'Bajo'
            }
          </h4>
        </div>
        <div className={`text-sm ${
          riskLevel === 'high' ? 'text-error-700' :
          riskLevel === 'medium' ? 'text-warning-700' :
          'text-success-700'
        }`}>
          {riskLevel === 'high' && (
            <div>
              <p className="font-medium mb-1">Atención requerida:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                {overduePhases.length > 0 && (
                  <li>{overduePhases.length} fase(s) retrasada(s)</li>
                )}
                {variancePercentage > 20 && (
                  <li>{variancePercentage}% sobre tiempo estimado</li>
                )}
                <li>Revisar recursos y prioridades</li>
              </ul>
            </div>
          )}
          {riskLevel === 'medium' && (
            <p>
              Monitoreo recomendado. {overduePhases.length > 0 && `${overduePhases.length} fase(s) requieren atención.`}
            </p>
          )}
          {riskLevel === 'low' && (
            <p>Producción en buen estado. Continuar con el plan actual.</p>
          )}
        </div>
      </div>

      {/* Stage Performance */}
      <div>
        <h4 className="font-semibold text-secondary-900 mb-4">
          Rendimiento por Etapa
        </h4>
        <div className="space-y-3">
          {stageMetrics.map((stage, index) => (
            <div key={index} className="border border-secondary-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-secondary-900">
                  {stage.name}
                </h5>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-secondary-600">
                    {stage.progress}%
                  </span>
                  {stage.onSchedule ? (
                    <CheckCircleIcon className="w-4 h-4 text-success-600" />
                  ) : (
                    <ExclamationTriangleIcon className="w-4 h-4 text-warning-600" />
                  )}
                </div>
              </div>
              
              <div className="w-full bg-secondary-200 rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stage.onSchedule ? 'bg-success-500' : 'bg-warning-500'
                  }`}
                  style={{ width: `${stage.progress}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs text-secondary-600">
                <span>Estimado: {formatDuration(stage.estimated)}</span>
                <span>Actual: {formatDuration(stage.actual)}</span>
                {stage.variance !== 0 && (
                  <span className={stage.variance > 0 ? 'text-error-600' : 'text-success-600'}>
                    {stage.variance > 0 ? '+' : ''}{formatDuration(Math.abs(stage.variance))}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      {(inProgressPhases.length > 0 || overduePhases.length > 0) && (
        <div className="mt-6 pt-6 border-t border-secondary-200">
          <h4 className="font-semibold text-secondary-900 mb-3">
            Información Clave
          </h4>
          <div className="space-y-2 text-sm">
            {inProgressPhases.length > 0 && (
              <p className="text-primary-700">
                • {inProgressPhases.length} fase(s) en progreso actualmente
              </p>
            )}
            {overduePhases.length > 0 && (
              <p className="text-error-700">
                • {overduePhases.length} fase(s) requieren atención inmediata por retraso
              </p>
            )}
            {efficiency < 80 && (
              <p className="text-warning-700">
                • Eficiencia por debajo del 80%, revisar procesos
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionMetrics;