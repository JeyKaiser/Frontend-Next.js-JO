# Production Timeline - Documentación Técnica

## Descripción General

Sistema de línea de tiempo empresarial para control de fases de producción de prendas, diseñado para ambientes de alta responsabilidad y auditoría.

## Arquitectura de Componentes

### Estructura de Archivos

```
app/
├── modules/
│   ├── types/
│   │   ├── production.ts         # Tipos TypeScript específicos
│   │   └── index.ts              # Re-exports principales
│   ├── hooks/
│   │   └── useProductionTimeline.ts  # Hook personalizado
│   └── (dashboard)/
│       └── referencia-detalle/[collectionId]/[referenciaId]/
│           └── timeline/page.tsx     # Página principal
│
├── globals/components/
│   ├── organisms/
│   │   └── ProductionTimeline.tsx    # Componente principal
│   └── molecules/
│       ├── TimelineStage.tsx         # Componente por etapa
│       ├── PhaseCard.tsx             # Tarjeta individual de fase
│       ├── ActionConfirmation.tsx    # Modal de confirmación
│       └── ProductionMetrics.tsx     # Panel de métricas
```

## Tipos TypeScript

### Tipos Principales

```typescript
// Estado de una fase
type PhaseStatus = 'pending' | 'in-progress' | 'completed' | 'returned' | 'overdue';

// Código de área responsable
type AreaCode = 'JO' | 'MD' | 'PT' | 'COSTEO';

// Fase individual
interface ProductionPhase {
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
  canDeliver: boolean;
  canReturn: boolean;
}

// Timeline completo
interface ProductionTimeline {
  referenciaId: string;
  collectionId: string;
  collectionName: string;
  currentPhase?: string;
  stages: ProductionStage[];
  totalEstimatedDuration: number;
  totalActualDuration?: number;
  startDate?: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  isCompleted: boolean;
  completionPercentage: number;
}
```

## Hook Personalizado

### `useProductionTimeline`

Hook que maneja el estado completo del timeline de producción.

```typescript
const {
  timeline,           // Timeline actual
  loading,           // Estado de carga
  error,             // Errores
  performAction,     // Ejecutar acción (entregar/devolver)
  refreshTimeline,   // Refrescar datos
  getPhaseProgress,  // Obtener progreso %
  getCurrentPhase,   // Fase actual
  getOverduePhases   // Fases retrasadas
} = useProductionTimeline({
  referenciaId,
  fases,
  currentCollectionId,
  collectionName,
  currentPhaseSlug
});
```

### Funciones Internas

- **fetchProductionTimeline**: Obtiene datos del backend
- **performPhaseAction**: Ejecuta acciones (entregar/devolver)
- **createMockTimeline**: Datos mock para desarrollo

## Componentes

### ProductionTimeline (Componente Principal)

**Props**:
```typescript
interface ProductionTimelineProps {
  referenciaId: string;
  fases: FaseDisponible[];
  currentCollectionId: string;
  collectionName: string;
  currentPhaseSlug?: string;
}
```

**Características**:
- Gestión completa del estado con el hook personalizado
- Panel de métricas expandible
- Alertas automáticas para fases retrasadas
- Botón de actualización manual
- Responsive design

### TimelineStage (Componente de Etapa)

**Props**:
```typescript
interface TimelineStageProps {
  stage: ProductionStage;
  stageIndex: number;
  totalStages: number;
  currentPhaseSlug?: string;
  onPhaseAction: (request: PhaseActionRequest) => Promise<void>;
  disabled?: boolean;
}
```

**Características**:
- Header con progreso y métricas de etapa
- Grid responsivo de fases
- Conectores visuales entre etapas
- Comparación tiempo estimado vs actual

### PhaseCard (Tarjeta de Fase)

**Props**:
```typescript
interface PhaseCardProps {
  phase: ProductionPhase;
  isActive: boolean;
  onAction: (request: PhaseActionRequest) => Promise<void>;
  disabled?: boolean;
}
```

**Características**:
- Estados visuales claros con iconografía
- Información de tiempo y responsable
- Botones de acción contextuales
- Barra de progreso para fases activas
- Modal de confirmación integrado

### ActionConfirmation (Modal de Confirmación)

**Props**:
```typescript
interface ActionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: 'deliver' | 'return';
  phaseName: string;
  areaName: string;
  isLoading?: boolean;
  notes?: string;
  onNotesChange?: (notes: string) => void;
}
```

**Características**:
- Validación obligatoria de notas para devoluciones
- Información contextual de la fase
- Advertencias para acciones críticas
- Loading states durante procesamiento

### ProductionMetrics (Panel de Métricas)

**Props**:
```typescript
interface ProductionMetricsProps {
  timeline: ProductionTimeline;
  className?: string;
}
```

**Características**:
- KPIs empresariales calculados automáticamente
- Evaluación de riesgo por niveles
- Rendimiento por etapa
- Insights y recomendaciones

## Configuración de Etapas

### Estructura Predefinida

```typescript
export const PRODUCTION_STAGES_CONFIG = {
  'creation': {
    id: 'creation',
    name: 'Etapa 1 - Creación de Muestra',
    description: 'Proceso inicial de creación y desarrollo de la muestra',
    phases: [
      { slug: 'jo', name: 'JO', areaCode: 'JO', areaName: 'Jefatura de Operaciones' },
      { slug: 'md-creacion-ficha', name: 'MD Creación Ficha', areaCode: 'MD', areaName: 'Modelado - Creación' },
      // ... más fases
    ]
  },
  // ... más etapas
};
```

### Métricas por Defecto

```typescript
export const DEFAULT_PHASE_METRICS: Record<string, PhaseMetrics> = {
  'jo': { averageDuration: 4, estimatedDuration: 4 },
  'md-creacion-ficha': { averageDuration: 8, estimatedDuration: 8 },
  // ... más métricas
};
```

## Funciones Utilitarias

### Cálculo de Estados

```typescript
function calculatePhaseStatus(
  phase: ProductionPhase,
  currentPhaseSlug?: string,
  phases: ProductionPhase[] = []
): PhaseStatus
```

### Formateo de Tiempo

```typescript
function formatDuration(hours: number): string {
  // Convierte horas a formato legible: "2d 4h" o "6h"
}

function calculateDuration(startDate: string, endDate?: string): number {
  // Calcula duración en horas entre fechas
}
```

## API Integration

### Endpoints Esperados

```typescript
// Obtener timeline de producción
GET /api/production-timeline/${collectionId}/${referenciaId}

// Ejecutar acción en fase
POST /api/phase-action
Body: {
  phaseId: string;
  action: 'deliver' | 'return';
  notes?: string;
  targetPhaseId?: string; // Para devoluciones
}
```

### Estructura de Respuesta

```typescript
// Timeline Response
interface ProductionTimelineResponse {
  timeline: ProductionTimeline;
  success: boolean;
  message?: string;
}

// Action Response
interface PhaseActionResponse {
  success: boolean;
  message: string;
  updatedTimeline: ProductionTimeline;
}
```

## Estilos y Theming

### Clases CSS Principales

```css
/* Estados de fases */
.phase-pending { @apply border-secondary-200 bg-white; }
.phase-in-progress { @apply border-primary-200 bg-primary-50; }
.phase-completed { @apply border-success-200 bg-success-50; }
.phase-overdue { @apply border-error-200 bg-error-50; }
.phase-returned { @apply border-warning-200 bg-warning-50; }

/* Animaciones */
.phase-card { @apply transition-all duration-300; }
.phase-card:hover { @apply shadow-medium; }

/* Responsive grid */
.phases-grid { 
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4; 
}
```

### Variables de Color

Usa el sistema de colores de Tailwind definido en `tailwind.config.ts`:
- `primary-*`: Azul para acciones principales
- `secondary-*`: Gris para elementos neutros
- `success-*`: Verde para estados completados
- `warning-*`: Amarillo para advertencias
- `error-*`: Rojo para errores y retrasos

## Consideraciones de Rendimiento

### Optimizaciones Implementadas

1. **Lazy Loading**: Componentes se cargan bajo demanda
2. **Memoización**: Cálculos costosos cached con useMemo
3. **Debounced Updates**: Actualizaciones agrupadas para reducir re-renders
4. **Virtual Scrolling**: Para listas largas de fases (futuro)

### Métricas de Rendimiento

- **Initial Load**: < 500ms para timeline completo
- **Action Response**: < 200ms para acciones locales
- **Memory Usage**: < 50MB para timeline con 50+ fases

## Testing

### Unit Tests

```typescript
// Ejemplo de test para hook
describe('useProductionTimeline', () => {
  it('should calculate phase progress correctly', () => {
    const { result } = renderHook(() => useProductionTimeline(mockProps));
    expect(result.current.getPhaseProgress()).toBe(33);
  });
});
```

### Integration Tests

```typescript
// Ejemplo de test para componente
describe('ProductionTimeline', () => {
  it('should display all stages with correct phases', () => {
    render(<ProductionTimeline {...mockProps} />);
    expect(screen.getByText('Etapa 1 - Creación de Muestra')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Problemas Comunes

1. **Timeline no carga**:
   - Verificar que `referenciaId` y `collectionId` estén presentes
   - Revisar logs de API en consola
   - Confirmar que `getReferenciaData` retorna `fases_disponibles`

2. **Botones de acción no aparecen**:
   - Verificar que `canDeliver` o `canReturn` estén en `true`
   - Confirmar que la fase tenga estado `in-progress`
   - Revisar permisos del usuario actual

3. **Métricas incorrectas**:
   - Verificar que las fechas estén en formato ISO válido
   - Confirmar que `DEFAULT_PHASE_METRICS` tenga todas las fases
   - Revisar cálculos de duración

### Debug Utils

```typescript
// Agregar en desarrollo para debug
console.log('Timeline Debug:', {
  timeline,
  currentPhase: getCurrentPhase(),
  overduePhases: getOverduePhases(),
  progress: getPhaseProgress()
});
```

## Deployment

### Build Requirements

- Next.js 14+
- TypeScript 5+
- Tailwind CSS 3+
- React 18+

### Environment Variables

```env
# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Timeline Settings
NEXT_PUBLIC_TIMELINE_REFRESH_INTERVAL=30000
NEXT_PUBLIC_TIMELINE_AUTO_SAVE=true
```

### Production Checklist

- [ ] API endpoints configurados correctamente
- [ ] Variables de entorno establecidas
- [ ] Types exportados desde `index.ts`
- [ ] Documentación UX revisada
- [ ] Tests unitarios pasando
- [ ] Performance auditado
- [ ] Accesibilidad validada (WCAG 2.1)

---

**Versión**: 1.0  
**Última actualización**: 2025-01-18  
**Maintainer**: Development Team