/**
 * Traceability API Route for specific reference
 * Handles traceability operations for references (T_TRAZABILIDAD)
 */

import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    referenciaId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const referenciaId = parseInt(params.referenciaId);
    
    if (isNaN(referenciaId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid reference ID' },
        { status: 400 }
      );
    }

    console.log('[API] Getting traceability for reference from Django backend:', referenciaId);

    const traceabilityUrl = `http://localhost:8000/costeo/referencias/${referenciaId}/trazabilidad/`;
    const currentPhaseUrl = `http://localhost:8000/costeo/referencias/${referenciaId}/trazabilidad/current/`;

    const [traceabilityResponse, currentPhaseResponse] = await Promise.all([
      fetch(traceabilityUrl),
      fetch(currentPhaseUrl)
    ]);

    if (!traceabilityResponse.ok) {
      const errorData = await traceabilityResponse.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error from Django API (traceability): ${traceabilityResponse.status}`);
    }
    
    const traceabilityData = await traceabilityResponse.json();
    
    let currentPhase = null;
    if (currentPhaseResponse.ok) {
      currentPhase = await currentPhaseResponse.json();
    }

    return NextResponse.json({
      success: true,
      data: {
        referenciaId,
        traceability: traceabilityData || [],
        currentPhase,
        totalPhases: traceabilityData?.length || 0,
        completedPhases: traceabilityData?.filter(
          (t: any) => t.PhaseName === 'COMPLETADO' // This is a guess, the data structure is not clear
        ).length || 0
      }
    });

  } catch (error) {
    console.error('[API] Traceability GET error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to get traceability: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const referenciaId = parseInt(params.referenciaId);
    const body = await request.json();
    
    if (isNaN(referenciaId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid reference ID' },
        { status: 400 }
      );
    }

    console.log('[API] Creating traceability record for reference:', referenciaId, body);

    // Validate required fields
    const requiredFields = ['ID_FASE', 'ID_USUARIO_RESPONSABLE', 'FECHA_INICIO', 'ESTADO'];
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

    // Add reference ID to the data
    const trazabilidadData = {
      ...body,
      ID_REFERENCIA: referenciaId
    };

    const result = await GarmentProductionDAL.createTrazabilidad(trazabilidadData);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Traceability record created successfully',
      referenciaId,
      executionTime: result.executionTime
    }, { status: 201 });

  } catch (error) {
    console.error('[API] Traceability POST error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to create traceability record: ${(error as Error).message}` },
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
