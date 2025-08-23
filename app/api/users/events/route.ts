/**
 * Server-Sent Events endpoint for real-time user updates
 * /api/users/events
 */

import { NextRequest } from 'next/server';

// Global event emitter for user changes
class UserEventEmitter {
  private clients: Set<ReadableStreamDefaultController> = new Set();
  private static instance: UserEventEmitter;

  static getInstance(): UserEventEmitter {
    if (!UserEventEmitter.instance) {
      UserEventEmitter.instance = new UserEventEmitter();
    }
    return UserEventEmitter.instance;
  }

  addClient(controller: ReadableStreamDefaultController) {
    this.clients.add(controller);
    console.log(`[SSE] Client connected. Total clients: ${this.clients.size}`);
  }

  removeClient(controller: ReadableStreamDefaultController) {
    this.clients.delete(controller);
    console.log(`[SSE] Client disconnected. Total clients: ${this.clients.size}`);
  }

  broadcast(event: UserChangeEvent) {
    const message = `data: ${JSON.stringify(event)}\n\n`;
    
    // Send to all connected clients
    this.clients.forEach((controller) => {
      try {
        controller.enqueue(new TextEncoder().encode(message));
      } catch (error) {
        console.error('[SSE] Error sending to client:', error);
        this.clients.delete(controller);
      }
    });
  }

  sendHeartbeat() {
    const heartbeat = `data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`;
    
    this.clients.forEach((controller) => {
      try {
        controller.enqueue(new TextEncoder().encode(heartbeat));
      } catch (error) {
        this.clients.delete(controller);
      }
    });
  }
}

export interface UserChangeEvent {
  type: 'user_created' | 'user_updated' | 'user_deleted' | 'user_status_changed' | 'heartbeat';
  userId?: number;
  data?: any;
  timestamp: number;
  area?: string; // Para filtros por área
}

// Export singleton instance
export const userEventEmitter = UserEventEmitter.getInstance();

// Start heartbeat interval
setInterval(() => {
  userEventEmitter.sendHeartbeat();
}, 30000); // Every 30 seconds

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get('area'); // Optional area filter

  // Create readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Add client to emitter
      userEventEmitter.addClient(controller);
      
      // Send initial connection confirmation
      const welcomeMessage = `data: ${JSON.stringify({
        type: 'connected',
        message: 'User events stream connected',
        timestamp: Date.now(),
        clientId: Math.random().toString(36).substr(2, 9)
      })}\n\n`;
      
      controller.enqueue(new TextEncoder().encode(welcomeMessage));
    },
    
    cancel() {
      // Client disconnected
      userEventEmitter.removeClient(this as any);
    }
  });

  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}