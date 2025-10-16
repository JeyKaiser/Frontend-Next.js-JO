'use client';

import React, { useState, useMemo } from 'react';
import { Search, Package2, Loader2 } from 'lucide-react';
import Input from '@/app/globals/components/atoms/Input';
import Button from '@/app/globals/components/atoms/Button';
import DataTable from '@/app/globals/components/molecules/DataTable';
import type { ConsumoData, ConsumosResponse, TipoConsumo } from '@/app/modules/types';

// Helper function to determine status chip styles
const getStatusChipProps = (status: string | null): { className: string; label: string } => {
  if (!status) {
    return { className: 'bg-secondary-200 text-secondary-800', label: 'Sin estado' };
  }

  const trimmedStatus = status.trim();

  switch (trimmedStatus) {
    case 'Aprobado sujeto a cambios':
      return { className: 'bg-teal-100 text-teal-800 border border-teal-300', label: status };
    case 'Aprobada y terminada':
      return { className: 'bg-green-100 text-green-800 border border-green-300', label: status };
    case 'En proceso':
      return { className: 'bg-yellow-100 text-yellow-800 border border-yellow-300', label: status };
    case 'Cancelada':
      return { className: 'bg-gray-200 text-gray-800 border border-gray-300', label: status };
    default:      
      console.warn(`[getStatusChipProps] Unexpected status value: "${status}"`);
      return { className: 'bg-gray-200 text-gray-800', label: status };
  }
};


export default function ConsumosPage() {
  const [searchCode, setSearchCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [consumosData, setConsumosData] = useState<ConsumoData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [collectionName, setCollectionName] = useState<string>('');
  const [referenceName, setReferenceName] = useState<string>('');
  const [estado, setEstado] = useState<string>('');

  // Agrupar consumos por tipo usando useMemo
  const tiposConsumo = useMemo((): TipoConsumo[] => {
    if (!consumosData.length) return [];
    
    const grupos = consumosData.reduce((acc, consumo) => {
      const tipo = consumo.TIPO || 'OTROS';
      if (!acc[tipo]) {
        acc[tipo] = [];
      }
      acc[tipo].push(consumo);
      return acc;
    }, {} as Record<string, ConsumoData[]>);

    return Object.entries(grupos).map(([tipo, data]) => ({
      id: tipo,
      nombre: tipo,
      data,
      count: data.length
    })).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [consumosData]);

  // Establecer la pestaña activa cuando cambien los tipos
  useMemo(() => {
    if (tiposConsumo.length > 0 && !activeTab) {
      setActiveTab(tiposConsumo[0].id);
    }
  }, [tiposConsumo, activeTab]);

  // Obtener datos del tipo activo
  const currentTypeData = useMemo(() => {
    return tiposConsumo.find(tipo => tipo.id === activeTab)?.data || [];
  }, [tiposConsumo, activeTab]);

  // Definición de columnas para la tabla de consumos
  const consumosColumns = [
    { key: 'USO_EN_PRENDA' as keyof ConsumoData, header: 'Uso en Prenda', sortable: true, filterable: true },
    { key: 'COD_TELA' as keyof ConsumoData, header: 'Código Tela', sortable: true, filterable: true },
    { key: 'NOMBRE_TELA' as keyof ConsumoData, header: 'Nombre Tela', sortable: true, filterable: true },
    {
      key: 'CONSUMO' as keyof ConsumoData,
      header: 'Consumo',
      sortable: true,
      align: 'center' as const,
      render: (item: ConsumoData) => item.CONSUMO ? item.CONSUMO.toFixed(2) : '-'
    },
    { key: 'GRUPO_TALLAS' as keyof ConsumoData, header: 'Grupo Tallas', sortable: true, filterable: true },
    { key: 'LINEA' as keyof ConsumoData, header: 'Línea', sortable: true, filterable: true },
  ];

  const handleSearch = async () => {
    if (!searchCode.trim()) {
      setError('Por favor, ingresa un código de referencia');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Normalizar el código ingresado: convertir a mayúsculas y eliminar espacios
      const normalizedCode = searchCode.trim().toUpperCase();
      console.log(`[Consumos] Buscando consumos para: ${normalizedCode} (original: ${searchCode})`);
      
      const response = await fetch(`/api/consumos?reference=${encodeURIComponent(normalizedCode)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result: ConsumosResponse = await response.json();

      if (!result.success) {
        setError(result.error || 'Error al obtener los datos de consumos');
        setConsumosData([]);
        setCollectionName('');
        setReferenceName('');
        setEstado('');
        return;
      }

      if (result.data && result.data.length > 0) {
        setConsumosData(result.data);
        setCollectionName(result.data[0].COLECCION);
        setReferenceName(result.data[0].NOMBRE_REF);
        setEstado(result.data[0].ESTADO);
      } else {
        setConsumosData([]);
        setCollectionName('');
        setReferenceName('');
        setEstado('');
        setError(`No se encontraron consumos para la referencia: ${searchCode.trim().toUpperCase()}`);
      }

    } catch (error) {
      console.error('[Consumos] Error en la búsqueda:', error);
      setError(`Error al buscar consumos para ${searchCode.trim().toUpperCase()}: ${(error as Error).message}`);
      setConsumosData([]);
      setCollectionName('');
      setReferenceName('');
      setEstado('');
      setActiveTab(''); // Reset active tab when there's no data
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permitir que el usuario escriba en minúsculas/mayúsculas pero normalizar al buscar
    setSearchCode(e.target.value);
    if (error) setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Consumos</h1>
        <p className="page-subtitle">Consulta de consumos por referencia</p>
      </div>
      
      <div className="content-section">
        <div className="section-body">
          {/* Buscador */}
          <div className="bg-white rounded-xl shadow-soft border border-secondary-200 p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-md">
                <label htmlFor="reference-search" className="block text-sm font-medium text-secondary-700 mb-2">
                  Código de Referencia
                </label>
                <Input
                  id="reference-search"
                  placeholder="Ej: PT03708, PT03212..."
                  value={searchCode}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  disabled={isLoading || !searchCode.trim()}
                  className="btn-primary flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {isLoading ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>              
            </div>

            {error && (
              <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg">
                <p className="text-sm text-error-700">{error}</p>
              </div>
            )}
          </div>

          {/* Resultados */}
          {tiposConsumo.length > 0 ? (
            <div className="bg-white rounded-xl shadow-soft border border-secondary-200">
              <div className="p-6 border-b border-secondary-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="heading-4 mb-2">
                      Consumos para: {searchCode.trim().toUpperCase()}
                    </h3>
                    <p className="text-secondary-600">
                      Se encontraron {consumosData.length} registro{consumosData.length !== 1 ? 's' : ''} de consumos en {tiposConsumo.length} tipo{tiposConsumo.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {estado && (
                        <div className={`px-3 py-1 text-base font-semibold rounded-full whitespace-nowrap ${getStatusChipProps(estado).className}`}>
                            {getStatusChipProps(estado).label}
                        </div>
                    )}
                    <div className="text-right">
                        <p className="text-lg font-semibold text-secondary-800">{collectionName}</p>
                        <p className="text-md text-secondary-600">{referenceName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pestañas por Tipo */}
              {tiposConsumo.length > 1 && (
                <div className="border-b border-secondary-200">
                  <nav className="flex space-x-1 px-6 overflow-x-auto">
                    {tiposConsumo.map((tipo) => (
                      <button
                        key={tipo.id}
                        onClick={() => setActiveTab(tipo.id)}
                        className={`
                          px-4 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-200 ease-in-out whitespace-nowrap
                          ${activeTab === tipo.id
                            ? 'bg-primary-50 text-primary-700 border-primary-600'
                            : 'text-secondary-600 hover:text-primary-600 border-transparent hover:bg-secondary-50'
                          }
                        `}
                      >
                        {tipo.nombre} ({tipo.count})
                      </button>
                    ))}
                  </nav>
                </div>
              )}
              
              <DataTable<ConsumoData>
                data={currentTypeData}
                columns={consumosColumns}
                emptyMessage="No hay datos de consumos disponibles"
                searchable={true}
                pagination={true}
                pageSize={10}
                exportable={false}
              />
            </div>
          ) : !isLoading && !error && (
            <div className="bg-white rounded-xl shadow-soft border border-secondary-200 p-12 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Package2 className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="heading-4 mb-3">Buscar Consumos</h3>
              <p className="body-medium mb-6 text-secondary-600">
                Ingresa un código de referencia para consultar los consumos de telas asociados.
              </p>
              
              <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-6 max-w-2xl mx-auto">
                <h4 className="heading-5 mb-4">Información sobre la consulta:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="body-medium">Consulta consumos por código PT</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="body-medium">Información de telas y cantidades</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="body-medium">Detalles de uso en prenda</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="body-medium">Grupos de tallas y líneas</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
