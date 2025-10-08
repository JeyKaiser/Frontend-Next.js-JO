'use client';

import { useSAPData } from '@/app/contexts/SAPDataContext';
import ImageUpload from '@/app/globals/components/molecules/ImageUpload';

export default function ProduccionPage() {
  // Usar el contexto para obtener prendas e imágenes
  const {
    prendas,
    images,
    prendasError,
    imagesError,
    refreshImagesData
  } = useSAPData();

  // Combinar errores del contexto
  const displayError = prendasError || imagesError;

  const handleUploadSuccess = async () => {
    // Refrescar las imágenes desde el servidor para asegurar sincronización
    await refreshImagesData();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Producción</h1>

      {displayError && <p className="text-red-500 mb-4">{displayError}</p>}

      {/* Sección de subida de imágenes */}
      <div className="mb-8">
        <ImageUpload onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Sección de prendas */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Prendas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {prendas.map((prenda) => (
            <div key={prenda.prenda_id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold">{prenda.tipo_prenda_nombre}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de imágenes */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Imágenes Subidas</h2>
        {images.length === 0 ? (
          <p className="text-gray-500">No hay imágenes subidas aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-md p-4">
                <img
                  src={`http://localhost:8000${image.image_url}`}
                  alt={image.title || `Imagen ${image.id}`}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h3 className="text-sm font-medium">{image.title || `Imagen ${image.id}`}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(image.uploaded_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
