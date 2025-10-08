'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getPrendas, getImages, refreshImages } from '@/app/services/sapService';

interface Prenda {
  prenda_id: number;
  tipo_prenda_nombre: string;
  cantidad_telas?: number;
  prenda_base?: string;
}

interface ImageData {
  id: number;
  title: string;
  image_url: string;
  uploaded_at: string;
}

interface SAPDataContextType {
  // Datos
  prendas: Prenda[];
  images: ImageData[];
  
  // Estados de carga
  prendasLoading: boolean;
  imagesLoading: boolean;
  
  // Errores
  prendasError: string | null;
  imagesError: string | null;
  
  // Funciones para refrescar datos
  refreshPrendasData: () => Promise<void>;
  refreshImagesData: () => Promise<void>;
  
  // Función para obtener imagen por criterios
  getImageByTitle: (title: string) => ImageData | undefined;
}

const SAPDataContext = createContext<SAPDataContextType | undefined>(undefined);

export function SAPDataProvider({ children }: { children: React.ReactNode }) {
  const [prendas, setPrendas] = useState<Prenda[]>([]);
  const [images, setImages] = useState<ImageData[]>([]);
  
  const [prendasLoading, setPrendasLoading] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  
  const [prendasError, setPrendasError] = useState<string | null>(null);
  const [imagesError, setImagesError] = useState<string | null>(null);

  // Cargar prendas
  const loadPrendas = useCallback(async () => {
    if (prendasLoading) return; // Evitar llamadas duplicadas
    
    setPrendasLoading(true);
    setPrendasError(null);
    
    try {
      const data = await getPrendas();
      setPrendas(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setPrendasError(errorMessage);
      console.error('Error loading prendas:', error);
    } finally {
      setPrendasLoading(false);
    }
  }, [prendasLoading]);

  // Cargar imágenes
  const loadImages = useCallback(async () => {
    if (imagesLoading) return; // Evitar llamadas duplicadas
    
    setImagesLoading(true);
    setImagesError(null);
    
    try {
      const data = await getImages();
      setImages(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setImagesError(errorMessage);
      console.error('Error loading images:', error);
    } finally {
      setImagesLoading(false);
    }
  }, [imagesLoading]);

  // Refrescar prendas (forzar recarga)
  const refreshPrendasData = useCallback(async () => {
    setPrendasLoading(true);
    setPrendasError(null);
    
    try {
      const data = await getPrendas();
      setPrendas(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setPrendasError(errorMessage);
      console.error('Error refreshing prendas:', error);
    } finally {
      setPrendasLoading(false);
    }
  }, []);

  // Refrescar imágenes (forzar recarga)
  const refreshImagesData = useCallback(async () => {
    setImagesLoading(true);
    setImagesError(null);
    
    try {
      const data = await refreshImages();
      setImages(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setImagesError(errorMessage);
      console.error('Error refreshing images:', error);
    } finally {
      setImagesLoading(false);
    }
  }, []);

  // Función helper para buscar imagen por título
  const getImageByTitle = useCallback((title: string): ImageData | undefined => {
    return images.find(img => 
      img.title.toUpperCase() === title.toUpperCase()
    );
  }, [images]);

  // Cargar datos iniciales solo una vez
  useEffect(() => {
    loadPrendas();
    loadImages();
  }, []); // Solo se ejecuta una vez al montar

  const value: SAPDataContextType = {
    prendas,
    images,
    prendasLoading,
    imagesLoading,
    prendasError,
    imagesError,
    refreshPrendasData,
    refreshImagesData,
    getImageByTitle,
  };

  return (
    <SAPDataContext.Provider value={value}>
      {children}
    </SAPDataContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useSAPData() {
  const context = useContext(SAPDataContext);
  
  if (context === undefined) {
    throw new Error('useSAPData debe ser usado dentro de un SAPDataProvider');
  }
  
  return context;
}