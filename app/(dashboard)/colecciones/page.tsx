// app/(dashboard)/colecciones/page.tsx
'use client'; // Necesario si usas hooks o interacciones del cliente

import Card from '@/components/molecules/Card'; // Asegúrate de que la ruta sea correcta

export default function ColeccionesPage() {
  const colecciones = [
    {
      id: 'winter-sun',           // Usamos el slug como ID para la URL
      label: 'Winter Sun',
      img: '/img/winter-sun.jpg', // Asegúrate de que estas imágenes existan en public/img/
      bg: '#feea4d',
    },
    {
      id: 'resort-rtw',
      label: 'Resort RTW',
      img: '/img/resort-rtw.jpg',
      bg: '#70a7ff',
    },
    {
      id: 'spring-summer',
      label: 'Spring Summer',
      img: '/img/spring-summer.jpg',
      bg: '#81c963',
    },
    {
      id: 'summer-vacation',
      label: 'Summer Vacation',
      img: '/img/summer-vacation.jpg',
      bg: '#ff935f', 
    },
    {
      id: 'pre-fall',
      label: 'Pre - Fall',
      img: '/img/pre-fall.jpg',
      bg: '#c6b9b1',
    },
    {
      id: 'fall-winter',
      label: 'Fall Winter',
      img: '/img/fall-winter.jpg',
      bg: '#b03c5c',
    },
    {
      id: 'prueba-api-django', // Un ID descriptivo para la URL
      label: 'Prueba API Django',
      img: '/img/fall-winter.jpg', // Usa una imagen existente o crea una para esto
      bg: '#A0D9EF',
    },
  ];

  return (
    <div>
      <header className="text-center mb-10 relative">
        <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
          COLECCIONES
        </h2>
        {/* Puedes descomentar la línea decorativa si la quieres */}
        {/* <div className="w-24 h-1 bg-gradient-to-r from-gray-700 via-yellow-400 to-gray-700 mx-auto mt-2 rounded-full" /> */}
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,_250px)] justify-center gap-10 px-4 py-8 items-start">
        {colecciones.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">No hay colecciones disponibles.</p>
        ) : (
          colecciones.map((anios) => (
            <Card
              key={anios.id}
              title={anios.label}
              imageSrc={anios.img}
              bgColor={anios.bg}
              // El href ahora apunta a la página de años de la colección, usando el ID/slug
              href={`/colecciones/${anios.id}`}
            />
          ))
        )}
      </div>
    </div>
  );
}



// import Card from '@/components/molecules/Card';
// import type { AnioColeccionApiResponse, AnioColeccionData } from '../../../types';
// // Eliminamos: import React from 'react';

// interface AnioColeccionPageProps {
//   params: {
//     coleccionSlug: string;
//   };
// }

// // Función para obtener los años de la colección
// async function getAniosColeccion(coleccionSlug: string): Promise<AnioColeccionApiResponse | null> {
//   const DJANGO_API_BASE_URL = 'http://localhost:8000'; // Tu URL base de Django

//   try {
//     const apiUrl = `${DJANGO_API_BASE_URL}/api/anio_coleccion/${coleccionSlug}/anios/`;
//     console.log(`[Next.js SC - Colecciones] Solicitando API: ${apiUrl}`);

//     const res = await fetch(apiUrl, {
//       cache: 'no-store', // Siempre obtiene los últimos datos
//     });

//     console.log(`[Next.js SC - Colecciones] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);

//     if (!res.ok) {
//       let errorBody = 'No body';
//       try {
//         errorBody = await res.text();
//       } catch (e) {}
//       console.error(`[Next.js SC - Colecciones] Error al obtener años para slug '${coleccionSlug}': STATUS ${res.status}. Cuerpo: ${errorBody}`);
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
//   const { coleccionSlug } = params; // Acceso directo a params como antes

//   const data = await getAniosColeccion(coleccionSlug);

//   if (!data || !data.anios) {          // Aseguramos que 'anios' exista
//     return (
//       <div className="text-center p-8 text-gray-700">
//         <h1 className="text-3xl font-bold mb-4">Error al cargar los años de la colección.</h1>
//         <p>Verifica la API de Django o la conexión.</p>
//         <p className="text-sm text-gray-500">Slug de Colección: {coleccionSlug}</p>
//       </div>
//     );
//   }

//   const anios = data.anios;
//   const displayCollectionName = data.nombre_coleccion; 

//   return (
//     <>
//       <header className="text-center mb-10 relative">
//         <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
//           AÑOS DE: {displayCollectionName.toUpperCase()}
//         </h2>
//         {/* <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mt-2 rounded-full" /> */}
//       </header>

//       <div className="grid grid-cols-[repeat(auto-fit,_250px)] justify-center gap-6 px-4 py-8 items-start">
//         {anios.length === 0 && (
//           <p className="col-span-full text-center text-gray-600">No hay años disponibles para esta colección.</p>
//         )}
//         {anios.map((anio) => (
//           <Card
//             key={anio.id}
//             title={anio.label}
//             subtitle={displayCollectionName} // Mostrar el nombre de la colección como subtítulo
//             imageSrc={anio.img}
//             bgColor={anio.bg}
//             href={`/referencias/${anio.id}`} // Redirige a la página de referencias con el ID del año
//           />
//         ))}
//       </div>
//     </>
//   );
// }
