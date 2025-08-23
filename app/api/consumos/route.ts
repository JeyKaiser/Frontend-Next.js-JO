/**
 * API Route para consultas de consumos
 * Maneja las consultas de consumos de telas por referencia
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ConsumoData, ConsumosResponse } from '@/app/modules/types';

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

    // Aquí se conectaría con el backend para ejecutar la consulta SQL
    // Por ahora simularemos la respuesta para PT03708 como en el ejemplo
    const mockData: ConsumoData[] = reference.toUpperCase() === 'PT03708' ? [
      {
        COLECCION: 'WINTER SUN',
        NOMBRE_REF: 'PANTALON CASUAL WINTER',
        USO_EN_PRENDA: 'FORRO',
        COD_TELA: 'TEL001',
        NOMBRE_TELA: 'ALGODÓN STRETCH',
        CONSUMO: 1.25,
        GRUPO_TALLAS: 'STD',
        LINEA: 'CASUAL',
        TIPO: 'TELAS'
      },
      {
        COLECCION: 'WINTER SUN',
        NOMBRE_REF: 'PANTALON CASUAL WINTER',
        USO_EN_PRENDA: 'PRINCIPAL',
        COD_TELA: 'TEL002',
        NOMBRE_TELA: 'DENIM STRETCH',
        CONSUMO: 2.80,
        GRUPO_TALLAS: 'STD',
        LINEA: 'CASUAL',
        TIPO: 'TELAS'
      }
    ] : [];

    const response: ConsumosResponse = {
      success: true,
      data: mockData,
      count: mockData.length,
      referenceCode: reference
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[API Consumos] Error:', error);
    return NextResponse.json({
      success: false,
      error: `Error interno del servidor: ${(error as Error).message}`
    }, { status: 500 });
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