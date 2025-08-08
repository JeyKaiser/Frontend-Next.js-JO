// app/(dashboard)/referencias-por-anio/[collectionId]/layout.tsx

// Este layout es para la página que lista las referencias (PT...) para un año/colección específico.
// NO debe intentar obtener datos de referencia individual ni mostrar pestañas de fases aquí.

interface ReferenciasPorAnioLayoutProps {
  children: React.ReactNode;
  params: {
    collectionId: string; // Este es el ID del año/colección, ej. "085", "071"
  };
}

// Este es un Server Component por defecto
export default async function ReferenciasPorAnioLayout({ children, params }: ReferenciasPorAnioLayoutProps) {
  const { collectionId } = await params;

  return (
    <div className="container mx-auto p-4">
      {/* Puedes poner un encabezado general para todas las referencias de un año si lo deseas,
          pero el título específico del año ya está en page.tsx. */}
      {/* <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Referencias del Año: {collectionId}
      </h1> */}
      {children}
    </div>
  );
}