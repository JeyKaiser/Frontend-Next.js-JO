// types/production.ts
// Types for the production timeline system

export type PhaseStatus = 'pending' | 'in-progress' | 'completed' | 'returned' | 'overdue';

export type AreaCode = 'JO' | 'MD' | 'PT' | 'COSTEO';

export interface PhaseDate {
  received?: string;  // ISO date string when phase was received
  delivered?: string; // ISO date string when phase was delivered
}

export interface PhaseAction {
  type: 'deliver' | 'return';
  timestamp: string;  // ISO date string
  user: string;       // User who performed the action
  notes?: string;     // Optional notes/observations
}

export interface PhaseMetrics {
  averageDuration: number;     // Average duration in hours
  estimatedDuration: number;   // Estimated duration in hours
  actualDuration?: number;     // Actual duration in hours (if completed)
}

export interface ProductionPhase {
  id: string;
  slug: string;
  name: string;
  areaCode: AreaCode;
  areaName: string;
  responsibleUser?: string;
  status: PhaseStatus;
  dates: PhaseDate;
  actions: PhaseAction[];
  metrics: PhaseMetrics;
  notes?: string;
  canDeliver: boolean;  // Whether current user can deliver this phase
  canReturn: boolean;   // Whether current user can return this phase
}

export interface ProductionStage {
  id: string;
  name: string;
  description: string;
  phases: ProductionPhase[];
  isCompleted: boolean;
  estimatedDuration: number;  // Total estimated duration for stage
  actualDuration?: number;    // Total actual duration for stage
}

export interface ProductionTimeline {
  referenciaId: string;
  collectionId: string;
  collectionName: string;
  currentPhase?: string;      // Current active phase slug
  stages: ProductionStage[];
  totalEstimatedDuration: number;
  totalActualDuration?: number;
  startDate?: string;         // When production started
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  isCompleted: boolean;
  completionPercentage: number;
}

export interface PhaseActionRequest {
  phaseId: string;
  action: 'deliver' | 'return';
  notes?: string;
  targetPhaseId?: string;  // For returns, which phase to return to
}

export interface PhaseActionResponse {
  success: boolean;
  message: string;
  updatedTimeline: ProductionTimeline;
}

// Predefined stage and phase structure
export const PRODUCTION_STAGES_CONFIG = {
  'creation': {
    id: 'creation',
    name: 'Etapa 1 - Creación de Muestra',
    description: 'Proceso inicial de creación y desarrollo de la muestra',
    phases: [
      { slug: 'jo', name: 'JO', areaCode: 'JO' as AreaCode, areaName: 'Jefatura de Operaciones' },
      { slug: 'md-creacion-ficha', name: 'MD Creación Ficha', areaCode: 'MD' as AreaCode, areaName: 'Modelado - Creación' },
      { slug: 'md-creativo', name: 'MD Creativo', areaCode: 'MD' as AreaCode, areaName: 'Modelado - Creativo' },
      { slug: 'md-corte', name: 'MD Corte', areaCode: 'MD' as AreaCode, areaName: 'Modelado - Corte' },
      { slug: 'md-fitting', name: 'MD Fitting', areaCode: 'MD' as AreaCode, areaName: 'Modelado - Fitting' }
    ]
  },
  'costing': {
    id: 'costing',
    name: 'Etapa 2 - Costeo',
    description: 'Análisis y determinación de costos de producción',
    phases: [
      { slug: 'md-tecnico', name: 'MD Técnico', areaCode: 'MD' as AreaCode, areaName: 'Modelado - Técnico' },
      { slug: 'md-trazador', name: 'MD Trazador', areaCode: 'MD' as AreaCode, areaName: 'Modelado - Trazador' },
      { slug: 'costeo', name: 'Costeo', areaCode: 'COSTEO' as AreaCode, areaName: 'Área de Costeo' }
    ]
  },
  'sampling': {
    id: 'sampling',
    name: 'Etapa 3 - Contramuestra',
    description: 'Desarrollo y validación de contramuestra final',
    phases: [
      { slug: 'pt-tecnico', name: 'PT Técnico', areaCode: 'PT' as AreaCode, areaName: 'Patronaje - Técnico' },
      { slug: 'pt-cortador', name: 'PT Cortador', areaCode: 'PT' as AreaCode, areaName: 'Patronaje - Cortador' },
      { slug: 'pt-fitting', name: 'PT Fitting', areaCode: 'PT' as AreaCode, areaName: 'Patronaje - Fitting' },
      { slug: 'pt-trazador', name: 'PT Trazador', areaCode: 'PT' as AreaCode, areaName: 'Patronaje - Trazador' }
    ]
  }
} as const;

// Default metrics for phases (in hours)
export const DEFAULT_PHASE_METRICS: Record<string, PhaseMetrics> = {
  'jo': { averageDuration: 4, estimatedDuration: 4 },
  'md-creacion-ficha': { averageDuration: 8, estimatedDuration: 8 },
  'md-creativo': { averageDuration: 12, estimatedDuration: 12 },
  'md-corte': { averageDuration: 6, estimatedDuration: 6 },
  'md-fitting': { averageDuration: 4, estimatedDuration: 4 },
  'md-tecnico': { averageDuration: 6, estimatedDuration: 6 },
  'md-trazador': { averageDuration: 8, estimatedDuration: 8 },
  'costeo': { averageDuration: 24, estimatedDuration: 24 },
  'pt-tecnico': { averageDuration: 6, estimatedDuration: 6 },
  'pt-cortador': { averageDuration: 4, estimatedDuration: 4 },
  'pt-fitting': { averageDuration: 4, estimatedDuration: 4 },
  'pt-trazador': { averageDuration: 8, estimatedDuration: 8 }
};

// Helper function to get phase status based on dates and current phase
export function calculatePhaseStatus(
  phase: ProductionPhase,
  currentPhaseSlug?: string,
  phases: ProductionPhase[] = []
): PhaseStatus {
  const currentPhaseIndex = phases.findIndex(p => p.slug === currentPhaseSlug);
  const phaseIndex = phases.findIndex(p => p.slug === phase.slug);
  
  // Check if phase was returned
  const lastAction = phase.actions[phase.actions.length - 1];
  if (lastAction?.type === 'return') {
    return 'returned';
  }
  
  // Check if completed
  if (phase.dates.delivered) {
    return 'completed';
  }
  
  // Check if current
  if (phase.slug === currentPhaseSlug || phaseIndex === currentPhaseIndex) {
    // Check if overdue
    if (phase.dates.received && phase.metrics.estimatedDuration) {
      const receivedDate = new Date(phase.dates.received);
      const estimatedCompletionDate = new Date(receivedDate.getTime() + (phase.metrics.estimatedDuration * 60 * 60 * 1000));
      const now = new Date();
      
      if (now > estimatedCompletionDate) {
        return 'overdue';
      }
    }
    return 'in-progress';
  }
  
  // Check if pending
  if (phaseIndex > currentPhaseIndex) {
    return 'pending';
  }
  
  return 'pending';
}

// Helper function to calculate duration between dates
export function calculateDuration(startDate: string, endDate?: string): number {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60))); // Duration in hours
}

// Helper function to format duration for display
export function formatDuration(hours: number): string {
  if (hours < 24) {
    return `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}