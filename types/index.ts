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
  // Puedes añadir otros campos de error que tu API pueda devolver
  // ej: [key: string]: string[]; para errores de validación de campos
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

// Puedes añadir más interfaces aquí para Productos, Técnicos, Telas, etc.
// export interface Producto { ... }