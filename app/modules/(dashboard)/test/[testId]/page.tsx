import Head from 'next/head';
import type { TestDataApiResponse } from '@/app/modules/types'; // Ruta correcta para tus tipos

// Definimos la interfaz para las props que recibe el componente de página dinámica
interface TestPageProps {
  params: {
    testId: string; // El nombre del parámetro de la URL
  };
}

// Función para obtener los datos de la API de Django (se ejecuta en el servidor)
async function getTestData(testId: string): Promise<TestDataApiResponse | null> {
  const DJANGO_API_BASE_URL = 'http://localhost:8000'; // Tu URL base de Django

  try {
    const apiUrl = `${DJANGO_API_BASE_URL}/api/test-data/${testId}/`;
    
    // --- Log en la terminal de Next.js (Server Component) ---
    console.log(`[Next.js Server Component - TestPage] Solicitando a API de Django: ${apiUrl}`);

    const res = await fetch(apiUrl, {
      cache: 'no-store', // Para asegurar que los datos se obtengan en cada solicitud
      // Aquí podrías añadir headers de autenticación si fuera necesario para esta API
    });

    if (!res.ok) {
      console.error(`[Next.js Server Component - TestPage] Error HTTP ${res.status} al obtener datos de prueba para '${testId}': ${res.statusText}`);
      const errorBody = await res.text();
      console.error(`[Next.js Server Component - TestPage] Cuerpo del error de la API:`, errorBody);
      return null;
    }

    const data: TestDataApiResponse = await res.json();
    console.log(`[Next.js Server Component - TestPage] Datos recibidos de la API para '${testId}':`, data); // Log de los datos recibidos
    return data;
  } catch (error) {
    console.error("[Next.js Server Component - TestPage] Error de red o al parsear JSON:", error);
    return null;
  }
}

export default async function TestPage({ params }: TestPageProps) {
  const { testId } = params;
  const data = await getTestData(testId);

  if (!data) {
    return (
      <div className="text-center p-8 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Error al cargar los datos de prueba.</h1>
        <p>Verifica la API de Django o la ruta.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Head>
        <title>Detalle de Prueba - {data.id}</title>
      </Head>
      <header className="text-center mb-10 relative">
        <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
          PÁGINA DE PRUEBA: {data.id}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mx-auto mt-2 rounded-full" />
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
        <p className="text-lg mb-4 text-gray-700">
          <strong>Mensaje:</strong> {data.message}
        </p>
        <p className="text-lg mb-4 text-gray-700">
          <strong>Fuente:</strong> {data.source}
        </p>
        <p className="text-lg mb-4 text-gray-700">
          <strong>Timestamp:</strong> {data.timestamp}
        </p>
        <p className="text-lg text-gray-700">
          <strong>ID recibido en Next.js:</strong> {params.testId}
        </p>
      </div>
    </div>
  );
}