import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8000/api/sap/sentido_sesgos/';

export async function GET() {
  try {
    const response = await fetch(BACKEND_URL);
    if (!response.ok) {
      return NextResponse.json({ error: `Backend error: ${response.statusText}` }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
