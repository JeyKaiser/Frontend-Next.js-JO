'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Usuario } from '@/app/modules/types';

/**
 * Hook para sincronización vía WebSocket
 * Más robusto que SSE para aplicaciones que requieren comunicación bidireccional
 */

export interface WebSocketMessage {
  type: 'user_change' | 'heartbeat' | 'authentication' | 'subscription';
  payload?: any;
  timestamp: number;
  requestId?: string;
}

export interface UseWebSocketOptions {
  url?: string;
  protocols?: string[];
  enabled?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useWebSocketSync(
  options: UseWebSocketOptions = {}
) {
  const {
    url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws/users',
    protocols = [],
    enabled = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    heartbeatInterval = 30000,
    onMessage,
    onError,
    onConnect,
    onDisconnect
  } = options;
  
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnectRef = useRef(true);
  
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('[WebSocket] Error sending message:', error);
        return false;
      }
    }
    console.warn('[WebSocket] Cannot send message - socket not open');
    return false;
  }, [socket]);
  
  const sendHeartbeat = useCallback(() => {
    const heartbeat: WebSocketMessage = {
      type: 'heartbeat',
      timestamp: Date.now()
    };
    sendMessage(heartbeat);
  }, [sendMessage]);
  
  const startHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
    }
    
    heartbeatTimeoutRef.current = setInterval(sendHeartbeat, heartbeatInterval);
  }, [sendHeartbeat, heartbeatInterval]);
  
  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
  }, []);
  
  const connect = useCallback(() => {
    if (!enabled || socket?.readyState === WebSocket.CONNECTING) {
      return;
    }
    
    try {
      setConnectionState('connecting');
      
      const ws = new WebSocket(url, protocols);
      
      ws.onopen = (event) => {
        console.log('[WebSocket] Connected to:', url);
        setConnectionState('connected');
        setReconnectAttempts(0);
        onConnect?.();
        
        // Subscribe to user events
        const subscribeMessage: WebSocketMessage = {
          type: 'subscription',
          payload: { channel: 'users', action: 'subscribe' },
          timestamp: Date.now()
        };
        
        setTimeout(() => sendMessage(subscribeMessage), 100);
        startHeartbeat();
      };
      
      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          
          if (message.type !== 'heartbeat') {
            onMessage?.(message);
          }
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      };
      
      ws.onclose = (event) => {
        console.log('[WebSocket] Connection closed:', event.code, event.reason);
        setConnectionState('disconnected');
        setSocket(null);
        stopHeartbeat();
        onDisconnect?.();
        
        // Attempt reconnection if enabled and within limits
        if (shouldReconnectRef.current && reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(reconnectInterval * Math.pow(1.5, reconnectAttempts), 30000);
          console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, delay);
        }
      };
      
      ws.onerror = (error) => {
        console.error('[WebSocket] Connection error:', error);
        setConnectionState('error');
        onError?.(error);
      };
      
      setSocket(ws);
      
    } catch (error) {
      console.error('[WebSocket] Failed to create connection:', error);
      setConnectionState('error');
    }
  }, [enabled, url, protocols, socket, reconnectAttempts, maxReconnectAttempts, reconnectInterval, onConnect, onMessage, onDisconnect, onError, sendMessage, startHeartbeat, stopHeartbeat]);
  
  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    stopHeartbeat();
    
    if (socket) {
      socket.close(1000, 'Manual disconnect');
      setSocket(null);
    }
    
    setConnectionState('disconnected');
  }, [socket, stopHeartbeat]);
  
  // Auto connect/disconnect based on enabled flag
  useEffect(() => {
    if (enabled) {
      shouldReconnectRef.current = true;
      connect();
    } else {
      disconnect();
    }
    
    return () => {
      shouldReconnectRef.current = false;
      disconnect();
    };
  }, [enabled, connect, disconnect]);
  
  return {
    socket,
    connectionState,
    lastMessage,
    reconnectAttempts,
    isConnected: connectionState === 'connected',
    sendMessage,
    connect,
    disconnect
  };
}