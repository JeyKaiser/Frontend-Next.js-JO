'use client';

import { useState, useEffect } from 'react';
import CardReferencia from '@/app/globals/components/molecules/CardReferencia';
import Breadcrumb from '@/app/globals/components/molecules/Breadcrumb';
import type { ReferenciasAnioApiResponse } from '@/app/modules/types';
import Link from 'next/link';
import { ArrowLeft, Grid, List, Search, Package, Eye, Plus } from 'lucide-react';

// Helper function to safely get image source
const getSafeImageSrc = (path: string | null | undefined): string => {
  const defaultImage = '/img/SIN FOTO.png';
  if (!path) {
    return defaultImage;
  }
  // Reemplaza las barras invertidas y comprueba si es una URL válida o una ruta relativa
  const normalizedPath = path.replace(/\\/g, '/');
  if (normalizedPath.startsWith('http') || normalizedPath.startsWith('/')) {
    return normalizedPath;
  }
  // Si es una ruta inválida, devuelve la imagen por defecto
  return defaultImage;
};

// Helper function to determine status chip styles
const getStatusChipProps = (status: string | null): { className: string; label: string } => {
  if (!status) {
    return { className: 'bg-gray-200 text-gray-800', label: 'Sin estado' };
  }
  const trimmedStatus = status.trim();
  switch (trimmedStatus) {
    case 'Aprobado sujeto a cambios':
      return { className: 'bg-teal-100 text-teal-800 border border-teal-300', label: 'Por cambios' };
    case 'Aprobada y terminada':
      return { className: 'bg-green-100 text-green-800 border border-green-300', label: 'Aprobada' };
    case 'En Proceso':
      return { className: 'bg-yellow-100 text-yellow-800 border border-yellow-300', label: trimmedStatus };
    case 'Cancelada':
      return { className: 'bg-gray-200 text-gray-800 border border-gray-300', label: trimmedStatus };
    default:
      return { className: 'bg-gray-200 text-gray-800', label: trimmedStatus };
  }
};

const ALL_STATUSES = ["Aprobado sujeto a cambios", "Aprobada y terminada", "En Proceso", "Cancelada"];

// Helper function to normalize status strings
const normalizeStatus = (status: string | null | undefined): string => {
  if (!status) return '';
  return status.trim().replace(/\s+/g, ' '); // Elimina espacios múltiples y caracteres invisibles
};

interface ReferenciasListPageProps {
  params: {
    coleccionId: string;
  };
}

async function getReferenciasList(collectionId: string): Promise<ReferenciasAnioApiResponse[] | null> {
  const DJANGO_API_BASE_URL = 'http://localhost:8000';
  try {
    const apiUrl = `${DJANGO_API_BASE_URL}/api/referencias-por-anio/${collectionId}/`;
    console.log(`[Next.js SC - Referencias List] Solicitando API: ${apiUrl}`);
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) {
      let errorBody = 'No body';
      try { errorBody = await res.text(); } catch (e) {}
      console.error(`[Next.js SC - Referencias List] Error al obtener referencias para ID '${collectionId}': STATUS ${res.status}. Cuerpo: ${errorBody}`);
      
      // Fallback to mock data when backend is not available
      console.log(`[Next.js SC - Referencias List] Backend no disponible, usando datos mock para colección ${collectionId}`);
      return getMockReferences(collectionId);
    }
    const data: ReferenciasAnioApiResponse[] = await res.json();
    console.log(`[Next.js SC - Referencias List] Datos recibidos:`, data);
    return data;
  } catch (error) {
    console.error("[Next.js SC - Referencias List] Error de red o al parsear JSON:", error);
    console.log(`[Next.js SC - Referencias List] Backend no disponible, usando datos mock para colección ${collectionId}`);
    return getMockReferences(collectionId);
  }
}

// Mock data function for testing when backend is not available
function getMockReferences(collectionId: string): ReferenciasAnioApiResponse[] {
  return [
    {
      U_GSP_Picture: '/img/SIN FOTO.png',
      U_GSP_REFERENCE: 'PT01662',
      U_GSP_Desc: 'Referencia de prueba para Kanban - Camisa elegante',
      Name: 'En Proceso',
      id: '1'
    }    
  ];
}

export default function ReferenciasListPage({ params }: ReferenciasListPageProps) {
  const [modelos, setModelos] = useState<ReferenciasAnioApiResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [collectionId, setCollectionId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const resolvedParams = await params;
        setCollectionId(resolvedParams.coleccionId);
        console.log(`[ReferenciasListPage] Cargando referencias para coleccionId: ${resolvedParams.coleccionId}`);
        
        const data = await getReferenciasList(resolvedParams.coleccionId);
        setModelos(data);
      } catch (err) {
        setError('Error al cargar las referencias');
        console.error('Error loading references:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [params]);

  const breadcrumbItems = [
    { label: 'Colecciones', href: '/modules/colecciones' },
    { label: collectionId || 'Cargando...', current: true },
  ];

  const filteredModelos = modelos?.filter(modelo => {
    const searchMatch = modelo.U_GSP_REFERENCE.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        modelo.U_GSP_Desc.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedStatus === 'all') {
      return searchMatch;
    }

    // Normalizamos el estado para eliminar espacios en blanco y caracteres invisibles
    const cleanStatus = normalizeStatus(modelo.Name);
    const normalizedSelectedStatus = normalizeStatus(selectedStatus);
    console.log(`[DEBUG] Comparando: "${cleanStatus}" === "${normalizedSelectedStatus}" (Original: "${modelo.Name}")`);
    const statusMatch = cleanStatus === normalizedSelectedStatus;
    return searchMatch && statusMatch;
  }) || [];

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="bg-white rounded-xl shadow-soft border border-secondary-200 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-secondary-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-secondary-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-secondary-200 rounded w-1/3"></div>
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="bg-white rounded-xl shadow-soft border border-secondary-200 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-secondary-200 rounded-xl h-48 mb-4"></div>
                <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !modelos) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-soft border border-secondary-200 p-6">
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
          <Link
            href="/modules/colecciones"
            className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-900 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Colecciones
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft border border-error-200 p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-error-500" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              Error al cargar las referencias
            </h1>
            <p className="text-secondary-600 mb-4">
              No se pudieron cargar las referencias para la colección: {collectionId}
            </p>
            <p className="text-sm text-error-600 mb-6">
              Verifica la API de Django o la conexión.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (modelos.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-soft border border-secondary-200 p-6">
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
          <Link
            href="/modules/colecciones"
            className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-900 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Colecciones
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft border border-secondary-200 p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-secondary-400" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              No hay referencias disponibles
            </h1>
            <p className="text-secondary-600 mb-6">
              No se encontraron referencias para la colección: {collectionId}
            </p>
            <button className="btn-primary">
              <Plus className="w-4 h-4" />
              Agregar primera referencia
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-soft border border-secondary-200 p-6">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        
        <Link
          href="/modules/colecciones"
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-900 transition-colors duration-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Colecciones
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Referencias de {collectionId}
            </h1>
            <p className="text-secondary-600">
              {filteredModelos.length} de {modelos.length} referencias encontradas
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View mode toggle */}
            <div className="flex items-center bg-secondary-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-secondary-600 hover:text-secondary-900'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-secondary-600 hover:text-secondary-900'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-soft border border-secondary-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar referencias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="md:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-input"
            >
              <option value="all">Todos los estados</option>
              {ALL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* References Grid/List */}
      <div className="bg-white rounded-xl shadow-soft border border-secondary-200">
        {filteredModelos.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              No se encontraron referencias
            </h3>
            <p className="text-secondary-600">
              No hay referencias que coincidan con "<strong>{searchTerm}</strong>"
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
              {filteredModelos.map((modelo, index) => {
                const fullImageSrc = getSafeImageSrc(modelo.U_GSP_Picture);
                const destinationUrl = `/modules/referencia-detalle/${collectionId}/${modelo.U_GSP_REFERENCE}`;
                console.log(`[ReferenciasListPage] Generando enlace para ${modelo.U_GSP_REFERENCE}: ${destinationUrl} collectionId: ${collectionId}`);

                return (
                  <div key={modelo.U_GSP_REFERENCE || modelo.id || index} className="relative group">
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusChipProps(normalizeStatus(modelo.Name)).className}`}>
                        {getStatusChipProps(normalizeStatus(modelo.Name)).label}
                      </span>
                    </div>
                    <CardReferencia
                      imageSrc={fullImageSrc}
                      title={modelo.U_GSP_REFERENCE}
                      subtitle={modelo.U_GSP_Desc}
                      href={destinationUrl}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* List view */
          <div className="divide-y divide-secondary-200">
            {filteredModelos.map((modelo, index) => {
              const fullImageSrc = getSafeImageSrc(modelo.U_GSP_Picture);
              const destinationUrl = `/modules/referencia-detalle/${collectionId}/${modelo.U_GSP_REFERENCE}`;

              return (
                <div key={modelo.U_GSP_REFERENCE || modelo.id || index} className="p-6 hover:bg-secondary-50 transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-secondary-100">
                      <img 
                        src={fullImageSrc} 
                        alt={modelo.U_GSP_REFERENCE}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-secondary-900 truncate">
                          {modelo.U_GSP_REFERENCE}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusChipProps(normalizeStatus(modelo.Name)).className}`}>
                          {getStatusChipProps(normalizeStatus(modelo.Name)).label}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-600 line-clamp-2">
                        {modelo.U_GSP_Desc}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <button className="btn-ghost p-2">
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={destinationUrl}
                        className="btn-secondary"
                      >
                        Ver detalles
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
