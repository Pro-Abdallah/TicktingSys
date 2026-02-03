import sql from 'mssql';

// Get configuration from environment variables
const server = process.env.DB_SERVER || 'DESKTOP-9M75GPK';
const database = process.env.DB_NAME || 'ElsewedySchoolSysDB_DEV';
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

if (!user || !password) {
    console.error('⚠️  Missing DB_USER or DB_PASSWORD in .env.local');
    console.error('   Please add SQL Server credentials to .env.local file');
}

const config: sql.config = {
    server,
    database,
    user,
    password,
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    connectionTimeout: 30000,
    requestTimeout: 30000
};

// Connection pool
let pool: sql.ConnectionPool | null = null;

/**
 * Get or create database connection pool
 */
export async function getDbPool(): Promise<sql.ConnectionPool> {
    if (pool && pool.connected) {
        return pool;
    }

    try {
        pool = await sql.connect(config);
        console.log('✅ Database connected successfully');
        return pool;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
}

/**
 * Execute a SQL query with parameters
 */
export async function executeQuery<T = any>(
    query: string,
    params: Record<string, any> = {}
): Promise<sql.IResult<T>> {
    try {
        const poolConnection = await getDbPool();
        const request = poolConnection.request();

        // Add parameters to request
        for (const [key, value] of Object.entries(params)) {
            request.input(key, value);
        }

        const result = await request.query<T>(query);
        return result;
    } catch (error) {
        console.error('Query execution error:', error);
        throw error;
    }
}

/**
 * Close the database connection
 */
export async function closeDbConnection(): Promise<void> {
    if (pool) {
        await pool.close();
        pool = null;
        console.log('Database connection closed');
    }
}

// Export sql for type definitions
export { sql };
