// app/modules/(dashboard)/kanban-demo/page.tsx
'use client';

import React from 'react';
import PhaseKanbanCarousel from '@/app/globals/components/organisms/PhaseKanbanCarousel';
import { FaseDisponible } from '@/app/modules/types';

const KanbanDemoPage = () => {
  // Mock data for demonstration
  const mockFases: FaseDisponible[] = [
    { slug: 'jo', nombre: 'JO - Jefatura Operaciones' },
    { slug: 'md-creacion-ficha', nombre: 'MD - Creación Ficha' },
    { slug: 'md-creativo', nombre: 'MD - Creativo' },
    { slug: 'md-corte', nombre: 'MD - Corte' },
    { slug: 'md-fitting', nombre: 'MD - Fitting' },
    { slug: 'md-tecnico', nombre: 'MD - Técnico' },
    { slug: 'md-trazador', nombre: 'MD - Trazador' },
    { slug: 'costeo', nombre: 'Costeo' },
    { slug: 'pt-tecnico', nombre: 'PT - Técnico' },
    { slug: 'pt-cortador', nombre: 'PT - Cortador' },
    { slug: 'pt-fitting', nombre: 'PT - Fitting' },
    { slug: 'pt-trazador', nombre: 'PT - Trazador' }
  ];

  const handlePhaseAction = async (phaseSlug: string, action: 'deliver' | 'return', notes?: string) => {
    console.log(`[Demo] Phase Action: ${action} on phase ${phaseSlug}`, notes);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Acción ${action} completada para la fase: ${phaseSlug}`);
  };

  const handlePhaseClick = (fase: FaseDisponible) => {
    console.log('[Demo] Phase clicked:', fase);
    alert(`Navegando a la fase: ${fase.nombre}`);
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">
            Demo del Sistema Kanban de Fases
          </h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Esta página demuestra el nuevo sistema kanban con carrusel para la gestión de fases, 
            basado en el diseño del archivo kanban.html y adaptado con Tailwind CSS y React/TypeScript.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">
            Características Implementadas:
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-secondary-700 mb-2">✅ Funcionalidades</h3>
              <ul className="text-sm text-secondary-600 space-y-1">
                <li>• Carrusel navegable con scroll suave</li>
                <li>• Barra de progreso dinámica</li>
                <li>• Estados visuales de fases (completada, actual, pendiente)</li>
                <li>• Modal para acciones (entregar/devolver)</li>
                <li>• Panel de detalles expandible</li>
                <li>• Botones de navegación del carrusel</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-secondary-700 mb-2">🎨 Estilos Tailwind</h3>
              <ul className="text-sm text-secondary-600 space-y-1">
                <li>• Paleta de colores consistente</li>
                <li>• Efectos de hover y transiciones</li>
                <li>• Diseño responsive</li>
                <li>• Sombras y efectos visuales</li>
                <li>• Iconografía con Heroicons</li>
                <li>• Tipografía escalada</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo del componente */}
        <PhaseKanbanCarousel
          referenciaId="PT01662"
          collectionId="063"
          fases={mockFases}
          currentPhaseSlug="md-creativo" // Fase actual para demo
          onPhaseAction={handlePhaseAction}
          onPhaseClick={handlePhaseClick}
        />

        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            🚀 Instrucciones de Uso
          </h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>Navegación:</strong> Usa los botones de flecha o scroll horizontal para navegar por las fases</p>
            <p><strong>Detalles:</strong> Haz clic en cualquier carta de fase para ver sus detalles</p>
            <p><strong>Acciones:</strong> Usa los botones "Entregar" y "Devolver" para simular acciones de fase</p>
            <p><strong>Progreso:</strong> La barra superior muestra el progreso general de las fases</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-secondary-500">
            Desarrollado siguiendo la estructura del archivo kanban.html original, 
            adaptado para React/TypeScript con Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
};

export default KanbanDemoPage;