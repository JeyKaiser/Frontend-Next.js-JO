// components/molecules/DataTable.tsx
'use client'; // Es un Client Component porque usará estado y quizás interactividad

import React from 'react';

interface DataTableProps<T> {
  data: T[]; // Array de objetos con los datos
  columns: { key: keyof T; header: string; render?: (item: T) => React.ReactNode }[]; // Definición de columnas
  emptyMessage?: string; // Mensaje a mostrar si no hay datos
}

function DataTable<T>({ data, columns, emptyMessage = "No hay datos disponibles." }: DataTableProps<T>) {
  if (!data || data.length === 0) {
    return <div className="text-center p-4 text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={String(col.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {col.render ? col.render(item) : String(item[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;