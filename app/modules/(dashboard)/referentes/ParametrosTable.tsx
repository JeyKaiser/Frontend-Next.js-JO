import React from 'react';

interface Parametro {
  CODIGO: string;
  DESCRIPCION: string;
  VALOR: string;
  UNIDAD: string;
}

interface ParametrosTableProps {
  data: Parametro[];
}

const ParametrosTable: React.FC<ParametrosTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No hay datos para mostrar.</p>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header) => (
              <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row[header as keyof Parametro]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParametrosTable;
