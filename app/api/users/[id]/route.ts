/**
 * Individual User API Route - Operations for specific user by ID
 * Handles GET, PUT, DELETE operations for a specific user
 */

import { NextRequest, NextResponse } from 'next/server';
import { GarmentProductionDAL } from '@/app/globals/lib/dal/garment-production';
import type { UpdateUsuarioRequest } from '@/app/modules/types';
import { userEventEmitter, type UserChangeEvent } from '../events/route';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/users/[id]
 * Get a specific user by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID. Must be a number.' },
        { status: 400 }
      );
    }
    
    console.log('[API] Getting user by ID:', userId);
    
    const result = await GarmentProductionDAL.getUsuarioById(userId);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    const user = result.data?.[0];
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user
    });
    
  } catch (error) {
    console.error('[API] User GET by ID error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to get user: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[id]
 * Update a specific user by ID
 * Body: UpdateUsuarioRequest
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID. Must be a number.' },
        { status: 400 }
      );
    }
    
    const updates: UpdateUsuarioRequest = await request.json();
    
    console.log('[API] Updating user:', userId, { 
      ...updates, 
      EMAIL: updates.EMAIL ? '[REDACTED]' : undefined 
    });
    
    // Validate that user exists
    const existingUserResult = await GarmentProductionDAL.getUsuarioById(userId);
    
    if (!existingUserResult.success) {
      return NextResponse.json(
        { success: false, error: existingUserResult.error },
        { status: 500 }
      );
    }
    
    if (!existingUserResult.data?.[0]) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Validate area and role if provided
    const validAreas = ['DISEÑO', 'PRODUCCION', 'CALIDAD', 'TECNICO', 'PATRONAJE', 'COMERCIAL', 'OPERACIONES'];
    const validRoles = [
      'JEFE_OPERACIONES', 'DISEÑADOR_SENIOR', 'DISEÑADOR', 'CORTADOR_SENIOR', 
      'ESPECIALISTA_CALIDAD', 'INGENIERO_TEXTIL', 'PATRONISTA_SENIOR', 'ANALISTA_COSTOS'
    ];
    const validEstados = ['ACTIVO', 'INACTIVO'];
    
    if (updates.AREA && !validAreas.includes(updates.AREA)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid area. Valid areas: ${validAreas.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    if (updates.ROL && !validRoles.includes(updates.ROL)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid role. Valid roles: ${validRoles.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    if (updates.ESTADO && !validEstados.includes(updates.ESTADO)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid status. Valid statuses: ${validEstados.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Check if new user code already exists (if code is being updated)
    if (updates.CODIGO_USUARIO) {
      const codeCheckResult = await GarmentProductionDAL.checkUsuarioCodeExists(
        updates.CODIGO_USUARIO, 
        userId
      );
      
      if (!codeCheckResult.success) {
        return NextResponse.json(
          { success: false, error: codeCheckResult.error },
          { status: 500 }
        );
      }
      
      if (codeCheckResult.data?.[0]?.count > 0) {
        return NextResponse.json(
          { success: false, error: `User code '${updates.CODIGO_USUARIO}' already exists` },
          { status: 409 }
        );
      }
    }
    
    // Update user
    const result = await GarmentProductionDAL.updateUsuario(userId, updates);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    // Get updated user data
    const updatedUserResult = await GarmentProductionDAL.getUsuarioById(userId);
    const updatedUser = updatedUserResult.data?.[0];
    
    // Emit user updated event for real-time updates
    if (updatedUser) {
      try {
        const event: UserChangeEvent = {
          type: 'user_updated',
          userId: userId,
          data: updatedUser,
          timestamp: Date.now(),
          area: updatedUser.AREA
        };
        userEventEmitter.broadcast(event);
      } catch (sseError) {
        console.warn('[SSE] Failed to broadcast user updated event:', sseError);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
      executionTime: result.executionTime
    });
    
  } catch (error) {
    console.error('[API] User PUT error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to update user: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]
 * Delete a specific user by ID (soft delete - sets ESTADO to 'INACTIVO')
 * Query params:
 * - hard: boolean (if true, performs hard delete - use with caution)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID. Must be a number.' },
        { status: 400 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const isHardDelete = searchParams.get('hard') === 'true';
    
    console.log('[API] Deleting user:', userId, { hard: isHardDelete });
    
    // Validate that user exists
    const existingUserResult = await GarmentProductionDAL.getUsuarioById(userId);
    
    if (!existingUserResult.success) {
      return NextResponse.json(
        { success: false, error: existingUserResult.error },
        { status: 500 }
      );
    }
    
    if (!existingUserResult.data?.[0]) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const user = existingUserResult.data[0];
    
    // Perform deletion
    const result = isHardDelete 
      ? await GarmentProductionDAL.hardDeleteUsuario(userId)
      : await GarmentProductionDAL.deleteUsuario(userId);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    // Emit user deleted event for real-time updates
    try {
      const event: UserChangeEvent = {
        type: isHardDelete ? 'user_deleted' : 'user_status_changed',
        userId: user.ID_USUARIO,
        data: { deleteType: isHardDelete ? 'hard' : 'soft' },
        timestamp: Date.now(),
        area: user.AREA
      };
      userEventEmitter.broadcast(event);
    } catch (sseError) {
      console.warn('[SSE] Failed to broadcast user deleted event:', sseError);
    }
    
    return NextResponse.json({
      success: true,
      message: isHardDelete 
        ? 'User permanently deleted successfully' 
        : 'User deactivated successfully',
      deletedUser: {
        ID_USUARIO: user.ID_USUARIO,
        CODIGO_USUARIO: user.CODIGO_USUARIO,
        NOMBRE_COMPLETO: user.NOMBRE_COMPLETO
      },
      deleteType: isHardDelete ? 'hard' : 'soft',
      executionTime: result.executionTime
    });
    
  } catch (error) {
    console.error('[API] User DELETE error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to delete user: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS for CORS
 */
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