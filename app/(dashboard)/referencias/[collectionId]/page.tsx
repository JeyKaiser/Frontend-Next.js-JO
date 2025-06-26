// app/(dashboard)/referencias/[collectionId]/page.tsx

// ¡IMPORTANTE! Cambia esto para importar tu Card genérica
import CardReferencia from '@/components/molecules/CardReferencia'; // Asegúrate que la ruta sea correcta

// Importa el tipo ReferenciaData de tu archivo types/index.ts
import type { ReferenciaData } from '../../../types'; 

interface ReferenciasPageProps {
  params: {
    collectionId: string; // El ID de la colección/año que viene de la URL
  };
}

async function getReferencias(collectionId: string): Promise<ReferenciaData[] | null> {
  const DJANGO_API_BASE_URL = 'http://localhost:8000';

  try {
    const apiUrl = `${DJANGO_API_BASE_URL}/api/referencias/${collectionId}/`; // Tu URL de API actual
    
    console.log(`[Next.js SC - Referencias] Solicitando API: ${apiUrl}`);

    const res = await fetch(apiUrl, {
      cache: 'no-store', // Siempre obtiene los últimos datos
    });

    console.log(`[Next.js SC - Referencias] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);

    if (!res.ok) {
      let errorBody = 'No body';
      try {
          errorBody = await res.text();
      } catch (e) {}
      console.error(`[Next.js SC - Referencias] Error al obtener referencias para ID '${collectionId}': STATUS ${res.status}. Cuerpo: ${errorBody}`);
      return null;
    }

    const data: ReferenciaData[] = await res.json();
    console.log(`[Next.js SC - Referencias] Datos recibidos:`, data);
    return data;
  } catch (error) {
    console.error("[Next.js SC - Referencias] Error de red o al parsear JSON:", error);
    return null;
  }
}

export default async function ReferenciasPage({ params }: ReferenciasPageProps) {
  const { collectionId } = params;
  const modelos = await getReferencias(collectionId); // 'modelos' es ahora ReferenciaData[] | null

  if (!modelos) { // Si es null, hubo un error de carga o API
    return (
      <div className="text-center p-8 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Error al cargar las referencias.</h1>
        <p>Verifica la API de Django o la conexión.</p>
        <p className="text-sm text-gray-500">ID de Colección: {collectionId}</p>
      </div>
    );
  }

  // Puedes derivar un título más descriptivo aquí si la API no lo proporciona directamente
  const displayTitle = `REFERENCIAS PARA ID: ${collectionId}`;

  return (
    <>
      <header className="text-center mb-10 relative">
        <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
          {displayTitle}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mx-auto mt-2 rounded-full" />
      </header>

      {/* Aplica el mismo grid flexible que ya usas en dashboard/colecciones */}
      <div className="grid grid-cols-[repeat(auto-fit,_200px)] justify-center gap-6 px-4 py-8 items-start">
        {modelos.length === 0 && (
            <p className="col-span-full text-center text-gray-600">No hay referencias disponibles para este ID.</p>
        )}
        {modelos.map((modelo, index) => (
          <CardReferencia
            key={modelo.U_GSP_REFERENCE || modelo.id || index} // Usa U_GSP_REFERENCE como key si es único, o modelo.id si lo añades al tipo
            imageSrc={modelo.U_GSP_Picture} // Mapea U_GSP_Picture a imageSrc
            title={modelo.U_GSP_REFERENCE} // Mapea U_GSP_REFERENCE a title
            subtitle={modelo.U_GSP_Desc} // Mapea U_GSP_Desc a subtitle
            // No hay bgColor en tus datos de referencia, o no lo estás pasando.
            // La Card tiene un valor por defecto (#f0f0f0) si no se pasa.
            // Si tu API de referencias tiene un campo para el color, mapealo aquí:
            // bgColor={modelo.tu_campo_color}
            // No hay href en tu código actual para estas cards. Se omitirá.
            // Si necesitas un href en el futuro para ver detalles de la referencia:
            // href={`/referencias/${modelo.id || modelo.U_GSP_REFERENCE}/detalle`}
          />
        ))}
      </div>
    </>
  );
}


// // components/molecules/Card.tsx
// import Image from 'next/image';
// import Link from 'next/link';

// interface CardProps {
//   title: string;       // Será U_GSP_REFERENCE
//   imageSrc: string;    // Será U_GSP_Picture
//   bgColor?: string;    // Puede ser opcional, ya que no lo pasas en Referencias
//   href?: string;       // Hacemos href opcional ya que no lo usas en Referencias
//   id?: string | number;
//   subtitle?: string;   // Será U_GSP_Desc
// }

// export default function Card({ title, imageSrc, bgColor, href, id, subtitle }: CardProps) {
//   // const handleClick = () => {
//   //   console.log('¡Clic en la tarjeta!', { title, href, id });
//   // };

//   const cardContent = (
//     <div
//       className="relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 ease-in-out transform
//                  hover:scale-102 hover:shadow-lg hover:-translate-y-2.5
//                  flex flex-col cursor-pointer
//                  w-[250px] h-[350px] mx-auto flex-shrink-0" // <-- Tamaño fijo de la tarjeta
//       style={{ backgroundColor: bgColor || '#f0f0f0' }} // Color por defecto si no se proporciona
//       // onClick={handleClick}
//     >
//       {/* Contenedor de la imagen. Aspecto 1:1 y flex-grow */}
//       <div className="relative w-full aspect-w-1 aspect-h-1 overflow-hidden rounded-t-2xl flex-grow"> {/* <-- Aspecto 1:1 */}
//         <Image
//           src={imageSrc}
//           alt={title}
//           fill // Ocupa todo el contenedor
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           style={{ objectFit: 'cover' }} // Para que la imagen llene el espacio sin distorsión
//           className="transition-transform duration-300 ease-in-out group-hover:scale-105"
//           priority
//         />
//       </div>

//       {/* Contenedor del título y subtítulo/descripción */}
//       <div className="flex flex-col items-center justify-center p-3 text-center flex-shrink-0 min-h-[60px]">
//         <span className="text-gray-800 font-bold text-xl uppercase tracking-wide transition-all duration-300 ease-in-out group-hover:text-2xl">
//           {title}
//         </span>
//         {subtitle && ( // Renderiza el subtítulo/descripción solo si existe
//           <span className="text-gray-600 text-sm mt-1">
//             {subtitle}
//           </span>
//         )}
//       </div>
//     </div>
//   );

//   return href ? <Link href={href} className="block group">{cardContent}</Link> : <div className="block group">{cardContent}</div>;
// }




// // app/(dashboard)/referencias/[collectionId]/page.tsx
// // 'use client'; // No necesita ser cliente si solo hace fetch y renderiza.

// // Update the import path if CardReferencia is located elsewhere, for example:
// import CardReferencia from '../../../../components/molecules/CardReferencia';
// // Or provide the correct relative path based on your project structure
// import type { ReferenciaData } from '../../../types'; 

// interface ReferenciasPageProps {
//   params: {
//     collectionId: string; // El ID de la colección/año que viene de la URL
//   };
// }

// async function getReferencias(collectionId: string): Promise<ReferenciaData[] | null> {
//   const DJANGO_API_BASE_URL = 'http://localhost:8000';

//   try {
//     const apiUrl = `${DJANGO_API_BASE_URL}/api/referencias/${collectionId}/`;
    
//     console.log(`[Next.js SC - Referencias] Solicitando API: ${apiUrl}`);

//     const res = await fetch(apiUrl, {
//       cache: 'no-store', // Siempre obtiene los últimos datos
//     });

//     console.log(`[Next.js SC - Referencias] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);

//     if (!res.ok) {
//       let errorBody = 'No body';
//       try {
//           errorBody = await res.text();
//       } catch (e) {}
//       console.error(`[Next.js SC - Referencias] Error al obtener referencias para ID '${collectionId}': STATUS ${res.status}. Cuerpo: ${errorBody}`);
//       // Podrías devolver un array vacío o un error específico
//       return null;
//     }

//     const data: ReferenciaData[] = await res.json();
//     console.log(`[Next.js SC - Referencias] Datos recibidos:`, data);
//     return data;
//   } catch (error) {
//     console.error("[Next.js SC - Referencias] Error de red o al parsear JSON:", error);
//     return null;
//   }
// }

// export default async function ReferenciasPage({ params }: ReferenciasPageProps) {
//   const { collectionId } = params;
//   const modelos = await getReferencias(collectionId);

//   if (!modelos) { // Si es null, hubo un error de carga o API
//     return (
//       <div className="text-center p-8 text-gray-700">
//         <h1 className="text-3xl font-bold mb-4">Error al cargar las referencias.</h1>
//         <p>Verifica la API de Django o la conexión.</p>
//         <p className="text-sm text-gray-500">ID de Colección: {collectionId}</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <header className="text-center mb-10 relative">
//         <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
//           REFERENCIAS PARA ID: {collectionId}
//         </h2>
//         <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mx-auto mt-2 rounded-full" />
//       </header>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8">
//         {modelos.length === 0 && (
//             <p className="col-span-full text-center text-gray-600">No hay referencias disponibles para este ID.</p>
//         )}
//         {modelos.map((modelo, index) => (
//           // Usamos el índice como key si no hay un ID único garantizado en cada 'modelo'
//           <CardReferencia
//             key={modelo.U_GSP_REFERENCE || index} // Usa una propiedad única si existe, si no, index
//             imageSrc={modelo.U_GSP_Picture}
//             title={modelo.U_GSP_REFERENCE}
//             description={modelo.U_GSP_Desc}
//             // No hay href en tus referencias.html, así que no se pasa aquí
//             // Si necesitas un href, agrégalo a la CardReferencia y a los datos de Django
//           />
//         ))}
//       </div>
//     </>
//   );
// }