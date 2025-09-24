'use client';

import { useState, useEffect } from 'react';
import ImageUpload from '@/app/globals/components/molecules/ImageUpload';

interface Prenda {
  prenda_id: number;
  tipo_prenda_nombre: string;
}

interface ImageData {
  id: number;
  title: string;
  image_url: string;
  uploaded_at: string;
}

export default function ProduccionPage() {
  const [prendas, setPrendas] = useState<Prenda[]>([]);
  const [images, setImages] = useState<ImageData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPrendas = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/sap/prendas/');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al obtener los datos');
      }
      const data = await response.json();
      setPrendas(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/sap/images/');
      if (!response.ok) {
        throw new Error('Error al obtener las imágenes');
      }
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchPrendas();
    fetchImages();
  }, []);

  const handleUploadSuccess = (imageData: ImageData) => {
    setImages(prev => [imageData, ...prev]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Producción</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

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
