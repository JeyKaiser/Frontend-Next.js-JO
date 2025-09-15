import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8000/api/fases';

export async function GET(
  request: NextRequest,
  { params }: { params: { collectionId: string; referenciaId: string; fasesSlug: string } }
) {
  const { collectionId, referenciaId, fasesSlug } = params;
  const apiUrl = `${BACKEND_URL}/${collectionId}/${referenciaId}/${fasesSlug}/`;

  try {
    console.log(`[API Fases Proxy] Forwarding request to Django backend: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[API Fases Proxy] Django backend error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Backend error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[API Fases Proxy] Success from Django backend for phase ${fasesSlug}`);
    
    return NextResponse.json(data);

  } catch (error) {
    console.error(`[API Fases Proxy] Error connecting to Django backend:`, error);
    return NextResponse.json(
      { error: `Failed to connect to backend: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
