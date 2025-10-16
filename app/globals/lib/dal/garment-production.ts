/**
 * Data Access Layer for Garment Production Control System
 * SAP HANA optimized queries for production tracking and traceability
 * Schema: GARMENT_PRODUCTION_CONTROL
 */

import { executeQuery, executeTransaction, QueryResult } from '../database';

// Type definitions based on database schema
export interface Coleccion {
  ID_COLECCION: number;
  CODIGO_COLECCION: string;
  NOMBRE_COLECCION: string;
  TEMPORADA: string;
  ANIO: number;
  FECHA_INICIO: Date;
  FECHA_FIN?: Date;
  ESTADO: string;
  OBSERVACIONES?: string;
  FECHA_CREACION: Date;
  USUARIO_CREACION: string;
  FECHA_MODIFICACION: Date;
  USUARIO_MODIFICACION: string;
}

export interface Referencia {
  ID_REFERENCIA: number;
  CODIGO_REFERENCIA: string;
  ID_COLECCION: number;
  NOMBRE_REFERENCIA: string;
  DESCRIPCION?: string;
  TIPO_PRENDA: string;
  CATEGORIA: string;
  GENERO: string;
  TALLA?: string;
  COLOR_PRINCIPAL?: string;
  MATERIAL_PRINCIPAL?: string;
  PRECIO_OBJETIVO?: number;
  ESTADO: string;
  FECHA_CREACION: Date;
  USUARIO_CREACION: string;
}

export interface Fase {
  ID_FASE: number;
  CODIGO_FASE: string;
  NOMBRE_FASE: string;
  DESCRIPCION?: string;
  ETAPA: string;
  ORDEN_SECUENCIA: number;
  AREA_RESPONSABLE: string;
  TIEMPO_ESTIMADO_HORAS: number;
  TIEMPO_MAXIMO_HORAS: number;
  ESTADO: string;
  FECHA_CREACION: Date;
  USUARIO_CREACION: string;
}

export interface Trazabilidad {
  ID_TRAZABILIDAD: number;
  ID_REFERENCIA: number;
  ID_FASE: number;
  ID_USUARIO_RESPONSABLE: number;
  FECHA_INICIO: Date;
  FECHA_FIN?: Date;
  ESTADO: string;
  OBSERVACIONES?: string;
  ARCHIVOS_ADJUNTOS?: string;
  TIEMPO_REAL_HORAS?: number;
  CALIFICACION?: number;
  FECHA_CREACION: Date;
}

export interface Usuario {
  ID_USUARIO: number;
  CODIGO_USUARIO: string;
  NOMBRE_COMPLETO: string;
  EMAIL?: string;
  AREA: string;
  ROL: string;
  ESTADO: string;
  FECHA_CREACION: Date;
}

// Garment Production Data Access Layer
export class GarmentProductionDAL {
  
  // ==========================================
  // COLECCIONES (Collections)
  // ==========================================
  
  /**
   * Get all collections with pagination
   */
  static async getColecciones(offset: number = 0, limit: number = 50, anio?: number): Promise<QueryResult> {
    let sql = `
      SELECT 
        ID_COLECCION,
        CODIGO_COLECCION,
        NOMBRE_COLECCION,
        TEMPORADA,
        ANIO,
        FECHA_INICIO,
        FECHA_FIN,
        ESTADO,
        OBSERVACIONES,
        FECHA_CREACION,
        USUARIO_CREACION
      FROM GARMENT_PRODUCTION_CONTROL.T_COLECCIONES
    `;
    
    const params: any[] = [];
    
    if (anio) {
      sql += ` WHERE ANIO = ?`;
      params.push(anio);
    }
    
    sql += ` ORDER BY ANIO DESC, FECHA_CREACION DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    return await executeQuery(sql, params);
  }
  
  /**
   * Get collection by code
   */
  static async getColeccionByCode(codigoColeccion: string): Promise<QueryResult> {
    const sql = `
      SELECT * FROM GARMENT_PRODUCTION_CONTROL.T_COLECCIONES 
      WHERE CODIGO_COLECCION = ?
    `;
    return await executeQuery(sql, [codigoColeccion]);
  }
  
  /**
   * Create new collection
   */
  static async createColeccion(coleccion: Omit<Coleccion, 'ID_COLECCION' | 'FECHA_CREACION' | 'FECHA_MODIFICACION'>): Promise<QueryResult> {
    const sql = `
      INSERT INTO GARMENT_PRODUCTION_CONTROL.T_COLECCIONES (
        CODIGO_COLECCION, NOMBRE_COLECCION, TEMPORADA, ANIO, 
        FECHA_INICIO, FECHA_FIN, ESTADO, OBSERVACIONES, USUARIO_CREACION, USUARIO_MODIFICACION
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      coleccion.CODIGO_COLECCION,
      coleccion.NOMBRE_COLECCION,
      coleccion.TEMPORADA,
      coleccion.ANIO,
      coleccion.FECHA_INICIO,
      coleccion.FECHA_FIN || null,
      coleccion.ESTADO,
      coleccion.OBSERVACIONES || null,
      coleccion.USUARIO_CREACION,
      coleccion.USUARIO_MODIFICACION
    ];
    
    return await executeQuery(sql, params);
  }
  
  // ==========================================
  // REFERENCIAS (References/Products)
  // ==========================================
  
  /**
   * Get references by collection
   */
  static async getReferenciasByColeccion(idColeccion: number, offset: number = 0, limit: number = 50): Promise<QueryResult> {
    const sql = `
      SELECT 
        r.ID_REFERENCIA,
        r.CODIGO_REFERENCIA,
        r.NOMBRE_REFERENCIA,
        r.DESCRIPCION,
        r.TIPO_PRENDA,
        r.CATEGORIA,
        r.GENERO,
        r.TALLA,
        r.COLOR_PRINCIPAL,
        r.MATERIAL_PRINCIPAL,
        r.PRECIO_OBJETIVO,
        r.ESTADO,
        r.FECHA_CREACION,
        r.USUARIO_CREACION,
        c.CODIGO_COLECCION,
        c.NOMBRE_COLECCION,
        c.TEMPORADA,
        c.ANIO
      FROM GARMENT_PRODUCTION_CONTROL.T_REFERENCIAS r
      INNER JOIN GARMENT_PRODUCTION_CONTROL.T_COLECCIONES c ON r.ID_COLECCION = c.ID_COLECCION
      WHERE r.ID_COLECCION = ?
      ORDER BY r.FECHA_CREACION DESC
      LIMIT ? OFFSET ?
    `;
    
    return await executeQuery(sql, [idColeccion, limit, offset]);
  }
  
  /**
   * Get reference by code
   */
  static async getReferenciaByCode(codigoReferencia: string): Promise<QueryResult> {
    const sql = `
      SELECT 
        r.*,
        c.CODIGO_COLECCION,
        c.NOMBRE_COLECCION,
        c.TEMPORADA,
        c.ANIO
      FROM GARMENT_PRODUCTION_CONTROL.T_REFERENCIAS r
      INNER JOIN GARMENT_PRODUCTION_CONTROL.T_COLECCIONES c ON r.ID_COLECCION = c.ID_COLECCION
      WHERE r.CODIGO_REFERENCIA = ?
    `;
    
    return await executeQuery(sql, [codigoReferencia]);
  }
  
  /**
   * Search references by multiple criteria
   */
  static async searchReferencias(searchTerm: string, filters?: {
    coleccionId?: number;
    temporada?: string;
    anio?: number;
    tipoprenda?: string;
    estado?: string;
  }): Promise<QueryResult> {
    let sql = `
      SELECT 
        r.*,
        c.CODIGO_COLECCION,
        c.NOMBRE_COLECCION,
        c.TEMPORADA,
        c.ANIO
      FROM GARMENT_PRODUCTION_CONTROL.T_REFERENCIAS r
      INNER JOIN GARMENT_PRODUCTION_CONTROL.T_COLECCIONES c ON r.ID_COLECCION = c.ID_COLECCION
      WHERE (
        UPPER(r.CODIGO_REFERENCIA) LIKE UPPER(?)
        OR UPPER(r.NOMBRE_REFERENCIA) LIKE UPPER(?)
        OR UPPER(r.DESCRIPCION) LIKE UPPER(?)
      )
    `;
    
    const params = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];
    
    if (filters?.coleccionId) {
      sql += ` AND r.ID_COLECCION = ?`;
      params.push(filters.coleccionId);
    }
    
    if (filters?.temporada) {
      sql += ` AND c.TEMPORADA = ?`;
      params.push(filters.temporada);
    }
    
    if (filters?.anio) {
      sql += ` AND c.ANIO = ?`;
      params.push(filters.anio);
    }
    
    if (filters?.tipoprenda) {
      sql += ` AND r.TIPO_PRENDA = ?`;
      params.push(filters.tipoprenda);
    }
    
    if (filters?.estado) {
      sql += ` AND r.ESTADO = ?`;
      params.push(filters.estado);
    }
    
    sql += ` ORDER BY r.FECHA_CREACION DESC LIMIT 100`;
    
    return await executeQuery(sql, params);
  }
  
  /**
   * Create new reference
   */
  static async createReferencia(referencia: Omit<Referencia, 'ID_REFERENCIA' | 'FECHA_CREACION'>): Promise<QueryResult> {
    const sql = `
      INSERT INTO GARMENT_PRODUCTION_CONTROL.T_REFERENCIAS (
        CODIGO_REFERENCIA, ID_COLECCION, NOMBRE_REFERENCIA, DESCRIPCION,
        TIPO_PRENDA, CATEGORIA, GENERO, TALLA, COLOR_PRINCIPAL,
        MATERIAL_PRINCIPAL, PRECIO_OBJETIVO, ESTADO, USUARIO_CREACION
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      referencia.CODIGO_REFERENCIA,
      referencia.ID_COLECCION,
      referencia.NOMBRE_REFERENCIA,
      referencia.DESCRIPCION || null,
      referencia.TIPO_PRENDA,
      referencia.CATEGORIA,
      referencia.GENERO,
      referencia.TALLA || null,
      referencia.COLOR_PRINCIPAL || null,
      referencia.MATERIAL_PRINCIPAL || null,
      referencia.PRECIO_OBJETIVO || null,
      referencia.ESTADO,
      referencia.USUARIO_CREACION
    ];
    
    return await executeQuery(sql, params);
  }
  
  // ==========================================
  // FASES (Process Phases)
  // ==========================================
  
  /**
   * Get all phases ordered by sequence
   */
  static async getFases(etapa?: string): Promise<QueryResult> {
    let sql = `
      SELECT * FROM GARMENT_PRODUCTION_CONTROL.T_FASES
    `;
    
    const params: any[] = [];
    
    if (etapa) {
      sql += ` WHERE ETAPA = ?`;
      params.push(etapa);
    }
    
    sql += ` ORDER BY ORDEN_SECUENCIA ASC`;
    
    return await executeQuery(sql, params);
  }
  
  /**
   * Get phase by code
   */
  static async getFaseByCode(codigoFase: string): Promise<QueryResult> {
    const sql = `
      SELECT * FROM GARMENT_PRODUCTION_CONTROL.T_FASES 
      WHERE CODIGO_FASE = ?
    `;
    return await executeQuery(sql, [codigoFase]);
  }
  
  // ==========================================
  // TRAZABILIDAD (Traceability)
  // ==========================================
  
  /**
   * Get traceability for a specific reference
   */
  static async getTrazabilidadByReferencia(idReferencia: number): Promise<QueryResult> {
    const sql = `
      SELECT 
        t.*,
        f.CODIGO_FASE,
        f.NOMBRE_FASE,
        f.ETAPA,
        f.ORDEN_SECUENCIA,
        f.AREA_RESPONSABLE,
        f.TIEMPO_ESTIMADO_HORAS,
        u.CODIGO_USUARIO,
        u.NOMBRE_COMPLETO,
        u.AREA as USUARIO_AREA
      FROM GARMENT_PRODUCTION_CONTROL.T_TRAZABILIDAD t
      INNER JOIN GARMENT_PRODUCTION_CONTROL.T_FASES f ON t.ID_FASE = f.ID_FASE
      INNER JOIN GARMENT_PRODUCTION_CONTROL.T_USUARIOS u ON t.ID_USUARIO_RESPONSABLE = u.ID_USUARIO
      WHERE t.ID_REFERENCIA = ?
      ORDER BY f.ORDEN_SECUENCIA ASC, t.FECHA_INICIO ASC
    `;
    
    return await executeQuery(sql, [idReferencia]);
  }
  
  /**
   * Get current phase for a reference
   */
  static async getCurrentPhaseForReferencia(idReferencia: number): Promise<QueryResult> {
    const sql = `
      SELECT 
        t.*,
        f.CODIGO_FASE,
        f.NOMBRE_FASE,
        f.ETAPA,
        f.ORDEN_SECUENCIA,
        f.AREA_RESPONSABLE
      FROM GARMENT_PRODUCTION_CONTROL.T_TRAZABILIDAD t
      INNER JOIN GARMENT_PRODUCTION_CONTROL.T_FASES f ON t.ID_FASE = f.ID_FASE
      WHERE t.ID_REFERENCIA = ? AND t.ESTADO IN ('INICIADO', 'EN_PROCESO')
      ORDER BY f.ORDEN_SECUENCIA DESC
      LIMIT 1
    `;
    
    return await executeQuery(sql, [idReferencia]);
  }
  
  /**
   * Create traceability record
   */
  static async createTrazabilidad(trazabilidad: Omit<Trazabilidad, 'ID_TRAZABILIDAD' | 'FECHA_CREACION'>): Promise<QueryResult> {
    const sql = `
      INSERT INTO GARMENT_PRODUCTION_CONTROL.T_TRAZABILIDAD (
        ID_REFERENCIA, ID_FASE, ID_USUARIO_RESPONSABLE, FECHA_INICIO,
        FECHA_FIN, ESTADO, OBSERVACIONES, ARCHIVOS_ADJUNTOS,
        TIEMPO_REAL_HORAS, CALIFICACION
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      trazabilidad.ID_REFERENCIA,
      trazabilidad.ID_FASE,
      trazabilidad.ID_USUARIO_RESPONSABLE,
      trazabilidad.FECHA_INICIO,
      trazabilidad.FECHA_FIN || null,
      trazabilidad.ESTADO,
      trazabilidad.OBSERVACIONES || null,
      trazabilidad.ARCHIVOS_ADJUNTOS || null,
      trazabilidad.TIEMPO_REAL_HORAS || null,
      trazabilidad.CALIFICACION || null
    ];
    
    return await executeQuery(sql, params);
  }
  
  /**
   * Update traceability record
   */
  static async updateTrazabilidad(idTrazabilidad: number, updates: Partial<Trazabilidad>): Promise<QueryResult> {
    const setClauses: string[] = [];
    const params: any[] = [];
    
    if (updates.FECHA_FIN !== undefined) {
      setClauses.push('FECHA_FIN = ?');
      params.push(updates.FECHA_FIN);
    }
    
    if (updates.ESTADO !== undefined) {
      setClauses.push('ESTADO = ?');
      params.push(updates.ESTADO);
    }
    
    if (updates.OBSERVACIONES !== undefined) {
      setClauses.push('OBSERVACIONES = ?');
      params.push(updates.OBSERVACIONES);
    }
    
    if (updates.TIEMPO_REAL_HORAS !== undefined) {
      setClauses.push('TIEMPO_REAL_HORAS = ?');
      params.push(updates.TIEMPO_REAL_HORAS);
    }
    
    if (updates.CALIFICACION !== undefined) {
      setClauses.push('CALIFICACION = ?');
      params.push(updates.CALIFICACION);
    }
    
    if (setClauses.length === 0) {
      return { success: false, error: 'No fields to update' };
    }
    
    const sql = `
      UPDATE GARMENT_PRODUCTION_CONTROL.T_TRAZABILIDAD 
      SET ${setClauses.join(', ')}
      WHERE ID_TRAZABILIDAD = ?
    `;
    
    params.push(idTrazabilidad);
    
    return await executeQuery(sql, params);
  }
  
  // ==========================================
  // USUARIOS (Users)
  // ==========================================
  
  /**
   * Get users by area
   */
  static async getUsuariosByArea(area: string): Promise<QueryResult> {
    const sql = `
      SELECT * FROM GARMENT_PRODUCTION_CONTROL.T_USUARIOS 
      WHERE AREA = ? AND ESTADO = 'ACTIVO'
      ORDER BY NOMBRE_COMPLETO ASC
    `;
    
    return await executeQuery(sql, [area]);
  }
  
  /**
   * Get user by code
   */
  static async getUsuarioByCode(codigoUsuario: string): Promise<QueryResult> {
    const sql = `
      SELECT * FROM GARMENT_PRODUCTION_CONTROL.T_USUARIOS 
      WHERE CODIGO_USUARIO = ?
    `;
    
    return await executeQuery(sql, [codigoUsuario]);
  }
  
  /**
   * Get all users with pagination
   */
  static async getUsuarios(offset: number = 0, limit: number = 50, filters?: {
    area?: string;
    rol?: string;
    estado?: string;
    search?: string;
  }): Promise<QueryResult> {
    let sql = `
      SELECT 
        ID_USUARIO,
        CODIGO_USUARIO,
        NOMBRE_COMPLETO,
        EMAIL,
        AREA,
        ROL,
        ESTADO,
        FECHA_CREACION
      FROM GARMENT_PRODUCTION_CONTROL.T_USUARIOS
    `;
    
    const params: any[] = [];
    const whereConditions: string[] = [];
    
    if (filters) {
      if (filters.area) {
        whereConditions.push('AREA = ?');
        params.push(filters.area);
      }
      
      if (filters.rol) {
        whereConditions.push('ROL = ?');
        params.push(filters.rol);
      }
      
      if (filters.estado) {
        whereConditions.push('ESTADO = ?');
        params.push(filters.estado);
      }
      
      if (filters.search) {
        whereConditions.push('(NOMBRE_COMPLETO LIKE ? OR CODIGO_USUARIO LIKE ? OR EMAIL LIKE ?)');
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }
    }
    
    if (whereConditions.length > 0) {
      sql += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    sql += ` ORDER BY NOMBRE_COMPLETO ASC LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    return await executeQuery(sql, params);
  }
  
  /**
   * Get user by ID
   */
  static async getUsuarioById(idUsuario: number): Promise<QueryResult> {
    const sql = `
      SELECT * FROM GARMENT_PRODUCTION_CONTROL.T_USUARIOS 
      WHERE ID_USUARIO = ?
    `;
    
    return await executeQuery(sql, [idUsuario]);
  }
  
  /**
   * Create new user
   */
  static async createUsuario(usuario: {
    CODIGO_USUARIO: string;
    NOMBRE_COMPLETO: string;
    EMAIL?: string;
    AREA: string;
    ROL: string;
    ESTADO?: string;
  }): Promise<QueryResult> {
    const sql = `
      INSERT INTO GARMENT_PRODUCTION_CONTROL.T_USUARIOS (
        CODIGO_USUARIO, NOMBRE_COMPLETO, EMAIL, AREA, ROL, ESTADO
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      usuario.CODIGO_USUARIO,
      usuario.NOMBRE_COMPLETO,
      usuario.EMAIL || null,
      usuario.AREA,
      usuario.ROL,
      usuario.ESTADO || 'ACTIVO'
    ];
    
    return await executeQuery(sql, params);
  }
  
  /**
   * Update user
   */
  static async updateUsuario(idUsuario: number, updates: {
    CODIGO_USUARIO?: string;
    NOMBRE_COMPLETO?: string;
    EMAIL?: string;
    AREA?: string;
    ROL?: string;
    ESTADO?: string;
  }): Promise<QueryResult> {
    const updateFields: string[] = [];
    const params: any[] = [];
    
    if (updates.CODIGO_USUARIO !== undefined) {
      updateFields.push('CODIGO_USUARIO = ?');
      params.push(updates.CODIGO_USUARIO);
    }
    
    if (updates.NOMBRE_COMPLETO !== undefined) {
      updateFields.push('NOMBRE_COMPLETO = ?');
      params.push(updates.NOMBRE_COMPLETO);
    }
    
    if (updates.EMAIL !== undefined) {
      updateFields.push('EMAIL = ?');
      params.push(updates.EMAIL);
    }
    
    if (updates.AREA !== undefined) {
      updateFields.push('AREA = ?');
      params.push(updates.AREA);
    }
    
    if (updates.ROL !== undefined) {
      updateFields.push('ROL = ?');
      params.push(updates.ROL);
    }
    
    if (updates.ESTADO !== undefined) {
      updateFields.push('ESTADO = ?');
      params.push(updates.ESTADO);
    }
    
    if (updateFields.length === 0) {
      return { success: false, error: 'No fields to update' };
    }
    
    params.push(idUsuario);
    
    const sql = `
      UPDATE GARMENT_PRODUCTION_CONTROL.T_USUARIOS 
      SET ${updateFields.join(', ')}
      WHERE ID_USUARIO = ?
    `;
    
    return await executeQuery(sql, params);
  }
  
  /**
   * Delete user (soft delete by setting ESTADO = 'INACTIVO')
   */
  static async deleteUsuario(idUsuario: number): Promise<QueryResult> {
    const sql = `
      UPDATE GARMENT_PRODUCTION_CONTROL.T_USUARIOS 
      SET ESTADO = 'INACTIVO'
      WHERE ID_USUARIO = ?
    `;
    
    return await executeQuery(sql, [idUsuario]);
  }
  
  /**
   * Hard delete user (use with caution)
   */
  static async hardDeleteUsuario(idUsuario: number): Promise<QueryResult> {
    const sql = `
      DELETE FROM GARMENT_PRODUCTION_CONTROL.T_USUARIOS 
      WHERE ID_USUARIO = ?
    `;
    
    return await executeQuery(sql, [idUsuario]);
  }
  
  /**
   * Check if user code exists
   */
  static async checkUsuarioCodeExists(codigoUsuario: string, excludeId?: number): Promise<QueryResult> {
    let sql = `
      SELECT COUNT(*) as count FROM GARMENT_PRODUCTION_CONTROL.T_USUARIOS 
      WHERE CODIGO_USUARIO = ?
    `;
    
    const params = [codigoUsuario];
    
    if (excludeId) {
      sql += ' AND ID_USUARIO != ?';
      params.push(excludeId);
    }
    
    return await executeQuery(sql, params);
  }
  
  // ==========================================
  // ANALYTICS & REPORTS
  // ==========================================
  
  /**
   * Get production summary by collection
   */
  static async getProductionSummary(idColeccion: number): Promise<QueryResult> {
    const sql = `
      SELECT 
        r.CODIGO_REFERENCIA,
        r.NOMBRE_REFERENCIA,
        COUNT(DISTINCT t.ID_FASE) as FASES_COMPLETADAS,
        (SELECT COUNT(*) FROM GARMENT_PRODUCTION_CONTROL.T_FASES WHERE ESTADO = 'ACTIVA') as TOTAL_FASES,
        MAX(CASE WHEN t.ESTADO = 'COMPLETADO' THEN f.ORDEN_SECUENCIA ELSE 0 END) as ULTIMA_FASE_COMPLETADA,
        MIN(t.FECHA_INICIO) as FECHA_INICIO_PRODUCCION,
        MAX(CASE WHEN t.ESTADO = 'COMPLETADO' THEN t.FECHA_FIN ELSE NULL END) as FECHA_ULTIMA_FASE
      FROM GARMENT_PRODUCTION_CONTROL.T_REFERENCIAS r
      LEFT JOIN GARMENT_PRODUCTION_CONTROL.T_TRAZABILIDAD t ON r.ID_REFERENCIA = t.ID_REFERENCIA
      LEFT JOIN GARMENT_PRODUCTION_CONTROL.T_FASES f ON t.ID_FASE = f.ID_FASE
      WHERE r.ID_COLECCION = ?
      GROUP BY r.ID_REFERENCIA, r.CODIGO_REFERENCIA, r.NOMBRE_REFERENCIA
      ORDER BY r.CODIGO_REFERENCIA ASC
    `;
    
    return await executeQuery(sql, [idColeccion]);
  }
  
  /**
   * Get phase performance metrics
   */
  static async getPhasePerformanceMetrics(idFase?: number, dateFrom?: string, dateTo?: string): Promise<QueryResult> {
    let sql = `
      SELECT 
        f.CODIGO_FASE,
        f.NOMBRE_FASE,
        f.TIEMPO_ESTIMADO_HORAS,
        COUNT(*) as TOTAL_EJECUCIONES,
        AVG(t.TIEMPO_REAL_HORAS) as TIEMPO_PROMEDIO_REAL,
        MIN(t.TIEMPO_REAL_HORAS) as TIEMPO_MINIMO,
        MAX(t.TIEMPO_REAL_HORAS) as TIEMPO_MAXIMO,
        AVG(t.CALIFICACION) as CALIFICACION_PROMEDIO,
        SUM(CASE WHEN t.TIEMPO_REAL_HORAS <= f.TIEMPO_ESTIMADO_HORAS THEN 1 ELSE 0 END) as DENTRO_TIEMPO_ESTIMADO,
        SUM(CASE WHEN t.ESTADO = 'COMPLETADO' THEN 1 ELSE 0 END) as COMPLETADOS
      FROM GARMENT_PRODUCTION_CONTROL.T_FASES f
      LEFT JOIN GARMENT_PRODUCTION_CONTROL.T_TRAZABILIDAD t ON f.ID_FASE = t.ID_FASE
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    if (idFase) {
      sql += ` AND f.ID_FASE = ?`;
      params.push(idFase);
    }
    
    if (dateFrom) {
      sql += ` AND t.FECHA_INICIO >= ?`;
      params.push(dateFrom);
    }
    
    if (dateTo) {
      sql += ` AND t.FECHA_INICIO <= ?`;
      params.push(dateTo);
    }
    
    sql += `
      GROUP BY f.ID_FASE, f.CODIGO_FASE, f.NOMBRE_FASE, f.TIEMPO_ESTIMADO_HORAS
      ORDER BY f.ORDEN_SECUENCIA ASC
    `;
    
    return await executeQuery(sql, params);
  }
}

// Export default
export default GarmentProductionDAL;
