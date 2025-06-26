// types/index.ts

/**
 * Interface para la respuesta exitosa del token JWT de Django
 */
export interface AuthTokenResponse {
  access: string;
  refresh: string;
}

/**
 * Interface para la respuesta de error de la API (ej. login fallido)
 */
export interface ApiErrorResponse {
  detail?: string; 
}

/**
 * Interface para un objeto Colección que viene de tu API de Django
 */
export interface Collection {
  id: number;
  nombre: string;
  slug?: string; // slug podría ser opcional si no todos lo tienen
  imagen_url: string; // La URL relativa de la imagen de Django
  color_fondo?: string; // Color, opcional si no siempre está presente
  // Añade aquí cualquier otro campo que tus colecciones tengan en el backend
}

/**
 * Interface para los datos de la colección formateados para el frontend
 */
export interface FormattedCollection {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  color: string;
}

/**
 * Interface para un objeto Año de Colección que viene de tu API de Django
 */
export interface AnioColeccionData {
  id: string;
  img: string; // Ruta relativa al public folder de Next.js (ej. /img/...)
  bg: string; // Color de fondo
  label: string; // Año (ej. '2024')
}

/**
 * Interface para la respuesta de la API de Años de Colección
 */
export interface AnioColeccionApiResponse {
  nombre_coleccion: string;
  anios: AnioColeccionData[];
}


export interface TestDataApiResponse {
  id: string;
  message: string;
  source: string;
  timestamp: string;
}

/**
 * Interface para un elemento de modelo/referencia (análogo a 'modelo' en tu template de Django)
 */
export interface ReferenciaData {
  U_GSP_Picture: string; // URL de la imagen
  U_GSP_REFERENCE: string; // Referencia/nombre
  U_GSP_Desc: string; // Descripción
  // Añade aquí cualquier otro campo que venga de modelsExample
  [key: string]: any; // Para permitir campos adicionales dinámicos
}