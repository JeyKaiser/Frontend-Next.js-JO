/**
 * References API Route
 * Handles CRUD operations for references/products (T_REFERENCIAS)
 */

import { NextRequest, NextResponse } from 'next/server';

const backendUrI = process.env.NEXT_PUBLIC_BACKEND_URL;

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
      const djangoApiUrl = `${backendUrI}/costeo/referencias/${codigo}/`;
      const response = await fetch(djangoApiUrl);

      if (!response.ok) {
        if (response.status === 404) {
          return NextResponse.json({
            success: true,
            data: null,
            found: false
          });
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error from Django API: ${response.status}`);
      }

      const data = await response.json();

      // Transform data to match what the frontend expects
      const transformedData = {
        CODIGO_REFERENCIA: data.U_GSP_REFERENCE,
        NOMBRE_REFERENCIA: data.U_GSP_Desc,
        ID_REFERENCIA: 0, // Not available
        ID_COLECCION: 0, // Not available from this endpoint, might need another call
        DESCRIPCION: data.U_GSP_Desc,
        TIPO_PRENDA: 'N/A', // Not available
        CATEGORIA: 'N/A', // Not available
        GENERO: 'N/A', // Not available
        ESTADO: 'ACTIVA', // Assuming active
        FECHA_CREACION: new Date().toISOString(), // Not available
        USUARIO_CREACION: 'N/A', // Not available
        img: data.U_GSP_Picture,
        CollectionName: data.CollectionName,
        SchemaName: data.SchemaName,
      };

      return NextResponse.json({
        success: true,
        data: transformedData,
        found: true
      });
    }

    // If search term is provided
    if (search) {
      const djangoApiUrl = `${backendUrI}/costeo/referencias/search/?search=${search}`;
      const response = await fetch(djangoApiUrl);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error from Django API: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format from Django API');
      }

      // Transform data to match what the frontend expects
      const transformedData = data.map((item: any) => ({
        CODIGO_REFERENCIA: item.U_GSP_REFERENCE,
        NOMBRE_REFERENCIA: item.U_GSP_Desc,
        ID_REFERENCIA: 0, // Not available
        ID_COLECCION: 0, // Not available from this endpoint
        DESCRIPCION: item.U_GSP_Desc,
        TIPO_PRENDA: 'N/A', // Not available
        CATEGORIA: 'N/A', // Not available
        GENERO: 'N/A', // Not available
        ESTADO: 'ACTIVA', // Assuming active
        FECHA_CREACION: new Date().toISOString(), // Not available
        USUARIO_CREACION: 'N/A', // Not available
        img: item.U_GSP_Picture,
        CollectionName: item.CollectionName,
      }));

      return NextResponse.json({
        success: true,
        data: transformedData,
        count: transformedData.length,
        searchTerm: search,
        filters
      });
    }

    // Get references by collection
    if (coleccionId) {
      const djangoApiUrl = `${backendUrI}/costeo/referencias-por-anio/${coleccionId}/`;
      const response = await fetch(djangoApiUrl);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error from Django API: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format from Django API');
      }

      // Transform data to match what the frontend expects
      const transformedData = data.map((item: any) => ({
        // Mapping what we can from the Django API response
        CODIGO_REFERENCIA: item.U_GSP_REFERENCE,
        NOMBRE_REFERENCIA: item.U_GSP_Desc,
        // The frontend expects more fields, which are not available in the Django API response.
        // Setting default/empty values for them.
        ID_REFERENCIA: 0, // Not available
        ID_COLECCION: coleccionId,
        DESCRIPCION: item.U_GSP_Desc,
        TIPO_PRENDA: 'N/A', // Not available
        CATEGORIA: 'N/A', // Not available
        GENERO: 'N/A', // Not available
        ESTADO: 'ACTIVA', // Assuming active
        FECHA_CREACION: new Date().toISOString(), // Not available
        USUARIO_CREACION: 'N/A', // Not available
        img: item.U_GSP_Picture, // Assuming this is an image url
      }));
      
      // The original code had pagination. The Django API returns everything.
      // I will implement pagination here.
      const paginatedData = transformedData.slice(offset, offset + limit);

      return NextResponse.json({
        success: true,
        data: paginatedData,
        count: transformedData.length,
        pagination: {
          offset,
          limit,
          hasMore: (offset + limit) < transformedData.length
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
    
    console.log('[API] Creating reference via Django backend:', body);

    // The Django API URL
    const djangoApiUrl = `${backendUrI}/costeo/referencias/`;

    // The Django API expects a different body, so I'm sending the original body for now.
    // This will likely fail, but it's a starting point for the refactoring.
    // The Django API needs to be updated to handle the fields sent by the frontend.
    
    // Call the Django backend
    const response = await fetch(djangoApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error from Django API: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: data.message || 'Reference created successfully',
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