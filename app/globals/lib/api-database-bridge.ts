/**
 * API Database Bridge
 * Provides unified interface for both Django API and SAP HANA direct access
 * Allows gradual migration from Django to direct database access
 */

import { GarmentProductionDAL } from './dal/garment-production';
import type { 
  ReferenciaDetalleAPI, 
  FaseDisponible, 
  PTSearchResult, 
  SearchResult, 
  SearchResponse, 
  SearchError 
} from '@/app/modules/types';

// Configuration for data source preference
const USE_DIRECT_DATABASE = process.env.USE_DIRECT_DATABASE === 'true';
const DJANGO_API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// API Response types for our database bridge
export interface DatabaseResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  source: 'database' | 'api';
  executionTime?: number;
}

export interface CollectionData {
  ID_COLECCION: number;
  CODIGO_COLECCION: string;
  NOMBRE_COLECCION: string;
  TEMPORADA: string;
  ANIO: number;
  FECHA_INICIO: string;
  FECHA_FIN?: string;
  ESTADO: string;
}

export interface ReferenciaData {
  ID_REFERENCIA: number;
  CODIGO_REFERENCIA: string;
  NOMBRE_REFERENCIA: string;
  DESCRIPCION?: string;
  TIPO_PRENDA: string;
  CATEGORIA: string;
  GENERO: string;
  ESTADO: string;
  CODIGO_COLECCION: string;
  NOMBRE_COLECCION: string;
  TEMPORADA: string;
  ANIO: number;
}

export interface TrazabilidadData {
  ID_TRAZABILIDAD: number;
  CODIGO_REFERENCIA: string;
  CODIGO_FASE: string;
  NOMBRE_FASE: string;
  ETAPA: string;
  ORDEN_SECUENCIA: number;
  ESTADO: string;
  FECHA_INICIO: string;
  FECHA_FIN?: string;
  NOMBRE_COMPLETO: string;
  AREA_RESPONSABLE: string;
}

class APIDataBaseBridge {
  
  /**
   * Get collection data with fallback to Django API
   */
  static async getColeccionByCode(codigoColeccion: string): Promise<DatabaseResponse<CollectionData>> {
    try {
      if (USE_DIRECT_DATABASE) {
        console.log('[Bridge] Using direct database access for collection:', codigoColeccion);
        
        const result = await GarmentProductionDAL.getColeccionByCode(codigoColeccion);
        
        if (result.success && result.data && result.data.length > 0) {
          return {
            success: true,
            data: result.data[0] as CollectionData,
            source: 'database',
            executionTime: result.executionTime
          };
        }
        
        return {
          success: false,
          error: 'Collection not found in database',
          source: 'database'
        };
      } else {
        // Fallback to Django API
        console.log('[Bridge] Using Django API for collection:', codigoColeccion);
        
        const response = await fetch(`${DJANGO_API_BASE_URL}/api/collections/${codigoColeccion}/`);
        
        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            data: data as CollectionData,
            source: 'api'
          };
        }
        
        return {
          success: false,
          error: `API returned ${response.status}`,
          source: 'api'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Error getting collection: ${(error as Error).message}`,
        source: USE_DIRECT_DATABASE ? 'database' : 'api'
      };
    }
  }
  
  /**
   * Get reference data with enhanced database access
   */
  static async getReferenciaByCode(codigoReferencia: string): Promise<DatabaseResponse<ReferenciaData>> {
    try {
      if (USE_DIRECT_DATABASE) {
        console.log('[Bridge] Using direct database access for reference:', codigoReferencia);
        
        const result = await GarmentProductionDAL.getReferenciaByCode(codigoReferencia);
        
        if (result.success && result.data && result.data.length > 0) {
          return {
            success: true,
            data: result.data[0] as ReferenciaData,
            source: 'database',
            executionTime: result.executionTime
          };
        }
        
        return {
          success: false,
          error: 'Reference not found in database',
          source: 'database'
        };
      } else {
        // Fallback to existing Django API logic
        console.log('[Bridge] Using Django API for reference:', codigoReferencia);
        
        const response = await fetch(`${DJANGO_API_BASE_URL}/api/detalle-referencia/${codigoReferencia}/`);
        
        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            data: data as ReferenciaData,
            source: 'api'
          };
        }
        
        return {
          success: false,
          error: `API returned ${response.status}`,
          source: 'api'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Error getting reference: ${(error as Error).message}`,
        source: USE_DIRECT_DATABASE ? 'database' : 'api'
      };
    }
  }
  
  /**
   * Get traceability data for a reference
   */
  static async getTrazabilidadByReferencia(codigoReferencia: string): Promise<DatabaseResponse<TrazabilidadData[]>> {
    try {
      if (USE_DIRECT_DATABASE) {
        console.log('[Bridge] Using direct database access for traceability:', codigoReferencia);
        
        // First get the reference ID
        const refResult = await GarmentProductionDAL.getReferenciaByCode(codigoReferencia);
        
        if (!refResult.success || !refResult.data || refResult.data.length === 0) {
          return {
            success: false,
            error: 'Reference not found',
            source: 'database'
          };
        }
        
        const referencia = refResult.data[0] as any;
        const result = await GarmentProductionDAL.getTrazabilidadByReferencia(referencia.ID_REFERENCIA);
        
        if (result.success) {
          return {
            success: true,
            data: result.data as TrazabilidadData[],
            source: 'database',
            executionTime: result.executionTime
          };
        }
        
        return {
          success: false,
          error: result.error,
          source: 'database'
        };
      } else {
        // Fallback to Django API
        console.log('[Bridge] Using Django API for traceability:', codigoReferencia);
        
        const response = await fetch(`${DJANGO_API_BASE_URL}/api/traceability/${codigoReferencia}/`);
        
        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            data: data as TrazabilidadData[],
            source: 'api'
          };
        }
        
        return {
          success: false,
          error: `API returned ${response.status}`,
          source: 'api'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Error getting traceability: ${(error as Error).message}`,
        source: USE_DIRECT_DATABASE ? 'database' : 'api'
      };
    }
  }
  
  /**
   * Search references with enhanced database capabilities
   */
  static async searchReferencias(searchTerm: string, filters?: {
    coleccionId?: number;
    temporada?: string;
    anio?: number;
    tipoprenda?: string;
    estado?: string;
  }): Promise<DatabaseResponse<ReferenciaData[]>> {
    try {
      if (USE_DIRECT_DATABASE) {
        console.log('[Bridge] Using direct database access for search:', searchTerm, filters);
        
        const result = await GarmentProductionDAL.searchReferencias(searchTerm, filters);
        
        if (result.success) {
          return {
            success: true,
            data: result.data as ReferenciaData[],
            source: 'database',
            executionTime: result.executionTime
          };
        }
        
        return {
          success: false,
          error: result.error,
          source: 'database'
        };
      } else {
        // Fallback to Django API search
        console.log('[Bridge] Using Django API for search:', searchTerm);
        
        const queryParams = new URLSearchParams({
          q: searchTerm,
          ...(filters?.temporada && { temporada: filters.temporada }),
          ...(filters?.anio && { anio: filters.anio.toString() }),
          ...(filters?.tipoprenda && { tipoprenda: filters.tipoprenda }),
          ...(filters?.estado && { estado: filters.estado })
        });
        
        const response = await fetch(`${DJANGO_API_BASE_URL}/api/search/?${queryParams}`);
        
        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            data: data.results as ReferenciaData[],
            source: 'api'
          };
        }
        
        return {
          success: false,
          error: `API returned ${response.status}`,
          source: 'api'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Error searching references: ${(error as Error).message}`,
        source: USE_DIRECT_DATABASE ? 'database' : 'api'
      };
    }
  }
  
  /**
   * Get collections with pagination
   */
  static async getColecciones(offset: number = 0, limit: number = 50, anio?: number): Promise<DatabaseResponse<CollectionData[]>> {
    try {
      if (USE_DIRECT_DATABASE) {
        console.log('[Bridge] Using direct database access for collections:', { offset, limit, anio });
        
        const result = await GarmentProductionDAL.getColecciones(offset, limit, anio);
        
        if (result.success) {
          return {
            success: true,
            data: result.data as CollectionData[],
            source: 'database',
            executionTime: result.executionTime
          };
        }
        
        return {
          success: false,
          error: result.error,
          source: 'database'
        };
      } else {
        // Fallback to Django API
        console.log('[Bridge] Using Django API for collections list');
        
        const queryParams = new URLSearchParams({
          offset: offset.toString(),
          limit: limit.toString(),
          ...(anio && { anio: anio.toString() })
        });
        
        const response = await fetch(`${DJANGO_API_BASE_URL}/api/collections/?${queryParams}`);
        
        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            data: data.results as CollectionData[],
            source: 'api'
          };
        }
        
        return {
          success: false,
          error: `API returned ${response.status}`,
          source: 'api'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Error getting collections: ${(error as Error).message}`,
        source: USE_DIRECT_DATABASE ? 'database' : 'api'
      };
    }
  }
  
  /**
   * Get production summary analytics
   */
  static async getProductionSummary(idColeccion: number): Promise<DatabaseResponse<any>> {
    try {
      if (USE_DIRECT_DATABASE) {
        console.log('[Bridge] Using direct database access for production summary:', idColeccion);
        
        const result = await GarmentProductionDAL.getProductionSummary(idColeccion);
        
        if (result.success) {
          return {
            success: true,
            data: result.data,
            source: 'database',
            executionTime: result.executionTime
          };
        }
        
        return {
          success: false,
          error: result.error,
          source: 'database'
        };
      } else {
        // This would require a new Django endpoint
        console.log('[Bridge] Production summary not available via Django API');
        
        return {
          success: false,
          error: 'Production summary only available with direct database access',
          source: 'api'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Error getting production summary: ${(error as Error).message}`,
        source: 'database'
      };
    }
  }
}

// Export utility functions
export const getColeccionByCode = APIDataBaseBridge.getColeccionByCode;
export const getReferenciaByCode = APIDataBaseBridge.getReferenciaByCode;
export const getTrazabilidadByReferencia = APIDataBaseBridge.getTrazabilidadByReferencia;
export const searchReferencias = APIDataBaseBridge.searchReferencias;
export const getColecciones = APIDataBaseBridge.getColecciones;
export const getProductionSummary = APIDataBaseBridge.getProductionSummary;

export default APIDataBaseBridge;
