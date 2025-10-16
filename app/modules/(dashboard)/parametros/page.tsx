'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Settings, Plus, Eye, Edit, Trash2, Layers, Tag } from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';

interface Parametro {
  CODIGO: string;
  BASE_TEXTIL: string;
  TELA: string;
  ANCHO: number;
  PRINT: string;
  HILO_DE_TELA: string;
  HILO_DE_MOLDE: string;
  CANAL_TELA: string;
  SENTIDO_SESGOS: string;
  ROTACION_MOLDE: string;
  RESTRICCIONES_TELA: string;
  CREATED_AT: string;
}

export default function ParametrosPage() {
  const [parametros, setParametros] = useState<Parametro[]>([]);
  const [filteredParametros, setFilteredParametros] = useState<Parametro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBaseTextil, setSelectedBaseTextil] = useState('');
  const [selectedPrint, setSelectedPrint] = useState('');
  const [baseTextilOptions, setBaseTextilOptions] = useState<string[]>([]);
  const [printOptions, setPrintOptions] = useState<string[]>([]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredParametros.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredParametros.slice(startIndex, endIndex);

  // Estadísticas optimizadas con useMemo
  const stats = useMemo(() => ({
    totalParametros: filteredParametros.length,
    basesTextiles: new Set(filteredParametros.map(p => p.BASE_TEXTIL)).size,
    tiposPrint: new Set(filteredParametros.map(p => p.PRINT)).size,
    sinRestricciones: filteredParametros.filter(p => p.RESTRICCIONES_TELA === 'NINGUNA').length,
  }), [filteredParametros]);

  useEffect(() => {
    fetchParametros();
    fetchFilters();
  }, []);

  useEffect(() => {
    filterParametros();
    resetPagination();
  }, [parametros, searchTerm, selectedBaseTextil, selectedPrint]);

  const fetchParametros = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/sap/parametros-view/');
      setParametros(response.data as Parametro[]);
    } catch (error: any) {
      console.error('Error fetching parámetros:', error);
      setError('Error al cargar los parámetros. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [baseTextilRes, printRes] = await Promise.all([
        axiosInstance.get('/sap/base_textil/'),
        axiosInstance.get('/sap/print/')
      ]);

      setBaseTextilOptions((baseTextilRes.data as { NOMBRE: string }[]).map((item) => item.NOMBRE));
      setPrintOptions((printRes.data as { NOMBRE: string }[]).map((item) => item.NOMBRE));
    } catch (error: any) {
      console.error('Error fetching filters:', error);
      // Los filtros no son críticos, así que no mostramos error
    }
  };

  const filterParametros = () => {
    let filtered = parametros;

    if (searchTerm) {
      filtered = filtered.filter(param =>
        param.TELA.toLowerCase().includes(searchTerm.toLowerCase()) ||
        param.CODIGO.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBaseTextil) {
      filtered = filtered.filter(param => param.BASE_TEXTIL === selectedBaseTextil);
    }

    if (selectedPrint) {
      filtered = filtered.filter(param => param.PRINT === selectedPrint);
    }

    setFilteredParametros(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBaseTextil('');
    setSelectedPrint('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Parámetros de Telas</h1>
            <p className="page-subtitle">Consulta y gestión de parámetros de producción de telas</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Parámetro
          </button>
        </div>
      </div>

      <div className="content-section">
        {/* Filtros y búsqueda */}
        <div className="section-header">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Búsqueda */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por tela o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              {/* Filtro Base Textil */}
              <select
                value={selectedBaseTextil}
                onChange={(e) => setSelectedBaseTextil(e.target.value)}
                className="input-field max-w-xs"
              >
                <option value="">Todas las bases textiles</option>
                {baseTextilOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              {/* Filtro Print */}
              <select
                value={selectedPrint}
                onChange={(e) => setSelectedPrint(e.target.value)}
                className="input-field max-w-xs"
              >
                <option value="">Todos los prints</option>
                {printOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              {/* Limpiar filtros */}
              <button
                onClick={clearFilters}
                className="btn-secondary flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de parámetros */}
        <div className="section-body">
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 text-error-600">⚠️</div>
                <p className="text-error-700 font-medium">{error}</p>
              </div>
              <button
                onClick={fetchParametros}
                className="mt-2 btn-secondary text-sm"
              >
                Reintentar
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4"></div>
              <span className="text-secondary-600 font-medium">Cargando parámetros...</span>
              <span className="text-secondary-500 text-sm mt-1">Esto puede tomar unos segundos</span>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg border border-secondary-200 shadow-sm">
              <table className="data-table">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="font-semibold text-secondary-800">Código</th>
                    <th className="font-semibold text-secondary-800">Base Textil</th>
                    <th className="font-semibold text-secondary-800">Tela</th>
                    <th className="font-semibold text-secondary-800">Ancho (m)</th>
                    <th className="font-semibold text-secondary-800">Print</th>
                    <th className="font-semibold text-secondary-800">Hilo de Tela</th>
                    <th className="font-semibold text-secondary-800">Hilo de Molde</th>
                    <th className="font-semibold text-secondary-800">Canal</th>
                    <th className="font-semibold text-secondary-800">Sentido Sesgos</th>
                    <th className="font-semibold text-secondary-800">Rotación Molde</th>
                    <th className="font-semibold text-secondary-800">Restricciones</th>
                    <th className="font-semibold text-secondary-800">Fecha Creación</th>
                    <th className="font-semibold text-secondary-800">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((param, index) => (
                    <tr key={startIndex + index} className="hover:bg-secondary-25 transition-colors duration-150">
                      <td className="font-semibold text-primary-700">{param.CODIGO}</td>
                      <td>
                        <span className="badge badge-primary">{param.BASE_TEXTIL}</span>
                      </td>
                      <td className="font-medium text-secondary-900">{param.TELA}</td>
                      <td className="text-secondary-700">{param.ANCHO}</td>
                      <td>
                        <span className="badge badge-secondary">{param.PRINT}</span>
                      </td>
                      <td className="text-secondary-700">{param.HILO_DE_TELA}</td>
                      <td className="text-secondary-700">{param.HILO_DE_MOLDE}</td>
                      <td className="text-secondary-700">{param.CANAL_TELA}</td>
                      <td className="text-secondary-700">{param.SENTIDO_SESGOS}</td>
                      <td className="text-secondary-700">{param.ROTACION_MOLDE}</td>
                      <td>
                        <span className={`badge ${param.RESTRICCIONES_TELA === 'NINGUNA' ? 'badge-success' : 'badge-warning'}`}>
                          {param.RESTRICCIONES_TELA}
                        </span>
                      </td>
                      <td className="text-sm text-secondary-600">
                        {new Date(param.CREATED_AT).toLocaleDateString('es-ES')}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button className="btn-icon btn-icon-primary" title="Ver detalles">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="btn-icon btn-icon-secondary" title="Editar">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="btn-icon btn-icon-danger" title="Eliminar">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredParametros.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                  <h3 className="heading-4 text-secondary-600 mb-2">No se encontraron parámetros</h3>
                  <p className="body-medium text-secondary-500">
                    {parametros.length === 0
                      ? 'No hay parámetros registrados en el sistema.'
                      : 'Intenta ajustar los filtros de búsqueda.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-secondary-600">
                Mostrando {startIndex + 1}-{Math.min(endIndex, filteredParametros.length)} de {filteredParametros.length} parámetros
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Estadísticas */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl border border-primary-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-primary-700 mb-1">{stats.totalParametros}</div>
                  <div className="text-sm font-medium text-primary-600">Parámetros encontrados</div>
                </div>
                <div className="w-12 h-12 bg-primary-200 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-6 rounded-xl border border-secondary-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-secondary-700 mb-1">{stats.basesTextiles}</div>
                  <div className="text-sm font-medium text-secondary-600">Bases textiles</div>
                </div>
                <div className="w-12 h-12 bg-secondary-200 rounded-lg flex items-center justify-center">
                  <Layers className="w-6 h-6 text-secondary-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-xl border border-accent-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-accent-700 mb-1">{stats.tiposPrint}</div>
                  <div className="text-sm font-medium text-accent-600">Tipos de print</div>
                </div>
                <div className="w-12 h-12 bg-accent-200 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-accent-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-success-50 to-success-100 p-6 rounded-xl border border-success-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-success-700 mb-1">{stats.sinRestricciones}</div>
                  <div className="text-sm font-medium text-success-600">Sin restricciones</div>
                </div>
                <div className="w-12 h-12 bg-success-200 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-success-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}