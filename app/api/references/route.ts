/**
 * References API Route
 * Handles CRUD operations for references/products (T_REFERENCIAS)
 */

import { NextRequest, NextResponse } from 'next/server';
import { GarmentProductionDAL } from '@/app/globals/lib/dal/garment-production';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coleccionId = searchParams.get('coleccionId') ? parseInt(searchParams.get('coleccionId')!) : undefined;
    const codigo = searchParams.get('codigo');
    const search = searchParams.get('search');
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    // Filters
    const filters = {
      temporada: searchParams.get('temporada') || undefined,
      anio: searchParams.get('anio') ? parseInt(searchParams.get('anio')!) : undefined,
      tipoprenda: searchParams.get('tipoprenda') || undefined,
      estado: searchParams.get('estado') || undefined,
      coleccionId
    };

    console.log('[API] Getting references:', { coleccionId, codigo, search, offset, limit, filters });

    // If specific reference code is requested
    if (codigo) {
      const result = await GarmentProductionDAL.getReferenciaByCode(codigo);
      
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

    // If search term is provided
    if (search) {
      const result = await GarmentProductionDAL.searchReferencias(search, filters);
      
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
        searchTerm: search,
        filters
      });
    }

    // Get references by collection
    if (coleccionId) {
      const result = await GarmentProductionDAL.getReferenciasByColeccion(coleccionId, offset, limit);
      
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
        coleccionId
      });
    }

    // Return error if no valid query parameters
    return NextResponse.json(
      { 
        success: false, 
        error: 'Please provide coleccionId, codigo, or search parameter' 
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('[API] References GET error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to get references: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[API] Creating reference:', body);

    // Validate required fields
    const requiredFields = [
      'CODIGO_REFERENCIA', 'ID_COLECCION', 'NOMBRE_REFERENCIA',
      'TIPO_PRENDA', 'CATEGORIA', 'GENERO', 'USUARIO_CREACION'
    ];
    
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
    const referenciaData = {
      ...body,
      ESTADO: body.ESTADO || 'ACTIVA'
    };

    const result = await GarmentProductionDAL.createReferencia(referenciaData);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reference created successfully',
      executionTime: result.executionTime
    }, { status: 201 });

  } catch (error) {
    console.error('[API] References POST error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to create reference: ${(error as Error).message}` },
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
