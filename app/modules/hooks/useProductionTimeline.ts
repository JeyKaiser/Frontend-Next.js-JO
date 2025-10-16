// hooks/useProductionTimeline.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  ProductionTimeline, 
  PhaseActionRequest, 
  PhaseActionResponse,
  ProductionPhase,
  PhaseStatus,
  calculatePhaseStatus,
  calculateDuration,
  PRODUCTION_STAGES_CONFIG,
  DEFAULT_PHASE_METRICS
} from '@/app/modules/types/production';
import { FaseDisponible } from '@/app/modules/types';

interface UseProductionTimelineProps {
  referenciaId: string;
  fases: FaseDisponible[];
  currentCollectionId: string;
  collectionName: string;
  currentPhaseSlug?: string;
}

interface UseProductionTimelineReturn {
  timeline: ProductionTimeline | null;
  loading: boolean;
  error: string | null;
  performAction: (request: PhaseActionRequest) => Promise<boolean>;
  refreshTimeline: () => Promise<void>;
  getPhaseProgress: () => number;
  getCurrentPhase: () => ProductionPhase | null;
  getOverduePhases: () => ProductionPhase[];
}

// Mock API functions - replace with actual API calls
const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchProductionTimeline(referenciaId: string, collectionId: string): Promise<ProductionTimeline> {
  // Simulate API call
  await mockApiDelay(500);
  
  // This would be replaced with actual API call
  // const response = await fetch(`/api/production-timeline/${collectionId}/${referenciaId}`);
  // return response.json();
  
  // Mock data for demonstration
  return createMockTimeline(referenciaId, collectionId);
}

async function performPhaseAction(request: PhaseActionRequest): Promise<PhaseActionResponse> {
  // Simulate API call
  await mockApiDelay(300);
  
  // This would be replaced with actual API call
  // const response = await fetch('/api/phase-action', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(request)
  // });
  // return response.json();
  
  // Mock response
  return {
    success: true,
    message: request.action === 'deliver' ? 'Fase entregada correctamente' : 'Fase devuelta correctamente',
    updatedTimeline: createMockTimeline('mock-ref', 'mock-collection')
  };
}

function createMockTimeline(referenciaId: string, collectionId: string): ProductionTimeline {
  const now = new Date();
  const startDate = new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000)); // 5 days ago
  
  const stages = Object.values(PRODUCTION_STAGES_CONFIG).map(stageConfig => {
    const phases: ProductionPhase[] = stageConfig.phases.map((phaseConfig, index) => {
      const phase: ProductionPhase = {
        id: `${phaseConfig.slug}-${referenciaId}`,
        slug: phaseConfig.slug,
        name: phaseConfig.name,
        areaCode: phaseConfig.areaCode,
        areaName: phaseConfig.areaName,
        responsibleUser: `User-${phaseConfig.areaCode}`,
        status: 'pending' as PhaseStatus,
        dates: {},
        actions: [],
        metrics: DEFAULT_PHASE_METRICS[phaseConfig.slug] || { averageDuration: 8, estimatedDuration: 8 },
        canDeliver: false,
        canReturn: false
      };
      
      // Simulate some completed phases
      if (index === 0 && stageConfig.id === 'creation') {
        phase.dates.received = new Date(startDate.getTime() + (index * 8 * 60 * 60 * 1000)).toISOString();
        phase.dates.delivered = new Date(startDate.getTime() + ((index + 1) * 8 * 60 * 60 * 1000)).toISOString();
        phase.status = 'completed';
        phase.actions.push({
          type: 'deliver',
          timestamp: phase.dates.delivered,
          user: 'Juan Pérez',
          notes: 'Completado correctamente'
        });
      } else if (index === 1 && stageConfig.id === 'creation') {
        phase.dates.received = new Date(startDate.getTime() + (24 * 60 * 60 * 1000)).toISOString();
        phase.status = 'in-progress';
        phase.canDeliver = true;
        phase.canReturn = true;
      }
      
      return phase;
    });
    
    return {
      id: stageConfig.id,
      name: stageConfig.name,
      description: stageConfig.description,
      phases,
      isCompleted: phases.every(p => p.status === 'completed'),
      estimatedDuration: phases.reduce((sum, p) => sum + p.metrics.estimatedDuration, 0),
      actualDuration: phases.reduce((sum, p) => {
        if (p.dates.received && p.dates.delivered) {
          return sum + calculateDuration(p.dates.received, p.dates.delivered);
        }
        return sum;
      }, 0)
    };
  });
  
  const allPhases = stages.flatMap(s => s.phases);
  const completedPhases = allPhases.filter(p => p.status === 'completed').length;
  
  return {
    referenciaId,
    collectionId,
    collectionName: 'WINTER SUN',
    currentPhase: 'md-creacion-ficha',
    stages,
    totalEstimatedDuration: stages.reduce((sum, s) => sum + s.estimatedDuration, 0),
    totalActualDuration: stages.reduce((sum, s) => sum + (s.actualDuration || 0), 0),
    startDate: startDate.toISOString(),
    targetCompletionDate: new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString(),
    isCompleted: false,
    completionPercentage: Math.round((completedPhases / allPhases.length) * 100)
  };
}

export function useProductionTimeline({
  referenciaId,
  fases,
  currentCollectionId,
  collectionName,
  currentPhaseSlug
}: UseProductionTimelineProps): UseProductionTimelineReturn {
  const [timeline, setTimeline] = useState<ProductionTimeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTimeline = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const timelineData = await fetchProductionTimeline(referenciaId, currentCollectionId);
      
      // Update timeline with collection name
      timelineData.collectionName = collectionName;
      timelineData.currentPhase = currentPhaseSlug;
      
      // Update phase statuses based on current phase
      timelineData.stages.forEach(stage => {
        stage.phases.forEach(phase => {
          phase.status = calculatePhaseStatus(
            phase, 
            currentPhaseSlug, 
            timelineData.stages.flatMap(s => s.phases)
          );
        });
      });
      
      setTimeline(timelineData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading timeline');
      console.error('Error fetching timeline:', err);
    } finally {
      setLoading(false);
    }
  }, [referenciaId, currentCollectionId, collectionName, currentPhaseSlug]);

  const performAction = useCallback(async (request: PhaseActionRequest): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await performPhaseAction(request);
      
      if (response.success) {
        // Update local timeline with response
        setTimeline(response.updatedTimeline);
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error performing action');
      console.error('Error performing action:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPhaseProgress = useCallback((): number => {
    if (!timeline) return 0;
    
    const allPhases = timeline.stages.flatMap(s => s.phases);
    const completedPhases = allPhases.filter(p => p.status === 'completed').length;
    
    return Math.round((completedPhases / allPhases.length) * 100);
  }, [timeline]);

  const getCurrentPhase = useCallback((): ProductionPhase | null => {
    if (!timeline) return null;
    
    const allPhases = timeline.stages.flatMap(s => s.phases);
    return allPhases.find(p => p.slug === timeline.currentPhase) || null;
  }, [timeline]);

  const getOverduePhases = useCallback((): ProductionPhase[] => {
    if (!timeline) return [];
    
    const allPhases = timeline.stages.flatMap(s => s.phases);
    return allPhases.filter(p => p.status === 'overdue');
  }, [timeline]);

  // Initialize timeline on mount
  useEffect(() => {
    refreshTimeline();
  }, [refreshTimeline]);

  return {
    timeline,
    loading,
    error,
    performAction,
    refreshTimeline,
    getPhaseProgress,
    getCurrentPhase,
    getOverduePhases
  };
}