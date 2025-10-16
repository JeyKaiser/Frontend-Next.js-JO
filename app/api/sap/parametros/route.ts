import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8000/api/sap/parametros/';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validar que todos los campos requeridos estén presentes
    const requiredFields = [
      'CODIGO', 'BASE_TEXTIL_ID', 'TELA_ID', 'PRINT_ID', 'HILO_DE_TELA_ID',
      'HILO_DE_MOLDE_ID', 'CANAL_TELA_ID', 'SENTIDO_SESGOS_ID', 
      'ROTACION_MOLDE_ID', 'RESTRICCIONES_ID'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `El campo ${field} es requerido` },
          { status: 400 }
        );
      }
    }

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: `Backend error: ${response.statusText}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
    
  } catch (error: unknown) {
    console.error('Error creating parameter:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}