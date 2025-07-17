// app/(dashboard)/referencia-detalle/[referenciaId]/fases/[faseSlug]/loading.tsx
export default function FaseLoading() {
  return (
    <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-blue-500 border-opacity-75"></div>
      <p className="ml-4 text-gray-600 text-lg">Cargando contenido de la fase...</p>
    </div>
  );
}