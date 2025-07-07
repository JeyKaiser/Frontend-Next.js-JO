// app/(dashboard)/referencia-detalle/[referenciaId]/fases/[faseSlug]/page.tsx

interface ReferenciaFasePageProps {
  params: {
    referenciaId: string;
    faseSlug: string; // Este es el slug de la fase actual, ej. 'jo', 'md-creacion-ficha'
  };
}

// Puedes (opcionalmente) obtener datos específicos de la fase si tu API lo soporta.
// Por ahora, simplemente mostraremos el slug de la fase.

export default async function ReferenciaFasePage({ params }: ReferenciaFasePageProps) {
  // Asegúrate de que params se 'await'ee
  const { referenciaId, faseSlug } = await params;

  // En un caso real, aquí cargarías el contenido específico de la fase
  // ej: const faseContent = await getFaseContent(referenciaId, faseSlug);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Contenido de la Fase: {faseSlug.toUpperCase()}</h2>
      <p className="text-gray-600">
        Esta es la página para la fase **{faseSlug.toUpperCase()}** de la referencia **{referenciaId}**.
        Aquí es donde se cargará el contenido específico de cada fase (tablas, imágenes, formularios, etc.).
      </p>
      {/* Puedes añadir la imagen de la card si quieres aquí */}
      {/* <img src={referenciaData.imagen_url} alt={referenciaData.nombre} className="mt-4 max-w-sm rounded-lg" /> */}
    </div>
  );
}
