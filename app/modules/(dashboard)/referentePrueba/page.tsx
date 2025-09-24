'use client';

import React, { useState } from 'react';
import { Search, Loader2, Package2 } from 'lucide-react';
import Input from '@/app/globals/components/atoms/Input';
import Button from '@/app/globals/components/atoms/Button';
import ReferenciaCard from './ReferenciaCard';
import type { ConsumoData, ConsumosResponse } from '@/app/modules/types';

interface ColumnState {
  searchCode: string;
  isLoading: boolean;
  error: string | null;
  data: ConsumoData[] | null;
}

const initialColumnState: ColumnState = {
  searchCode: '',
  isLoading: false,
  error: null,
  data: null,
};

export default function Referentes2Page() {
  const [columns, setColumns] = useState<ColumnState[]>([initialColumnState, initialColumnState, initialColumnState]);

  const handleSearch = async (columnIndex: number) => {
    const searchCode = columns[columnIndex].searchCode;

    if (!searchCode.trim()) {
      updateColumnState(columnIndex, { error: 'Por favor, ingresa un código.' });
      return;
    }

    updateColumnState(columnIndex, { isLoading: true, error: null });

    try {
      const normalizedCode = searchCode.trim().toUpperCase();
      const response = await fetch(`/api/consumos?reference=${encodeURIComponent(normalizedCode)}`);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result: ConsumosResponse = await response.json();

      if (!result.success || !result.data || result.data.length === 0) {
        updateColumnState(columnIndex, { 
          error: result.error || `No se encontraron datos para ${normalizedCode}`,
          data: null,
          isLoading: false 
        });
        return;
      }

      updateColumnState(columnIndex, { data: result.data, isLoading: false });

    } catch (error) {
      updateColumnState(columnIndex, { 
        error: `Error al buscar: ${(error as Error).message}`,
        data: null,
        isLoading: false 
      });
    }
  };

  const updateColumnState = (index: number, newState: Partial<ColumnState>) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      newColumns[index] = { ...newColumns[index], ...newState };
      return newColumns;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newSearchCode = e.target.value;
    updateColumnState(index, { searchCode: newSearchCode, error: null });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(index);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Comparador de Referencias</h1>
        <p className="page-subtitle">Compara los consumos de hasta 3 referencias lado a lado.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[0, 1, 2].map(index => (
          <div key={index} className="bg-gray-50 rounded-xl border border-secondary-200 p-4 flex flex-col gap-4">
            {/* Search Input */}
            <div className="flex items-center gap-2">
              <Input
                placeholder={`Código de Referencia ${index + 1}...`}
                value={columns[index].searchCode}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={columns[index].isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => handleSearch(index)}
                disabled={columns[index].isLoading || !columns[index].searchCode.trim()}
                className="btn-primary p-2"
              >
                {columns[index].isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </Button>
            </div>

            {/* Results Area */}
            <div className="flex-grow min-h-[400px] flex flex-col justify-center">
              {columns[index].isLoading ? (
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" />
                  <p className="mt-2 text-sm text-secondary-600">Buscando...</p>
                </div>
              ) : columns[index].error ? (
                <div className="p-4 bg-error-50 border border-error-200 rounded-lg text-center">
                  <p className="text-sm text-error-700">{columns[index].error}</p>
                </div>
              ) : columns[index].data ? (
                <ReferenciaCard consumosData={columns[index].data!} referenceCode={columns[index].searchCode} />
              ) : (
                <div className="text-center text-secondary-500">
                    <Package2 className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-medium">Ingrese un código de referencia</p>
                    <p className="text-xs">para ver sus consumos.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
