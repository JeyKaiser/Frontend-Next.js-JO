'use client';

import { useState, useEffect } from 'react';
import Card from '@/app/globals/components/molecules/Card';
import Breadcrumb from '@/app/globals/components/molecules/Breadcrumb';
import { Search, Filter, Plus, Grid, List, Layers } from 'lucide-react';

interface Reference {
  codigo_coleccion: string;
  codigo_referencia: string;
  label: string;
  img: string;
  bg: string;
  status: 'active' | 'archived' | 'planning';
  lastUpdated: string;
  season: 'Spring/Summer' | 'Fall/Winter' | 'Resort' | 'Pre-Fall' | 'Summer Vacation' | 'Winter Sun';
}

interface Collection {
  id: string;
  label: string;
  img: string;
  bg: string;
  status: 'active' | 'archived' | 'planning';
  references: Reference[];
  lastUpdated: string;
  season: 'Spring/Summer' | 'Fall/Winter' | 'Resort' | 'Pre-Fall' | 'Summer Vacation' | 'Winter Sun';
}

export default function ColeccionesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [colecciones, setColecciones] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColecciones = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/colecciones', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.details || `Error del servidor: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Formato de respuesta inválido');
        }
        
        setColecciones(data);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar las colecciones');
      } finally {
        setLoading(false);
      }
    };

    fetchColecciones();
  }, []);

  const breadcrumbItems = [
    { label: 'Colecciones', current: true },
  ];

  const seasons = ['all', 'Winter Sun', 'Spring/Summer', 'Fall/Winter', 'Resort', 'Pre-Fall', 'Summer Vacation'];

  const filteredCollections = colecciones.filter(collection => {
    const matchesSearch = collection.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeason = selectedSeason === 'all' || collection.season === selectedSeason;
    return matchesSearch && matchesSeason;
  });

  const getStatusBadge = (status: Collection['status']) => {
    const badges = {
      active: 'bg-success-100 text-success-700 border-success-200',
      planning: 'bg-warning-100 text-warning-700 border-warning-200',
      archived: 'bg-secondary-100 text-secondary-700 border-secondary-200',
    };
    
    return badges[status];
  };

  const getStatusLabel = (status: Collection['status']) => {
    const labels = {
      active: 'Activa',
      planning: 'En Planificación',
      archived: 'Archivada',
    };
    
    return labels[status];
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-soft border border-secondary-200 p-6">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header">
            <h1 className="page-title">
              Gestión de Colecciones
            </h1>
            <p className="page-subtitle">
              Administra y organiza todas las colecciones
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View mode toggle */}
            <div className="flex items-center bg-secondary-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button className="btn-primary">
              <Plus className="w-4 h-4" />
              Nueva Colección
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-soft border border-secondary-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar colecciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
          
          {/* Season Filter */}
          <div className="md:w-48">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="form-input"
            >
              {seasons.map((season) => (
                <option key={season} value={season}>
                  {season === 'all' ? 'Todas las colecciones' : season}
                </option>
              ))}
            </select>
          </div>
          
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-secondary-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{filteredCollections.length}</p>
              <p className="text-sm text-secondary-600">Colecciones</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-secondary-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-success-500 rounded-full" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">
                {filteredCollections.filter(c => c.status === 'active').length}
              </p>
              <p className="text-sm text-secondary-600">Activas</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-secondary-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-warning-500 rounded-full" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">
                {filteredCollections.filter(c => c.status === 'planning').length}
              </p>
              <p className="text-sm text-secondary-600">En Planificación</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-secondary-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-secondary-500 rounded-full" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">
                {filteredCollections.filter(c => c.status === 'archived').length}
              </p>
              <p className="text-sm text-secondary-600">Archivadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Grid/List */}
      <div className="bg-white rounded-xl shadow-soft border border-secondary-200">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Layers className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Cargando colecciones...
            </h3>
            <p className="text-secondary-600">
              Por favor espera mientras obtenemos los datos.
            </p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Error al cargar colecciones
            </h3>
            <p className="text-red-600 mb-4">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Intentar de nuevo
            </button>
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              No se encontraron colecciones
            </h3>
            <p className="text-secondary-600 mb-6">
              No hay colecciones que coincidan con los filtros seleccionados.
            </p>
            <button className="btn-primary">
              <Plus className="w-4 h-4" />
              Crear primera colección
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCollections.map((collection, index) => (
                <div key={`${collection.id}-${index}`} className="relative group">
                  {/* Status badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(collection.status)}`}>
                      {getStatusLabel(collection.status)}
                    </span>
                  </div>
                  
                  <Card
                    title={collection.label}
                    imageSrc={collection.img}
                    bgColor={collection.bg}
                    href={`/modules/colecciones/${collection.id}/referencias-por-anio`}
                  />
                  
                  {/* Additional info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-b-2xl">
                    <p className="text-white text-xs">
                      Última actualización: {new Date(collection.lastUpdated).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* List view */
          <div className="divide-y divide-secondary-200">
            {filteredCollections.map((collection, index) => (
              <div key={`${collection.id}-${index}`} className="p-6 hover:bg-secondary-50 transition-colors duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: collection.bg }}>
                    <img 
                      src={collection.img} 
                      alt={collection.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-secondary-900 truncate">
                        {collection.label}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(collection.status)}`}>
                        {getStatusLabel(collection.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-secondary-600">
                      <span>ID: {collection.id}</span>
                      <span>{collection.season}</span>
                      <span>{collection.references?.length || 0} referencias</span>
                      <span>Última act.: {new Date(collection.lastUpdated).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <a
                      href={`/modules/colecciones/${collection.id}/referencias-por-anio`}
                      className="btn-secondary"
                    >
                      Ver referencias
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

