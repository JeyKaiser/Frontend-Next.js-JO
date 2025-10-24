/**
 * Collections API Route
 * Handles CRUD operations for collections (T_COLECCIONES)
 */

import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100); // Cap at 100
    const anio = searchParams.get('anio') ? parseInt(searchParams.get('anio')!) : undefined;
    const codigo = searchParams.get('codigo');

    console.log('[API] Getting collections from Django backend:', { offset, limit, anio, codigo });
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // The Django API URL
    const djangoApiUrl = `${backendUrl}/api/colecciones/`;

    // Fetch data from Django backend
    const response = await fetch(djangoApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error from Django API: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid response format from Django API');
    }

    // The original code had logic for fetching a single collection by code.
    // The Django API returns all collections. I will filter by code here if needed.
    if (codigo) {
      const collection = data.find(c => c.id === codigo);
      return NextResponse.json({
        success: true,
        data: collection || null,
        found: !!collection
      });
    }
    
    // The original code had pagination. The Django API returns everything.
    // I will implement pagination here.
    const paginatedData = data.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedData,
      count: data.length,
      pagination: {
        offset,
        limit,
        hasMore: (offset + limit) < data.length
      },
      filters: { anio } // anio filter is not implemented in Django API yet
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
    
    console.log('[API] Creating collection via Django backend:', body);

    // The Django API URL
    const djangoApiUrl = `${backendUrl}/api/colecciones/`;

    // Transform the body to match what the Django API expects
    const transformedBody = {
      Code: body.CODIGO_COLECCION,
      Name: body.NOMBRE_COLECCION,
      U_GSP_SEASON: body.ANIO
    };

    // Call the Django backend
    const response = await fetch(djangoApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error from Django API: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: data.message || 'Collection created successfully',
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
