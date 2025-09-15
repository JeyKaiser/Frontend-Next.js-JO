"use client";

import React, { useState, useEffect } from 'react';
import ParametroModal from '../../../globals/components/organisms/ParametroModal';

// Se usa un tipo genérico ya que la estructura de los parámetros puede variar.
type Parametro = {
  [key: string]: string | number | boolean | null | undefined;
};

const CategoriasPage = () => {
  const [parametros, setParametros] = useState<Parametro[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showParametrosModal, setShowParametrosModal] = useState(false);

  const fetchParametros = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/parametros/');
      if (!response.ok) {
        throw new Error(`Error de red: ${response.statusText}`);
      }
      const data: Parametro[] = await response.json();
      console.log("DATOS RECIBIDOS EN EL COMPONENTE (desde la ruta API):", data);
      setParametros(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParametros();
  }, []); // El array vacío asegura que el fetch se ejecute solo una vez.

  const handleParametroSuccess = () => {
    // Recargar los datos después de crear un nuevo parámetro
    fetchParametros();
  };

  if (loading) {
    return <div className="p-6 text-center">Cargando datos...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error al cargar los datos: {error}</div>;
  }

  if (!parametros || parametros.length === 0) {
    return <div className="p-6 text-center">No se encontraron parámetros para mostrar.</div>;
  }

  // Obtener las cabeceras dinámicamente del primer objeto.
  const headers = Object.keys(parametros[0]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Parámetros del Sistema
        </h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
          onClick={() => setShowParametrosModal(true)}
        >
          <span className="text-lg">+</span>
          Crear Parámetro
        </button>
      </div>
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left text-foreground">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col" className="px-6 py-3 font-medium">
                  {header.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parametros.map((parametro, index) => (
              <tr key={index} className="bg-background border-b last:border-b-0 border-border hover:bg-muted/50">
                {headers.map((header) => (
                  <td key={header} className="px-6 py-4">
                    {String(parametro[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ParametroModal
        isOpen={showParametrosModal}
        onClose={() => setShowParametrosModal(false)}
        onSuccess={handleParametroSuccess}
      />
    </div>
  );
};

export default CategoriasPage;
