//app/modules/(dashboard)/dashboard/page.tsx

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        ¡Bienvenido al Dashboard!
      </h1>
      <p className="text-lg text-gray-600 text-center max-w-2xl">
        Usa el menú lateral para navegar por las diferentes secciones de la aplicación, como Colecciones, Consumos y más.
      </p>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md text-gray-700 text-center">
        <p className="text-xl font-semibold mb-2">Empieza explorando las colecciones.</p>
        <p>Haz clic en Colecciones en el Sidebar para ver las opciones disponibles.</p>
      </div>
    </div>
  );
}
