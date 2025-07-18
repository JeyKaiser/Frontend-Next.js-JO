// types/index.ts

/** Interface para la respuesta exitosa del token JWT de Django*/
export interface AuthTokenResponse {
  access: string;
  refresh: string;
}

/** Interface para la respuesta de error de la API (ej. login fallido) */
export interface ApiErrorResponse {
  detail?: string; 
}


/** Interface para la respuesta a la solicitud de años de una coleccion (Cards)*/
export interface AniosColeccionApiResponse {
  nombre_coleccion: string;
  anios: AnioColeccionData[];
}


/** Interface para la respuesta a la solicitud de PT's de un año de una coleccion (Cards)*/
export interface ReferenciasAnioApiResponse {
  U_GSP_Picture: string;
  U_GSP_REFERENCE: string;
  U_GSP_Desc: string;
  id?: string | number;
  color_fondo?: string;  
  // Si tu API de lista de referencias devuelve otros campos, añádelos aquí.
}






export interface ReferenciaData {
  codigo_referencia: string; // Coincide con el campo 'codigo_referencia' de Django
  nombre: string;            // Coincide con el campo 'nombre' de Django
  imagen_url: string;        // Coincide con el campo 'imagen_url' de Django
  fases_disponibles: FaseDisponible[]; // Coincide con el campo 'fases_disponibles' de Django
}




/** Interface para un objeto Colección que viene de tu API de Django */
export interface Collection {
  id: number;
  nombre: string;
  slug?: string;         // slug podría ser opcional si no todos lo tienen
  imagen_url: string;    // La URL relativa de la imagen de Django
  color_fondo?: string;  // Color, opcional si no siempre está presente
  // Añade aquí cualquier otro campo que tus colecciones tengan en el backend
}

/** Interface para los datos de la colección formateados para el frontend */
export interface FormattedCollection {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  color: string;
}

/** Interface para un objeto Año de Colección que viene de tu API de Django */
export interface AnioColeccionData {
  id: string;
  img: string;    // Ruta relativa al public folder de Next.js (ej. /img/...)
  bg: string;     // Color de fondo
  label: string;  // Año (ej. '2024')
}




export interface TestDataApiResponse {
  id: string;
  message: string;
  source: string;
  timestamp: string;
}


/** -----------------FASES------------------ */
// Asegúrate de que los nombres de los campos coincidan EXACTAMENTE con lo que Django envía.
export interface FaseDisponible {
  slug: string;
  nombre: string;
}

export interface ReferenciaDetalleAPI {
  codigo_referencia: string;
  nombre: string;
  imagen_url: string;
  fases_disponibles: FaseDisponible[];
}


export interface TelaData {
  U_GSP_REFERENCE: string;   // Código de referencia (PT Code)
  U_GSP_SchLinName: string;  // Uso en prenda
  U_GSP_ItemCode: string;    // Código Tela
  U_GSP_ItemName: string;    // Descripción Tela
  BWidth1: number | null;    // Ancho (puede ser nulo)
  // Añade cualquier otro campo que tu consulta SQL pueda devolver
}

export interface InsumoData {
  U_GSP_REFERENCE: string;   // Código de referencia (PT Code)
  U_GSP_SchLinName: string;  // Uso en prenda
  U_GSP_ItemCode: string;    // Código Insumo
  U_GSP_ItemName: string;    // Descripción Insumo
  BWidth1: number | null;    // Ancho (puede ser nulo, aunque para insumos quizás no aplique siempre)
  // Si hay otras columnas específicas para insumos, añádelas aquí.
}

export interface PTSearchResult {
  U_GSP_REFERENCE: string;
  U_GSP_COLLECTION: string; // Necesitamos la colección para redirigir a la página de telas
  // Puedes añadir más campos si la búsqueda devuelve información adicional
}
 // NUEVA INTERFAZ PARA LA RESPUESTA COMBINADA DEL MODELO DETALLE
export interface ModeloDetalleResponse {
  telas: TelaData[];
  insumos: InsumoData[];
}
