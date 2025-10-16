
export default function ProfilePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
        <p className="text-gray-600 mt-2">Gestión de perfil de usuario</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Módulo en Desarrollo</h3>
          <p className="text-gray-500 mb-6">La gestión de perfil está siendo desarrollada y estará disponible próximamente.</p>
          
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <h4 className="font-medium mb-2">Funcionalidades planificadas:</h4>
            <ul className="text-left space-y-1">
              <li>• Edición de datos personales</li>
              <li>• Cambio de contraseña</li>
              <li>• Configuración de preferencias</li>
              <li>• Historial de actividades</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}