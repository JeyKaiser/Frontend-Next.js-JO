'use client';

import React, { useState, useMemo } from 'react';
import DataTable from '@/app/globals/components/molecules/DataTable';
import type { ConsumoData, TipoConsumo } from '@/app/modules/types';

// Helper function to determine status chip styles (copied from consumos/page.tsx)
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
      return { className: 'bg-gray-200 text-gray-800', label: status };
  }
};

interface ReferenciaCardProps {
  consumosData: ConsumoData[];
  referenceCode: string;
}

export default function ReferenciaCard({ consumosData, referenceCode }: ReferenciaCardProps) {
  const [activeTab, setActiveTab] = useState<string>('');

  const collectionName = consumosData.length > 0 ? consumosData[0].COLECCION : '';
  const referenceName = consumosData.length > 0 ? consumosData[0].NOMBRE_REF : '';
  const estado = consumosData.length > 0 ? consumosData[0].ESTADO : '';

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

  useMemo(() => {
    if (tiposConsumo.length > 0 && !activeTab) {
      setActiveTab(tiposConsumo[0].id);
    }
  }, [tiposConsumo, activeTab]);

  const currentTypeData = useMemo(() => {
    return tiposConsumo.find(tipo => tipo.id === activeTab)?.data || [];
  }, [tiposConsumo, activeTab]);

  const consumosColumns = [
    { key: 'USO_EN_PRENDA' as keyof ConsumoData, header: 'Uso en Prenda' },
    { key: 'COD_TELA' as keyof ConsumoData, header: 'Código Tela' },
    { key: 'NOMBRE_TELA' as keyof ConsumoData, header: 'Nombre Tela' },
    {
      key: 'CONSUMO' as keyof ConsumoData,
      header: 'Consumo',
      align: 'center' as const,
      render: (item: ConsumoData) => item.CONSUMO ? item.CONSUMO.toFixed(2) : '-'
    },
  ];

  if (consumosData.length === 0) {
    return (
        <div className="p-4 text-center text-sm text-gray-500">No se encontraron datos para esta referencia.</div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft border border-secondary-200 h-full flex flex-col">
      <div className="p-4 border-b border-secondary-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg mb-1">
              {referenceCode.toUpperCase()}
            </h3>
            <p className="text-sm text-secondary-600">{collectionName}</p>
            <p className="text-sm text-secondary-600">{referenceName}</p>
          </div>
          {estado && (
            <div className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusChipProps(estado).className}`}>
                {getStatusChipProps(estado).label}
            </div>
          )}
        </div>
      </div>

      {tiposConsumo.length > 1 && (
        <div className="border-b border-secondary-200">
          <nav className="flex space-x-1 px-4 overflow-x-auto">
            {tiposConsumo.map((tipo) => (
              <button
                key={tipo.id}
                onClick={() => setActiveTab(tipo.id)}
                className={`px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-all duration-200 ease-in-out whitespace-nowrap ${
                  activeTab === tipo.id
                    ? 'bg-primary-50 text-primary-700 border-primary-600'
                    : 'text-secondary-600 hover:text-primary-600 border-transparent hover:bg-secondary-50'
                }`}
              >
                {tipo.nombre} ({tipo.count})
              </button>
            ))}
          </nav>
        </div>
      )}
      
      <div className="flex-grow overflow-y-auto">
        <DataTable<ConsumoData>
            data={currentTypeData}
            columns={consumosColumns}
            emptyMessage="No hay datos de consumos para este tipo."
            searchable={false}
            pagination={false}
        />
      </div>
    </div>
  );
}
