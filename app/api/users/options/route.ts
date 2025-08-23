/**
 * User Options API Route
 * Provides valid options for user fields (areas, roles, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/app/globals/lib/database';

/**
 * GET /api/users/options
 * Get available options for user fields
 * Returns: areas, roles, and their counts from the database
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[API] Getting user options');
    
    // Get distinct areas with counts
    const areasResult = await executeQuery(`
      SELECT 
        AREA,
        COUNT(*) as USER_COUNT
      FROM GARMENT_PRODUCTION_CONTROL.T_USUARIOS 
      WHERE ESTADO = 'ACTIVO'
      GROUP BY AREA 
      ORDER BY AREA ASC
    `);
    
    // Get distinct roles with counts
    const rolesResult = await executeQuery(`
      SELECT 
        ROL,
        COUNT(*) as USER_COUNT
      FROM GARMENT_PRODUCTION_CONTROL.T_USUARIOS 
      WHERE ESTADO = 'ACTIVO'
      GROUP BY ROL 
      ORDER BY ROL ASC
    `);
    
    // Get user status counts
    const statusResult = await executeQuery(`
      SELECT 
        ESTADO,
        COUNT(*) as USER_COUNT
      FROM GARMENT_PRODUCTION_CONTROL.T_USUARIOS 
      GROUP BY ESTADO 
      ORDER BY ESTADO ASC
    `);
    
    // Static valid options (for validation)
    const validAreas = [
      'DISEÑO', 
      'PRODUCCION', 
      'CALIDAD', 
      'TECNICO', 
      'PATRONAJE', 
      'COMERCIAL', 
      'OPERACIONES'
    ];
    
    const validRoles = [
      'JEFE_OPERACIONES',
      'DISEÑADOR_SENIOR', 
      'DISEÑADOR',
      'CORTADOR_SENIOR',
      'ESPECIALISTA_CALIDAD',
      'INGENIERO_TEXTIL',
      'PATRONISTA_SENIOR',
      'ANALISTA_COSTOS'
    ];
    
    const validEstados = ['ACTIVO', 'INACTIVO'];
    
    // Build response
    const response = {
      success: true,
      data: {
        // Current data from database
        currentAreas: areasResult.success ? areasResult.data : [],
        currentRoles: rolesResult.success ? rolesResult.data : [],
        statusCounts: statusResult.success ? statusResult.data : [],
        
        // Valid options for forms
        validAreas,
        validRoles,
        validEstados,
        
        // Role descriptions for UI
        roleDescriptions: {
          'JEFE_OPERACIONES': 'Responsable de operaciones generales',
          'DISEÑADOR_SENIOR': 'Diseñador con experiencia senior',
          'DISEÑADOR': 'Diseñador de prendas',
          'CORTADOR_SENIOR': 'Especialista en corte senior',
          'ESPECIALISTA_CALIDAD': 'Control y aseguramiento de calidad',
          'INGENIERO_TEXTIL': 'Especialista técnico en textiles',
          'PATRONISTA_SENIOR': 'Especialista en patronaje senior',
          'ANALISTA_COSTOS': 'Análisis de costos y pricing'
        },
        
        // Area descriptions for UI
        areaDescriptions: {
          'DISEÑO': 'Área de diseño y desarrollo creativo',
          'PRODUCCION': 'Área de producción y manufactura',
          'CALIDAD': 'Control y aseguramiento de calidad',
          'TECNICO': 'Área técnica y de ingeniería',
          'PATRONAJE': 'Desarrollo de patrones y moldería',
          'COMERCIAL': 'Área comercial y de costos',
          'OPERACIONES': 'Operaciones generales y coordinación'
        }
      },
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('[API] User options error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to get user options: ${(error as Error).message}` 
      },
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS for CORS
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}