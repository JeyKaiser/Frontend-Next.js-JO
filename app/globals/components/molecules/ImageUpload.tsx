'use client';

import { useState } from 'react';

const backendUrI = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ImageUploadProps {
  onUploadSuccess?: (imageData: any) => void;
}

export default function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor selecciona una imagen');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);
    if (title.trim()) {
      formData.append('title', title.trim());
    }

    try {
      const response = await fetch(`${backendUrI}/api/sap/images/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir la imagen');
      }

      const data = await response.json();
      onUploadSuccess?.(data);

      // Reset form
      setSelectedFile(null);
      setTitle('');
      (document.getElementById('file-input') as HTMLInputElement).value = '';
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Subir Imagen</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título (opcional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa un título para la imagen"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Imagen
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {selectedFile && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Archivo seleccionado: {selectedFile.name}
            </p>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="mt-2 max-w-full h-32 object-cover rounded"
            />
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploading ? 'Subiendo...' : 'Subir Imagen'}
        </button>
      </div>
    </div>
  );
}