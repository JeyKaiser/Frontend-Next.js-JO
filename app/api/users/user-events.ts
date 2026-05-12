export interface UserChangeEvent {
  type: 'user_created' | 'user_updated' | 'user_deleted' | 'user_status_changed' | 'heartbeat';
  userId?: number;
  data?: any;
  timestamp: number;
  area?: string;
}

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
      } catch {
        this.clients.delete(controller);
      }
    });
  }
}

export const userEventEmitter = UserEventEmitter.getInstance();

if (!(globalThis as any).__userEventsHeartbeatStarted) {
  (globalThis as any).__userEventsHeartbeatStarted = true;
  setInterval(() => {
    userEventEmitter.sendHeartbeat();
  }, 30000);
}
