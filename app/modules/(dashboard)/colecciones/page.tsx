import ColeccionesClient from './ColeccionesClient';

interface Reference {
  codigo_coleccion: string;
  codigo_referencia: string;
  label: string;
  img: string;
  bg: string;
  status: 'active' | 'archived' | 'planning';
  lastUpdated: string;
  season: 'Spring Summer' | 'Fall Winter' | 'Resort' | 'PreFall' | 'Summer Vacation' | 'Winter Sun';
}

interface Collection {
  id: string;
  label: string;
  img: string;
  bg: string;
  status: 'active' | 'archived' | 'planning';
  references: Reference[];
  lastUpdated: string;
  season: 'Spring Summer' | 'Fall Winter' | 'Resort' | 'PreFall' | 'Summer Vacation' | 'Winter Sun';
}

async function getColecciones(): Promise<Collection[]> {
  const BACKEND_URL = 'http://localhost:8000/api/colecciones/';
  try {
    console.log('[Server Component] Fetching collections from:', BACKEND_URL);
    const response = await fetch(BACKEND_URL, {
      cache: 'no-store', // Fetch fresh data on each request
    });

    if (!response.ok) {
      console.error('[Server Component] Backend error:', response.status, response.statusText);
      throw new Error(`Error del backend: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Server Component] Success from backend:', data.length, 'collections');
    return data;
  } catch (error) {
    console.error('[Server Component] Error connecting to backend:', error);
    throw new Error('No se pudo conectar con el backend.');
  }
}

export default async function ColeccionesPage() {
  try {
    const colecciones = await getColecciones();
    return <ColeccionesClient initialColecciones={colecciones} />;
  } catch (error) {
    // This is a simplified error view. You can create a more sophisticated one.
    return (
      <div className="p-12 text-center">
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Error al cargar colecciones
        </h3>
        <p className="text-red-600 mb-4">
          {error instanceof Error ? error.message : 'Error desconocido'}
        </p>
        <p className="text-sm text-gray-500">
          Asegúrate de que el servicio del backend (Django) se esté ejecutando en {process.env.BACKEND_URL || 'http://localhost:8000'}.
        </p>
      </div>
    );
  }
}
