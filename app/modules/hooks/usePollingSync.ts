'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Usuario } from '@/app/modules/types';

/**
 * Hook para sincronización por polling
 * Útil como fallback cuando SSE no está disponible
 */
export interface UsePollingOptions {
  interval?: number; // milliseconds
  enabled?: boolean;
  onError?: (error: Error) => void;
  compareFunction?: (oldData: Usuario[], newData: Usuario[]) => boolean;
}

export function usePollingSync(
  fetchFunction: () => Promise<Usuario[]>,
  options: UsePollingOptions = {}
) {
  const {
    interval = 30000, // 30 seconds default
    enabled = true,
    onError,
    compareFunction = defaultCompare
  } = options;
  
  const [data, setData] = useState<Usuario[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Default comparison function
  function defaultCompare(oldData: Usuario[], newData: Usuario[]): boolean {
    if (oldData.length !== newData.length) return false;
    
    return oldData.every((oldUser, index) => {
      const newUser = newData[index];
      return (
        oldUser.ID_USUARIO === newUser.ID_USUARIO &&
        oldUser.ESTADO === newUser.ESTADO &&
        oldUser.FECHA_MODIFICACION === newUser.FECHA_MODIFICACION
      );
    });
  }
  
  const poll = useCallback(async () => {
    if (!enabled) return;
    
    try {
      // Abort previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      const newData = await fetchFunction();
      
      // Only update state if data has actually changed
      setData(prevData => {
        if (!compareFunction(prevData, newData)) {
          console.log('[Polling] Data changed, updating state');
          setLastUpdate(new Date());
          return newData;
        }
        return prevData;
      });
      
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('[Polling] Error fetching data:', error);
        onError?.(error);
      }
    }
  }, [fetchFunction, enabled, compareFunction, onError]);
  
  const startPolling = useCallback(() => {
    if (!enabled || intervalRef.current) return;
    
    setIsPolling(true);
    
    // Initial fetch
    poll();
    
    // Setup interval
    intervalRef.current = setInterval(poll, interval);
    
    console.log(`[Polling] Started with ${interval}ms interval`);
  }, [poll, interval, enabled]);
  
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setIsPolling(false);
    console.log('[Polling] Stopped');
  }, []);
  
  // Auto start/stop based on enabled flag
  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }
    
    return stopPolling;
  }, [enabled, startPolling, stopPolling]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);
  
  return {
    data,
    lastUpdate,
    isPolling,
    startPolling,
    stopPolling,
    forcePoll: poll
  };
}