// app/(dashboard)/referencia-detalle/[referenciaId]/layout.tsx
// Este layout ahora es el ENCARGADO de obtener los detalles de UNA referencia
// y mostrar la barra de pestañas para sus fases.

import { getReferenciaData } from '@/lib/api'; // Asegúrate de que esta ruta sea correcta
import TabList from '@/components/molecules/TabList'; // Componente que crearemos
import { notFound, redirect } from 'next/navigation'; // Importa redirect

interface ReferenciaDetalleLayoutProps {
  children: React.ReactNode;
  params: {
    referenciaId: string; // Este es el ID de la referencia (ej. PT01660)
  };
}

export default async function ReferenciaDetalleLayout({ children, params }: ReferenciaDetalleLayoutProps) {
  const referenciaId = params.referenciaId;
  let referenciaData;

  try {
    referenciaData = await getReferenciaData(referenciaId);
  } catch (error) {
    console.error(`Error fetching referencia data for layout ${referenciaId}:`, error);
    // Si la referencia no se encuentra, o hay un error de fetch, muestra un 404
    notFound();
  }

  if (!referenciaData || referenciaData.fases_disponibles.length === 0) {
    // Si no hay datos o no hay fases, también 404
    notFound();
  }

  // Para manejar la redirección a la primera fase si se llega a la URL base
  // http://localhost:3000/referencia-detalle/PT01660
  // el `children` será el `page.tsx` de esta carpeta, que redirigirá.

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Referencia: {referenciaData.nombre} ({referenciaData.codigo_referencia})
      </h1>
      {referenciaData.imagen_url && (
        // Asumiendo que tienes un componente ImageDisplay o que next/image es suficiente
        // Si no tienes ImageDisplay, puedes usar el <Image> de next/image directamente
        <img
          src={referenciaData.imagen_url}
          alt={`Imagen de la referencia ${referenciaData.nombre}`}
          className="mb-6 max-w-xs h-auto rounded shadow-lg" 
        />
      )}
      {/* Barra de pestañas */}
      <TabList referenciaId={referenciaId} fases={referenciaData.fases_disponibles} />
      {/* Aquí se renderizará el contenido de la fase activa (children) */}
      <div className="mt-4 p-6 bg-white rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
}