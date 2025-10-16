'use client';

import React, { useState } from 'react';
import { useUserManagement } from '@/app/modules/hooks/useUserManagement';
import { usePollingSync } from '@/app/modules/hooks/usePollingSync';
import { useWebSocketSync } from '@/app/modules/hooks/useWebSocketSync';
import ConnectionStatus from '../molecules/ConnectionStatus';
import { Usuario } from '@/app/modules/types';

/**
 * Componente de demostración para comparar diferentes estrategias de sincronización
 */

interface StrategyMetrics {
  name: string;
  updateCount: number;
  lastUpdate: Date | null;
  averageLatency: number;
  dataFreshness: 'real-time' | 'near-real-time' | 'periodic' | 'manual';
  resourceUsage: 'low' | 'medium' | 'high';
  reliability: 'high' | 'medium' | 'low';
}

export default function SyncStrategyComparison() {
  const [selectedStrategy, setSelectedStrategy] = useState<'sse' | 'polling' | 'websocket' | 'manual'>('sse');
  const [metrics, setMetrics] = useState<Record<string, StrategyMetrics>>({
    sse: {
      name: 'Server-Sent Events',
      updateCount: 0,
      lastUpdate: null,
      averageLatency: 0,
      dataFreshness: 'real-time',
      resourceUsage: 'low',
      reliability: 'high'
    },
    polling: {
      name: 'Polling',
      updateCount: 0,
      lastUpdate: null,
      averageLatency: 0,
      dataFreshness: 'periodic',
      resourceUsage: 'medium',
      reliability: 'high'
    },
    websocket: {
      name: 'WebSocket',
      updateCount: 0,
      lastUpdate: null,
      averageLatency: 0,
      dataFreshness: 'real-time',
      resourceUsage: 'medium',
      reliability: 'medium'
    },
    manual: {
      name: 'Manual Refresh',
      updateCount: 0,
      lastUpdate: null,
      averageLatency: 0,
      dataFreshness: 'manual',
      resourceUsage: 'low',
      reliability: 'high'
    }
  });

  // SSE Strategy
  const sseData = useUserManagement(selectedStrategy === 'sse');
  
  // Polling Strategy  
  const fetchUsers = async (): Promise<Usuario[]> => {
    const response = await fetch('/api/users');
    const data = await response.json();
    return data.success ? data.data : [];
  };
  
  const pollingData = usePollingSync(fetchUsers, {
    interval: 10000, // 10 seconds
    enabled: selectedStrategy === 'polling'
  });
  
  // WebSocket Strategy
  const websocketData = useWebSocketSync({
    enabled: selectedStrategy === 'websocket',
    onMessage: (message) => {
      console.log('[WebSocket] Received:', message);
      // Handle user updates here
    }
  });

  const strategies = [
    {
      id: 'sse' as const,
      name: 'Server-Sent Events (Recomendado)',
      description: 'Conexión unidireccional servidor->cliente para notificaciones en tiempo real',
      pros: [
        'Actualizaciones en tiempo real',
        'Bajo uso de recursos',
        'Reconexicón automática',
        'Funciona con proxies',
        'Fácil implementación'
      ],
      cons: [
        'Solo unidireccional',
        'Requiere soporte HTTP/2 para múltiples conexiones'
      ],
      bestFor: 'Aplicaciones administrativas con cambios poco frecuentes',
      performance: {
        latency: '< 100ms',
        resourceUsage: 'Muy bajo',
        scalability: 'Excelente'
      }
    },
    {
      id: 'polling' as const,
      name: 'Polling Inteligente',
      description: 'Consultas periódicas al servidor con comparación de datos',
      pros: [
        'Simple y confiable',
        'Funciona en cualquier red',
        'Fácil debugging',
        'Control total del intervalo'
      ],
      cons: [
        'Latencia según intervalo',
        'Mayor uso de ancho de banda',
        'Posible sobrecarga del servidor'
      ],
      bestFor: 'Fallback cuando otras opciones no están disponibles',
      performance: {
        latency: '5-30 segundos',
        resourceUsage: 'Medio',
        scalability: 'Buena'
      }
    },
    {
      id: 'websocket' as const,
      name: 'WebSocket',
      description: 'Conexión bidireccional para máxima interactividad',
      pros: [
        'Comunicación bidireccional',
        'Latencia mínima',
        'Soporte para múltiples canales',
        'Ideal para colaboración'
      ],
      cons: [
        'Más complejo',
        'Problemas con proxies/firewalls',
        'Requiere manejo de reconexicón',
        'Mayor uso de recursos'
      ],
      bestFor: 'Aplicaciones colaborativas con edición simultánea',
      performance: {
        latency: '< 50ms',
        resourceUsage: 'Alto',
        scalability: 'Buena con límites'
      }
    },
    {
      id: 'manual' as const,
      name: 'Refresh Manual',
      description: 'Usuario controla cuándo actualizar los datos',
      pros: [
        'Control total del usuario',
        'Uso mínimo de recursos',
        'Muy simple',
        'Ideal para datos estáticos'
      ],
      cons: [
        'Datos pueden estar desactualizados',
        'Requiere intervención manual',
        'Mala experiencia para datos dinámicos'
      ],
      bestFor: 'Datos que cambian muy raramente o cuando el control es crítico',
      performance: {
        latency: 'Manual',
        resourceUsage: 'Mínimo',
        scalability: 'Excelente'
      }
    }
  ];

  const currentStrategy = strategies.find(s => s.id === selectedStrategy);
  const currentData = selectedStrategy === 'sse' ? sseData : 
                     selectedStrategy === 'polling' ? { users: pollingData.data, isLoading: pollingData.isPolling, connectionStatus: pollingData.isPolling ? 'connected' : 'disconnected', isConnected: pollingData.isPolling } :
                     selectedStrategy === 'websocket' ? { users: [], isLoading: false, connectionStatus: websocketData.connectionState, isConnected: websocketData.isConnected } :
                     { users: [], isLoading: false, connectionStatus: 'disconnected' as const, isConnected: false };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Comparación de Estrategias de Sincronización
        </h1>
        <p className="text-gray-600">
          Demo interactiva de diferentes enfoques para mantener datos sincronizados
        </p>
      </div>

      {/* Strategy Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Selecciona una Estrategia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {strategies.map((strategy) => (
            <button
              key={strategy.id}
              onClick={() => setSelectedStrategy(strategy.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedStrategy === strategy.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-sm mb-1">{strategy.name}</h3>
              <p className="text-xs text-gray-600">{strategy.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Current Strategy Details */}
      {currentStrategy && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strategy Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{currentStrategy.name}</h2>
              <ConnectionStatus 
                isConnected={currentData.isConnected}
                connectionStatus={currentData.connectionStatus}
              />
            </div>
            
            <p className="text-gray-600 mb-4">{currentStrategy.description}</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-green-700 mb-2">Ventajas:</h3>
                <ul className="list-disc list-inside text-sm text-green-600 space-y-1">
                  {currentStrategy.pros.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-red-700 mb-2">Desventajas:</h3>
                <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                  {currentStrategy.cons.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 p-3 rounded">
                <h3 className="font-medium text-blue-800 mb-1">Mejor para:</h3>
                <p className="text-sm text-blue-700">{currentStrategy.bestFor}</p>
              </div>
            </div>
          </div>
          
          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Métricas de Rendimiento</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">Latencia:</span>
                <span className="text-blue-600">{currentStrategy.performance.latency}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">Uso de Recursos:</span>
                <span className="text-blue-600">{currentStrategy.performance.resourceUsage}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">Escalabilidad:</span>
                <span className="text-blue-600">{currentStrategy.performance.scalability}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">Usuarios Cargados:</span>
                <span className="text-blue-600">{currentData.users.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Implementation Example */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Ejemplo de Implementación</h2>
        <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm">
            <code>
{selectedStrategy === 'sse' ? `// Server-Sent Events Hook
const { 
  users, 
  isConnected, 
  connectionStatus 
} = useUserManagement(true); // Enable real-time sync

// Automatic updates cuando hay cambios en backend` :
selectedStrategy === 'polling' ? `// Polling Hook
const pollingData = usePollingSync(fetchUsers, {
  interval: 30000, // 30 seconds
  enabled: true,
  compareFunction: (old, new) => {
    // Custom comparison logic
    return JSON.stringify(old) === JSON.stringify(new);
  }
});` :
selectedStrategy === 'websocket' ? `// WebSocket Hook
const websocketData = useWebSocketSync({
  url: 'ws://localhost:3001/ws/users',
  enabled: true,
  onMessage: (message) => {
    if (message.type === 'user_change') {
      // Handle real-time user updates
      updateLocalUsers(message.payload);
    }
  }
});` :
`// Manual Refresh
const { users, refreshUsers } = useUserManagement(false);

// User triggers refresh
<button onClick={refreshUsers}>
  Actualizar Datos
</button>`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}