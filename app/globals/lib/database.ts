/**
 * SAP HANA Database Connection Utility
 * Optimized for Next.js applications with connection pooling and error handling
 * Schema: GARMENT_PRODUCTION_CONTROL
 */

let hana: any = null;
try {
  hana = require('@sap/hana-client');
} catch (error) {
  console.warn('SAP HANA client not available, using mock implementation');
  hana = {
    createConnection: () => ({
      connect: (callback: Function) => callback(new Error('SAP HANA client not available')),
      exec: (sql: string, params: any[], callback: Function) => callback(new Error('SAP HANA client not available')),
      on: () => {},
      disconnect: (callback: Function) => callback()
    })
  };
}

// Database configuration interface
interface DatabaseConfig {
  host: string;
  port: number;
  uid: string;
  pwd: string;
  databaseName?: string;
  schema?: string;
  encrypt?: boolean;
  validateCertificate?: boolean;
  pooling?: boolean;
  poolMax?: number;
  poolMin?: number;
  poolTimeout?: number;
  connectTimeout?: number;
}

// Connection pool interface
interface ConnectionPool {
  pool: any;
  isConnected: boolean;
}

// Query result interface
export interface QueryResult {
  success: boolean;
  data?: any[];
  error?: string;
  rowCount?: number;
  executionTime?: number;
}

// Database utility class
class HanaDatabase {
  private config: DatabaseConfig;
  private connectionPool: ConnectionPool | null = null;
  private isInitialized = false;

  constructor() {
    this.config = this.loadConfig();
  }

  /**
   * Load database configuration from environment variables
   */
  private loadConfig(): DatabaseConfig {
    return {
      host: process.env.HANA_HOST || 'localhost',
      port: parseInt(process.env.HANA_PORT || '39015'),
      uid: process.env.HANA_USER || '',
      pwd: process.env.HANA_PASSWORD || '',
      databaseName: process.env.HANA_DATABASE || 'HXE',
      schema: process.env.HANA_SCHEMA || 'GARMENT_PRODUCTION_CONTROL',
      encrypt: process.env.HANA_ENCRYPT === 'true',
      validateCertificate: process.env.HANA_VALIDATE_CERTIFICATE === 'true',
      pooling: true,
      poolMax: parseInt(process.env.HANA_POOL_MAX || '10'),
      poolMin: parseInt(process.env.HANA_POOL_MIN || '2'),
      poolTimeout: parseInt(process.env.HANA_POOL_TIMEOUT || '30000'),
      connectTimeout: parseInt(process.env.HANA_CONNECTION_TIMEOUT || '10000')
    };
  }

  /**
   * Initialize connection pool
   */
  private async initializePool(): Promise<void> {
    if (this.isInitialized && this.connectionPool?.isConnected) {
      return;
    }

    try {
      const connectionString = {
        serverNode: `${this.config.host}:${this.config.port}`,
        uid: this.config.uid,
        pwd: this.config.pwd,
        databaseName: this.config.databaseName,
        encrypt: this.config.encrypt,
        validateCertificate: this.config.validateCertificate,
        pooling: this.config.pooling,
        poolMax: this.config.poolMax,
        poolMin: this.config.poolMin,
        poolTimeout: this.config.poolTimeout,
        connectTimeout: this.config.connectTimeout,
        currentSchema: this.config.schema
      };

      console.log('[HANA DB] Initializing connection pool...', {
        host: this.config.host,
        port: this.config.port,
        schema: this.config.schema,
        poolMax: this.config.poolMax,
        poolMin: this.config.poolMin
      });

      const pool = hana.createConnection(connectionString);
      
      // Test connection
      await new Promise((resolve, reject) => {
        pool.connect((err: any) => {
          if (err) {
            console.error('[HANA DB] Connection failed:', err.message);
            reject(err);
          } else {
            console.log('[HANA DB] Connection pool initialized successfully');
            resolve(null);
          }
        });
      });

      this.connectionPool = {
        pool,
        isConnected: true
      };
      
      this.isInitialized = true;

      // Set up connection event handlers
      pool.on('error', (err: any) => {
        console.error('[HANA DB] Pool error:', err.message);
        this.connectionPool = null;
        this.isInitialized = false;
      });

    } catch (error) {
      console.error('[HANA DB] Failed to initialize pool:', error);
      throw new Error(`Database initialization failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get a connection from the pool
   */
  private async getConnection(): Promise<any> {
    if (!this.isInitialized || !this.connectionPool?.isConnected) {
      await this.initializePool();
    }

    if (!this.connectionPool?.pool) {
      throw new Error('Connection pool not available');
    }

    return this.connectionPool.pool;
  }

  /**
   * Execute a SQL query with parameters
   */
  async query(sql: string, params: any[] = []): Promise<QueryResult> {
    const startTime = Date.now();
    let connection: any = null;

    try {
      connection = await this.getConnection();
      
      console.log('[HANA DB] Executing query:', {
        sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
        paramCount: params.length
      });

      // Execute query with promise wrapper
      const result = await new Promise((resolve, reject) => {
        connection.exec(sql, params, (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      const executionTime = Date.now() - startTime;
      const data = Array.isArray(result) ? result : [result];

      console.log('[HANA DB] Query executed successfully:', {
        rowCount: data.length,
        executionTime: `${executionTime}ms`
      });

      return {
        success: true,
        data,
        rowCount: data.length,
        executionTime
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = (error as Error).message;
      
      console.error('[HANA DB] Query failed:', {
        sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
        error: errorMessage,
        executionTime: `${executionTime}ms`
      });

      return {
        success: false,
        error: errorMessage,
        executionTime
      };
    }
  }

  /**
   * Execute a transaction with multiple queries
   */
  async transaction(queries: Array<{ sql: string; params?: any[] }>): Promise<QueryResult> {
    const startTime = Date.now();
    let connection: any = null;

    try {
      connection = await this.getConnection();
      
      console.log('[HANA DB] Starting transaction with', queries.length, 'queries');

      // Begin transaction
      await new Promise((resolve, reject) => {
        connection.exec('BEGIN TRANSACTION', [], (err: any) => {
          if (err) reject(err);
          else resolve(null);
        });
      });

      const results: any[] = [];

      // Execute all queries
      for (const query of queries) {
        const result = await new Promise((resolve, reject) => {
          connection.exec(query.sql, query.params || [], (err: any, result: any) => {
            if (err) reject(err);
            else resolve(result);
          });
        });
        results.push(result);
      }

      // Commit transaction
      await new Promise((resolve, reject) => {
        connection.exec('COMMIT', [], (err: any) => {
          if (err) reject(err);
          else resolve(null);
        });
      });

      const executionTime = Date.now() - startTime;

      console.log('[HANA DB] Transaction completed successfully:', {
        queryCount: queries.length,
        executionTime: `${executionTime}ms`
      });

      return {
        success: true,
        data: results,
        rowCount: results.reduce((total, result) => {
          return total + (Array.isArray(result) ? result.length : 1);
        }, 0),
        executionTime
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = (error as Error).message;

      // Rollback transaction on error
      if (connection) {
        try {
          await new Promise((resolve) => {
            connection.exec('ROLLBACK', [], () => resolve(null));
          });
          console.log('[HANA DB] Transaction rolled back due to error');
        } catch (rollbackError) {
          console.error('[HANA DB] Rollback failed:', rollbackError);
        }
      }

      console.error('[HANA DB] Transaction failed:', {
        error: errorMessage,
        executionTime: `${executionTime}ms`
      });

      return {
        success: false,
        error: errorMessage,
        executionTime
      };
    }
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<QueryResult> {
    try {
      const result = await this.query('SELECT VERSION FROM M_DATABASE');
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('[HANA DB] Connection test successful. Database version:', result.data[0].VERSION);
        return {
          success: true,
          data: result.data,
          rowCount: 1
        };
      } else {
        throw new Error('No version information returned');
      }
    } catch (error) {
      console.error('[HANA DB] Connection test failed:', error);
      return {
        success: false,
        error: `Connection test failed: ${(error as Error).message}`
      };
    }
  }

  /**
   * Get database health information
   */
  async getHealthInfo(): Promise<QueryResult> {
    try {
      const healthQueries = [
        'SELECT VERSION FROM M_DATABASE',
        'SELECT COUNT(*) as ACTIVE_CONNECTIONS FROM M_CONNECTIONS WHERE CONNECTION_STATUS = \'RUNNING\'',
        'SELECT SCHEMA_NAME, COUNT(*) as TABLE_COUNT FROM TABLES WHERE SCHEMA_NAME = \'GARMENT_PRODUCTION_CONTROL\' GROUP BY SCHEMA_NAME'
      ];

      const results = [];
      for (const sql of healthQueries) {
        const result = await this.query(sql);
        if (result.success) {
          results.push(result.data);
        }
      }

      return {
        success: true,
        data: results,
        rowCount: results.length
      };
    } catch (error) {
      return {
        success: false,
        error: `Health check failed: ${(error as Error).message}`
      };
    }
  }

  /**
   * Close all connections
   */
  async close(): Promise<void> {
    if (this.connectionPool?.pool && this.connectionPool.isConnected) {
      try {
        await new Promise((resolve) => {
          this.connectionPool!.pool.disconnect(() => {
            console.log('[HANA DB] Connection pool closed');
            resolve(null);
          });
        });
        
        this.connectionPool = null;
        this.isInitialized = false;
      } catch (error) {
        console.error('[HANA DB] Error closing connections:', error);
      }
    }
  }
}

// Singleton instance
let dbInstance: HanaDatabase | null = null;

/**
 * Get database instance (singleton)
 */
export function getDatabase(): HanaDatabase {
  if (!dbInstance) {
    dbInstance = new HanaDatabase();
  }
  return dbInstance;
}

/**
 * Convenience function for executing queries
 */
export async function executeQuery(sql: string, params: any[] = []): Promise<QueryResult> {
  const db = getDatabase();
  return await db.query(sql, params);
}

/**
 * Convenience function for executing transactions
 */
export async function executeTransaction(queries: Array<{ sql: string; params?: any[] }>): Promise<QueryResult> {
  const db = getDatabase();
  return await db.transaction(queries);
}

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<QueryResult> {
  const db = getDatabase();
  return await db.testConnection();
}

/**
 * Get database health information
 */
export async function getDatabaseHealth(): Promise<QueryResult> {
  const db = getDatabase();
  return await db.getHealthInfo();
}

/**
 * Close database connections (use with caution in production)
 */
export async function closeDatabaseConnection(): Promise<void> {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
}

// Default export
export default getDatabase;
