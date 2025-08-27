// lib/api.ts

import type { 
  ReferenciaDetalleAPI, 
  FaseDisponible, 
  PTSearchResult, 
  SearchResult, 
  SearchResponse, 
  SearchError 
} from '@/app/modules/types';

const DJANGO_API_BASE_URL = 'http://localhost:8000';

// Collection ID to Name mapping
// This should ideally come from the backend, but for now we'll maintain this mapping
const COLLECTION_NAMES: Record<string, string> = {
  '063': 'WINTER SUN',
  '065': 'SPRING SUMMER',
  '085': 'RESORT RTW',
  '105': 'FALL WINTER',
  '125': 'HOLIDAY COLLECTION',
  // Add more mappings as needed
};

/**
 * Get collection name by ID
 * @param collectionId - The collection ID
 * @returns The collection name or formatted ID if not found
 */
export function getCollectionName(collectionId: string): string {
  return COLLECTION_NAMES[collectionId] || `COLECCIÓN ${collectionId}`;
}

/**
 * Get formatted reference name from reference ID
 * @param referenciaId - The reference ID (e.g., PT01662)
 * @returns Formatted reference name
 */
export function getFormattedReferenceName(referenciaId: string): string {
  // Extract the meaningful part of the reference
  if (referenciaId.startsWith('PT')) {
    return `${referenciaId}`;
  }
  return referenciaId;
}

// Mock data for reference details when backend is not available
function getMockReferenciaData(referenciaId: string, collectionId?: string): ReferenciaDetalleAPI {
  return {
    codigo_referencia: referenciaId,
    nombre: `Referencia ${referenciaId}`,
    imagen_url: '/img/SIN FOTO.png',
    collection_id: collectionId || '109',
    collection_name: getCollectionName(collectionId || '109'),
    reference_name: getFormattedReferenceName(referenciaId),
    fases_disponibles: [
      { slug: 'jo', nombre: 'JO - Jefatura Operaciones' },
      { slug: 'md-creacion-ficha', nombre: 'MD - Creación Ficha' },
      { slug: 'md-creativo', nombre: 'MD - Creativo' },
      { slug: 'md-corte', nombre: 'MD - Corte' },
      { slug: 'md-fitting', nombre: 'MD - Fitting' },
      { slug: 'md-tecnico', nombre: 'MD - Técnico' },
      { slug: 'md-trazador', nombre: 'MD - Trazador' },
      { slug: 'costeo', nombre: 'Costeo' },
      { slug: 'pt-tecnico', nombre: 'PT - Técnico' },
      { slug: 'pt-cortador', nombre: 'PT - Cortador' },
      { slug: 'pt-fitting', nombre: 'PT - Fitting' },
      { slug: 'pt-trazador', nombre: 'PT - Trazador' }
    ]
  };
}

// Enhanced function to get reference details with collection information
export async function getReferenciaData(referenciaId: string, collectionId?: string): Promise<ReferenciaDetalleAPI | null> {
  try {
    const apiUrl = `${DJANGO_API_BASE_URL}/api/detalle-referencia/${referenciaId}/`;
    console.log(`[Next.js SC - Referencia Detalle] Solicitando API: ${apiUrl}`);

    const res = await fetch(apiUrl, {
      cache: 'no-store',
    });

    console.log(`[Next.js SC - Referencia Detalle] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);

    if (!res.ok) {
      let errorBody = 'No body';
      try {
          errorBody = await res.text();
      } catch (e) {}
      console.error(`[Next.js SC - Referencia Detalle] Error al obtener detalles para ID '${referenciaId}': STATUS ${res.status}. Cuerpo: ${errorBody}`);
      
      // Return mock data when backend is not available (401, 403, 500, etc)
      console.log(`[Next.js SC - Referencia Detalle] Backend no disponible, usando datos mock para ${referenciaId}`);
      return getMockReferenciaData(referenciaId, collectionId);
    }

    const data: ReferenciaDetalleAPI = await res.json();
    console.log(`[Next.js SC - Referencia Detalle] Datos recibidos:`, data);
    
    // If collection ID is provided, try to get collection name from search API
    if (collectionId && !data.collection_id) {
      data.collection_id = collectionId;
      data.collection_name = getCollectionName(collectionId);
    } else if (!data.collection_name && data.collection_id) {
      data.collection_name = getCollectionName(data.collection_id);
    }
    
    // If we don't have collection info from the API, try to get it from search
    if (!data.collection_id && !collectionId) {
      try {
        const searchResult = await searchPTReference(referenciaId);
        if ('results' in searchResult && searchResult.results.length > 0) {
          const result = searchResult.results[0];
          if (result.collection) {
            data.collection_id = result.collection;
            data.collection_name = getCollectionName(result.collection);
          }
        }
      } catch (error) {
        console.log(`[Next.js SC - Referencia Detalle] No se pudo obtener información de colección adicional para ${referenciaId}`);
      }
    }
    
    // Enhance reference name
    if (!data.reference_name) {
      data.reference_name = getFormattedReferenceName(referenciaId);
    }
    
    return data;
  } catch (error) {
    console.error("[Next.js SC - Referencia Detalle] Error de red o al parsear JSON:", error);
    console.log(`[Next.js SC - Referencia Detalle] Backend no disponible, usando datos mock para ${referenciaId}`);
    return getMockReferenciaData(referenciaId, collectionId);
  }
}


// Nueva función para obtener los datos de una fase específica
// Ahora collectionId es un parámetro de ruta
export async function getFaseData(referenciaId: string, fasesSlug: string, collectionId: string): Promise<any | null> {
    try {
        // *** CAMBIO CLAVE: Construcción de la URL de la API con collectionId como parámetro de ruta ***
        const apiUrl = `${DJANGO_API_BASE_URL}/api/fases/${collectionId}/${referenciaId}/${fasesSlug}/`;
        console.log(`[Next.js SC - Fase Detalle] Solicitando API: ${apiUrl}`);

        const res = await fetch(apiUrl, {
            cache: 'no-store',
        });

        console.log(`[Next.js SC - Fase Detalle] Estado de respuesta HTTP: ${res.status} (${res.statusText})`);

        if (!res.ok) {
            let errorBody = 'No body';
            try {
                errorBody = await res.text();
            } catch (e) {}
            console.error(`[Next.js SC - Fase Detalle] Error al obtener datos para fase '${fasesSlug}' de referencia '${referenciaId}' (Colección: ${collectionId}): STATUS ${res.status}. Cuerpo: ${errorBody}`);
            // Return mock data when backend is not available
            console.log(`[Next.js SC - Fase Detalle] Backend no disponible, usando datos mock para fase ${fasesSlug}`);
            return getMockFaseData(fasesSlug);
        }

        const data = await res.json();
        console.log(`[Next.js SC - Fase Detalle] Datos recibidos para fase ${fasesSlug}:`, data);
        return data;
    } catch (error) {
        console.error(`[Next.js SC - Fase Detalle] Error de red o al parsear JSON para fase ${fasesSlug} (Colección: ${collectionId}):`, error);
        // Return mock data on network/JSON parsing error
        console.log(`[Next.js SC - Fase Detalle] Backend no disponible, usando datos mock para fase ${fasesSlug}`);
        return getMockFaseData(fasesSlug);
    }
}

// Mock data for phase details when backend is not available
function getMockFaseData(fasesSlug: string): any { // Use 'any' for now, or define a specific mock type
  if (fasesSlug === 'md-creacion-ficha') {
    return {
      id: 'mock-md-creacion-ficha-id',
      nombre_fase: 'MD - Creación Ficha (Mock)',
      estado: 'completado',
      fecha_inicio: '2024-01-01',
      fecha_fin: '2024-01-05',
      responsable: 'Mock User',
      telas: [
        { id: 'tela-mock-1', nombre: 'Tela Mock A', cantidad: 10, unidad: 'metros' },
        { id: 'tela-mock-2', nombre: 'Tela Mock B', cantidad: 5, unidad: 'metros' },
      ],
      insumos: [
        { id: 'insumo-mock-1', nombre: 'Botones Mock', cantidad: 100, unidad: 'unidades' },
        { id: 'insumo-mock-2', nombre: 'Cremalleras Mock', cantidad: 20, unidad: 'unidades' },
      ],
      observaciones: 'Datos mock para la fase MD - Creación Ficha.',
    };
  }
  // Return a generic mock for other phases if needed, or null
  return {
    id: `mock-${fasesSlug}-id`,
    nombre_fase: `${fasesSlug} (Mock)`,
    estado: 'pendiente',
    observaciones: `Datos mock para la fase ${fasesSlug}.`,
  };
}

// Enhanced search functions

/**
 * Detects the search type based on the query pattern
 * 
 * Supported patterns:
 * - PT codes: PT followed by numbers (PT003112, PT03388, pt01662)
 * - MD codes: MD followed by numbers (MD003422, MD12345, md003422)
 * - Collections: Names starting with season words (Winter, Spring, Summer, Resort, Fall)
 * - General: Any other search term
 * 
 * @param query - The search query string
 * @returns The detected search type
 */
export function detectSearchType(query: string): 'pt' | 'md' | 'collection' | 'general' {
  const cleanQuery = query.trim().toLowerCase();
  
  // PT pattern: pt followed by numbers (pt003112, pt03388, etc.)
  if (/^pt\d+$/i.test(cleanQuery)) {
    return 'pt';
  }
  
  // MD pattern: md followed by numbers (md003422, md12345, etc.)
  if (/^md\d+$/i.test(cleanQuery)) {
    return 'md';
  }
  
  // Collection pattern: specific collection names or patterns
  if (/^(winter|spring|summer|resort|fall|collection)/i.test(cleanQuery)) {
    return 'collection';
  }
  
  return 'general';
}

/**
 * Validates if a search query matches expected patterns
 * @param query - The search query
 * @returns Object with validation result and suggestions
 */
export function validateSearchQuery(query: string): { 
  isValid: boolean; 
  type: string; 
  suggestions: string[] 
} {
  const cleanQuery = query.trim();
  
  if (!cleanQuery) {
    return {
      isValid: false,
      type: 'empty',
      suggestions: ['Ingresa un término de búsqueda', 'Ejemplos: PT003112, MD003422, Winter']
    };
  }
  
  const type = detectSearchType(cleanQuery);
  
  switch (type) {
    case 'pt':
      const ptPattern = /^pt\d{3,6}$/i;
      return {
        isValid: ptPattern.test(cleanQuery),
        type: 'pt',
        suggestions: ptPattern.test(cleanQuery) 
          ? ['Código PT válido'] 
          : ['Formato: PT seguido de 3-6 números', 'Ejemplos: PT003112, PT01662']
      };
      
    case 'md':
      const mdPattern = /^md\d{3,6}$/i;
      return {
        isValid: mdPattern.test(cleanQuery),
        type: 'md',
        suggestions: mdPattern.test(cleanQuery) 
          ? ['Código MD válido (en desarrollo)'] 
          : ['Formato: MD seguido de 3-6 números', 'Ejemplos: MD003422, MD12345']
      };
      
    case 'collection':
      return {
        isValid: true,
        type: 'collection',
        suggestions: ['Búsqueda de colección', 'Intenta: Winter, Spring, Summer, Resort']
      };
      
    default:
      return {
        isValid: true,
        type: 'general',
        suggestions: ['Búsqueda general', 'Para mejores resultados usa códigos PT o nombres de colecciones']
      };
  }
}

// Enhanced search function that handles multiple patterns
export async function searchUniversal(query: string): Promise<SearchResponse | SearchError> {
  try {
    const searchType = detectSearchType(query);
    const encodedQuery = encodeURIComponent(query.trim());
    
    console.log(`[API] Universal search for "${query}" - detected type: ${searchType}`);
    
    switch (searchType) {
      case 'pt':
        return await searchPTReference(query);
      case 'md':
        return await searchMDReference(query);
      case 'collection':
        return await searchCollections(query);
      default:
        return await searchGeneral(query);
    }
  } catch (error) {
    console.error('[API] Universal search error:', error);
    return {
      message: `Error en la búsqueda: ${(error as Error).message}`,
      code: 'SEARCH_ERROR',
      suggestions: ['Verifica tu conexión a internet', 'Intenta con otro término de búsqueda']
    };
  }
}

// Search PT references (existing functionality enhanced)
export async function searchPTReference(query: string): Promise<SearchResponse | SearchError> {
  try {
    const apiUrl = `${DJANGO_API_BASE_URL}/api/search-pt/?ptCode=${encodeURIComponent(query)}`;
    console.log(`[API] Searching PT reference: ${apiUrl}`);
    
    const res = await fetch(apiUrl, { cache: 'no-store' });
    
    if (!res.ok) {
      if (res.status === 404) {
        return {
          message: `Código PT '${query}' no encontrado`,
          code: 'PT_NOT_FOUND',
          suggestions: [
            'Verifica que el código PT esté bien escrito',
            'Asegúrate de incluir el prefijo "PT" seguido de números',
            'Ejemplo: PT003112, PT03388'
          ]
        };
      }
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const data: PTSearchResult = await res.json();
    
    if (data && data.U_GSP_REFERENCE && data.U_GSP_COLLECTION) {
      return {
        results: [{
          id: data.U_GSP_REFERENCE,
          title: `Referencia ${data.U_GSP_REFERENCE}`,
          description: `Colección: ${data.U_GSP_COLLECTION}`,
          type: 'reference',
          url: `/modules/referencia-detalle/${data.U_GSP_COLLECTION}/${data.U_GSP_REFERENCE}`,
          collection: data.U_GSP_COLLECTION,
          reference: data.U_GSP_REFERENCE,
          metadata: data
        }],
        total: 1,
        query,
        searchType: 'pt'
      };
    }
    
    return {
      message: `Código PT '${query}' no encontrado`,
      code: 'PT_NOT_FOUND',
      suggestions: ['Verifica el código PT e intenta nuevamente']
    };
  } catch (error) {
    console.error('[API] PT search error:', error);
    return {
      message: `Error al buscar código PT: ${(error as Error).message}`,
      code: 'PT_SEARCH_ERROR',
      suggestions: ['Verifica tu conexión e intenta nuevamente']
    };
  }
}

// Search MD references (new functionality)
export async function searchMDReference(query: string): Promise<SearchResponse | SearchError> {
  try {
    // For now, we'll simulate MD search - you can implement the actual API endpoint
    const apiUrl = `${DJANGO_API_BASE_URL}/api/search-md/?mdCode=${encodeURIComponent(query)}`;
    console.log(`[API] Searching MD reference: ${apiUrl}`);
    
    const res = await fetch(apiUrl, { cache: 'no-store' });
    
    if (!res.ok) {
      if (res.status === 404) {
        return {
          message: `Código MD '${query}' no encontrado`,
          code: 'MD_NOT_FOUND',
          suggestions: [
            'Los códigos MD están en desarrollo',
            'Verifica que el código MD esté bien escrito',
            'Ejemplo: MD003422, MD12345'
          ]
        };
      }
      // For now, return a development message
      return {
        message: `Búsqueda de códigos MD en desarrollo`,
        code: 'MD_SEARCH_DEVELOPMENT',
        suggestions: [
          'La funcionalidad de búsqueda MD está siendo desarrollada',
          'Por ahora, usa códigos PT para buscar referencias'
        ]
      };
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    // Return development message for MD search
    return {
      message: `Búsqueda de códigos MD en desarrollo`,
      code: 'MD_SEARCH_DEVELOPMENT',
      suggestions: [
        'La funcionalidad de búsqueda MD estará disponible pronto',
        'Usa códigos PT como PT003112 para buscar referencias'
      ]
    };
  }
}

// Search collections
export async function searchCollections(query: string): Promise<SearchResponse | SearchError> {
  try {
    const apiUrl = `${DJANGO_API_BASE_URL}/api/search-collections/?q=${encodeURIComponent(query)}`;
    console.log(`[API] Searching collections: ${apiUrl}`);
    
    const res = await fetch(apiUrl, { cache: 'no-store' });
    
    if (!res.ok) {
      return {
        message: `No se encontraron colecciones con "${query}"`,
        code: 'COLLECTION_NOT_FOUND',
        suggestions: [
          'Intenta con nombres como "Winter", "Spring", "Summer"',
          'Busca por año: "2024", "2023"'
        ]
      };
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    // Simulate collection search for development
    const mockCollections = [
      'Winter Sun', 'Spring Summer', 'Resort RTW', 'Fall Winter'
    ].filter(name => name.toLowerCase().includes(query.toLowerCase()));
    
    if (mockCollections.length > 0) {
      return {
        results: mockCollections.map((name, index) => ({
          id: `collection-${index}`,
          title: name,
          description: `Colección ${name}`,
          type: 'collection' as const,
          url: `/modules/colecciones/${name.toLowerCase().replace(/\s+/g, '-')}`,
          metadata: { name }
        })),
        total: mockCollections.length,
        query,
        searchType: 'collection'
      };
    }
    
    return {
      message: `No se encontraron colecciones con "${query}"`,
      code: 'COLLECTION_NOT_FOUND',
      suggestions: ['Intenta con "Winter", "Spring", "Summer", o "Resort"']
    };
  }
}

// General search across multiple types
export async function searchGeneral(query: string): Promise<SearchResponse | SearchError> {
  try {
    const apiUrl = `${DJANGO_API_BASE_URL}/api/search/?q=${encodeURIComponent(query)}`;
    console.log(`[API] General search: ${apiUrl}`);
    
    const res = await fetch(apiUrl, { cache: 'no-store' });
    
    if (!res.ok) {
      return {
        message: `No se encontraron resultados para "${query}"`,
        code: 'NO_RESULTS',
        suggestions: [
          'Intenta con códigos PT: PT003112',
          'Busca colecciones: Winter, Spring',
          'Usa términos más específicos'
        ]
      };
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    return {
      message: `No se encontraron resultados para "${query}"`,
      code: 'NO_RESULTS',
      suggestions: [
        'Intenta con códigos PT como PT003112',
        'Busca colecciones como Winter o Spring',
        'Verifica la ortografía del término de búsqueda'
      ]
    };
  }
}
