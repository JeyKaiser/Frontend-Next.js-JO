import { NextResponse } from 'next/server';

export async function GET() {
  console.log('API route /api/sap/prendas called');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  console.log('Backend URL:', backendUrl);
  try {
    const response = await fetch(`${backendUrl}/api/sap/prendas/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Error data:', errorData);
      return NextResponse.json(
        { error: errorData.detail || 'Error al obtener los datos' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Data fetched:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching prendas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}