// app/modules/hooks/usePhaseKanban.ts
'use client';

import { useState, useMemo } from 'react';
import { FaseDisponible } from '@/app/modules/types';

interface PhaseDetails {
  [key: string]: string | string[];
}

interface PhaseData extends FaseDisponible {
  id: string;
  responsible?: string;
  startDate?: string;
  endDate?: string;
  status: 'pending' | 'current' | 'completed' | 'returned' | 'overdue';
  canDeliver?: boolean;
  canReturn?: boolean;
  details?: PhaseDetails;
}

interface UsePhaseKanbanProps {
  fases: FaseDisponible[];
  currentPhaseSlug?: string;
}

export const usePhaseKanban = ({ fases, currentPhaseSlug }: UsePhaseKanbanProps) => {
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number | null>(null);

  // Helper functions for phase data enhancement
  const getPhaseResponsible = (slug: string): string => {
    const responsibleMap: Record<string, string> = {
      'jo': 'Andrea López',
      'md-creacion-ficha': 'Carlos Pérez',
      'md-creativo': 'Marta Gómez',
      'md-corte': 'Javier Ruiz',
      'md-fitting': 'Sofía Vargas',
      'md-tecnico': 'Roberto Castro',
      'md-trazador': 'Luis Fernández',
      'costeo': 'Ana Morales',
      'pt-tecnico': 'Carlos Pérez',
      'pt-cortador': 'Marta Gómez',
      'pt-fitting': 'Javier Ruiz',
      'pt-trazador': 'Sofía Vargas'
    };
    return responsibleMap[slug] || 'Sin asignar';
  };

  const getPhaseStartDate = (slug: string, index: number): string => {
    const baseDate = new Date('2025-08-15');
    baseDate.setDate(baseDate.getDate() + (index * 2));
    return baseDate.toISOString().split('T')[0];
  };

  const getPhaseDetails = (slug: string): PhaseDetails => {
    const detailsMap: Record<string, PhaseDetails> = {
      'jo': {
        'Objetivos': 'Coordinación inicial del proyecto y asignación de recursos',
        'Entregables': ['Plan de trabajo', 'Asignación de responsables', 'Cronograma inicial'],
        'Duración Estimada': '1 día laboral'
      },
      'md-creacion-ficha': {
        'Objetivos': 'Crear bocetos iniciales y un prototipo físico de la prenda',
        'Entregables': ['Bocetos digitales e impresos', 'Prototipo de muestra', 'Especificaciones de diseño iniciales'],
        'Herramientas': ['Software de diseño CAD', 'Impresora 3D (opcional)', 'Materiales básicos de confección'],
        'Duración Estimada': '3 días laborales'
      },
      'md-creativo': {
        'Objetivos': 'Desarrollo creativo y ajustes de diseño',
        'Entregables': ['Propuestas de diseño', 'Moodboard', 'Paleta de colores'],
        'Duración Estimada': '2 días laborales'
      },
      'md-corte': {
        'Objetivos': 'Preparación y corte de materiales',
        'Entregables': ['Piezas cortadas', 'Reporte de materiales utilizados'],
        'Duración Estimada': '1 día laboral'
      },
      'costeo': {
        'Objetivos': 'Análisis y determinación de costos de producción',
        'Entregables': ['Reporte de costos', 'Análisis de rentabilidad'],
        'Duración Estimada': '1 día laboral'
      }
    };
    return detailsMap[slug] || {};
  };

  // Enhanced phases with computed properties
  const enhancedPhases: PhaseData[] = useMemo(() => {
    return fases.map((fase, index) => {
      const currentPhaseIndex = fases.findIndex(f => f.slug === currentPhaseSlug);
      
      let status: PhaseData['status'] = 'pending';
      if (index < currentPhaseIndex) {
        status = 'completed';
      } else if (index === currentPhaseIndex) {
        status = 'current';
      }

      return {
        ...fase,
        id: fase.slug,
        status,
        responsible: getPhaseResponsible(fase.slug),
        startDate: getPhaseStartDate(fase.slug, index),
        canDeliver: status === 'current',
        canReturn: status === 'completed' && index > 0,
        details: getPhaseDetails(fase.slug)
      };
    });
  }, [fases, currentPhaseSlug]);

  // Calculate progress
  const progress = useMemo(() => {
    const completedPhases = enhancedPhases.filter(p => p.status === 'completed').length;
    return (completedPhases / enhancedPhases.length) * 100;
  }, [enhancedPhases]);

  const completedCount = useMemo(() => {
    return enhancedPhases.filter(p => p.status === 'completed').length;
  }, [enhancedPhases]);

  // Status styling helpers
  const getStatusIcon = (status: PhaseData['status']) => {
    const iconMap = {
      'completed': '✓',
      'current': '⏱',
      'overdue': '⚠',
      'returned': '↩',
      'pending': '○'
    };
    return iconMap[status] || '○';
  };

  const getStatusColor = (status: PhaseData['status']) => {
    const colorMap = {
      'completed': 'border-success-200 bg-success-50',
      'current': 'border-primary-200 bg-primary-50 shadow-lg transform scale-105',
      'overdue': 'border-error-200 bg-error-50',
      'returned': 'border-warning-200 bg-warning-50',
      'pending': 'border-secondary-200 bg-white'
    };
    return colorMap[status] || 'border-secondary-200 bg-white';
  };

  const getBorderColor = (status: PhaseData['status']) => {
    const borderMap = {
      'completed': '#4CAF50',
      'current': '#ff9800',
      'overdue': '#f44336',
      'returned': '#ff9800',
      'pending': '#1a73e8'
    };
    return borderMap[status] || '#1a73e8';
  };

  return {
    enhancedPhases,
    progress,
    completedCount,
    selectedPhaseIndex,
    setSelectedPhaseIndex,
    getStatusIcon,
    getStatusColor,
    getBorderColor
  };
};

export type { PhaseData, PhaseDetails };