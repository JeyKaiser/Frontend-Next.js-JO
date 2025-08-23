/**
 * Database Configuration Constants
 * SAP HANA connection settings and table definitions
 */

export const DATABASE_CONFIG = {
  SCHEMA: 'GARMENT_PRODUCTION_CONTROL',
  TABLES: {
    COLECCIONES: 'T_COLECCIONES',
    REFERENCIAS: 'T_REFERENCIAS', 
    FASES: 'T_FASES',
    USUARIOS: 'T_USUARIOS',
    TRAZABILIDAD: 'T_TRAZABILIDAD'
  },
  CONNECTION: {
    DEFAULT_TIMEOUT: 30000,
    POOL_MIN: 2,
    POOL_MAX: 10,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  }
} as const;

export const ESTADOS = {
  COLECCION: {
    ACTIVA: 'ACTIVA',
    INACTIVA: 'INACTIVA',
    ARCHIVADA: 'ARCHIVADA'
  },
  REFERENCIA: {
    ACTIVA: 'ACTIVA',
    INACTIVA: 'INACTIVA',
    DESCONTINUADA: 'DESCONTINUADA'
  },
  FASE: {
    ACTIVA: 'ACTIVA',
    INACTIVA: 'INACTIVA'
  },
  USUARIO: {
    ACTIVO: 'ACTIVO',
    INACTIVO: 'INACTIVO',
    SUSPENDIDO: 'SUSPENDIDO'
  },
  TRAZABILIDAD: {
    INICIADO: 'INICIADO',
    EN_PROCESO: 'EN_PROCESO',
    COMPLETADO: 'COMPLETADO',
    PAUSADO: 'PAUSADO',
    CANCELADO: 'CANCELADO'
  }
} as const;

export const ETAPAS = {
  MUESTRA_INICIAL: 'MUESTRA_INICIAL',
  COSTEO: 'COSTEO',
  CONTRAMUESTRA: 'CONTRAMUESTRA'
} as const;

export const AREAS = {
  DISENO: 'DISEÑO',
  PATRONAJE: 'PATRONAJE',
  CORTE: 'CORTE',
  CONFECCION: 'CONFECCIÓN',
  ACABADOS: 'ACABADOS',
  CALIDAD: 'CALIDAD',
  PRODUCCION: 'PRODUCCIÓN'
} as const;

export const ROLES = {
  ADMIN: 'ADMIN',
  SUPERVISOR: 'SUPERVISOR',
  OPERARIO: 'OPERARIO',
  ANALISTA: 'ANALISTA'
} as const;

// Common SQL patterns for HANA optimization
export const SQL_PATTERNS = {
  PAGINATION: 'LIMIT ? OFFSET ?',
  DATE_FILTER: 'DATE(?) BETWEEN DATE(?) AND DATE(?)',
  TEXT_SEARCH: 'UPPER(?) LIKE UPPER(?)',
  COUNT_TOTAL: 'SELECT COUNT(*) as TOTAL FROM',
  ORDER_BY_DATE: 'ORDER BY FECHA_CREACION DESC',
  ORDER_BY_SEQUENCE: 'ORDER BY ORDEN_SECUENCIA ASC'
} as const;

// Validation rules
export const VALIDATION = {
  CODIGO_COLECCION: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[A-Z0-9]+$/
  },
  CODIGO_REFERENCIA: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 30,
    PATTERN: /^[A-Z]{2}\d{3,8}$/
  },
  CODIGO_FASE: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 20,
    PATTERN: /^[A-Z0-9_]+$/
  },
  CODIGO_USUARIO: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[A-Z0-9]+$/
  }
} as const;

// Error messages
export const ERROR_MESSAGES = {
  CONNECTION_FAILED: 'Database connection failed',
  INVALID_PARAMS: 'Invalid parameters provided',
  RECORD_NOT_FOUND: 'Record not found',
  DUPLICATE_ENTRY: 'Duplicate entry detected',
  VALIDATION_FAILED: 'Validation failed',
  UNAUTHORIZED: 'Unauthorized access',
  TIMEOUT: 'Database operation timed out'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Record created successfully',
  UPDATED: 'Record updated successfully',
  DELETED: 'Record deleted successfully',
  FOUND: 'Records found successfully'
} as const;
