'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { TelaData } from '../../../types';

interface TelasPageProps {
    params: {
        referencePt: string; // El código PT que viene de la URL
    };
}


//formatear el ancho para anchos mal ingresados en SAP
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

    const [telas, setTelas] = useState<TelaData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getTelas() {
            if (!referencePt || !collectionId) {
                setError("Faltan parámetros de referencia o colección.");
                setLoading(false);
                return;
            }

            const DJANGO_API_BASE_URL = 'http://localhost:8000';
            const apiUrl = `${DJANGO_API_BASE_URL}/api/telas/${referencePt}/?collectionId=${collectionId}`;

            console.log(`[Next.js Client - Telas] Solicitando API: ${apiUrl}`);

            try {
                const res = await fetch(apiUrl, {
                    cache: 'no-store',
                });

                console.log(`[Next.js Client - Telas] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);

                if (!res.ok) {
                    let errorBody = 'No body';
                    try {
                        errorBody = await res.text();
                    } catch (e) { }
                    throw new Error(`Error al obtener telas: STATUS ${res.status}. Cuerpo: ${errorBody}`);
                }

                const data: TelaData[] = await res.json();
                console.log(`[Next.js Client - Telas] Datos recibidos:`, data);
                setTelas(data);
            } catch (err) {
                console.error("[Next.js Client - Telas] Error de red o al parsear JSON:", err);
                setError(`Error al cargar las telas: ${(err as Error).message}`);
            } finally {
                setLoading(false);
            }
        }

        getTelas();
    }, [referencePt, collectionId]);

    if (loading) {
        return (
            <div className="text-center p-8 text-gray-700">
                <p className="text-xl">Cargando telas para la referencia: {referencePt}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 text-red-700">
                <h1 className="text-3xl font-bold mb-4">Error al cargar las telas.</h1>
                <p>{error}</p>
                <p className="text-sm text-gray-500">Referencia: {referencePt}, Colección: {collectionId}</p>
            </div>
        );
    }

    const displayTitle = `TELAS PARA REFERENCIA: ${referencePt}`;

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

            <div className="p-4 overflow-x-auto">
                {telas && telas.length > 0 ? (
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
                                    {/* Aplica la función formatWidth aquí */}
                                    <td className="py-3 px-6 text-left">{formatWidth(tela.BWidth1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-600 text-lg">No hay datos de telas disponibles para esta referencia y colección.</p>
                )}
            </div>
        </>
    );
}



// 'use client'; // Esto es un Client Component porque usaremos useRouter para obtener query params

// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import type { TelaData } from '../../../types';

// interface TelasPageProps {
//     params: {
//         referencePt: string; // El código PT que viene de la URL
//     };
// }

// export default function TelasPage({ params }: TelasPageProps) {
//     const { referencePt } = params;
//     const searchParams = useSearchParams();
//     const collectionId = searchParams.get('collectionId'); // Obtiene el collectionId de los query params

//     const [telas, setTelas] = useState<TelaData[] | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         async function getTelas() {
//             if (!referencePt || !collectionId) {
//                 setError("Faltan parámetros de referencia o colección.");
//                 setLoading(false);
//                 return;
//             }

//             const DJANGO_API_BASE_URL = 'http://localhost:8000';
//             // La URL de la API ahora incluye ambos parámetros
//             const apiUrl = `${DJANGO_API_BASE_URL}/api/telas/${referencePt}/?collectionId=${collectionId}`;

//             console.log(`[Next.js Client - Telas] Solicitando API: ${apiUrl}`);

//             try {
//                 const res = await fetch(apiUrl, {
//                     cache: 'no-store',
//                 });

//                 console.log(`[Next.js Client - Telas] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);

//                 if (!res.ok) {
//                     let errorBody = 'No body';
//                     try {
//                         errorBody = await res.text();
//                     } catch (e) { }
//                     throw new Error(`Error al obtener telas: STATUS ${res.status}. Cuerpo: ${errorBody}`);
//                 }

//                 const data: TelaData[] = await res.json();
//                 console.log(`[Next.js Client - Telas] Datos recibidos:`, data);
//                 setTelas(data);
//             } catch (err) {
//                 console.error("[Next.js Client - Telas] Error de red o al parsear JSON:", err);
//                 setError(`Error al cargar las telas: ${(err as Error).message}`);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         getTelas();
//     }, [referencePt, collectionId]); // Dependencias del useEffect

//     if (loading) {
//         return (
//             <div className="text-center p-8 text-gray-700">
//                 <p className="text-xl">Cargando telas para la referencia: {referencePt}...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="text-center p-8 text-red-700">
//                 <h1 className="text-3xl font-bold mb-4">Error al cargar las telas.</h1>
//                 <p>{error}</p>
//                 <p className="text-sm text-gray-500">Referencia: {referencePt}, Colección: {collectionId}</p>
//             </div>
//         );
//     }

//     const displayTitle = `TELAS PARA REFERENCIA: ${referencePt}`;

//     return (
//         <>
//             <header className="text-center mb-10 relative">
//                 <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
//                     {displayTitle}
//                 </h2>
//                 <div className="w-24 h-1 bg-gradient-to-r from-teal-500 via-green-500 to-teal-500 mx-auto mt-2 rounded-full" />
//                 {collectionId && (
//                     <p className="text-gray-600 text-lg mt-2">
//                         (Colección: {collectionId})
//                     </p>
//                 )}
//             </header>

//             <div className="p-4 overflow-x-auto">
//                 {telas && telas.length > 0 ? (
//                     <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//                         <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
//                             <tr>
//                                 <th className="py-3 px-6 text-left">Uso en Prenda</th>
//                                 <th className="py-3 px-6 text-left">Código Tela</th>
//                                 <th className="py-3 px-6 text-left">Descripción Tela</th>
//                                 <th className="py-3 px-6 text-left">Ancho</th>
//                             </tr>
//                         </thead>
//                         <tbody className="text-gray-600 text-sm font-light">
//                             {telas.map((tela, index) => (
//                                 <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
//                                     <td className="py-3 px-6 text-left whitespace-nowrap">{tela.U_GSP_SchLinName}</td>
//                                     <td className="py-3 px-6 text-left">{tela.U_GSP_ItemCode}</td>
//                                     <td className="py-3 px-6 text-left">{tela.U_GSP_ItemName}</td>
//                                     <td className="py-3 px-6 text-left">{tela.BWidth1 !== null ? tela.BWidth1 : 'N/A'}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 ) : (
//                     <p className="text-center text-gray-600 text-lg">No hay datos de telas disponibles para esta referencia y colección.</p>
//                 )}
//             </div>
//         </>
//     );
// }
