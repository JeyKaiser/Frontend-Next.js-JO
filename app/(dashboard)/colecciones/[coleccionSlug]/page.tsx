import Card from '@/components/molecules/Card';
import type { AnioColeccionApiResponse, AnioColeccionData } from '../../../types';

interface AnioColeccionPageProps {
  params: {
    coleccionSlug: string;
  };
}

async function getAniosColeccion(coleccionSlug: string): Promise<AnioColeccionApiResponse | null> {
  const DJANGO_API_BASE_URL = 'http://localhost:8000';

  try {
    const apiUrl = `${DJANGO_API_BASE_URL}/api/colecciones/${coleccionSlug}/anios/`;
    console.log(`[Next.js SC - Colecciones] Solicitando API: ${apiUrl}`); //

    const res = await fetch(apiUrl, {
      cache: 'no-store', // Para que no cachee viejas respuestas
    });

    console.log(`[Next.js SC - Colecciones] Estado de respuesta HTTP: ${res.status} (${res.statusText})`); //

    if (!res.ok) {
      let errorBody = 'No body';
      try {
          errorBody = await res.text();
      } catch (e) {}
      console.error(`[Next.js SC - Colecciones] Error al obtener años para '${coleccionSlug}': STATUS ${res.status}. Cuerpo: ${errorBody}`); //
      return null;
    }

    const data: AnioColeccionApiResponse = await res.json();
    console.log(`[Next.js SC - Colecciones] Datos recibidos:`, data); //
    return data;
  } catch (error) {
    console.error("[Next.js SC - Colecciones] Error de red o al parsear JSON:", error); //
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

      {/* Usar el mismo estilo de grid flexible del dashboard */}
      <div className="grid grid-cols-[repeat(auto-fit,_250px)] justify-center gap-6 px-4 py-8 items-start">
        {data.anios.length === 0 && ( //
            <p className="col-span-full text-center text-gray-600">No hay años disponibles para esta colección.</p>
        )}
        {data.anios.map((anio: AnioColeccionData) => ( 
          <Card
            key={anio.id}
            id={anio.id}
            title={anio.label}                // El año (ej. "2024")
            subtitle={displayCollectionName}  // El nombre de la colección
            imageSrc={anio.img}               // "/img/..."
            bgColor={anio.bg}     
            href={`/referencias/${anio.id}`}  // CRÍTICO: La URL para la siguiente página. Usamos el ID del año.
          />
        ))}
      </div>
    </>
  );
}


// app/(dashboard)/colecciones/[coleccionSlug]/page.tsx
// // 'use client'; // evaluar si se necesita

// import Card from '@/components/molecules/Card'; 
// import type { AnioColeccionApiResponse } from '../../../types'; 

// interface AnioColeccionPageProps {
//   params: {
//     coleccionSlug: string;
//   };
// }

// async function getAniosColeccion(coleccionSlug: string): Promise<AnioColeccionApiResponse | null> {
//   const DJANGO_API_BASE_URL = 'http://localhost:8000';

//   try {
//     const apiUrl = `${DJANGO_API_BASE_URL}/api/colecciones/${coleccionSlug}/anios/`;
//     console.log(`[Next.js SC - Colecciones] Solicitando API: ${apiUrl}`);

//     const res = await fetch(apiUrl, {
//       cache: 'no-store', // Para que no cachee viejas respuestas
//     });

//     console.log(`[Next.js SC - Colecciones] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);

//     if (!res.ok) {
//       let errorBody = 'No body';
//       try {
//           errorBody = await res.text();
//       } catch (e) {}
//       console.error(`[Next.js SC - Colecciones] Error al obtener años para '${coleccionSlug}': STATUS ${res.status}. Cuerpo: ${errorBody}`);
//       return null;
//     }

//     const data: AnioColeccionApiResponse = await res.json();
//     console.log(`[Next.js SC - Colecciones] Datos recibidos:`, data);
//     return data;
//   } catch (error) {
//     console.error("[Next.js SC - Colecciones] Error de red o al parsear JSON:", error);
//     return null;
//   }
// }

// export default async function AnioColeccionPage({ params }: AnioColeccionPageProps) {
//   const { coleccionSlug } = params;
//   const data = await getAniosColeccion(coleccionSlug);

//   if (!data || !data.anios) { // Aseguramos que 'anios' exista
//     return (
//       <div className="text-center p-8 text-gray-700">
//         <h1 className="text-3xl font-bold mb-4">Colección no encontrada o error de carga.</h1>
//         <p>Por favor, verifica la URL o intenta de nuevo más tarde.</p>
//         <p className="text-sm text-gray-500">Slug: {coleccionSlug}</p>
//       </div>
//     );
//   }

//   // Si el nombre viene como slug, lo formateamos para mostrarlo
//   const displayCollectionName = data.nombre_coleccion.replace(/-/g, ' ').toUpperCase();

//   return (
//     <>
//       <header className="text-center mb-10 relative">
//         <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
//           AÑOS DE LA COLECCIÓN: {displayCollectionName}
//         </h2>
//         <div className="w-24 h-1 bg-gradient-to-r from-gray-700 via-blue-400 to-gray-700 mx-auto mt-2 rounded-full" />
//       </header>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8">
//         {data.anios.length === 0 && (
//             <p className="col-span-full text-center text-gray-600">No hay años disponibles para esta colección.</p>
//         )}
//         {data.anios.map((anio) => ( // 'anio' es de tipo AnioColeccionData
//           <Card
//             key={anio.id}
//             id={anio.id}
//             title={anio.label} // El año (ej. "2024")
//             subtitle={displayCollectionName} // El nombre de la colección
//             imageSrc={anio.img} // "/img/..."
//             bgColor={anio.bg}
//             // CRÍTICO: La URL para la siguiente página. Usamos el ID del año.
//             href={`/referencias/${anio.id}`}
//           />
//         ))}
//       </div>
//     </>
//   );
// }

