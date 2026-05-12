/**
 * Server-Sent Events endpoint for real-time user updates
 * /api/users/events
 */

import { NextRequest } from 'next/server';
import { userEventEmitter } from '../user-events';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get('area'); // Optional area filter

  // Create readable stream for SSE
  let clientController: ReadableStreamDefaultController | null = null;

  const stream = new ReadableStream({
    start(controller) {
      clientController = controller;
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
      if (clientController) {
        userEventEmitter.removeClient(clientController);
      }
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
