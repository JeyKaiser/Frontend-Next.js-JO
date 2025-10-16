/**
 * User Search API Route
 * Advanced search functionality for users
 */

import { NextRequest, NextResponse } from 'next/server';
import { GarmentProductionDAL } from '@/app/globals/lib/dal/garment-production';

/**
 * GET /api/users/search
 * Advanced search for users
 * Query params:
 * - q: string (search term - searches in name, code, email)
 * - area: string (filter by area)
 * - rol: string (filter by role)
 * - estado: string (filter by status)
 * - exact: boolean (exact match for user code)
 * - limit: number (max results, default: 20)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const area = searchParams.get('area');
    const rol = searchParams.get('rol');
    const estado = searchParams.get('estado');
    const exact = searchParams.get('exact') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Search query (q) is required' },
        { status: 400 }
      );
    }
    
    console.log('[API] Searching users:', { 
      query, area, rol, estado, exact, limit 
    });
    
    // If exact search for user code
    if (exact) {
      const result = await GarmentProductionDAL.getUsuarioByCode(query.trim());
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: result.data || [],
        count: result.data?.length || 0,
        searchType: 'exact',
        query: query.trim()
      });
    }
    
    // Use the general search method with filters
    const filters = {
      search: query.trim(),
      ...(area && { area }),
      ...(rol && { rol }),
      ...(estado && { estado })
    };
    
    const result = await GarmentProductionDAL.getUsuarios(0, limit, filters);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    // Enhance results with search relevance scoring
    const users = result.data || [];
    const searchTerm = query.trim().toLowerCase();
    
    const scoredUsers = users.map((user: any) => {
      let score = 0;
      
      // Higher score for exact matches
      if (user.CODIGO_USUARIO?.toLowerCase() === searchTerm) score += 100;
      else if (user.CODIGO_USUARIO?.toLowerCase().includes(searchTerm)) score += 50;
      
      if (user.NOMBRE_COMPLETO?.toLowerCase().includes(searchTerm)) {
        // Higher score if match is at the beginning
        if (user.NOMBRE_COMPLETO.toLowerCase().startsWith(searchTerm)) {
          score += 30;
        } else {
          score += 10;
        }
      }
      
      if (user.EMAIL?.toLowerCase().includes(searchTerm)) score += 20;
      
      return {
        ...user,
        _searchScore: score
      };
    });
    
    // Sort by search relevance score
    scoredUsers.sort((a, b) => b._searchScore - a._searchScore);
    
    return NextResponse.json({
      success: true,
      data: scoredUsers,
      count: scoredUsers.length,
      searchType: 'general',
      query: query.trim(),
      filters: {
        ...(area && { area }),
        ...(rol && { rol }),
        ...(estado && { estado })
      },
      suggestions: generateSearchSuggestions(query.trim(), users)
    });
    
  } catch (error) {
    console.error('[API] User search error:', error);
    return NextResponse.json(
      { success: false, error: `Search failed: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

/**
 * Generate search suggestions based on the query and available data
 */
function generateSearchSuggestions(query: string, users: any[]): string[] {
  const suggestions: Set<string> = new Set();
  const queryLower = query.toLowerCase();
  
  // Add similar user codes
  users.forEach(user => {
    if (user.CODIGO_USUARIO && user.CODIGO_USUARIO.toLowerCase().includes(queryLower)) {
      suggestions.add(user.CODIGO_USUARIO);
    }
  });
  
  // Add similar names (first word matches)
  const queryWords = queryLower.split(' ');
  users.forEach(user => {
    if (user.NOMBRE_COMPLETO) {
      const nameWords = user.NOMBRE_COMPLETO.toLowerCase().split(' ');
      queryWords.forEach(queryWord => {
        nameWords.forEach(nameWord => {
          if (nameWord.startsWith(queryWord) && nameWord.length > queryWord.length) {
            suggestions.add(user.NOMBRE_COMPLETO);
          }
        });
      });
    }
  });
  
  // Limit suggestions
  return Array.from(suggestions).slice(0, 5);
}

/**
 * Handle OPTIONS for CORS
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}