'use client';

import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, Download } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  searchable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  className?: string;
}

type SortConfig<T> = {
  key: keyof T;
  direction: 'asc' | 'desc';
} | null;

function DataTable<T extends Record<string, any>>({
  data = [],
  columns,
  emptyMessage = "No hay datos disponibles.",
  loading = false,
  pagination = true,
  pageSize = 10,
  searchable = true,
  exportable = false,
  selectable = false,
  onRowSelect,
  className = '',
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Filter and search data
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter((item) =>
      columns.some((column) => {
        if (!column.filterable) return false;
        const value = item[column.key];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = pagination ? Math.ceil(sortedData.length / pageSize) : 1;

  const handleSort = (key: keyof T) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleRowSelect = (index: number) => {
    if (!selectable) return;
    
    const newSelection = new Set(selectedRows);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    
    setSelectedRows(newSelection);
    
    if (onRowSelect) {
      const selectedData = Array.from(newSelection).map(i => sortedData[i]);
      onRowSelect(selectedData);
    }
  };

  const handleSelectAll = () => {
    if (!selectable) return;
    
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    } else {
      const allIndices = new Set(paginatedData.map((_, index) => index));
      setSelectedRows(allIndices);
      onRowSelect?.(paginatedData);
    }
  };

  const getSortIcon = (key: keyof T) => {
    if (sortConfig?.key !== key) {
      return <ChevronUp className="w-4 h-4 text-secondary-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-primary-600" />
      : <ChevronDown className="w-4 h-4 text-primary-600" />;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-soft border border-secondary-200 ${className}`}>
        <div className="p-6">
          {/* Header skeleton */}
          <div className="animate-pulse mb-4">
            <div className="h-4 bg-secondary-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-secondary-200 rounded"></div>
          </div>
          
          {/* Table skeleton */}
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="h-4 bg-secondary-200 rounded flex-1"></div>
                <div className="h-4 bg-secondary-200 rounded flex-1"></div>
                <div className="h-4 bg-secondary-200 rounded flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-soft border border-secondary-200 ${className}`}>
      {/* Table Header */}
      {(searchable || exportable) && (
        <div className="p-4 border-b border-secondary-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            {searchable && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar en la tabla..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            )}
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              {exportable && (
                <button className="btn-ghost flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
              )}
              
              {selectable && selectedRows.size > 0 && (
                <span className="text-sm text-secondary-600">
                  {selectedRows.size} seleccionado{selectedRows.size !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {filteredData.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              {searchTerm ? 'No se encontraron resultados' : 'Sin datos'}
            </h3>
            <p className="text-secondary-600">
              {searchTerm 
                ? `No hay resultados para "${searchTerm}"`
                : emptyMessage
              }
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                {selectable && (
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                      onChange={handleSelectAll}
                      className="form-checkbox"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-6 py-3 text-xs font-medium text-secondary-500 uppercase tracking-wider ${
                      column.align === 'center' ? 'text-center' :
                      column.align === 'right' ? 'text-right' : 'text-left'
                    } ${column.sortable ? 'cursor-pointer hover:bg-secondary-100 select-none' : ''}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.header}</span>
                      {column.sortable && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {paginatedData.map((item, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className={`hover:bg-secondary-50 transition-colors duration-200 ${
                    selectedRows.has(rowIndex) ? 'bg-primary-50' : ''
                  }`}
                >
                  {selectable && (
                    <td className="w-12 px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => handleRowSelect(rowIndex)}
                        className="form-checkbox"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td 
                      key={String(column.key)} 
                      className={`px-6 py-4 text-sm text-secondary-900 ${
                        column.align === 'center' ? 'text-center' :
                        column.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {column.render 
                        ? column.render(item, rowIndex) 
                        : String(item[column.key] ?? '-')
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && filteredData.length > 0 && (
        <div className="px-6 py-4 border-t border-secondary-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-secondary-600">
              Mostrando {((currentPage - 1) * pageSize) + 1} a{' '}
              {Math.min(currentPage * pageSize, sortedData.length)} de{' '}
              {sortedData.length} resultados
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded text-sm ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'text-secondary-600 hover:bg-secondary-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;