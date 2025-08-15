'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ModeloDetalleResponse, TelaData, InsumoData } from '@/app/modules/types';

interface TelasPageProps {
  params: {
    referencePt: string; // The PT code from the URL
  };
}

// Utility function to format width intelligently
const formatWidth = (width: number | null): string => {
  if (width === null) {
    return 'N/A';
  }

  let valueToFormat: number = width;

  if (Number.isInteger(width) && width >= 100) {
    valueToFormat = width / 100;
  }

  const formatted = valueToFormat.toFixed(2);
  return formatted.replace('.', ',');
};

export default function TelasPage({ params }: TelasPageProps) {
  const { referencePt } = params;
  const searchParams = useSearchParams();
  const collectionId = searchParams.get('collectionId');
  const collectionName = searchParams.get('collectionName'); // RECIBIMOS EL NOMBRE DE LA COLECCIÓN

  const [modeloDetalle, setModeloDetalle] = useState<ModeloDetalleResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'telas' | 'insumos'>('telas');

  useEffect(() => {
    async function fetchModeloDetalle() {
      if (!referencePt || !collectionId) {
        setError("Faltan parámetros de referencia o colección.");
        setLoading(false);
        return;
      }

      const DJANGO_API_BASE_URL = 'http://localhost:8000';
      const apiUrl = `${DJANGO_API_BASE_URL}/api/modelo-detalle/${referencePt}/?collectionId=${collectionId}`;

      console.log(`[Next.js Client - Modelo Detalle] Solicitando API combinada: ${apiUrl}`);

      try {
        const res = await fetch(apiUrl, { cache: 'no-store' });
        console.log(`[Next.js Client - Modelo Detalle] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);

        if (!res.ok) {
          let errorBody = 'No body';
          try { errorBody = await res.text(); } catch (e) {}
          throw new Error(`Error al obtener el detalle del modelo: STATUS ${res.status}. Cuerpo: ${errorBody}`);
        }

        const data: ModeloDetalleResponse = await res.json();
        console.log(`[Next.js Client - Modelo Detalle] Datos combinados recibidos:`, data);
        setModeloDetalle(data);
      } catch (err) {
        console.error("[Next.js Client - Modelo Detalle] Error de red o al parsear JSON:", err);
        setError(`Error al cargar el detalle del modelo: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchModeloDetalle();
  }, [referencePt, collectionId]);

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-700">
        <p className="text-xl">Cargando detalle para la referencia: {referencePt}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-700">
        <h1 className="text-3xl font-bold mb-4">Error al cargar los datos.</h1>
        <p>{error}</p>
        <p className="text-sm text-gray-500">Referencia: {referencePt}, Colección: {collectionId}</p>
      </div>
    );
  }

  // Usamos el nombre de la colección si está disponible, de lo contrario, el ID
  const displayCollectionInfo = collectionName
    ? `(Colección: ${decodeURIComponent(collectionName).toUpperCase()})` // Decodificamos y ponemos en mayúsculas
    : `(Colección ID: ${collectionId})`;

  const displayTitle = `DETALLE PARA REFERENCIA: ${referencePt}`;


  const telas = modeloDetalle?.telas || [];
  const insumos = modeloDetalle?.insumos || [];

  return (
    <>
      <header className="text-center mb-10 relative">
        <h2 className="text-xl sm:text-2xl font-semibold uppercase tracking-wider" style={{ color: 'var(--text-color)' }}>
          {displayTitle}
        </h2>
        {/* <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-teal-500 via-green-500 to-teal-500 mx-auto mt-2 rounded-full" /> */}
        {/* Mostramos el nombre de la colección aquí */}
        {collectionId && (
          <p className="text-md sm:text-lg mt-2" style={{ color: 'var(--text-color)' }}>
            {displayCollectionInfo}
          </p>
        )}
      </header>

      {/* Tab navigation */}
      <div className="flex justify-start">
        <button
          className={`sm:px-8 sm:py-3 text-sm sm:text-lg font-semibold rounded-t-lg transition-colors duration-200
                      ${activeTab === 'telas'
                        ? 'text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-300'
                      }`}
          style={{
            backgroundColor: activeTab === 'telas' ? 'var(--primary-color)' : 'var(--background-color)',
            color: activeTab === 'telas' ? 'var(--secondary-color)' : 'var(--text-color)',
            borderRadius: '15px 15px 0 0',
            transition: 'var(--transition)'
          }}
          onClick={() => setActiveTab('telas')}
        >
          TELAS
        </button>
        <button
          className={`sm:px-6 sm:py-3 text-sm sm:text-lg font-semibold rounded-t-lg transition-colors duration-200
                      ${activeTab === 'insumos'
                        ? 'text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-300'
                      }`}
          style={{
            backgroundColor: activeTab === 'insumos' ? 'var(--primary-color)' : 'var(--background-color)',
            color: activeTab === 'insumos' ? 'var(--secondary-color)' : 'var(--text-color)',
            borderRadius: '15px 15px 0 0',
            transition: 'var(--transition)'
          }}
          onClick={() => setActiveTab('insumos')}
        >
          INSUMOS
        </button>
      </div>

      {/* Conditional rendering based on activeTab */}
      {activeTab === 'telas' && (
        <div className="overflow-x-auto mb-8">
          {telas.length > 0 ? (
            <table className="min-w-full bg-white shadow-md overflow-hidden">
              <thead className="text-gray-200 uppercase text-xs sm:text-sm leading-normal"
              style={{backgroundColor:'var(--primary-color)'}}>
                <tr>
                  <th className="py-2 px-4 sm:py-3 sm:px-6 text-left">Uso en Prenda</th>
                  <th className="py-2 px-4 sm:py-3 sm:px-6 text-left">Código Tela</th>
                  <th className="py-2 px-4 sm:py-3 sm:px-6 text-left">Descripción Tela</th>
                  <th className="py-2 px-4 sm:py-3 sm:px-6 text-left">Ancho</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-xs sm:text-sm font-light">
                {telas.map((tela, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-2 px-4 sm:py-3 sm:px-6 text-left whitespace-nowrap">{tela.U_GSP_SchLinName}</td>
                    <td className="py-2 px-4 sm:py-3 sm:px-6 text-left">{tela.U_GSP_ItemCode}</td>
                    <td className="py-2 px-4 sm:py-3 sm:px-6 text-left">{tela.U_GSP_ItemName}</td>
                    <td className="py-2 px-4 sm:py-3 sm:px-6 text-left">{formatWidth(tela.BWidth1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600 text-sm sm:text-lg">No hay datos de telas disponibles para esta referencia y colección.</p>
          )}
        </div>
      )}

      {activeTab === 'insumos' && (
        <div className="overflow-x-auto mb-8">
          {insumos.length > 0 ? (
            <table className="min-w-full bg-white shadow-md overflow-hidden">
              <thead className="text-gray-200 uppercase text-xs sm:text-sm leading-normal"
              style={{backgroundColor:'var(--primary-color)'}}>
                <tr>
                  <th className="py-2 px-4 sm:py-3 sm:px-6 text-left">Uso en Prenda</th>
                  <th className="py-2 px-4 sm:py-3 sm:px-6 text-left">Código Insumo</th>
                  <th className="py-2 px-4 sm:py-3 sm:px-6 text-left">Descripción Insumo</th>
                  <th className="py-2 px-4 sm:py-3 sm:px-6 text-left">Cantidad</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-xs sm:text-sm font-light">
                {insumos.map((insumo, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-2 px-4 sm:py-3 sm:px-6 text-left whitespace-nowrap">{insumo.U_GSP_SchLinName}</td>
                    <td className="py-2 px-4 sm:py-3 sm:px-6 text-left">{insumo.U_GSP_ItemCode}</td>
                    <td className="py-2 px-4 sm:py-3 sm:px-6 text-left">{insumo.U_GSP_ItemName}</td>
                    <td className="py-2 px-4 sm:py-3 sm:px-6 text-left">{formatWidth(insumo.BWidth1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600 text-sm sm:text-lg">No hay datos de insumos disponibles para esta referencia y colección.</p>
          )}
        </div>
      )}
    </>
  );
}
