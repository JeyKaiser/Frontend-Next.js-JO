/**
 * Database Health Check API Route
 * Tests SAP HANA connection and provides health information
 */

import { NextRequest, NextResponse } from 'next/server';
import { testDatabaseConnection, getDatabaseHealth } from '@/app/globals/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('[API] Database health check requested');
    
    // Test basic connection
    const connectionTest = await testDatabaseConnection();
    
    if (!connectionTest.success) {
      console.error('[API] Database connection test failed:', connectionTest.error);
      return NextResponse.json(
        {
          success: false,
          error: connectionTest.error,
          timestamp: new Date().toISOString()
        },
        { status: 503 } // Service Unavailable
      );
    }
    
    // Get detailed health information
    const healthInfo = await getDatabaseHealth();
    
    return NextResponse.json({
      success: true,
      connection: {
        status: 'connected',
        version: connectionTest.data?.[0]?.VERSION || 'unknown',
        executionTime: connectionTest.executionTime
      },
      health: healthInfo.success ? healthInfo.data : null,
      timestamp: new Date().toISOString(),
      schema: 'GARMENT_PRODUCTION_CONTROL'
    });
    
  } catch (error) {
    console.error('[API] Database health check error:', error);
    
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
