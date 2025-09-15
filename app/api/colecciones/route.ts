/**
 * Collections API Route - Proxy to Django Backend
 * All database operations handled by Django backend on port 8000
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8000/api/colecciones/';

export async function GET() {
  try {
    console.log('[API Colecciones] Forwarding request to Django backend:', BACKEND_URL);

    const response = await fetch(BACKEND_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store', // Evita cache para obtener datos frescos
    });

    if (!response.ok) {
      console.error('[API Colecciones] Django backend error:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Backend error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[API Colecciones] Success from Django backend:', data.length, 'collections');
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('[API Colecciones] Error connecting to Django backend:', error);
    return NextResponse.json(
      { error: `Failed to connect to backend: ${(error as Error).message}` },
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