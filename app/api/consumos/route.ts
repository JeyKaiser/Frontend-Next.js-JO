/**
 * API Route para consultas de consumos
 * Maneja las consultas de consumos de telas por referencia
 */

import { NextRequest, NextResponse } from 'next/server';
const backendUrI = process.env.NEXT_PUBLIC_BACKEND_URL;


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({
        success: false,
        error: 'El parámetro reference es requerido'
      }, { status: 400 });
    }

    console.log('[API Consumos] Consultando consumos para referencia:', reference);

    // Hacer petición al backend externo
    const backendUrl = `${backendUrI}/api/consumos/?reference=${encodeURIComponent(reference)}`;
    
    try {
      console.log('[API Consumos] Conectando al backend:', backendUrl);
      
      const backendResponse = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Agregar timeout de 30 segundos
        signal: AbortSignal.timeout(30000),
      });

      if (!backendResponse.ok) {
        console.error('[API Consumos] Error del backend:', backendResponse.status, backendResponse.statusText);
        throw new Error(`Backend error: ${backendResponse.status} ${backendResponse.statusText}`);
      }

      const backendData = await backendResponse.json();
      console.log('[API Consumos] Respuesta del backend:', {
        success: backendData.success,
        count: backendData.count,
        referenceCode: backendData.referenceCode
      });

      // Retornar la respuesta del backend directamente
      return NextResponse.json(backendData);

    } catch (fetchError) {
      console.error('[API Consumos] Error al conectar con el backend:', fetchError);
      
      const error = fetchError as Error;
      
      // Si es un error de timeout, devolver mensaje específico
      if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
        return NextResponse.json({
          success: false,
          error: `Timeout al conectar con el backend para la referencia: ${reference}. Intenta nuevamente.`,
          referenceCode: reference
        }, { status: 504 });
      }

      // Si es un error de conexión, devolver mensaje específico
      if (error.message?.includes('fetch') || ('code' in error && error.code === 'ECONNREFUSED')) {
        return NextResponse.json({
          success: false,
          error: `No se puede conectar con el backend. Verifica que el servidor esté ejecutándose en puerto 8000.`,
          referenceCode: reference
        }, { status: 502 });
      }

      // Para otros errores, propagar el mensaje
      return NextResponse.json({
        success: false,
        error: `Error del backend: ${error.message || 'Error desconocido'}`,
        referenceCode: reference
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[API Consumos] Error:', error);
    return NextResponse.json({
      success: false,
      error: `Error interno del servidor: ${(error as Error).message}`
    }, { status: 500 });
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