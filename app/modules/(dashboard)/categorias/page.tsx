import { Tag } from 'lucide-react';

export default function CategoriasPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Categorías</h1>
        <p className="page-subtitle">Gestión de categorías del sistema</p>
      </div>
      
      <div className="content-section">
        <div className="section-body">
          <div className="text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Tag className="w-8 h-8 text-accent-600" />
            </div>
            <h3 className="heading-4 mb-3">Módulo en Desarrollo</h3>
            <p className="body-medium mb-8">La gestión de categorías está siendo desarrollada y estará disponible próximamente.</p>
            
            <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-6">
              <h4 className="heading-5 mb-4">Funcionalidades planificadas:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="body-medium">Creación y edición de categorías</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="body-medium">Organización jerárquica</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="body-medium">Clasificación de productos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="body-medium">Filtros y búsquedas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}