import { NextResponse } from 'next/server';

const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/health/`;

export async function GET() {
  try {
    console.log('[API Health] Forwarding request to backend:', BACKEND_URL);
    
    const response = await fetch(BACKEND_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || `Backend error: ${response.statusText}`,
          timestamp: new Date().toISOString()
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[API Health] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: `Health check failed: ${(error as Error).message}`,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
