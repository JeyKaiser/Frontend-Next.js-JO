/**
 * Traceability API Route
 * Proxies traceability operations to the Django backend.
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface RouteParams {
  params: {
    referenciaId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    if (!/^\d+$/.test(params.referenciaId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid reference ID' },
        { status: 400 }
      );
    }

    const traceabilityUrl = `${BACKEND_BASE_URL}/api/referencias/${params.referenciaId}/trazabilidad/`;
    const currentPhaseUrl = `${BACKEND_BASE_URL}/api/referencias/${params.referenciaId}/trazabilidad/current/`;

    const [traceabilityResponse, currentPhaseResponse] = await Promise.all([
      fetch(traceabilityUrl, { headers: { Accept: 'application/json' } }),
      fetch(currentPhaseUrl, { headers: { Accept: 'application/json' } }),
    ]);

    if (!traceabilityResponse.ok) {
      const errorData = await traceabilityResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || `Backend error: ${traceabilityResponse.statusText}`,
        },
        { status: traceabilityResponse.status }
      );
    }

    const traceabilityData = await traceabilityResponse.json();
    const currentPhase = currentPhaseResponse.ok ? await currentPhaseResponse.json() : null;

    return NextResponse.json({
      success: true,
      data: {
        referenciaId: params.referenciaId,
        traceability: traceabilityData || [],
        currentPhase,
        totalPhases: traceabilityData?.length || 0,
        completedPhases: traceabilityData?.filter(
          (item: { ESTADO?: string; estado?: string }) =>
            String(item.ESTADO || item.estado || '').toLowerCase() === 'completado'
        ).length || 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Failed to get traceability: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    if (!/^\d+$/.test(params.referenciaId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid reference ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const response = await fetch(
      `${BACKEND_BASE_URL}/api/referencias/${params.referenciaId}/trazabilidad/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || `Backend error: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Failed to create traceability record: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
