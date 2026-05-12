'use client';

import Link from 'next/link';
import Breadcrumb from '@/app/globals/components/molecules/Breadcrumb';
import {
  ArrowRight,
  AlertCircle,
  Database,
  Layers,
  Package,
  Users,
} from 'lucide-react';

export default function DashboardPage() {
  const breadcrumbItems = [{ label: 'Dashboard', current: true }];

  const unavailableMessage =
    'No se puede cargar información del dashboard porque todavía no existe una fuente de datos conectada. No se muestran datos quemados ni simulados.';

  return (
    <div className="page-container">
      <div className="bg-white rounded-xl shadow-soft border border-secondary-200 p-6">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
          <div className="page-header">
            <h1 className="page-title">Dashboard de Gestión</h1>
            <p className="page-subtitle">
              El tablero está preparado para consumir datos reales del sistema.
            </p>
          </div>

          <div className="rounded-xl border border-warning-200 bg-warning-50 px-4 py-3 text-warning-900 max-w-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Fuente no disponible</p>
                <p className="text-sm mt-1">{unavailableMessage}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card border-dashed border-secondary-300 bg-secondary-50">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Referencias</p>
                <p className="text-lg font-semibold text-secondary-900">No disponible</p>
                <p className="text-sm text-secondary-500 mt-1">Pendiente de API real</p>
              </div>
              <div className="p-3 bg-secondary-100 rounded-lg">
                <Package className="w-6 h-6 text-secondary-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="card border-dashed border-secondary-300 bg-secondary-50">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Colecciones Activas</p>
                <p className="text-lg font-semibold text-secondary-900">No disponible</p>
                <p className="text-sm text-secondary-500 mt-1">Pendiente de API real</p>
              </div>
              <div className="p-3 bg-secondary-100 rounded-lg">
                <Layers className="w-6 h-6 text-secondary-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="card border-dashed border-secondary-300 bg-secondary-50">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
              <p className="text-sm font-medium text-secondary-600">En Producción</p>
                <p className="text-lg font-semibold text-secondary-900">No disponible</p>
                <p className="text-sm text-secondary-500 mt-1">Pendiente de API real</p>
              </div>
              <div className="p-3 bg-secondary-100 rounded-lg">
                <Database className="w-6 h-6 text-secondary-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="card border-dashed border-secondary-300 bg-secondary-50">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Completadas</p>
                <p className="text-lg font-semibold text-secondary-900">No disponible</p>
                <p className="text-sm text-secondary-500 mt-1">Pendiente de API real</p>
              </div>
              <div className="p-3 bg-secondary-100 rounded-lg">
                <Users className="w-6 h-6 text-secondary-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900">Acciones Rápidas</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              <Link href="/modules/colecciones" className="btn-primary w-full justify-between">
                <span>Ver Colecciones</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/modules/consumos" className="btn-secondary w-full justify-between">
                <span>Gestionar Consumos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/modules/referentes" className="btn-ghost w-full justify-between">
                <span>Ver Referentes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900">Actividad Reciente</h3>
          </div>
          <div className="card-body">
            <div className="rounded-xl border border-dashed border-secondary-300 bg-secondary-50 px-4 py-6 text-center">
              <AlertCircle className="w-8 h-8 text-warning-500 mx-auto mb-3" />
              <p className="text-sm font-medium text-secondary-900">
                No hay actividad para mostrar
              </p>
              <p className="text-sm text-secondary-600 mt-1">
                Esta sección espera datos reales del backend. Mientras tanto, permanece vacía para
                evitar contenido falso.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-secondary-900">Resumen de Rendimiento</h3>
        </div>
        <div className="card-body">
          <div className="rounded-xl border border-dashed border-secondary-300 bg-secondary-50 px-4 py-8 text-center">
            <AlertCircle className="w-10 h-10 text-warning-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-secondary-900">
              No se pueden calcular métricas todavía
            </p>
            <p className="text-sm text-secondary-600 mt-1">
              Cuando exista un endpoint real para el dashboard, aquí se mostrarán las métricas
              reales del sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
