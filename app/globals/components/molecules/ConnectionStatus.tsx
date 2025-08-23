'use client';

import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  className?: string;
}

export default function ConnectionStatus({ 
  isConnected, 
  connectionStatus, 
  className = '' 
}: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ),
          message: 'Sincronización activa'
        };
      case 'connecting':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ),
          message: 'Conectando...'
        };
      case 'error':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
          message: 'Error de conexión'
        };
      case 'disconnected':
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" />
            </svg>
          ),
          message: 'Sin sincronización'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
      config.bgColor
    } ${config.color} ${className}`}>
      {config.icon}
      <span>{config.message}</span>
    </div>
  );
}

// Componente compacto para uso en headers
export function CompactConnectionStatus({ 
  isConnected, 
  connectionStatus, 
  className = '' 
}: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          color: 'bg-green-500',
          title: 'Sincronización activa - Los datos se actualizan automáticamente'
        };
      case 'connecting':
        return {
          color: 'bg-yellow-500 animate-pulse',
          title: 'Conectando a sincronización en tiempo real'
        };
      case 'error':
        return {
          color: 'bg-red-500',
          title: 'Error en sincronización - Los datos pueden no estar actualizados'
        };
      case 'disconnected':
      default:
        return {
          color: 'bg-gray-400',
          title: 'Sin sincronización automática'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div 
      className={`w-3 h-3 rounded-full ${config.color} ${className}`}
      title={config.title}
    />
  );
}