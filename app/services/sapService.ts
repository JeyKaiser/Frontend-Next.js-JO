import axiosInstance from '@/utils/axiosInstance';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const BACKEND_URL = `${backendUrl}/api`;

// Interfaz para los datos de prendas
interface Prenda {
  prenda_id: number;
  tipo_prenda_nombre: string;
  cantidad_telas?: number;
  prenda_base?: string;
}

// Interfaz para los datos de imágenes
interface ImageData {
  id: number;
  title: string;
  image_url: string;
  uploaded_at: string;
}

// Cache simple en memoria
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // en milisegundos
}

class APICache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  set<T>(key: string, data: T, expiresIn: number = 300000): void { // 5 minutos por defecto
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Verificar si el cache ha expirado
    if (Date.now() - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    // Verificar si ha expirado
    if (Date.now() - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
}

// Instancia única del cache
const apiCache = new APICache();

// Mapa para rastrear solicitudes en progreso y evitar duplicados
const pendingRequests = new Map<string, Promise<unknown>>();

/**
 * Función helper para hacer fetch con cache y deduplicación
 */
async function fetchWithCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  cacheTime: number = 300000
): Promise<T> {
  // 1. Verificar si hay datos en cache
  const cachedData = apiCache.get<T>(key);
  if (cachedData) {
    console.log(`✅ Cache hit para: ${key}`);
    return cachedData;
  }

  // 2. Verificar si ya hay una solicitud en progreso para esta key
  if (pendingRequests.has(key)) {
    console.log(`⏳ Esperando solicitud en progreso para: ${key}`);
    return pendingRequests.get(key)! as Promise<T>;
  }

  // 3. Crear nueva solicitud
  console.log(`🔄 Nueva solicitud para: ${key}`);
  const promise = fetchFn()
    .then(data => {
      // Guardar en cache
      apiCache.set(key, data, cacheTime);
      // Limpiar de solicitudes pendientes
      pendingRequests.delete(key);
      return data;
    })
    .catch(error => {
      // Limpiar de solicitudes pendientes en caso de error
      pendingRequests.delete(key);
      throw error;
    });

  // Guardar la promesa en solicitudes pendientes
  pendingRequests.set(key, promise);

  return promise;
}

/**
 * Obtener lista de prendas
 */
export const getPrendas = async (): Promise<Prenda[]> => {
  return fetchWithCache(
    'prendas',
    async () => {
      const response = await fetch(`${BACKEND_URL}/sap/prendas/`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al obtener los datos');
      }
      return response.json();
    },
    300000 // 5 minutos
  );
};

/**
 * Obtener lista de imágenes
 */
export const getImages = async (): Promise<ImageData[]> => {
  return fetchWithCache(
    'images',
    async () => {
      const response = await fetch(`${BACKEND_URL}/sap/images/`);
      if (!response.ok) {
        throw new Error('Error al obtener las imágenes');
      }
      return response.json();
    },
    300000 // 5 minutos
  );
};

/**
 * Subir una imagen
 */
export const uploadImage = async (file: File, title: string): Promise<ImageData> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('title', title);

  const response = await fetch(`${BACKEND_URL}/sap/images/upload/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al subir la imagen');
  }

  const data = await response.json();
  
  // Invalidar cache de imágenes después de subir una nueva
  apiCache.clear('images');
  
  return data;
};

/**
 * Obtener datos de consumo textil
 */
export const getConsumoTextil = async (
  tipoPrenda: string,
  cantidadTelas?: number,
  numeroVariante?: string
): Promise<unknown[]> => {
  const params = new URLSearchParams();
  params.append('tipo_prenda', tipoPrenda);
  if (cantidadTelas !== undefined) {
    params.append('cantidad_telas', cantidadTelas.toString());
  }
  if (numeroVariante !== undefined) {
    params.append('numero_variante', numeroVariante);
  }

  const cacheKey = `consumo-${tipoPrenda}-${cantidadTelas || 'all'}-${numeroVariante || 'all'}`;

  return fetchWithCache(
    cacheKey,
    async () => {
      const url = `${BACKEND_URL}/sap/consumo-textil/?${params.toString()}`;
      console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener los datos de consumo');
      }
      return response.json();
    },
    300000 // 5 minutos
  );
};

/**
 * Obtener parámetros
 */
export const getParametros = async () => {
  return fetchWithCache(
    'parametros',
    async () => {
      const response = await axiosInstance.get('/sap/parametros/');
      return response.data;
    },
    600000 // 10 minutos
  );
};

/**
 * Obtener vista de parámetros
 */
export const getParametrosView = async () => {
  return fetchWithCache(
    'parametros-view',
    async () => {
      const response = await axiosInstance.get('/sap/parametros-view/');
      return response.data;
    },
    600000 // 10 minutos
  );
};

/**
 * Limpiar cache manualmente
 */
export const clearCache = (key?: string) => {
  apiCache.clear(key);
  console.log(key ? `🗑️ Cache limpiado para: ${key}` : '🗑️ Todo el cache limpiado');
};

/**
 * Refrescar datos (limpiar cache y volver a obtener)
 */
export const refreshPrendas = async (): Promise<Prenda[]> => {
  clearCache('prendas');
  return getPrendas();
};

export const refreshImages = async (): Promise<ImageData[]> => {
  clearCache('images');
  return getImages();
};
