'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/app/globals/components/molecules/Breadcrumb';
import {
  TrendingUp,
  Package,
  Layers,
  Users,
  ArrowRight,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface DashboardStats {
  totalReferences: number;
  activeCollections: number;
  inProduction: number;
  completed: number;
}

interface RecentActivity {
  id: string;
  type: 'reference' | 'collection' | 'phase';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'in-progress' | 'pending';
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReferences: 247,
    activeCollections: 6,
    inProduction: 89,
    completed: 158,
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'reference',
      title: 'PT-2024-001',
      description: 'Nueva referencia creada para Winter Sun',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'completed',
    },
    {
      id: '2',
      type: 'phase',
      title: 'MD Creación Ficha',
      description: 'Fase completada para PT-2024-002',
      timestamp: '2024-01-15T09:15:00Z',
      status: 'completed',
    },
    {
      id: '3',
      type: 'collection',
      title: 'Spring Summer 2024',
      description: 'Colección actualizada con nuevas referencias',
      timestamp: '2024-01-14T16:45:00Z',
      status: 'in-progress',
    },
  ]);

  const breadcrumbItems = [
    { label: 'Dashboard', current: true },
  ];

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-success-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-warning-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-error-500" />;
      default:
        return <Activity className="w-4 h-4 text-secondary-500" />;
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-soft border border-secondary-200 p-6">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <div className="flex items-center justify-between">
          <div className="page-header">
            <h1 className="page-title">
              Dashboard de Gestión
            </h1>
            <p className="page-subtitle">
              Bienvenido al sistema de gestión del ciclo de vida de prendas JO
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-secondary-500">Última actualización</p>
            <p className="text-sm font-medium text-secondary-900">
              {new Date().toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Referencias</p>
                <p className="text-3xl font-bold text-secondary-900">{stats.totalReferences}</p>
                <p className="text-sm text-success-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  +12% vs mes anterior
                </p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Colecciones Activas</p>
                <p className="text-3xl font-bold text-secondary-900">{stats.activeCollections}</p>
                <p className="text-sm text-secondary-500 mt-1">
                  6 temporadas activas
                </p>
              </div>
              <div className="p-3 bg-accent-100 rounded-lg">
                <Layers className="w-6 h-6 text-accent-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">En Producción</p>
                <p className="text-3xl font-bold text-secondary-900">{stats.inProduction}</p>
                <p className="text-sm text-warning-600 mt-1">
                  {Math.round((stats.inProduction / stats.totalReferences) * 100)}% del total
                </p>
              </div>
              <div className="p-3 bg-warning-100 rounded-lg">
                <Activity className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Completadas</p>
                <p className="text-3xl font-bold text-secondary-900">{stats.completed}</p>
                <p className="text-sm text-success-600 mt-1">
                  {Math.round((stats.completed / stats.totalReferences) * 100)}% del total
                </p>
              </div>
              <div className="p-3 bg-success-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
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
              <Link href="/modules/categorias" className="btn-ghost w-full justify-between">
                <span>Ver Categorías</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card lg:col-span-2">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900">Actividad Reciente</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border border-secondary-100 hover:bg-secondary-50 transition-colors duration-200">
                  <div className="flex-shrink-0">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-secondary-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                    <p className="text-sm text-secondary-600 mt-1">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-secondary-900">Resumen de Rendimiento</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-1">Productividad</h4>
              <p className="text-sm text-secondary-600">
                Las referencias se completan 23% más rápido que el trimestre anterior
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-success-600" />
              </div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-1">Calidad</h4>
              <p className="text-sm text-secondary-600">
                95% de las referencias pasan la revisión de calidad en la primera iteración
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-accent-600" />
              </div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-1">Colaboración</h4>
              <p className="text-sm text-secondary-600">
                12 equipos activos trabajando en diferentes fases del proceso
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}