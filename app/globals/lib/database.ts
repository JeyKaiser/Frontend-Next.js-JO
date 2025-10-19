/**
 * Mock Database Utility for Frontend
 * Since we're only using Supabase through the Django backend,
 * this file provides mock implementations to avoid build errors
 */

export interface QueryResult {
  success: boolean;
  data?: any[];
  error?: string;
  rowCount?: number;
  executionTime?: number;
}

// Mock database class
class MockDatabase {
  async query(sql: string, params: any[] = []): Promise<QueryResult> {
    console.warn('[MOCK DB] Database query attempted but not implemented:', sql);
    return {
      success: false,
      error: 'Database not available in frontend. Use Django API instead.',
      executionTime: 0
    };
  }

  async transaction(queries: Array<{ sql: string; params?: any[] }>): Promise<QueryResult> {
    console.warn('[MOCK DB] Database transaction attempted but not implemented');
    return {
      success: false,
      error: 'Database not available in frontend. Use Django API instead.',
      executionTime: 0
    };
  }

  async testConnection(): Promise<QueryResult> {
    return {
      success: false,
      error: 'Database not available in frontend. Use Django API instead.',
      executionTime: 0
    };
  }

  async getHealthInfo(): Promise<QueryResult> {
    return {
      success: false,
      error: 'Database not available in frontend. Use Django API instead.',
      executionTime: 0
    };
  }

  async close(): Promise<void> {
    // No-op
  }
}

// Singleton instance
let dbInstance: MockDatabase | null = null;

/**
 * Get mock database instance
 */
export function getDatabase(): MockDatabase {
  if (!dbInstance) {
    dbInstance = new MockDatabase();
  }
  return dbInstance;
}

/**
 * Convenience function for executing queries (mock)
 */
export async function executeQuery(sql: string, params: any[] = []): Promise<QueryResult> {
  const db = getDatabase();
  return await db.query(sql, params);
}

/**
 * Convenience function for executing transactions (mock)
 */
export async function executeTransaction(queries: Array<{ sql: string; params?: any[] }>): Promise<QueryResult> {
  const db = getDatabase();
  return await db.transaction(queries);
}

/**
 * Test database connection (mock)
 */
export async function testDatabaseConnection(): Promise<QueryResult> {
  const db = getDatabase();
  return await db.testConnection();
}

/**
 * Get database health information (mock)
 */
export async function getDatabaseHealth(): Promise<QueryResult> {
  const db = getDatabase();
  return await db.getHealthInfo();
}

/**
 * Close database connections (mock)
 */
export async function closeDatabaseConnection(): Promise<void> {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
}

// Default export
export default getDatabase;
