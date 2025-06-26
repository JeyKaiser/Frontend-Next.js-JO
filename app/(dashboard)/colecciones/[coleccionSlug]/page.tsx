// app/(dashboard)/colecciones/[coleccionSlug]/page.tsx
// 'use client'; // No necesita ser cliente si solo hace fetch y renderiza. Next.js lo deduce.

import CardAnio from '@/components/molecules/CardAnio'; 
import type { AnioColeccionApiResponse } from '../../../types'; // Ruta correcta para tus tipos

interface AnioColeccionPageProps {
  params: {
    coleccionSlug: string;
  };
}

async function getAniosColeccion(coleccionSlug: string): Promise<AnioColeccionApiResponse | null> {
  const DJANGO_API_BASE_URL = 'http://localhost:8000';

  try {
    const apiUrl = `${DJANGO_API_BASE_URL}/api/colecciones/${coleccionSlug}/anios/`;

    console.log(`[Next.js SC - Colecciones] Solicitando API: ${apiUrl}`);

    const res = await fetch(apiUrl, {
      cache: 'no-store', // Para que no cachee viejas respuestas
    });

    console.log(`[Next.js SC - Colecciones] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);

    if (!res.ok) {
      let errorBody = 'No body';
      try {
          errorBody = await res.text();
      } catch (e) {}
      console.error(`[Next.js SC - Colecciones] Error al obtener años para '${coleccionSlug}': STATUS ${res.status}. Cuerpo: ${errorBody}`);
      return null;
    }

    const data: AnioColeccionApiResponse = await res.json();
    console.log(`[Next.js SC - Colecciones] Datos recibidos:`, data);
    return data;
  } catch (error) {
    console.error("[Next.js SC - Colecciones] Error de red o al parsear JSON:", error);
    return null;
  }
}

export default async function AnioColeccionPage({ params }: AnioColeccionPageProps) {
  const { coleccionSlug } = params;
  const data = await getAniosColeccion(coleccionSlug);

  if (!data || !data.anios) { // Aseguramos que 'anios' exista
    return (
      <div className="text-center p-8 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Colección no encontrada o error de carga.</h1>
        <p>Por favor, verifica la URL o intenta de nuevo más tarde.</p>
        <p className="text-sm text-gray-500">Slug: {coleccionSlug}</p>
      </div>
    );
  }

  // Si el nombre viene como slug, lo formateamos para mostrarlo
  const displayCollectionName = data.nombre_coleccion.replace(/-/g, ' ').toUpperCase();

  return (
    <>
      <header className="text-center mb-10 relative">
        <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
          AÑOS DE LA COLECCIÓN: {displayCollectionName}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-gray-700 via-blue-400 to-gray-700 mx-auto mt-2 rounded-full" />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8">
        {data.anios.length === 0 && (
            <p className="col-span-full text-center text-gray-600">No hay años disponibles para esta colección.</p>
        )}
        {data.anios.map((anio) => ( // 'anio' es de tipo AnioColeccionData
          <CardAnio
            key={anio.id}
            id={anio.id}
            title={anio.label} // El año (ej. "2024")
            subtitle={displayCollectionName} // El nombre de la colección
            imageSrc={anio.img} // "/img/..."
            bgColor={anio.bg}
            // CRÍTICO: La URL para la siguiente página. Usamos el ID del año.
            href={`/referencias/${anio.id}`}
          />
        ))}
      </div>
    </>
  );
}












// // src/app/(dashboard)/colecciones/[coleccionSlug]/page.tsx
// // import Image from 'next/image';
// // import Link from 'next/link';
// import CardAnio from '@/components/molecules/CardAnio';
// import type { AnioColeccionApiResponse, AnioColeccionData } from '../../types';

// interface AnioColeccionPageProps {
//   params: {
//     coleccionSlug: string;
//   };  
// }

// async function getAniosColeccion(coleccionSlug: string): Promise<AnioColeccionApiResponse | null> {
//   // --- Paso 1: Logear el slug que llega a la función
//   console.log(`[getAniosColeccion] Coleccion Slug recibido: ${coleccionSlug}`);

//   try {
//     const apiUrl = `http://localhost:8000/api/colecciones/${coleccionSlug}/anios/`;
//     // --- Paso 2: Logear la URL de la API que se va a consultar
//     console.log(`[getAniosColeccion] URL de la API a consultar: ${apiUrl}`);

//     const res = await fetch(apiUrl, {
//       cache: 'no-store',
//     });

//     // --- Paso 3: Logear el estado de la respuesta de la API
//     console.log(`[getAniosColeccion] Estado de la respuesta API: ${res.status} (${res.statusText})`);
//     if (!res.ok) {
//       if (res.status === 404) {
//         console.warn(`[getAniosColeccion] Colección '${coleccionSlug}' no encontrada (404).`);
//       } else {
//         console.error(`[getAniosColeccion] Error HTTP al obtener años de colección '${coleccionSlug}':`, res.status, res.statusText);
//       }
//       // Si la respuesta no es OK, intenta leer el cuerpo del error si es posible
//       const errorBody = await res.text(); // Lee como texto por si no es JSON
//       console.error(`[getAniosColeccion] Cuerpo del error de la API:`, errorBody);
//       return null;
//     }

//     const data: AnioColeccionApiResponse = await res.json();
//     // --- Paso 4: Logear los datos recibidos de la API
//     console.log(`[getAniosColeccion] Datos recibidos de la API:`, data);
//     return data;
//   } catch (error) {
//     // --- Paso 5: Logear cualquier error durante el fetch
//     console.error("[getAniosColeccion] Error general al obtener años de colección:", error);
//     return null;
//   }
// }

// export default async function AnioColeccionPage({ params }: AnioColeccionPageProps) {
//   const { coleccionSlug } = params;
//   const data = await getAniosColeccion(coleccionSlug);

//   // --- Paso 6: Logear los datos que llegan al componente de página antes de renderizar
//   console.log(`[AnioColeccionPage] Datos para renderizar:`, data);

//   if (!data) {
//     // --- Paso 7: Logear si los datos son nulos (indicativo de un error anterior)
//     console.log(`[AnioColeccionPage] Los datos son nulos, mostrando mensaje de error.`);
//     return (
//       <div className="text-center p-8 text-gray-700">
//         <h1 className="text-3xl font-bold mb-4">Colección no encontrada o error de carga.</h1>
//         <p>Por favor, verifica la URL o intenta de nuevo más tarde.</p>
//       </div>
//     );
//   }

//   const formattedCollectionName = data.nombre_coleccion.replace(/_/g, ' ');

//   return (
//     <>
//       <header className="text-center mb-10 relative">
//         <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
//           AÑOS DE LA COLECCIÓN: {formattedCollectionName}
//         </h2>
//         <div className="w-24 h-1 bg-gradient-to-r from-gray-700 via-blue-400 to-gray-700 mx-auto mt-2 rounded-full" />
//       </header>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8">
//         {/* --- Paso 8: Logear el número de tarjetas a renderizar */}
//         {data.anios.length === 0 && (
//             <p className="col-span-full text-center text-gray-600">No hay años disponibles para esta colección.</p>
//         )}
//         {data.anios.map((anio: AnioColeccionData) => {
//           // --- Paso 9: Logear cada objeto 'anio' que se está mapeando
//           console.log(`[AnioColeccionPage] Renderizando CardAnio para:`, anio);
//           return (
//             <CardAnio
//               key={anio.id}
//               id={anio.id}
//               title={anio.label}
//               subtitle={formattedCollectionName}
//               imageSrc={anio.img}
//               bgColor={anio.bg}
//               href={`/referencias/${anio.id}`}
//             />
//           );
//         })}
//       </div>
//     </>
//   );
// }


// // //app/dashboard/(dashboard)/colecciones/[coleccionSlug]/page.tsx
// // import CardAnio from '@/components/molecules/CardAnio'; // Importa el nuevo componente
// // import type { AnioColeccionApiResponse, AnioColeccionData } from '../../../types'; // Ruta correcta para tus tipos

// // // Definimos la interfaz para las props que recibe el componente de página dinámica
// // interface AnioColeccionPageProps {
// //   params: {
// //     coleccionSlug: string; // El nombre del parámetro de la URL
// //   };
// // }

// // // Función para obtener los datos de la API de Django (se ejecuta en el servidor)
// // async function getAniosColeccion(coleccionSlug: string): Promise<AnioColeccionApiResponse | null> {
// //   try {
// //     // La URL de tu API de Django
// //     const apiUrl = `http://localhost:8000/api/colecciones/${coleccionSlug}/anios/`;
// //     const res = await fetch(apiUrl, {
// //       cache: 'no-store', // Para asegurar que los datos se obtengan en cada solicitud
// //       // Aquí podrías añadir headers de autorización si tu API de años es protegida
// //       // headers: { 'Authorization': `Bearer ${token_jwt_aqui}` }
// //     });

// //     if (!res.ok) {
// //       if (res.status === 404) {
// //         console.warn(`Colección '${coleccionSlug}' no encontrada.`);
// //       } else {
// //         console.error(`Error al obtener años de colección '${coleccionSlug}':`, res.status, res.statusText);
// //       }
// //       return null; // Retorna null si hay un error
// //     }

// //     const data: AnioColeccionApiResponse = await res.json();
// //     return data;
// //   } catch (error) {
// //     console.error("Error fetching años de colección:", error);
// //     return null;
// //   }
// // }

// // export default async function AnioColeccionPage({ params }: AnioColeccionPageProps) {
// //   const { coleccionSlug } = params;
// //   const data = await getAniosColeccion(coleccionSlug);

// //   if (!data) {
// //     return (
// //       <div className="text-center p-8 text-gray-700">
// //         <h1 className="text-3xl font-bold mb-4">Colección no encontrada o error de carga.</h1>
// //         <p>Por favor, verifica la URL o intenta de nuevo más tarde.</p>
// //       </div>
// //     );
// //   }

// //   // Formatear el nombre de la colección para el título si es necesario
// //   const formattedCollectionName = data.nombre_coleccion.replace(/_/g, ' '); // Reemplazar guiones bajos por espacios

// //   return (
// //     <>
// //       {/* Encabezado de la página de años */}
// //       <header className="text-center mb-10 relative">
// //         <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
// //           AÑOS DE LA COLECCIÓN: {formattedCollectionName}
// //         </h2>
// //         <div className="w-24 h-1 bg-gradient-to-r from-gray-700 via-blue-400 to-gray-700 mx-auto mt-2 rounded-full" />
// //         {/* Aquí puedes ajustar el gradiente para que coincida con tus estilos de colecciones */}
// //       </header>

// //       {/* Grid de tarjetas de años */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8">
// //         {data.anios.map((anio: AnioColeccionData) => (
// //           <CardAnio
// //             key={anio.id}
// //             id={anio.id}
// //             title={anio.label} // El año (ej. '2024')
// //             subtitle={formattedCollectionName} // El nombre de la colección
// //             imageSrc={anio.img} // La ruta de la imagen (ej. /img/1.WINTER_SUN/Winter Sun 2024.png)
// //             bgColor={anio.bg} // Color de fondo
// //             href={`/referencias/${anio.id}`} // Enlace a la página de referencias de ese año
// //           />
// //         ))}
// //       </div>
// //     </>
// //   );
// // }