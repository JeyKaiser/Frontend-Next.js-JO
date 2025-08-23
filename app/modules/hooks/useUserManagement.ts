'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Usuario, CreateUsuarioRequest, UpdateUsuarioRequest, UsuariosResponse } from '@/app/modules/types';
import type { UserChangeEvent } from '@/app/api/users/events/route';

// Backend API URL (Django backend)
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

// Mock data for development (will be replaced by real backend data)
const getMockUsuarios = (): Usuario[] => [
  {
    ID_USUARIO: 1,
    CODIGO_USUARIO: 'USR001',
    NOMBRE_COMPLETO: 'Juan Carlos Pérez',
    EMAIL: 'juan.perez@empresa.com',
    AREA: 'DISEÑO',
    ROL: 'DISEÑADOR_SENIOR',
    ESTADO: 'ACTIVO',
    FECHA_CREACION: '2023-01-15T10:30:00.000Z'
  },
  {
    ID_USUARIO: 2,
    CODIGO_USUARIO: 'USR002',
    NOMBRE_COMPLETO: 'María González López',
    EMAIL: 'maria.gonzalez@empresa.com',
    AREA: 'PRODUCCION',
    ROL: 'CORTADOR_SENIOR',
    ESTADO: 'ACTIVO',
    FECHA_CREACION: '2023-03-20T14:15:00.000Z'
  },
  {
    ID_USUARIO: 3,
    CODIGO_USUARIO: 'USR003',
    NOMBRE_COMPLETO: 'Carlos Rodríguez Silva',
    EMAIL: 'carlos.rodriguez@empresa.com',
    AREA: 'CALIDAD',
    ROL: 'ESPECIALISTA_CALIDAD',
    ESTADO: 'ACTIVO',
    FECHA_CREACION: '2023-02-10T09:45:00.000Z'
  },
  {
    ID_USUARIO: 4,
    CODIGO_USUARIO: 'USR004',
    NOMBRE_COMPLETO: 'Ana López Martínez',
    EMAIL: 'ana.lopez@empresa.com',
    AREA: 'PATRONAJE',
    ROL: 'PATRONISTA_SENIOR',
    ESTADO: 'INACTIVO',
    FECHA_CREACION: '2023-05-12T16:20:00.000Z'
  },
  {
    ID_USUARIO: 5,
    CODIGO_USUARIO: 'USR005',
    NOMBRE_COMPLETO: 'Luis Martínez Torres',
    EMAIL: 'luis.martinez@empresa.com',
    AREA: 'TECNICO',
    ROL: 'INGENIERO_TEXTIL',
    ESTADO: 'ACTIVO',
    FECHA_CREACION: '2024-01-15T11:00:00.000Z'
  },
  {
    ID_USUARIO: 6,
    CODIGO_USUARIO: 'USR006',
    NOMBRE_COMPLETO: 'Sandra Ramírez Castro',
    EMAIL: 'sandra.ramirez@empresa.com',
    AREA: 'COMERCIAL',
    ROL: 'ANALISTA_COSTOS',
    ESTADO: 'ACTIVO',
    FECHA_CREACION: '2023-11-08T13:30:00.000Z'
  },
  {
    ID_USUARIO: 7,
    CODIGO_USUARIO: 'USR007',
    NOMBRE_COMPLETO: 'Diego Morales Vega',
    EMAIL: 'diego.morales@empresa.com',
    AREA: 'OPERACIONES',
    ROL: 'JEFE_OPERACIONES',
    ESTADO: 'ACTIVO',
    FECHA_CREACION: '2022-08-22T08:15:00.000Z'
  },
  {
    ID_USUARIO: 8,
    CODIGO_USUARIO: 'USR008',
    NOMBRE_COMPLETO: 'Patricia Jiménez Ruiz',
    EMAIL: 'patricia.jimenez@empresa.com',
    AREA: 'DISEÑO',
    ROL: 'DISEÑADOR',
    ESTADO: 'ACTIVO',
    FECHA_CREACION: '2023-09-03T15:45:00.000Z'
  }
];

// API functions that connect to your Django backend
const userApi = {
  fetchUsers: async (): Promise<Usuario[]> => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/users`);
      if (!response.ok) {
        // If backend is not available, fallback to mock data
        console.warn('Backend not available, using mock data');
        return getMockUsuarios();
      }
      const data = await response.json();
      
      // Django backend response format based on your description
      if (!data.success || !data.data) {
        throw new Error(data.error || 'No data received');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching users, falling back to mock data:', error);
      // Fallback to mock data when backend is not available
      return getMockUsuarios();
    }
  },

  createUser: async (userData: CreateUsuarioRequest): Promise<Usuario> => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        // Mock creation for development
        console.warn('Backend not available for user creation, simulating...');
        const newUser: Usuario = {
          ID_USUARIO: Math.max(...getMockUsuarios().map(u => u.ID_USUARIO)) + 1,
          CODIGO_USUARIO: userData.CODIGO_USUARIO,
          NOMBRE_COMPLETO: userData.NOMBRE_COMPLETO,
          EMAIL: userData.EMAIL,
          AREA: userData.AREA,
          ROL: userData.ROL,
          ESTADO: userData.ESTADO || 'ACTIVO',
          FECHA_CREACION: new Date().toISOString()
        };
        return newUser;
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to create user');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error creating user, simulating creation:', error);
      // Mock creation fallback
      const newUser: Usuario = {
        ID_USUARIO: Math.max(...getMockUsuarios().map(u => u.ID_USUARIO)) + 1,
        CODIGO_USUARIO: userData.CODIGO_USUARIO,
        NOMBRE_COMPLETO: userData.NOMBRE_COMPLETO,
        EMAIL: userData.EMAIL,
        AREA: userData.AREA,
        ROL: userData.ROL,
        ESTADO: userData.ESTADO || 'ACTIVO',
        FECHA_CREACION: new Date().toISOString()
      };
      return newUser;
    }
  },

  updateUser: async (id: string, userData: UpdateUsuarioRequest): Promise<Usuario> => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        // Mock update for development
        console.warn('Backend not available for user update, simulating...');
        const mockUsers = getMockUsuarios();
        const existingUser = mockUsers.find(u => u.ID_USUARIO.toString() === id);
        if (!existingUser) {
          throw new Error('Usuario no encontrado');
        }
        
        const updatedUser: Usuario = {
          ...existingUser,
          ...userData,
          ID_USUARIO: existingUser.ID_USUARIO
        };
        return updatedUser;
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to update user');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error updating user, simulating update:', error);
      // Mock update fallback
      const mockUsers = getMockUsuarios();
      const existingUser = mockUsers.find(u => u.ID_USUARIO.toString() === id);
      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }
      
      const updatedUser: Usuario = {
        ...existingUser,
        ...userData,
        ID_USUARIO: existingUser.ID_USUARIO
      };
      return updatedUser;
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/users/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        // Mock deletion for development
        console.warn('Backend not available for user deletion, simulating...');
        const mockUsers = getMockUsuarios();
        const userExists = mockUsers.some(u => u.ID_USUARIO.toString() === id);
        if (!userExists) {
          throw new Error('Usuario no encontrado');
        }
        return; // Simulate successful deletion
      }
    } catch (error) {
      console.error('Error deleting user, simulating deletion:', error);
      // Mock deletion fallback - just log it
      const mockUsers = getMockUsuarios();
      const userExists = mockUsers.some(u => u.ID_USUARIO.toString() === id);
      if (!userExists) {
        throw new Error('Usuario no encontrado');
      }
      // Simulate successful deletion
    }
  }
};

export interface UseUserManagementReturn {
  users: Usuario[];
  isLoading: boolean;
  error: string | null;
  createUser: (userData: CreateUsuarioRequest) => Promise<void>;
  updateUser: (id: string, userData: UpdateUsuarioRequest) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

export const useUserManagement = (enableRealTime: boolean = true, areaFilter?: string): UseUserManagementReturn => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedUsers = await userApi.fetchUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create user
  const createUser = useCallback(async (userData: CreateUsuarioRequest) => {
    try {
      setError(null);
      await userApi.createUser(userData);
      // Refresh the full list instead of trying to add incomplete user data
      await fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear usuario';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchUsers]);

  // Update user
  const updateUser = useCallback(async (id: string, userData: UpdateUsuarioRequest) => {
    try {
      setError(null);
      await userApi.updateUser(id, userData);
      // Refresh the full list to ensure data consistency
      await fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar usuario';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchUsers]);

  // Delete user (soft delete - deactivates user)
  const deleteUser = useCallback(async (id: string) => {
    try {
      setError(null);
      await userApi.deleteUser(id);
      // Refresh the full list since backend does soft delete (deactivation)
      await fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar usuario';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchUsers]);

  // Refresh users
  const refreshUsers = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  // Handle real-time events from SSE
  const handleUserEvent = useCallback((event: UserChangeEvent) => {
    console.log('[SSE] Received user event:', event);
    
    switch (event.type) {
      case 'user_created':
        if (event.data) {
          setUsers(prevUsers => {
            // Check if user already exists to avoid duplicates
            const exists = prevUsers.some(u => u.ID_USUARIO === event.data.ID_USUARIO);
            if (!exists) {
              return [...prevUsers, event.data];
            }
            return prevUsers;
          });
        }
        break;
        
      case 'user_updated':
        if (event.data && event.userId) {
          setUsers(prevUsers => 
            prevUsers.map(user => 
              user.ID_USUARIO === event.userId ? { ...user, ...event.data } : user
            )
          );
        }
        break;
        
      case 'user_deleted':
      case 'user_status_changed':
        if (event.userId) {
          setUsers(prevUsers => 
            prevUsers.filter(user => user.ID_USUARIO !== event.userId)
          );
        }
        break;
        
      case 'heartbeat':
        // Just keep connection alive
        break;
        
      default:
        console.log('[SSE] Unknown event type:', event.type);
    }
  }, []);

  // Setup SSE connection
  const setupEventSource = useCallback(() => {
    if (!enableRealTime || typeof window === 'undefined') return;
    
    try {
      setConnectionStatus('connecting');
      
      // Build URL with area filter if provided
      const sseUrl = new URL('/api/users/events', window.location.origin);
      if (areaFilter) {
        sseUrl.searchParams.set('area', areaFilter);
      }
      
      const eventSource = new EventSource(sseUrl.toString());
      eventSourceRef.current = eventSource;
      
      eventSource.onopen = () => {
        console.log('[SSE] Connection opened');
        setConnectionStatus('connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };
      
      eventSource.onmessage = (event) => {
        try {
          const data: UserChangeEvent = JSON.parse(event.data);
          handleUserEvent(data);
        } catch (error) {
          console.error('[SSE] Error parsing event data:', error);
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('[SSE] Connection error:', error);
        setConnectionStatus('error');
        setIsConnected(false);
        
        eventSource.close();
        
        // Attempt reconnection with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          console.log(`[SSE] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            setupEventSource();
          }, delay);
        }
      };
      
    } catch (error) {
      console.error('[SSE] Failed to setup event source:', error);
      setConnectionStatus('error');
    }
  }, [enableRealTime, areaFilter, handleUserEvent]);

  // Cleanup SSE connection
  const cleanupEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  // Load users on mount and setup SSE
  useEffect(() => {
    fetchUsers();
    
    if (enableRealTime) {
      setupEventSource();
    }
    
    // Cleanup on unmount
    return () => {
      cleanupEventSource();
    };
  }, [fetchUsers, setupEventSource, cleanupEventSource, enableRealTime]);

  return {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers,
    isConnected,
    connectionStatus
  };
};

export default useUserManagement;