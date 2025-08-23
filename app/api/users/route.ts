/**
 * Users API Route - CRUD operations for user management
 * Handles operations for T_USUARIOS table in GARMENT_PRODUCTION_CONTROL schema
 */

import { NextRequest, NextResponse } from 'next/server';
import { GarmentProductionDAL } from '@/app/globals/lib/dal/garment-production';
import type { CreateUsuarioRequest, UpdateUsuarioRequest, Usuario } from '@/app/modules/types';
import { userEventEmitter, type UserChangeEvent } from './events/route';

/**
 * GET /api/users
 * List all users with optional filtering and pagination
 * Query params:
 * - offset: number (default: 0)
 * - limit: number (default: 50, max: 100)
 * - area: string (filter by area)
 * - rol: string (filter by role)
 * - estado: string (filter by status: 'ACTIVO' | 'INACTIVO')
 * - search: string (search in name, code, or email)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    
    // Filters
    const filters = {
      area: searchParams.get('area') || undefined,
      rol: searchParams.get('rol') || undefined,
      estado: searchParams.get('estado') || undefined,
      search: searchParams.get('search') || undefined
    };
    
    // Remove undefined values from filters
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined)
    );
    
    console.log('[API] Getting users:', { offset, limit, filters: cleanFilters });
    
    const result = await GarmentProductionDAL.getUsuarios(
      offset, 
      limit, 
      Object.keys(cleanFilters).length > 0 ? cleanFilters : undefined
    );
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: result.data || [],
      count: result.rowCount || 0,
      pagination: {
        offset,
        limit,
        hasMore: (result.data?.length || 0) === limit
      },
      filters: cleanFilters
    });
    
  } catch (error) {
    console.error('[API] Users GET error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to get users: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Create a new user
 * Body: CreateUsuarioRequest
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateUsuarioRequest = await request.json();
    
    console.log('[API] Creating user:', { ...body, EMAIL: body.EMAIL ? '[REDACTED]' : undefined });
    
    // Validate required fields
    const requiredFields = ['CODIGO_USUARIO', 'NOMBRE_COMPLETO', 'AREA', 'ROL'];
    const missingFields = requiredFields.filter(field => !body[field as keyof CreateUsuarioRequest]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Validate area and role values (you can expand these based on your business rules)
    const validAreas = ['DISEÑO', 'PRODUCCION', 'CALIDAD', 'TECNICO', 'PATRONAJE', 'COMERCIAL', 'OPERACIONES'];
    const validRoles = [
      'JEFE_OPERACIONES', 'DISEÑADOR_SENIOR', 'DISEÑADOR', 'CORTADOR_SENIOR', 
      'ESPECIALISTA_CALIDAD', 'INGENIERO_TEXTIL', 'PATRONISTA_SENIOR', 'ANALISTA_COSTOS'
    ];
    
    if (!validAreas.includes(body.AREA)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid area. Valid areas: ${validAreas.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    if (!validRoles.includes(body.ROL)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid role. Valid roles: ${validRoles.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Check if user code already exists
    const codeCheckResult = await GarmentProductionDAL.checkUsuarioCodeExists(body.CODIGO_USUARIO);
    
    if (!codeCheckResult.success) {
      return NextResponse.json(
        { success: false, error: codeCheckResult.error },
        { status: 500 }
      );
    }
    
    if (codeCheckResult.data?.[0]?.count > 0) {
      return NextResponse.json(
        { success: false, error: `User code '${body.CODIGO_USUARIO}' already exists` },
        { status: 409 } // Conflict
      );
    }
    
    // Create user
    const result = await GarmentProductionDAL.createUsuario({
      CODIGO_USUARIO: body.CODIGO_USUARIO,
      NOMBRE_COMPLETO: body.NOMBRE_COMPLETO,
      EMAIL: body.EMAIL,
      AREA: body.AREA,
      ROL: body.ROL,
      ESTADO: body.ESTADO || 'ACTIVO'
    });
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    // Emit user created event for real-time updates
    const newUserData: Usuario = {
      ID_USUARIO: result.data?.[0]?.ID_USUARIO || Date.now(), // Fallback ID
      CODIGO_USUARIO: body.CODIGO_USUARIO,
      NOMBRE_COMPLETO: body.NOMBRE_COMPLETO,
      EMAIL: body.EMAIL,
      AREA: body.AREA,
      ROL: body.ROL,
      ESTADO: body.ESTADO || 'ACTIVO',
      FECHA_CREACION: new Date().toISOString()
    };
    
    try {
      const event: UserChangeEvent = {
        type: 'user_created',
        userId: newUserData.ID_USUARIO,
        data: newUserData,
        timestamp: Date.now(),
        area: body.AREA
      };
      userEventEmitter.broadcast(event);
    } catch (sseError) {
      console.warn('[SSE] Failed to broadcast user created event:', sseError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: newUserData,
      executionTime: result.executionTime
    }, { status: 201 });
    
  } catch (error) {
    console.error('[API] Users POST error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to create user: ${(error as Error).message}` },
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}