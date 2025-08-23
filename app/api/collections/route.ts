/**
 * Collections API Route
 * Handles CRUD operations for collections (T_COLECCIONES)
 */

import { NextRequest, NextResponse } from 'next/server';
import { GarmentProductionDAL } from '@/app/globals/lib/dal/garment-production';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100); // Cap at 100
    const anio = searchParams.get('anio') ? parseInt(searchParams.get('anio')!) : undefined;
    const codigo = searchParams.get('codigo');

    console.log('[API] Getting collections:', { offset, limit, anio, codigo });

    // If specific collection code is requested
    if (codigo) {
      const result = await GarmentProductionDAL.getColeccionByCode(codigo);
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.data?.[0] || null,
        found: (result.data?.length || 0) > 0
      });
    }

    // Get collections with pagination
    const result = await GarmentProductionDAL.getColecciones(offset, limit, anio);
    
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
      filters: { anio }
    });

  } catch (error) {
    console.error('[API] Collections GET error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to get collections: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[API] Creating collection:', body);

    // Validate required fields
    const requiredFields = ['CODIGO_COLECCION', 'NOMBRE_COLECCION', 'TEMPORADA', 'ANIO', 'FECHA_INICIO', 'USUARIO_CREACION'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Set defaults
    const coleccionData = {
      ...body,
      ESTADO: body.ESTADO || 'ACTIVA',
      USUARIO_MODIFICACION: body.USUARIO_CREACION
    };

    const result = await GarmentProductionDAL.createColeccion(coleccionData);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Collection created successfully',
      executionTime: result.executionTime
    }, { status: 201 });

  } catch (error) {
    console.error('[API] Collections POST error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to create collection: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
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
