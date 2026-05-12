/**
 * Individual User API Route
 * Proxies GET, PUT and DELETE requests to the Django backend.
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface RouteParams {
  params: {
    id: string;
  };
}

async function proxyToBackend(request: NextRequest, path: string, method: string, body?: unknown) {
  const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    return NextResponse.json(
      { success: false, error: errorData.error || `Backend error: ${response.statusText}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data, { status: response.status === 201 ? 201 : 200 });
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!/^\d+$/.test(params.id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid user ID. Must be a number.' },
      { status: 400 }
    );
  }

  return proxyToBackend(request, `/api/users/${params.id}`, 'GET');
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  if (!/^\d+$/.test(params.id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid user ID. Must be a number.' },
      { status: 400 }
    );
  }

  const body = await request.json();
  return proxyToBackend(request, `/api/users/${params.id}`, 'PUT', body);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!/^\d+$/.test(params.id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid user ID. Must be a number.' },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const hard = searchParams.get('hard') === 'true' ? '?hard=true' : '';
  return proxyToBackend(request, `/api/users/${params.id}${hard}`, 'DELETE');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
