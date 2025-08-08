// components/organisms/FaseMdCreacionFicha.tsx
'use client'; // Es un Client Component porque usará useState para las pestañas

import React, { useState } from 'react';
import DataTable from '../molecules/DataTable'; 
import { TelaData, InsumoData, MdCreacionFichaData } from '../../../../app/modules/types/index'; 

interface FaseMdCreacionFichaProps {
  data: MdCreacionFichaData; // Recibe todos los datos de la fase
  referenciaId: string; // Para mostrar en el mensaje
  collectionId: string; // Para mostrar en el mensaje
}

const FaseMdCreacionFicha: React.FC<FaseMdCreacionFichaProps> = ({ data, referenciaId, collectionId }) => {
  const [activeTab, setActiveTab] = useState<'telas' | 'insumos'>('telas'); // Estado para la pestaña activa

  // Definición de columnas para la tabla de Telas
  const telasColumns = [
    { key: 'U_GSP_SchLinName', header: 'Uso en Prenda' },
    { key: 'U_GSP_ItemCode', header: 'Código Tela' },
    { key: 'U_GSP_ItemName', header: 'Descripción Tela' },
    { key: 'BWidth1', header: 'Ancho' },
    // Añade más columnas si las necesitas y están en TelaData
  ];

  // Definición de columnas para la tabla de Insumos
  const insumosColumns = [
    { key: 'U_GSP_SchLinName', header: 'Uso en Prenda' }, // Ajusta 'UsoEnPrenda' al nombre real de la columna de tu DB
    { key: 'U_GSP_ItemCode', header: 'Código Insumo' },
    { key: 'U_GSP_ItemName', header: 'Descripción Insumo' },
    { key: 'BWidth1', header: 'Cantidad' }, // Ajusta 'Cantidad' al nombre real de la columna de tu DB
    // Añade más columnas si las necesitas y están en InsumoData
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* <h2 className="text-2xl font-semibold mb-4 text-gray-700">Contenido de la Fase: MD CREACIÓN FICHA</h2> */}
      <p className="text-gray-600 mb-4">
        {/* Datos de la referencia **{referenciaId}** para la colección **{collectionId}**. */}
      </p>

      {/* Navegación de pestañas internas */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors duration-200 ease-in-out
            ${activeTab === 'telas' ? 'bg-slate-800 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}
          `}
          onClick={() => setActiveTab('telas')}
        >
          TELAS
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors duration-200 ease-in-out
            ${activeTab === 'insumos' ? 'bg-slate-800 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}
          `}
          onClick={() => setActiveTab('insumos')}
        >
          INSUMOS
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div>
        {activeTab === 'telas' && (
          <DataTable<TelaData>
            data={data.telas}
            columns={telasColumns}
            emptyMessage="No hay telas disponibles para esta referencia."
          />
        )}
        {activeTab === 'insumos' && (
          <DataTable<InsumoData>
            data={data.insumos}
            columns={insumosColumns}
            emptyMessage="No hay insumos disponibles para esta referencia."
          />
        )}
      </div>
    </div>
  );
};

export default FaseMdCreacionFicha;
