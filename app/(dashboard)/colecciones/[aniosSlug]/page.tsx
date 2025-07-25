import Card from '@/components/molecules/Card';
import type { AniosColeccionApiResponse, AnioColeccionData } from '../../../types';

interface AnioColeccionPageProps {
  params: {
    aniosSlug: string;
  };
}

// Función para obtener los años de la colección
async function getAniosColeccion(aniosSlug: string): Promise<AniosColeccionApiResponse | null> {
  const DJANGO_API_BASE_URL = 'http://localhost:8000'; // Tu URL base de Django

  try {
    // Asegúrate de que esta URL coincida con tu API de Django
    const apiUrl = `${DJANGO_API_BASE_URL}/api/colecciones/${aniosSlug}/anios/`;
    console.log(`[Next.js SC - Colecciones] Solicitando API: ${apiUrl}`);

    const res = await fetch(apiUrl, {
      cache: 'no-store',               // Siempre obtiene los últimos datos
    });

    console.log(`[Next.js SC - Colecciones] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);

    if (!res.ok) {
      let errorBody = 'No body';
      try {
        errorBody = await res.text();
      } catch (e) {}
      console.error(`[Next.js SC - Colecciones] Error al obtener años para slug '${aniosSlug}': STATUS ${res.status}. Cuerpo: ${errorBody}`);
      return null;
    }

    const data: AniosColeccionApiResponse = await res.json();
    console.log(`[Next.js SC - Colecciones] Datos recibidos:`, data);
    return data;
  } catch (error) {
    console.error("[Next.js SC - Colecciones] Error de red o al parsear JSON:", error);
    return null;
  }
}


export default async function AnioColeccionPage({ params }: AnioColeccionPageProps) {

  const { aniosSlug } = await params;
  const data = await getAniosColeccion(aniosSlug);

  if (!data || !data.anios) {
    return (
      <div className="text-center p-8 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Error al cargar los años de la colección.</h1>
        <p>Verifica la API de Django o la conexión.</p>
        <p className="text-sm text-gray-500">Slug de Colección: {aniosSlug}</p>
      </div>
    );
  }
 
  const anios = data.anios;
  const displayCollectionName = data.nombre_coleccion;

  return (
    <>
      <header className="text-center mb-10 relative">
        <h3>COLECCIÓN</h3>
        <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
          {displayCollectionName.toUpperCase()}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mt-2 rounded-full" />
      </header>

      {/* Gap ajustado a 'gap-10' para más separación entre las tarjetas de años */}
      <div className="grid grid-cols-[repeat(auto-fit,_250px)] justify-center gap-10 px-4 py-8 items-start">
        {anios.length === 0 && (
          <p className="col-span-full text-center text-gray-600">No hay años disponibles para esta colección.</p>
        )}
        {anios.map((anio) => (
          <Card
            key={anio.id}
            title={anio.label}
            subtitle={displayCollectionName}
            imageSrc={anio.img}
            bgColor={anio.bg}
            href={`/referencias-por-anio/${anio.id}`} // Redirige a la página de referencias con el ID del año
          />
        ))}
      </div>
    </>
  );
}
