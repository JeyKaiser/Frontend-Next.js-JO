'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ModeloDetalleResponse, TelaData, InsumoData } from '../../../types'; // Importa la nueva interfaz combinada

interface TelasPageProps {
  params: {
    referencePt: string; // El código PT que viene de la URL
  };
}

// Función de utilidad para formatear el ancho de manera inteligente
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

  // Un solo estado para los datos combinados
  const [modeloDetalle, setModeloDetalle] = useState<ModeloDetalleResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchModeloDetalle() {
      if (!referencePt || !collectionId) {
        setError("Faltan parámetros de referencia o colección.");
        setLoading(false);
        return;
      }

      const DJANGO_API_BASE_URL = 'http://localhost:8000';
      // La URL de la API ahora apunta al nuevo endpoint combinado
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
  }, [referencePt, collectionId]); // Dependencias del useEffect

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

  const displayTitle = `DETALLE PARA REFERENCIA: ${referencePt}`;

  // Accede a telas e insumos desde el objeto modeloDetalle
  const telas = modeloDetalle?.telas || [];
  const insumos = modeloDetalle?.insumos || [];

  return (
    <>
      <header className="text-center mb-10 relative">
        <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
          {displayTitle}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-teal-500 via-green-500 to-teal-500 mx-auto mt-2 rounded-full" />
        {collectionId && (
          <p className="text-gray-600 text-lg mt-2">
            (Colección: {collectionId})
          </p>
        )}
      </header>

      {/* Sección de Telas */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Telas</h3>
      <div className="p-4 overflow-x-auto mb-8">
        {telas.length > 0 ? (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Uso en Prenda</th>
                <th className="py-3 px-6 text-left">Código Tela</th>
                <th className="py-3 px-6 text-left">Descripción Tela</th>
                <th className="py-3 px-6 text-left">Ancho</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {telas.map((tela, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{tela.U_GSP_SchLinName}</td>
                  <td className="py-3 px-6 text-left">{tela.U_GSP_ItemCode}</td>
                  <td className="py-3 px-6 text-left">{tela.U_GSP_ItemName}</td>
                  <td className="py-3 px-6 text-left">{formatWidth(tela.BWidth1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600 text-lg">No hay datos de telas disponibles para esta referencia y colección.</p>
        )}
      </div>

      {/* Sección de Insumos */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Insumos</h3>
      <div className="p-4 overflow-x-auto">
        {insumos.length > 0 ? (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Uso en Prenda</th>
                <th className="py-3 px-6 text-left">Código Insumo</th>
                <th className="py-3 px-6 text-left">Descripción Insumo</th>
                <th className="py-3 px-6 text-left">Cantidad</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {insumos.map((insumo, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{insumo.U_GSP_SchLinName}</td>
                  <td className="py-3 px-6 text-left">{insumo.U_GSP_ItemCode}</td>
                  <td className="py-3 px-6 text-left">{insumo.U_GSP_ItemName}</td>
                  <td className="py-3 px-6 text-left">{formatWidth(insumo.BWidth1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600 text-lg">No hay datos de insumos disponibles para esta referencia y colección.</p>
        )}
      </div>
    </>
  );
}





// 'use client';

// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import type { TelaData, InsumoData } from '../../../types'; // Importa InsumoData

// interface TelasPageProps {
//   params: {
//     referencePt: string; // El código PT que viene de la URL
//   };
// }

// // Función de utilidad para formatear el ancho de manera inteligente
// const formatWidth = (width: number | null): string => {
//   if (width === null) {
//     return 'N/A';
//   }

//   let valueToFormat: number = width;

//   if (Number.isInteger(width) && width >= 100) {
//     valueToFormat = width / 100;
//   }

//   const formatted = valueToFormat.toFixed(2);
//   return formatted.replace('.', ',');
// };

// export default function TelasPage({ params }: TelasPageProps) {
//   const { referencePt } = params;
//   const searchParams = useSearchParams();
//   const collectionId = searchParams.get('collectionId');

//   // Estados para Telas
//   const [telas, setTelas] = useState<TelaData[] | null>(null);
//   const [loadingTelas, setLoadingTelas] = useState<boolean>(true);
//   const [errorTelas, setErrorTelas] = useState<string | null>(null);

//   // NUEVOS Estados para Insumos
//   const [insumos, setInsumos] = useState<InsumoData[] | null>(null);
//   const [loadingInsumos, setLoadingInsumos] = useState<boolean>(true);
//   const [errorInsumos, setErrorInsumos] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchData() {
//       if (!referencePt || !collectionId) {
//         setErrorTelas("Faltan parámetros de referencia o colección para telas.");
//         setErrorInsumos("Faltan parámetros de referencia o colección para insumos.");
//         setLoadingTelas(false);
//         setLoadingInsumos(false);
//         return;
//       }

//       const DJANGO_API_BASE_URL = 'http://localhost:8000';

//       // --- FETCH PARA TELAS ---
//       const apiUrlTelas = `${DJANGO_API_BASE_URL}/api/telas/${referencePt}/?collectionId=${collectionId}`;
//       console.log(`[Next.js Client - Telas] Solicitando API de Telas: ${apiUrlTelas}`);
//       try {
//         const resTelas = await fetch(apiUrlTelas, { cache: 'no-store' });
//         console.log(`[Next.js Client - Telas] Estado de respuesta HTTP (Telas): ${resTelas.status} (${resTelas.statusText})`);
//         if (!resTelas.ok) {
//           let errorBody = 'No body';
//           try { errorBody = await resTelas.text(); } catch (e) {}
//           throw new Error(`Error al obtener telas: STATUS ${resTelas.status}. Cuerpo: ${errorBody}`);
//         }
//         const dataTelas: TelaData[] = await resTelas.json();
//         console.log(`[Next.js Client - Telas] Datos de Telas recibidos:`, dataTelas);
//         setTelas(dataTelas);
//       } catch (err) {
//         console.error("[Next.js Client - Telas] Error de red o al parsear JSON (Telas):", err);
//         setErrorTelas(`Error al cargar las telas: ${(err as Error).message}`);
//       } finally {
//         setLoadingTelas(false);
//       }

//       // --- FETCH PARA INSUMOS ---
//       const apiUrlInsumos = `${DJANGO_API_BASE_URL}/api/insumos/${referencePt}/?collectionId=${collectionId}`;
//       console.log(`[Next.js Client - Insumos] Solicitando API de Insumos: ${apiUrlInsumos}`);
//       try {
//         const resInsumos = await fetch(apiUrlInsumos, { cache: 'no-store' });
//         console.log(`[Next.js Client - Insumos] Estado de respuesta HTTP (Insumos): ${resInsumos.status} (${resInsumos.statusText})`);
//         if (!resInsumos.ok) {
//           let errorBody = 'No body';
//           try { errorBody = await resInsumos.text(); } catch (e) {}
//           throw new Error(`Error al obtener insumos: STATUS ${resInsumos.status}. Cuerpo: ${errorBody}`);
//         }
//         const dataInsumos: InsumoData[] = await resInsumos.json();
//         console.log(`[Next.js Client - Insumos] Datos de Insumos recibidos:`, dataInsumos);
//         setInsumos(dataInsumos);
//       } catch (err) {
//         console.error("[Next.js Client - Insumos] Error de red o al parsear JSON (Insumos):", err);
//         setErrorInsumos(`Error al cargar los insumos: ${(err as Error).message}`);
//       } finally {
//         setLoadingInsumos(false);
//       }
//     }

//     fetchData();
//   }, [referencePt, collectionId]); // Dependencias del useEffect

//   // Determinar el estado general de carga y error
//   const loading = loadingTelas || loadingInsumos;
//   const error = errorTelas || errorInsumos; // Si hay error en cualquiera, mostrar error general

//   if (loading) {
//     return (
//       <div className="text-center p-8 text-gray-700">
//         <p className="text-xl">Cargando datos para la referencia: {referencePt}...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center p-8 text-red-700">
//         <h1 className="text-3xl font-bold mb-4">Error al cargar los datos.</h1>
//         <p>{error}</p>
//         <p className="text-sm text-gray-500">Referencia: {referencePt}, Colección: {collectionId}</p>
//       </div>
//     );
//   }

//   const displayTitle = `DETALLE PARA REFERENCIA: ${referencePt}`;

//   return (
//     <>
//       <header className="text-center mb-10 relative">
//         <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
//           {displayTitle}
//         </h2>
//         <div className="w-24 h-1 bg-gradient-to-r from-teal-500 via-green-500 to-teal-500 mx-auto mt-2 rounded-sm" />
//         {collectionId && (
//           <p className="text-gray-600 text-lg mt-2">
//             (Colección: {collectionId})
//           </p>
//         )}
//       </header>

//       {/* Sección de Telas */}
//       <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Telas</h3>
//       <div className="p-2 overflow-x-auto mb-8"> {/* Añadido mb-8 para espacio entre tablas */}
//         {telas && telas.length > 0 ? (
//           <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//             <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
//               <tr>
//                 <th className="py-2 px-4 text-left">Uso en Prenda</th>
//                 <th className="py-2 px-4 text-left">Código Tela</th>
//                 <th className="py-2 px-4 text-left">Descripción Tela</th>
//                 <th className="py-2 px-4 text-left">Ancho</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-600 text-sm font-light">
//               {telas.map((tela, index) => (
//                 <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
//                   <td className="py-2 px-4 text-left whitespace-nowrap">{tela.U_GSP_SchLinName}</td>
//                   <td className="py-2 px-4 text-left">{tela.U_GSP_ItemCode}</td>
//                   <td className="py-2 px-4 text-left">{tela.U_GSP_ItemName}</td>
//                   <td className="py-2 px-4 text-left">{formatWidth(tela.BWidth1)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-center text-gray-600 text-lg">No hay datos de telas disponibles para esta referencia y colección.</p>
//         )}
//       </div>

//       {/* NUEVA Sección de Insumos */}
//       <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Insumos</h3>
//       <div className="p-2 overflow-x-auto">
//         {insumos && insumos.length > 0 ? (
//           <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//             <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
//               <tr>
//                 <th className="py-2 px-4 text-left">Uso en Prenda</th>
//                 <th className="py-2 px-4 text-left">Código Insumo</th>
//                 <th className="py-2 px-4 text-left">Descripción Insumo</th>
//                 <th className="py-2 px-4 text-left">Cantidad</th> {/* Si aplica para insumos */}
//               </tr>
//             </thead>
//             <tbody className="text-gray-600 text-sm font-light">
//               {insumos.map((insumo, index) => (
//                 <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
//                   <td className="py-2 px-4 text-left whitespace-nowrap">{insumo.U_GSP_SchLinName}</td>
//                   <td className="py-2 px-4 text-left">{insumo.U_GSP_ItemCode}</td>
//                   <td className="py-2 px-4 text-left">{insumo.U_GSP_ItemName}</td>
//                   <td className="py-2 px-4 text-left">{formatWidth(insumo.BWidth1)}</td> {/* Usa formatWidth si aplica */}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-center text-gray-600 text-lg">No hay datos de insumos disponibles para esta referencia y colección.</p>
//         )}
//       </div>
//     </>
//   );
// }








// // 'use client';

// // import { useSearchParams } from 'next/navigation';
// // import { useEffect, useState } from 'react';
// // import type { TelaData } from '../../../types';

// // interface TelasPageProps {
// //     params: {
// //         referencePt: string; // El código PT que viene de la URL
// //     };
// // }


// // //formatear el ancho para anchos mal ingresados en SAP
// // const formatWidth = (width: number | null): string => {
// //     if (width === null) {
// //         return 'N/A';
// //     }
// //     let valueToFormat: number = width;
// //     if (Number.isInteger(width) && width >= 100) {
// //         valueToFormat = width / 100;
// //     }
// //     const formatted = valueToFormat.toFixed(2);
// //     return formatted.replace('.', ',');
// // };

// // export default function TelasPage({ params }: TelasPageProps) {
// //     const { referencePt } = params;
// //     const searchParams = useSearchParams();
// //     const collectionId = searchParams.get('collectionId');

// //     const [telas,     setTelas] = useState<TelaData[] | null>(null);
// //     const [loading, setLoading] = useState<boolean>(true);
// //     const [error,     setError] = useState<string | null>(null);

// //     useEffect(() => {
// //         async function getTelas() {
// //             if (!referencePt || !collectionId) {
// //                 setError("Faltan parámetros de referencia o colección.");
// //                 setLoading(false);
// //                 return;
// //             }

// //             const DJANGO_API_BASE_URL = 'http://localhost:8000';
// //             const apiUrl = `${DJANGO_API_BASE_URL}/api/telas/${referencePt}/?collectionId=${collectionId}`;

// //             console.log(`[Next.js Client - Telas] Solicitando API: ${apiUrl}`);

// //             try {
// //                 const res = await fetch(apiUrl, {
// //                     cache: 'no-store',
// //                 });

// //                 console.log(`[Next.js Client - Telas] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);

// //                 if (!res.ok) {
// //                     let errorBody = 'No body';
// //                     try {
// //                         errorBody = await res.text();
// //                     } catch (e) { }
// //                     throw new Error(`Error al obtener telas: STATUS ${res.status}. Cuerpo: ${errorBody}`);
// //                 }

// //                 const data: TelaData[] = await res.json();
// //                 console.log(`[Next.js Client - Telas] Datos recibidos:`, data);
// //                 setTelas(data);
// //             } catch (err) {
// //                 console.error("[Next.js Client - Telas] Error de red o al parsear JSON:", err);
// //                 setError(`Error al cargar las telas: ${(err as Error).message}`);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         }
// //         getTelas();
// //     }, [referencePt, collectionId]);


// //     if (loading) {
// //         return (
// //             <div className="text-center p-8 text-gray-700">
// //                 <p className="text-xl">Cargando telas para la referencia: {referencePt}...</p>
// //             </div>
// //         );
// //     }


// //     if (error) {
// //         return (
// //             <div className="text-center p-8 text-red-700">
// //                 <h1 className="text-3xl font-bold mb-4">Error al cargar las telas.</h1>
// //                 <p>{error}</p>
// //                 <p className="text-sm text-gray-500">Referencia: {referencePt}, Colección: {collectionId}</p>
// //             </div>
// //         );
// //     }


// //     const displayTitle = `TELAS PARA REFERENCIA: ${referencePt}`;
// //     return (
// //         <>
// //             <header className="text-center mb-10 relative">
// //                 <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
// //                     {displayTitle}
// //                 </h2>
// //                 <div className="w-24 h-1 bg-gradient-to-r from-teal-500 via-green-500 to-teal-500 mx-auto mt-2 rounded-full" />
// //                 {collectionId && (
// //                     <p className="text-gray-600 text-lg mt-2">
// //                         (Colección: {collectionId})
// //                     </p>
// //                 )}
// //             </header>

// //             <div className="p-4 overflow-x-auto">
// //                 {telas && telas.length > 0 ? (
// //                     <table className="min-w-full bg-white shadow-sm rounded-sm overflow-hidden">
// //                         <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
// //                             <tr>
// //                                 <th className="py-3 px-6 text-left">Uso en Prenda</th>
// //                                 <th className="py-3 px-6 text-left">Código Tela</th>
// //                                 <th className="py-3 px-6 text-left">Descripción Tela</th>
// //                                 <th className="py-3 px-6 text-left">Ancho</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody className="text-gray-600 text-sm font-light">
// //                             {telas.map((tela, index) => (
// //                                 <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
// //                                     <td className="py-3 px-6 text-left whitespace-nowrap">{tela.U_GSP_SchLinName}</td>
// //                                     <td className="py-3 px-6 text-left">{tela.U_GSP_ItemCode}</td>
// //                                     <td className="py-3 px-6 text-left">{tela.U_GSP_ItemName}</td>
// //                                     {/* Aplica la función formatWidth aquí */}
// //                                     <td className="py-3 px-6 text-left">{formatWidth(tela.BWidth1)}</td>
// //                                 </tr>
// //                             ))}
// //                         </tbody>
// //                     </table>
// //                 ) : (
// //                     <p className="text-center text-gray-600 text-lg">No hay datos de telas disponibles para esta referencia y colección.</p>
// //                 )}
// //             </div>
// //         </>
// //     );
// // }
